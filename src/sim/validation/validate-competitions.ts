import { prizeReason } from '../competition/prizes';
import { config, skillKeys } from '../../data/config';
import { rulesReason } from '../competition/eligibility';
import { resolveCompetition } from '../competition/resolve';
import { navigationTerrain } from '../food-sources';
import { terrainCost, tileIndex } from '../map';
import type { Competition, CompetitionResult, SaveState } from '../types';
import { exactKeys, finite, integer, object, requireValue } from './checks';

function validateRules(r:Competition['entryRules']):void{
  requireValue(exactKeys(r,['allowedStages','levels','maximumEntrants','needMaximum','stressMaximum','minimumMood','relatedEntrantsAllowed'])&&!rulesReason(r),'competition rules');
  for(const range of Object.values(r.levels))requireValue(range&&exactKeys(range,['minimum','maximum']),'competition skill rule');
}
function filtered(result:CompetitionResult,ids:readonly string[]):CompetitionResult{
  const present=new Set(ids);result.placements=result.placements.filter(p=>present.has(p.id)).map((p,i)=>({...p,rank:i+1}));result.effects=result.effects.filter(p=>present.has(p.id));
  for(const round of result.rounds){round.ranking=round.ranking.filter(p=>present.has(p.id)).map((p,i)=>({...p,rank:i+1}));round.effects=round.effects.filter(p=>present.has(p.id));if(round.winnerId&&!present.has(round.winnerId))round.winnerId=null;
    round.margin=round.ranking.length>=2?Math.max(0,round.ranking[0].score-round.ranking[1].score):0;}
  return result;
}
export function validateCompetitions(s:SaveState):void{
  const settings=config.competitions,tick=s.clock.tick,records=new Map(s.lineage.map(l=>[l.id,l])),living=new Map(s.creatures.map(c=>[c.id,c]));
  requireValue(Array.isArray(s.competitions)&&s.competitions.length<=settings.maximumConcurrent&&Array.isArray(s.competitionHistory)&&s.competitionHistory.length<=settings.historyLimit,'competition lists');
  const terrain=navigationTerrain(s.world),locks=new Set([...s.sessions.flatMap(e=>e.participants),...s.social.sessions.flatMap(e=>e.participants)]);
  const ids=new Set<string>();let previousFinished=-1;
  for(const [history,list] of [[false,s.competitions],[true,s.competitionHistory]] as const)for(const e of list){
    requireValue(exactKeys(e,['id','skill','skills','format','entryRules','status','createdTick','entryOpenTick','startTick','endTick','finishedTick','entrantIds','startedIds','attendance','snapshots','results','drops','cancellationReason','createdBy','prize',...(s.schemaVersion>=10?['escrowState','awarded','deliveries']:[])]),'competition fields');
    requireValue(typeof e.id==='string'&&/^cpt_[0-9]{8}$/.test(e.id)&&integer(Number(e.id.slice(4)),1,s.counters.competition-1)&&!ids.has(e.id),'competition ID');ids.add(e.id);
    const format=settings.formats.find(f=>f.id===e.format);
    requireValue(format&&skillKeys.includes(e.skill)&&format.skills.includes(e.skill)&&Array.isArray(e.skills)&&e.skills[0]===e.skill
      &&e.skills.length===(e.format==='circuit'?format.rounds:1)&&new Set(e.skills).size===e.skills.length&&e.skills.every(k=>format.skills.includes(k)),'competition format skills');
    validateRules(e.entryRules);
    requireValue(['player','debug','auto'].includes(e.createdBy)&&(s.schemaVersion>=10?!prizeReason(e.prize):e.prize===null),'competition reserved data');
    requireValue(integer(e.createdTick,0,tick)&&integer(e.entryOpenTick,e.createdTick+1)&&integer(e.startTick,e.entryOpenTick+1)&&e.endTick===e.startTick+settings.durationTicks,'competition clocks');
    requireValue(history?['resolved','cancelled'].includes(e.status)&&integer(e.finishedTick,previousFinished,tick):['scheduled','entryOpen','running'].includes(e.status)&&e.finishedTick===null,'competition status');
    if(history)previousFinished=e.finishedTick!;
    if(e.status==='scheduled')requireValue(tick<e.entryOpenTick,'scheduled boundary');
    if(e.status==='entryOpen')requireValue(tick>=e.entryOpenTick&&tick<e.startTick,'entry boundary');
    if(e.status==='running')requireValue(tick>=e.startTick&&tick<e.endTick,'running boundary');
    if(e.status==='resolved')requireValue(e.finishedTick===e.endTick,'resolved boundary');
    requireValue(Array.isArray(e.entrantIds)&&e.entrantIds.length<=e.entryRules.maximumEntrants&&new Set(e.entrantIds).size===e.entrantIds.length&&e.entrantIds.every(id=>records.has(id)),'entrant IDs');
    requireValue(Array.isArray(e.startedIds)&&e.startedIds.length<=e.entryRules.maximumEntrants&&new Set(e.startedIds).size===e.startedIds.length&&e.startedIds.every(id=>records.has(id)),'starter IDs');
    requireValue(Array.isArray(e.drops)&&new Set(e.drops.map(d=>d.id)).size===e.drops.length&&e.drops.every(d=>exactKeys(d,['id','tick','reason'])&&records.has(d.id)&&!e.entrantIds.includes(d.id)&&integer(d.tick,e.createdTick,tick)&&typeof d.reason==='string'&&d.reason.length>0),'competition drops');
    // At most the population can try once each, even if many drop during entry.
    requireValue(e.drops.length+e.entrantIds.length<=s.settings.capacity,'competition entry budget');
    requireValue(e.status==='cancelled'?typeof e.cancellationReason==='string'&&e.cancellationReason.length>0:e.cancellationReason===null,'competition cancellation');
    requireValue(Array.isArray(e.attendance)&&(history?e.attendance.length===0:e.attendance.length===e.entrantIds.length),'competition attendance');
    const places=new Set<string>();
    for(const a of e.attendance){
      const c=living.get(a.id);requireValue(c&&exactKeys(a,['id','entryPosition','target','path'])&&e.entrantIds.includes(a.id)&&c.currentAction===null&&!locks.has(a.id),'competition lock');locks.add(a.id);
      const point=(p:{x:number;y:number})=>exactKeys(p,['x','y'])&&finite(p.x,0,s.world.width-Number.EPSILON)&&finite(p.y,0,s.world.height-Number.EPSILON)&&Number.isFinite(terrainCost(terrain[tileIndex(p,s.world.width)]));
      requireValue(point(a.entryPosition)&&settings.venue.places.some(p=>p.x===a.target.x&&p.y===a.target.y)&&!places.has(`${a.target.x}:${a.target.y}`)&&Array.isArray(a.path)&&a.path.length<=s.world.width*s.world.height,'competition venue');places.add(`${a.target.x}:${a.target.y}`);
      let previous=c.position;
      for(const p of a.path){requireValue(point(p)&&Number.isInteger(p.x-.5)&&Number.isInteger(p.y-.5)&&(p.x===previous.x||p.y===previous.y)&&Math.abs(p.x-previous.x)+Math.abs(p.y-previous.y)<=1,'competition path');previous=p;}
      requireValue(previous.x===a.target.x&&previous.y===a.target.y&&(e.status!=='running'||a.path.length===0),'competition destination');
    }
    if(!history)requireValue(e.entrantIds.every(id=>living.has(id)),'live entrants');
    requireValue(Array.isArray(e.snapshots)&&e.snapshots.length===e.startedIds.length,'competition snapshots');
    for(const p of e.snapshots)requireValue(exactKeys(p,['id','organismId','levels','aptitudes','wellbeing','stagePerformance',...(p.confidence!==undefined?['confidence']:[])])&&e.startedIds.includes(p.id)&&records.get(p.id)?.organismId===p.organismId
      &&exactKeys(p.levels,skillKeys)&&Object.values(p.levels).every(n=>integer(n,0,100))&&exactKeys(p.aptitudes,skillKeys)&&Object.values(p.aptitudes).every(n=>finite(n,0,1))&&finite(p.wellbeing,0,1)&&(p.confidence===undefined||p.confidence===0||p.confidence===config.prizes.confidenceBonus)
      &&Object.values(config.lifecycle.stages).some(stage=>stage.mobile&&p.stagePerformance===stage.performanceMultiplier),'competition snapshot');
    requireValue(new Set(e.snapshots.map(p=>p.id)).size===e.snapshots.length,'unique competition snapshots');
    if(e.status==='running'||e.status==='resolved'){
      requireValue(e.entrantIds.length>=settings.minimumEntrants&&e.startedIds.length>=settings.minimumEntrants&&e.results&&integer(e.results.startRng,1,0xffffffff),'committed results');
      const expected=filtered(resolveCompetition(e,e.snapshots,e.results.startRng,config),e.entrantIds);
      requireValue(JSON.stringify(e.results)===JSON.stringify(expected),'competition committed score mismatch');
    }else requireValue(e.results===null&&(e.status==='cancelled'||e.snapshots.length===0),'unexpected competition result');
  }
  for(const c of s.creatures){const m=c.competition;
    requireValue(exactKeys(m,['nextEntryTick','stats'])&&integer(m.nextEntryTick)&&exactKeys(m.stats,['entered','wins','podiums','bestPlacement'])&&integer(m.stats.entered)&&integer(m.stats.wins,0,m.stats.podiums)&&integer(m.stats.podiums,0,m.stats.entered)&&object(m.stats.bestPlacement),'competition memory');
    requireValue(Object.entries(m.stats.bestPlacement).every(([k,n])=>skillKeys.includes(k as typeof skillKeys[number])&&integer(n,1,settings.maximumEntrants)),'competition best placement');
    if(!config.lifecycle.stages[c.stage].mobile)requireValue(m.stats.entered===0&&m.stats.wins===0&&m.stats.podiums===0&&Object.keys(m.stats.bestPlacement).length===0,'dormant competition stats');
  }
  const state=s.competitionState;
  requireValue(exactKeys(state,['skillCooldowns','nextAutoTick','statistics'])&&integer(state.nextAutoTick)&&exactKeys(state.statistics,['held','cancelled','cancellationReasons','entrants','dropped','accepted','entryBands','aptitudeBands','levelBands','placementCorrelation']),'competition scheduler state');
  requireValue(object(state.skillCooldowns)&&Object.entries(state.skillCooldowns).every(([k,v])=>skillKeys.includes(k as typeof skillKeys[number])&&integer(v,0,tick+settings.skillCooldownTicks)),'competition skill cooldowns');
  const stats=state.statistics;
  for(const k of ['held','cancelled','entrants','dropped','accepted'] as const)requireValue(integer(stats[k]),'competition counters');
  requireValue(stats.dropped<=stats.accepted&&object(stats.cancellationReasons)&&Object.values(stats.cancellationReasons).every(n=>integer(n))&&Object.values(stats.cancellationReasons).reduce((n,v)=>n+v,0)===stats.cancelled,'competition cancellation counts');
  for(const [rows,bounds,entry] of [[stats.entryBands,settings.report.levelBands,true],[stats.aptitudeBands,settings.report.aptitudeBands,false],[stats.levelBands,settings.report.levelBands,false]] as const){
    requireValue(Array.isArray(rows)&&rows.length===bounds.length+1,'competition report bands');
    for(const row of rows)requireValue(exactKeys(row,entry?['considered','entered']:['entries','wins'])&&Object.values(row).every(n=>integer(n)),'competition band counters');
  }
  requireValue(exactKeys(stats.placementCorrelation,['count','levels','levelsSquared','placements','placementsSquared','levelPlacements'])&&Object.values(stats.placementCorrelation).every(n=>finite(n,0,Number.MAX_SAFE_INTEGER)),'competition report correlation');
}
export function validateCompetitionCommand(command:unknown):void{
  requireValue(object(command),'competition command');const c=command as Record<string,unknown>;
  if(c.kind==='cancelCompetition'){requireValue(exactKeys(c,['kind','id',...(Object.hasOwn(c,'debug')?['debug']:[])])&&(c.debug===undefined||typeof c.debug==='boolean')&&typeof c.id==='string'&&/^cpt_[0-9]{8}$/.test(c.id),'cancel command');return;}
  requireValue(exactKeys(c,['kind','skill','format','entryRules','startDelay',...(Object.hasOwn(c,'skills')?['skills']:[]),...(Object.hasOwn(c,'prize')?['prize']:[])])&&skillKeys.includes(c.skill as typeof skillKeys[number])&&config.competitions.formats.some(f=>f.id===c.format)&&integer(c.startDelay,config.competitions.minimumStartDelay,config.competitions.maximumStartDelay),'create command');
  requireValue(!prizeReason(c.prize),'command prize');
  validateRules(c.entryRules as Competition['entryRules']);
  if(c.skills!==undefined)requireValue(Array.isArray(c.skills)&&c.skills.every(k=>skillKeys.includes(k)),'command skills');
}
