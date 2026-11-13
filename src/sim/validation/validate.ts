import { validateDynasty } from '../dynasty/validate';
import { validatePrizes } from './validate-prizes';
import { validateCompetitions } from './validate-competitions';
import { actionKinds, config, fruitKinds, lifeStages, needKeys, skillKeys, tasteKeys } from '../../data/config';
import emptyInventory from '../../data/empty-inventory.json';
import { decodeTerrain, isSafeLand, terrainCost, tileIndex } from '../map';
import { navigationTerrain, plantApproaches, validFoodClaim } from '../food-sources';
import { skillCap, skillLevel, trainingSkill, xpAtLevel } from '../skills';
import { spotCells, trainingApproaches, validTraining } from '../training';
import { validateGenome } from '../genetics/validate';
import type { Creature, LegacySaveState, Milestone3SaveState, Milestone4Creature, Milestone4SaveState, Milestone5aSaveState, Milestone5bSaveState, Milestone7aSaveState, Milestone7bSaveState, Milestone8SaveState, Point, SaveState } from '../types';
import { validateSocial } from './validate-social';
import { validateAppearanceModifiers } from './validate-appearance';
import { validateBreeding } from './validate-breeding';
import { validateLifecycle } from './validate-lifecycle';

import { requireValue, integer, finite, object, exactKeys, allFinite } from './checks';

function validateFoodExperience(c: Creature, tick: number, started: number, lifecycle: boolean): void {
  requireValue(exactKeys(c.foodPreferences, fruitKinds), 'food preference table');
  let meals = 0;
  for (const kind of fruitKinds) {
    const memory = c.foodPreferences[kind];
    requireValue(exactKeys(memory, ['learnedMean', 'samples']) && finite(memory.learnedMean, -1, 1) && integer(memory.samples), 'food memory');
    meals += memory.samples;
  }
  requireValue(Array.isArray(c.lastFiveFoods) && (lifecycle && c.lifeIndex > 0
    ? c.lastFiveFoods.length <= Math.min(meals, config.food.historyLength) : c.lastFiveFoods.length === Math.min(meals, config.food.historyLength))
    && c.lastFiveFoods.every(kind => fruitKinds.includes(kind)), 'food history');
  for (const kind of fruitKinds) requireValue(c.lastFiveFoods.filter(f => f === kind).length <= c.foodPreferences[kind].samples, 'food history counts');
  if (meals === 0 || (lifecycle && c.lifeIndex > 0 && c.lastFiveFoods.length === 0)) requireValue(c.lastMeal === null, 'unexpected last meal');
  else {
    const meal = c.lastMeal;
    requireValue(meal && exactKeys(meal, ['fruit', 'tick', 'preference', 'reward']) && fruitKinds.includes(meal.fruit)
      && c.foodPreferences[meal.fruit].samples > 0 && meal.fruit === c.lastFiveFoods.at(-1)
      && integer(meal.tick, started, tick) && finite(meal.preference, -1, 1) && finite(meal.reward, -1, 1), 'last meal');
  }
}

/** Validate only this milestone's format; never silently load unsupported future systems. */
export function validateSave(data: unknown): asserts data is SaveState {
  validateStructure(data, 12);
}

export function validateLegacySave(data: unknown): asserts data is LegacySaveState {
  validateStructure(data, 1);
}

export function validateMilestone3Save(data: unknown): asserts data is Milestone3SaveState {
  validateStructure(data, 2);
}

export function validateMilestone4Save(data: unknown): asserts data is Milestone4SaveState {
  validateStructure(data, 3);
}
export function validateMilestone5aSave(data: unknown): asserts data is Milestone5aSaveState {
  validateStructure(data, 4);
}

export function validateMilestone5bSave(data: unknown): asserts data is Milestone5bSaveState { validateStructure(data, 5); }
export function validateMilestone7aSave(data: unknown): asserts data is Milestone7aSaveState { validateStructure(data, 6); }
export function validateMilestone7bSave(data: unknown): asserts data is Milestone7bSaveState { validateStructure(data, 7); }

export function validateMilestone8Save(data:unknown):asserts data is Milestone8SaveState {validateStructure(data,8);}

