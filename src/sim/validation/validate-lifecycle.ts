import { lifespanAtDeath } from '../historical-time';
import { validationLineage, validParentMarker } from './archived-lineage';
import { config, lifeStages, skillKeys } from '../../data/config';
import { stageAtAge, stageStartAge } from '../life-stages';
import { xpAtLevel } from '../skills';
import type { SaveState } from '../types';
import { exactKeys, finite, integer, object, requireValue } from './checks';

export function validateLifecycle(state: SaveState, breeding = true, social = true): void {
  const s = state, tick = s.clock.tick;
  requireValue(Array.isArray(s.lineage) && s.lineage.every(object)
    && new Set(s.lineage.map(l => l.id)).size === s.lineage.length, 'lineage list/IDs');
  const lineage=validationLineage(s);
  const records = new Map(lineage.map(l => [l.id, l]));
  requireValue(records.size===lineage.length,'unique archived lives');
  const organisms = new Map(s.organisms.map(o => [o.id, o]));
  const active = new Map(s.creatures.map(c => [c.id, c]));
  const id = (v: unknown, prefix: string) => typeof v === 'string' && new RegExp(`^${prefix}_[0-9]{8}$`).test(v) && Number(v.slice(2)) > 0;
  for (const o of s.organisms) {
    requireValue(exactKeys(o, ['id', 'parents', 'appearanceSeed', 'lives']) && id(o.id, 'o')
      && Number(o.id.slice(2)) < s.counters.organism && integer(o.appearanceSeed, 1, 0xffffffff)
      && Array.isArray(o.parents) && o.parents.length <= (breeding ? 2 : 1) && new Set(o.parents).size === o.parents.length && (!breeding || o.parents.length<2 || o.parents[0]<o.parents[1]) && o.parents.every(p => (organisms.has(p)||validParentMarker(p,s)) && p !== o.id && (validParentMarker(p,s)||Number(p.slice(2)) < Number(o.id.slice(2))))
      && Array.isArray(o.lives) && o.lives.length > 0 && o.lives.length < s.counters.creature, 'organism legacy');
    let previousEnd = 0;
    for (const [index, life] of o.lives.entries()) {
      const record = records.get(life.creatureId);
      requireValue(exactKeys(life, ['creatureId', 'lifeIndex', 'displayName', 'startedTick', 'endedTick']) && record
        && life.lifeIndex === index && record.organismId === o.id && record.displayName === life.displayName
        && integer(life.startedTick, previousEnd, tick) && life.startedTick === record.birthTick && life.endedTick === record.deathTick,
      'life/lineage reference');
      if (life.endedTick === null) requireValue(index === o.lives.length - 1 && active.get(life.creatureId)?.organismId === o.id, 'open life');
      else requireValue(integer(life.endedTick, life.startedTick, tick) && !active.has(life.creatureId), 'closed life');
      previousEnd = life.endedTick ?? tick;
    }
  }
  for (const l of lineage) {
    const o = organisms.get(l.organismId), life = o?.lives.find(life => life.creatureId === l.id);
    requireValue(exactKeys(l, ['id', 'organismId', 'displayName', 'parentIds', 'birthTick', 'deathTick', 'finalStage', 'ageAtDeath', 'topSkill', 'endReason', ...(breeding ? ['origin','generation','birthAptitudes','mutations'] : []),...(s.schemaVersion>=10?['awards']:[])])
      && id(l.id, 'c') && Number(l.id.slice(2)) < s.counters.creature && life
      && typeof l.displayName === 'string' && [...l.displayName].length <= 40 && integer(l.birthTick, 0, tick), 'lineage record');
    requireValue(l.parentIds === null ? o!.parents.length === 0 : Array.isArray(l.parentIds) && l.parentIds.length === o!.parents.length && l.parentIds.length > 0
      && l.parentIds.every(parentId => {
        if(validParentMarker(parentId,s))return true;
        const p = records.get(parentId);
        return !!p && p.id !== l.id && Number(p.id.slice(2)) < Number(l.id.slice(2)) && p.birthTick <= l.birthTick && o!.parents.includes(p.organismId);
      }), 'lineage parent');
    if (l.deathTick === null) {
      requireValue(active.has(l.id) && l.finalStage === null && l.ageAtDeath === null && l.topSkill === null && l.endReason === null, 'living lineage');
    } else {
      requireValue(!active.has(l.id) && integer(l.deathTick, l.birthTick, tick) && l.finalStage === 'elder'
        && l.ageAtDeath === lifespanAtDeath(s,l.deathTick,life!.lifeIndex) && (l.endReason === 'oldAge' || l.endReason === 'rebirth'), 'closed lineage');
      const top = l.topSkill;
      if(top===null) requireValue(s.dynasty.legacyRecords.some((r)=>!!r&&typeof r==='object'&&'kind' in r&&r.kind==='retiredTopSkill'&&'creatureId' in r&&r.creatureId===l.id),'missing historical top skill');
      else {
      requireValue(exactKeys(top, ['skill', 'level', 'xp', 'aptitude']) && skillKeys.includes(top.skill)
        && finite(top.aptitude, 0, 1) && integer(top.level, 0, config.skillCatalog[top.skill].levelCap), 'final top skill');
      const { xpLinear: a, xpQuadratic: b } = config.skillCatalog[top.skill];
      const cap = Math.floor(config.skills.capBase + config.skills.capRange * top.aptitude);
      requireValue(finite(top.xp, 0, xpAtLevel(cap, top.skill)) && top.level === Math.min(cap,
        Math.floor((-a + Math.sqrt(a * a + 4 * b * top.xp)) / (2 * b))), 'final XP/level');
      }
    }
  }
  for (const c of s.creatures) {
    const record = records.get(c.id);
    requireValue(record && record.organismId === c.organismId && record.deathTick === null
      && integer(c.age) && stageAtAge(c.age, c.lifeIndex) === c.stage
      && c.age - stageStartAge(c.stage, c.lifeIndex) === tick - c.stageStartedTick
      && exactKeys(c.welfare, ['total', 'ticks']) && integer(c.welfare.ticks, 0, tick - record.birthTick)
      && finite(c.welfare.total, 0, c.welfare.ticks), 'age/stage/welfare');
    if (!config.lifecycle.stages[c.stage].mobile) requireValue(c.needs === null && c.currentAction === null
      && Object.values(c.xp).every(x => x === 0) && Object.values(c.trainingTicks).every(x => x === 0)
      && Object.keys(c.skillBonuses).length === 0 && c.welfare.ticks === 0, 'dormant life');
  }
  requireValue(Array.isArray(s.relationships) && s.relationships.every(object), 'rebirth bond records');
  const pairs = new Set<string>();
  for (const r of s.relationships) {
    const pair = `${r.a}:${r.b}`;
    requireValue(exactKeys(r, ['a', 'b', 'bond', 'mateBond', 'lastContactTick', 'lastDecayTick', ...(social?['history']:[])])
      && organisms.has(r.a) && organisms.has(r.b) && r.a < r.b && !pairs.has(pair)
      && finite(r.bond, -100, 100) && finite(r.mateBond, 0, 100)
      && integer(r.lastContactTick, 0, tick) && integer(r.lastDecayTick, 0, tick), 'rebirth bond');
    pairs.add(pair);
  }
  requireValue(Array.isArray(s.events) && s.events.length <= config.lifecycle.eventLogLimit && s.events.every(object), 'life event log');
  let previousTick = 0, previousId = 0;
  for (const e of s.events) {
    requireValue(exactKeys(e, ['id', 'tick', 'creatureId', 'kind', 'from', 'to', 'relatedCreatureId', ...(Object.hasOwn(e,'command') ? ['command'] : []), ...(social&&Object.hasOwn(e,'socialResult')?['socialResult']:[]),...(s.schemaVersion>=9&&Object.hasOwn(e,'competitionEvent')?['competitionEvent']:[])])
      && id(e.id, 'e') && integer(Number(e.id.slice(2)), previousId + 1, s.counters.event - 1)
      && integer(e.tick, previousTick, tick) && records.has(e.creatureId)
      && (breeding ? ['spawn','hatch','stage','death','rebirth','debugStage','courtship','mating','eggLaid','intervention','forceBreed','rescue','courtshipAborted', ...(social?['friendship','rivalry','contest','share','steal','fight','mateBondFormed','mateBondBroken','mourning','debugAffinity',...(s.schemaVersion>=9?['competitionCreated','competitionOpened','competitionEntered','competitionStarted','competitionResult','competitionCancelled','competitionDropped',...(s.schemaVersion>=10?['prizeEscrowed','prizeRefunded','prizeAwarded','prizeReturned','trophyEarned','prizeFruitEaten','dailyCache','inventoryOverflow']:[])]:[])]:[])] : ['spawn','hatch','stage','death','rebirth','replacement','debugStage']).includes(e.kind)
      && (e.from === null || lifeStages.includes(e.from)) && (e.to === 'dead' || lifeStages.includes(e.to))
      && (e.relatedCreatureId === null || records.has(e.relatedCreatureId)), 'life event');
    if(e.competitionEvent)requireValue(s.schemaVersion>=9&&(e.kind.startsWith('competition')||s.schemaVersion>=10)&&exactKeys(e.competitionEvent,['id','reason'])&&/^cpt_[0-9]{8}$/.test(e.competitionEvent.id)&&(e.competitionEvent.reason===null||typeof e.competitionEvent.reason==='string'),'competition event');
    if (e.kind === 'death') requireValue(e.from === 'elder' && e.to === 'dead' && records.get(e.creatureId)!.deathTick === e.tick, 'death event');
    if (e.kind === 'hatch') requireValue((e.from === 'egg' || e.from === 'cocoon') && e.to === 'baby', 'hatch event');
    if(e.socialResult)requireValue(e.kind==='contest'&&exactKeys(e.socialResult,['skill','winnerId','margin'])&&(e.socialResult.skill===null||skillKeys.includes(e.socialResult.skill))
      &&(e.socialResult.winnerId===null||records.has(e.socialResult.winnerId))&&finite(e.socialResult.margin,0,Number.MAX_SAFE_INTEGER),'contest event');
    previousTick = e.tick; previousId = Number(e.id.slice(2));
  }
}
