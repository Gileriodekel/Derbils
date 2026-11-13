import { contracts } from './contracts';
import type { ConfigIssue, ValueContract } from './validation-types';

/** Hand-written recursive validator, no coercion/defaults and no dependency. */
export function validateData(file: string, value: unknown): ConfigIssue[] {
  const issues: ConfigIssue[]=[];
  const fail=(path:string,message:string)=>issues.push({file,path:path||'$root',message});
  function visit(rule:ValueContract, v:unknown, path:string) {
    if(rule.type==='number') {
      const m=rule.metadata;
      if(!m?.description||!m.unit||!Number.isFinite(m.min)||!Number.isFinite(m.max))fail(path,'numeric tunable lacks metadata');
      else if(typeof v!=='number'||!Number.isFinite(v)||v<m.min||v>m.max||(m.integer&&!Number.isSafeInteger(v)))fail(path,`expected ${m.integer?'integer':'number'} in [${m.min}, ${m.max}] ${m.unit}`);
    } else if(rule.type==='boolean') {
      const m=rule.metadata;
      if(!m?.description||!m.unit||!Array.isArray(m.allowed)||m.allowed.length!==2||m.allowed[0]!==false||m.allowed[1]!==true)fail(path,'boolean switch lacks metadata');
      else if(typeof v!=='boolean')fail(path,'expected boolean');
    } else if(rule.type==='object') {
      if(!v||typeof v!=='object'||Array.isArray(v)){fail(path,'expected object');return;}
      const object=v as Record<string,unknown>;
      for(const [key,child] of Object.entries(rule.fields)) {
        const at=path?`${path}.${key}`:key;
        if(!Object.hasOwn(object,key))fail(at,'required key missing');else visit(child,object[key],at);
      }
      for(const key of Object.keys(object))if(!Object.hasOwn(rule.fields,key))fail(path?`${path}.${key}`:key,'unknown key; add its contract and metadata');
    } else if(rule.type==='array') {
      if(!Array.isArray(v)){fail(path,'expected array');return;}
      if(rule.repeat){
        if(rule.entries.length!==1){fail(path,'list needs one element contract');return;}
        if(v.length===0)fail(path,'expected a nonempty list');
        v.forEach((child,i)=>visit(rule.entries[0],child,`${path}[${i}]`));
      }else{
        if(v.length!==rule.entries.length)fail(path,`expected ${rule.entries.length} catalog entries`);
        rule.entries.forEach((child,i)=>visit(child,v[i],`${path}[${i}]`));
      }
    } else if(rule.type==='null') {if(v!==null)fail(path,'expected null');}
    else if(typeof v!==rule.type || (rule.type==='string'&&rule.allowed&&!rule.allowed.includes(v as string)) || (rule.type==='string'&&rule.pattern&&!new RegExp(rule.pattern).test(v as string)))fail(path,`expected ${rule.type}${rule.type==='string'&&rule.allowed?` (${rule.allowed.join(', ')})`:''}`);
  }
  if(!contracts[file])fail('','file has no validation contract');else visit(contracts[file],value,'');
  if(issues.length===0){
    function cross(v:unknown,path:string):void {
      if(Array.isArray(v)){
        if(/(Range|Bounds|Scale|mutationStep|\.bands\.[^.]+)$/.test(path)&&v.length===2&&v.every(n=>typeof n==='number')&&v[0]>v[1])fail(path,'lower bound exceeds upper bound');
        if(/(Thresholds|Milestones)$/.test(path)&&v.every(n=>typeof n==='number')&&v.some((n,i)=>i>0&&n<=v[i-1]))fail(path,'thresholds must increase strictly');
        v.forEach((n,i)=>cross(n,`${path}[${i}]`));
      }else if(v&&typeof v==='object')for(const [k,n]of Object.entries(v))cross(n,path?`${path}.${k}`:k);
    }
    cross(value,'');
    const root=value as Record<string,unknown>;
    if(file==='offline.json'){
      if(Number(root.minTicksPerSlice)>Number(root.maxTicksPerSlice))fail('minTicksPerSlice','cannot exceed maxTicksPerSlice');
    }
    if(file==='breeding.json'){
      if(Number(root.densityFullUntil)>=Number(root.targetPopulation))fail('densityFullUntil','must be below targetPopulation');
      if(Number(root.foodCapacityFloor)>Number(root.targetPopulation))fail('foodCapacityFloor','must not exceed targetPopulation');
    }
    if(file==='robustness.json'){if(Number(root.heartbeatMs)>=Number(root.leaseMs))fail('heartbeatMs','must be shorter than leaseMs');if(Number(root.helloWaitMs)>=Number(root.leaseMs))fail('helloWaitMs','must be shorter than leaseMs');}
    if(file==='presentation.json'&&!(root.textSizes as number[]).includes(Number(root.defaultTextSize)))fail('defaultTextSize','must be present in textSizes');
    if(file==='health.json')for(const profileName of ['full','quick']){
      const profile=root[profileName] as {ticks:number;sampleEveryTicks:number;seeds:number[];bands:Record<string,number[]>};
      if(profile.sampleEveryTicks>profile.ticks)fail(`${profileName}.sampleEveryTicks`,'must not exceed profile ticks');
      if(new Set(profile.seeds).size!==profile.seeds.length)fail(`${profileName}.seeds`,'seeds must be distinct');
      for(const [metric,band]of Object.entries(profile.bands))if(band[0]>band[1])fail(`${profileName}.bands.${metric}`,'lower bound exceeds upper bound');
    }
    if(file==='health.json'){
      const soak=root.soak as {seeds:number[];shortSeeds:number[]};
      for(const key of ['seeds','shortSeeds'] as const)if(new Set(soak[key]).size!==soak[key].length)fail(`soak.${key}`,'seeds must be distinct');
    }
    if(file==='names.json')for(const key of ['starts','middles','ends'])if((root[key] as string[]).some(s=>s.trim().length===0))fail(key,'syllables must not be empty');
    if(file==='balance.json'){
      const clock=root.clock as {foregroundSpeeds:number[]};
      clock.foregroundSpeeds.forEach((speed,i)=>{if(![0,1,10,100,1000].includes(speed))fail(`clock.foregroundSpeeds[${i}]`,'unsupported foreground speed');});
      if(new Set(clock.foregroundSpeeds).size!==clock.foregroundSpeeds.length)fail('clock.foregroundSpeeds','speeds must be unique');
      const mood=root.mood as {needWeights:Record<string,number>};
      if(Math.abs(Object.values(mood.needWeights).reduce((n,x)=>n+x,0)-1)>1e-9)fail('mood.needWeights','weights must sum to one');
    }
  }
  return issues;
}
export function assertValidData(files:Record<string,unknown>):void {
  const issues=Object.entries(files).flatMap(([f,v])=>validateData(f,v));
  if(issues.length)throw new Error(issues.map(i=>`${i.file}:${i.path}: ${i.message}`).join('\n'));
}
export function tuningDocument(files:Record<string,unknown>):string {
  assertValidData(files);
  const rows:string[]=[];
  function walk(file:string,rule:ValueContract,v:unknown,path:string) {
    if(rule.type==='number') {const m=rule.metadata;rows.push(`| ${file} | \`${path}\` | ${v} | ${m.unit} | ${m.integer?'integer ':''}[${m.min}, ${m.max}] | ${m.description} |`);}
    else if(rule.type==='boolean'){const m=rule.metadata;rows.push(`| ${file} | \`${path}\` | ${v} | ${m.unit} | ${m.allowed.join(', ')} | ${m.description} |`);}
    else if(rule.type==='object')for(const [k,r] of Object.entries(rule.fields))walk(file,r,(v as Record<string,unknown>)[k],path?`${path}.${k}`:k);
    else if(rule.type==='array'){
      if(rule.repeat)(v as unknown[]).forEach((child,i)=>walk(file,rule.entries[0],child,`${path}[${i}]`));
      else rule.entries.forEach((r,i)=>walk(file,r,(v as unknown[])[i],`${path}[${i}]`));
    }
  }
  const priority=['balance.json','lifecycle.json','breeding.json','social.json','competitions.json','prizes.json','skills.json','fruits.json','offline.json','health.json','robustness.json','presentation.json','names.json','actions.json','sources.json','training-spots.json','items.json','empty-inventory.json','genes.json','appearance.json'];
  for(const file of Object.keys(files).sort((a,b)=>(priority.indexOf(a)<0?priority.length:priority.indexOf(a))-(priority.indexOf(b)<0?priority.length:priority.indexOf(b))||a.localeCompare(b)))walk(file,contracts[file],files[file],'');
  return '# Tuning table\n\nGenerated with `npm run tuning:doc`. Every numeric catalog value and boolean switch is included (including geometry and test targets). Change the explicit validator contract when adding a key. Target bands are acceptance criteria, never automatic tuning.\n\n| File | Key path | Current | Unit | Valid range | Description |\n|---|---|---:|---|---|---|\n'+rows.join('\n')+'\n';
}