function historicalCap(c: Milestone4Creature, skill: typeof skillKeys[number]): number {
  return Math.min(config.skillCatalog[skill].levelCap, Math.floor(config.skills.capBase + config.skills.capRange * c.innateAptitude[skill]));
}
function savedLevel(c: Creature, skill: typeof skillKeys[number], genetic: boolean): number {
  if (genetic) return skillLevel(c, skill);
  const { xpLinear: a, xpQuadratic: b } = config.skillCatalog[skill];
  return Math.min(historicalCap(c as unknown as Milestone4Creature, skill), Math.floor((-a + Math.sqrt(a * a + 4 * b * c.xp[skill])) / (2 * b)));
}
function validGenome(value: unknown): boolean {
  try { validateGenome(value); return true; } catch { return false; }
}

function validateSkills(c: Creature, tick: number, genetic: boolean, started: number): void {
  const old = c as unknown as Milestone4Creature;
  if (!genetic) requireValue(exactKeys(old.innateAptitude, skillKeys) && Object.values(old.innateAptitude).every(n => finite(n, 0, 1)), 'historical aptitudes');
  requireValue(exactKeys(c.practiceTicks, skillKeys) && exactKeys(c.trainingTicks, skillKeys)
    && exactKeys(c.activityPreferences, skillKeys) && object(c.skillBonuses), 'skill memory fields');
  for (const skill of skillKeys) {
    requireValue(integer(c.trainingTicks[skill], 0, tick) && integer(c.practiceTicks[skill], 0, tick % config.clock.dayTicks)
      && c.practiceTicks[skill] <= c.trainingTicks[skill], 'practice/training counters');
    requireValue(finite(c.xp[skill], 0, xpAtLevel(genetic ? skillCap(c, skill) : historicalCap(old, skill), skill)), 'skill XP/cap');
    const memory = c.activityPreferences[skill];
    requireValue(exactKeys(memory, ['learnedMean', 'samples']) && finite(memory.learnedMean, -1, 1) && integer(memory.samples), 'activity memory');
  }
  requireValue(Object.keys(c.skillBonuses).every(s => skillKeys.includes(s as typeof skillKeys[number])), 'bonus skill');
  for (const bonus of Object.values(c.skillBonuses)) requireValue(bonus && exactKeys(bonus, ['amount', 'expiresTick'])
    && finite(bonus.amount, 0, 1) && integer(bonus.expiresTick, tick + 1), 'skill bonus');
  const up = c.lastLevelUp;
  requireValue(up === null || (exactKeys(up, ['skill', 'level', 'tick']) && skillKeys.includes(up.skill)
    && integer(up.level, 1, savedLevel(c, up.skill, genetic)) && integer(up.tick, started, tick)), 'last level-up');
}

function validateStructure(data: unknown, version: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12): void {
  const legacy = version === 1, skills = version >= 3, genetic = version >= 4, lifecycle = version >= 5, breeding = version >= 6;
  requireValue(exactKeys(data, [...(version>=11?['dynasty']:[]), 'schemaVersion', 'rulesVersion', 'saveId', 'revision', 'clock', 'rng', 'counters', 'settings', 'breedingRules', 'world', 'creatures', 'organisms', 'relationships', 'sessions', 'competitions', 'inventory', 'events', 'discoveries', ...(lifecycle ? ['lineage'] : []), ...(version>=8?['social']:[]),...(version>=9?['competitionHistory','competitionState']:[]),...(version>=10?['prizeLedger',...(Object.hasOwn(data as object,'archive')?['archive']:[])]:[])]), 'root fields');
  const s = data as unknown as SaveState;
  requireValue(allFinite(s), 'nonfinite number');
  requireValue(Number(s.schemaVersion) === version && s.rulesVersion === (legacy ? '0.2.0' : version >= 10 ? config.rulesVersion : version===9?'0.9.0' : version===8?'0.8.0' : version===7?'0.7.0':breeding ? '0.6.0' : lifecycle ? '0.5.1' : genetic ? '0.5.0' : skills ? '0.4.0' : '0.3.0'), 'unsupported schema or rules version');
  requireValue(typeof s.saveId === 'string' && /^world_[1-9]\d*$/.test(s.saveId) && integer(Number(s.saveId.slice(6)), 1, 0xffffffff), 'seed identity');
  requireValue(integer(s.revision), 'revision');
  requireValue(exactKeys(s.clock, ['tick', 'wallAnchorMs', 'speed', 'offlineEnabled', 'fractionalSeconds', 'catchup']), 'clock fields');
  requireValue(integer(s.clock.tick) && finite(s.clock.wallAnchorMs, 0, Number.MAX_SAFE_INTEGER)
    && finite(s.clock.fractionalSeconds, 0, Number.MAX_SAFE_INTEGER) && (lifecycle ? config.clock.foregroundSpeeds : [0, 1, 10, 100]).includes(s.clock.speed)
    && s.clock.offlineEnabled === false && s.clock.catchup === null, 'clock');
  requireValue(exactKeys(s.rng, ['world', 'genetics', 'competition']) && Object.values(s.rng).every(n => integer(n, 1, 0xffffffff)), 'RNG streams');
  requireValue(exactKeys(s.counters, ['creature', 'organism', 'item', 'plant', 'fruit', 'session', 'competition', 'event'])
    && Object.values(s.counters).every(n => integer(n, 1)), 'ID counters');
  const retiredSetting = ['auto', 'Replace', 'OnDeath'].join('');
  requireValue(exactKeys(s.settings, ['autoBreed', 'autoImmigration', 'capacity', ...(version>=9?['autoCompetitions']:[]),...(version>=10?['autoPrizes']:[]), ...(breeding ? ['extinctionRescue'] : lifecycle ? [retiredSetting] : [])])
    && s.settings.capacity === (breeding ? config.lifecycle.capacity : lifecycle ? 8 : 30)
    && (breeding ? typeof s.settings.extinctionRescue === 'boolean' && typeof s.settings.autoBreed === 'boolean'
      : s.settings.autoBreed === false && (!lifecycle || typeof (s.settings as unknown as Record<string,unknown>)[retiredSetting] === 'boolean'))
    && (version<9||typeof s.settings.autoCompetitions==='boolean') && (version<10||typeof s.settings.autoPrizes==='boolean') && s.settings.autoImmigration === false, 'milestone settings');
  requireValue(exactKeys(s.breedingRules, ['blockedPairs', 'encouragedPairs', 'exclusivePairs', ...(breeding ? ['blockedIndividuals','encouragedIndividuals'] : [])]), 'breeding rule fields');
  for (const list of [...(version<9?[s.competitions]:[]), s.discoveries, ...(!breeding ? [...Object.values(s.breedingRules), s.sessions] : []), ...(!lifecycle ? [s.relationships, s.events] : [])]) {
    requireValue(Array.isArray(list) && list.length === 0, 'unsupported later-milestone records');
  }
  requireValue(exactKeys(s.world, ['width', 'height', 'terrainRle', 'terrainRevision', 'items', 'plants', 'looseFruit', 'nextImmigrationTick', 'lastCacheDay']), 'world fields');
  const w = s.world;
  requireValue(w.width === config.world.widthTiles && w.height === config.world.heightTiles, 'map dimensions');
  requireValue(Array.isArray(w.terrainRle) && w.terrainRle.length > 0 && w.terrainRle.length <= w.width * w.height, 'terrain runs');
  let tiles = 0;
  for (const run of w.terrainRle) {
    requireValue(Array.isArray(run) && run.length === 2 && integer(run[0], 0, 5) && integer(run[1], 1, w.width * w.height), 'terrain run');
    tiles += run[1];
  }
  requireValue(tiles === w.width * w.height, 'terrain run total');
  requireValue(integer(w.terrainRevision) && integer(w.nextImmigrationTick) && integer(w.lastCacheDay), 'world clocks');
  requireValue(Array.isArray(w.items) && w.items.length <= (skills ? config.training.defaults.length : 0) && Array.isArray(w.plants)
    && w.plants.length <= (legacy ? 0 : Math.max(config.dynasty.plants.maximum,config.dynasty.plants.saveCompatibilityMaximum)), 'unsupported items/plant count');
  const baseTerrain = decodeTerrain(w.terrainRle);
  const plantIds = new Set<string>();
  const plantTiles = new Set<number>();
  for (const p of w.plants) {
    requireValue(exactKeys(p, ['id', 'kind', 'x', 'y', 'matureAtTick', 'ripe', 'growthProgress', 'berries', 'berryIds'])
      && typeof p.id === 'string' && /^p_[0-9]{8}$/.test(p.id) && Number(p.id.slice(2)) > 0
      && Number(p.id.slice(2)) < s.counters.plant && !plantIds.has(p.id) && fruitKinds.includes(p.kind)
      && integer(p.x, 0, w.width - 1) && integer(p.y, 0, w.height - 1)
      && [0, 1, 3].includes(baseTerrain[p.y * w.width + p.x]) && !plantTiles.has(p.y * w.width + p.x)
      && integer(p.matureAtTick, 0, s.clock.tick) && integer(p.ripe, 0, config.fruit[p.kind].capacity)
      && finite(p.growthProgress, 0, config.fruit[p.kind].growthTicks) && p.growthProgress < config.fruit[p.kind].growthTicks
      && (p.ripe < config.fruit[p.kind].capacity || p.growthProgress === 0), 'fruit source');
    plantIds.add(p.id); plantTiles.add(p.y * w.width + p.x);
  }
  const itemIds = new Set<string>();
  for (const item of w.items) {
    requireValue(exactKeys(item, ['id', 'skill', 'x', 'y', 'width', 'height']) && typeof item.id === 'string'
      && /^i_[0-9]{8}$/.test(item.id) && Number(item.id.slice(2)) > 0 && Number(item.id.slice(2)) < s.counters.item
      && !itemIds.has(item.id) && skillKeys.includes(item.skill)
      && config.training.defaults.some(d => d.skill === item.skill && d.width === item.width && d.height === item.height)
      && integer(item.x, 0, w.width - item.width) && integer(item.y, 0, w.height - item.height), 'training item');
    const cells = spotCells(item, w.width);
    requireValue(cells.every(i => isSafeLand(baseTerrain[i]) && !plantTiles.has(i)), 'training footprint');
    cells.forEach(i => plantTiles.add(i)); itemIds.add(item.id);
  }
  const terrain = navigationTerrain(w);
  for (const p of w.plants) requireValue(plantApproaches(p, terrain, w.width, w.height).length > 0, 'source approach');
  for (const item of w.items) requireValue(trainingApproaches(item, terrain, w.width, w.height).length > 0, 'training approach');
  const point = (p: Point) => exactKeys(p, ['x', 'y']) && finite(p.x, 0, w.width) && p.x < w.width
    && finite(p.y, 0, w.height) && p.y < w.height;
  const walkable = (p: Point) => point(p) && Number.isFinite(terrainCost(terrain[tileIndex(p, w.width)]));
  const id = (value: unknown, prefix: string) => typeof value === 'string' && new RegExp(`^${prefix}_[0-9]{8}$`).test(value) && Number(value.slice(2)) > 0;
  requireValue(Array.isArray(w.looseFruit) && w.looseFruit.length <= (version>=10?config.prizes.looseCapacity:config.initial.fruit.length), 'fruit list');
  const fruitIds = new Set<string>();
  for (const f of w.looseFruit) {
    requireValue(exactKeys(f, ['id', 'kind', 'x', 'y', 'droppedTick',...(version>=10&&f.prize?['prize']:[])]) && id(f.id, 'f') && !fruitIds.has(f.id)
      && (legacy ? ['sunapple', 'dewberry', 'cloudplum', 'vinefig'].includes(f.kind) : fruitKinds.includes(f.kind))
      && finite(f.x, 0, w.width) && f.x < w.width && finite(f.y, 0, w.height) && f.y < w.height
      && integer(f.droppedTick, 0, s.clock.tick) && Number(f.id.slice(2)) < s.counters.fruit, 'fruit record');
    fruitIds.add(f.id);
  }
  requireValue(Array.isArray(s.creatures) && s.creatures.length <= (legacy ? 1 : breeding ? config.lifecycle.capacity : lifecycle ? 8 : 3) && Array.isArray(s.organisms)
    && (lifecycle ? s.organisms.length >= s.creatures.length : s.organisms.length === s.creatures.length)
    && [...s.creatures, ...s.organisms].every(object) && (!lifecycle || Array.isArray(s.lineage)), 'creature scope');
  requireValue(new Set(s.creatures.map(c => c.id)).size === s.creatures.length
    && new Set(s.organisms.map(o => o.id)).size === s.organisms.length
    && new Set(s.creatures.map(c => c.organismId)).size === s.creatures.length, 'unique creature/organism IDs');
  for (const c of s.creatures) {
    requireValue(exactKeys(c, [...(version>=11?['dynasty']:[]), 'id', 'organismId', 'lifeIndex', 'displayName', 'stage', 'stageStartedTick', 'position', 'needs', 'mood', 'recentValence', 'xp', 'rng', 'currentAction', 'lastCompletedAction', 'nextDecisionTick',
      ...(legacy ? [] : ['foodPreferences', 'lastFiveFoods', 'lastMeal']),
      ...(!legacy && !genetic ? ['innateBias'] : []),
      ...(skills && !genetic ? ['innateAptitude'] : []),
      ...(skills ? ['practiceTicks', 'trainingTicks', 'activityPreferences', 'skillBonuses', 'lastLevelUp'] : []),
      ...(genetic ? ['genome', 'personalityDrift', 'lastPersonalityRewardTick'] : []),
      ...(lifecycle ? ['age', 'welfare'] : []), ...(breeding ? ['breeding'] : []), ...(version >= 7 ? ['appearanceModifiers'] : []), ...(version>=8?['social']:[]),...(version>=9?['competition']:[]),...(version>=10?['awards']:[])]), 'creature fields');
    requireValue(id(c.id, 'c') && Number(c.id.slice(2)) < s.counters.creature && id(c.organismId, 'o')
      && (lifecycle ? integer(c.lifeIndex, 0, s.counters.creature-1) && lifeStages.includes(c.stage) : c.lifeIndex === 0 && c.stage === 'adult')
      && integer(c.stageStartedTick, version>=11&&c.lifeIndex===0&&['adult','juvenile'].includes(c.stage)
        && s.lineage.some(l=>l.id===c.id&&l.origin==='founder'&&l.birthTick===0)
        ? -config.lifecycle.stages[c.stage].durationTicks+1 : 0, s.clock.tick)
      && typeof c.displayName === 'string' && [...c.displayName].length <= 40 && walkable(c.position), 'creature identity/position');
    requireValue((lifecycle && !config.lifecycle.stages[c.stage].mobile ? c.needs === null : c.needs && exactKeys(c.needs, needKeys) && Object.values(c.needs).every(n => finite(n, 0, 100)))
      && finite(c.mood, -1, 1) && finite(c.recentValence, -.5, .5), 'needs/mood');
    requireValue(exactKeys(c.xp, skillKeys) && (skills || Object.values(c.xp).every(n => n === 0)), 'skill XP fields');
    const started = lifecycle ? s.lineage.find(l => l.id === c.id)?.birthTick ?? 0 : c.stageStartedTick;
    if (genetic) {
      requireValue(validGenome(c.genome), 'creature genome');
      const traits = config.genes.filter(g => g.traitGroup === 'personality').map(g => g.trait);
      requireValue(exactKeys(c.personalityDrift, traits) && Object.values(c.personalityDrift).every(n => finite(n, -config.personality.driftLimit, config.personality.driftLimit))
        && (c.lastPersonalityRewardTick === null || integer(c.lastPersonalityRewardTick, started, s.clock.tick)), 'personality memory');
    }
    if (skills) validateSkills(c, s.clock.tick, genetic, started);
    if (version >= 7) validateAppearanceModifiers(c, s.clock.tick);
    requireValue(integer(c.rng, 1, 0xffffffff) && integer(c.nextDecisionTick)
      && (c.lastCompletedAction === null || (actionKinds.includes(c.lastCompletedAction) && (skills || !trainingSkill(c.lastCompletedAction))
        && (version>=9||!['enterCompetition','attendCompetition'].includes(c.lastCompletedAction)) && (version>=8||!['play','comfort','contest','avoid'].includes(c.lastCompletedAction)))), 'creature decision state');
    if (!legacy) validateFoodExperience(c, s.clock.tick, started, lifecycle);
    if (!legacy && !genetic) {
      const old = c as unknown as Milestone4Creature;
      requireValue(exactKeys(old.innateBias, tasteKeys) && Object.values(old.innateBias).every(n => finite(n, 0, 1)), 'historical taste bias');
    }
    if (c.currentAction !== null) {
      const a = c.currentAction;
      requireValue(object(a), 'action object');
      const optionalPlant = !legacy && Object.hasOwn(a, 'targetPlantId');
      const optionalItem = skills && Object.hasOwn(a, 'targetItemId');
      const workStart = skills && Object.hasOwn(a, 'workStart');
      const partner = version>=8 && Object.hasOwn(a,'targetCreatureId');
      requireValue(exactKeys(a, ['kind', 'target', 'targetFruitId', 'path', 'workTicks', ...(optionalPlant ? ['targetPlantId'] : []),
        ...(optionalItem ? ['targetItemId'] : []), ...(workStart ? ['workStart'] : []), ...(partner?['targetCreatureId']:[])]) && actionKinds.includes(a.kind) && !['enterCompetition','attendCompetition','court','play','comfort','contest'].includes(a.kind) && (version>=8||a.kind!=='avoid') && (skills || !trainingSkill(a.kind))
        && walkable(a.target) && integer(a.workTicks, 0, config.actions[a.kind].workTicks - 1)
        && Array.isArray(a.path) && a.path.length <= w.width * w.height, 'action state');
      let previous = c.position;
      for (const p of a.path) {
        requireValue(walkable(p) && Number.isInteger(p.x - .5) && Number.isInteger(p.y - .5)
          && (p.x === previous.x || p.y === previous.y)
          && Math.abs(p.x - previous.x) + Math.abs(p.y - previous.y) <= 1, 'cardinal action path');
        previous = p;
      }
      requireValue(a.path.length > 0 || (a.target.x === c.position.x && a.target.y === c.position.y), 'work location');
      if (a.path.length > 0) requireValue(previous.x === a.target.x && previous.y === a.target.y, 'path destination');
      if (a.kind === 'eat' || a.kind === 'gather') {
        requireValue(!optionalPlant || (typeof a.targetPlantId === 'string' && plantIds.has(a.targetPlantId)
          && Number.isInteger(a.target.x - .5) && Number.isInteger(a.target.y - .5)), 'source claim');
        requireValue(validFoodClaim(s, c, a), 'food claim');
      } else requireValue(a.targetFruitId === null && !optionalPlant, 'unexpected food claim');
      requireValue(a.kind==='avoid'?partner&&s.creatures.some(c=>c.id===a.targetCreatureId):!partner,'social action target');
      if (a.kind === 'graze') requireValue(terrain[tileIndex(a.target, w.width)] === 0, 'grazing terrain');
      if (a.kind === 'sleep' || a.kind === 'idle') requireValue(isSafeLand(terrain[tileIndex(a.target, w.width)]), 'rest terrain');
      const skill = trainingSkill(a.kind);
      if (skill) {
        requireValue(validTraining(s, c, a, terrain), 'training claim/terrain');
        requireValue(a.workTicks === 0 ? !workStart : workStart, 'training work start');
        if (workStart) requireValue(a.workStart && exactKeys(a.workStart, ['wellbeing', 'level'])
          && finite(a.workStart.wellbeing, 0, 1) && integer(a.workStart.level, 0, savedLevel(c, skill, genetic)), 'training reward checkpoint');
      } else requireValue(!optionalItem && !workStart, 'unexpected training state');
    }
    const o = s.organisms.find(o => o.id === c.organismId);
    requireValue(o && exactKeys(o, ['id', 'parents', 'appearanceSeed', 'lives', ...(!genetic ? ['genome'] : [])])
      && Number(o.id.slice(2)) < s.counters.organism && Array.isArray(o.parents) && (lifecycle || o.parents.length === 0)
      && integer(o.appearanceSeed, 1, 0xffffffff), 'organism reference');
    requireValue(Array.isArray(o.lives) && (lifecycle || o.lives.length === 1), 'life record');
    const life = o.lives.find(l => l.creatureId === c.id);
    requireValue(life && exactKeys(life, ['creatureId', 'lifeIndex', 'displayName', 'startedTick', 'endedTick'])
      && life.creatureId === c.id && life.lifeIndex === c.lifeIndex && life.displayName === c.displayName
      && integer(life.startedTick, 0, s.clock.tick) && life.endedTick === null, 'open life reference');
    if (!genetic) requireValue(validGenome((o as unknown as Milestone4SaveState['organisms'][number]).genome), 'historical genome');
  }
  if (lifecycle) validateLifecycle(s, breeding, version>=8);
  if (breeding) validateBreeding(s);
  if (version>=8) validateSocial(s);
  if(version>=9)validateCompetitions(s);
  requireValue(exactKeys(s.inventory, ['fruit', 'seeds', 'items', 'cosmetics'])
    && Object.entries(emptyInventory).every(([key, fixture]) => {
      const group = s.inventory[key as keyof typeof emptyInventory];
      return exactKeys(group, Object.keys(fixture)) && Object.values(group).every(n => version>=10?integer(n):n === 0);
    }), 'inventory');
  if(version>=10)validatePrizes(s);
  if(version>=11)validateDynasty(s);
}

export function validateMilestone9aSave(data:unknown): asserts data is import("../types").Milestone9aSaveState {validateStructure(data,9);}
