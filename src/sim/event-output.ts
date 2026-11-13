import { config, skillKeys } from '../data/config';
import { skillLevel } from './skills';
import type { LifeEvent, SaveState, TickOutput } from './types';

// Only private tick journal arrays are registered. Neither inputs nor saved state carry a sink.
// Weak keys follow the journal across ordinary immutable root replacements.
const sinks = new WeakMap<LifeEvent[], LifeEvent[]>();
export function observeJournal(journal: LifeEvent[], output: TickOutput): void { sinks.set(journal,output.events); }
export function inheritJournal(before: LifeEvent[], after: LifeEvent[]): void {
  const sink=sinks.get(before); if(sink)sinks.set(after,sink);
}
export function emitJournal(before: LifeEvent[], after: LifeEvent[], event: LifeEvent): void {
  const sink=sinks.get(before); if(sink){sink.push(JSON.parse(JSON.stringify(event)) as LifeEvent);sinks.set(after,sink);}
}
/** Derived notices are output only: no new journal entries, counters or random draws. */
export function collectChanges(before: SaveState, after: SaveState, output: TickOutput): void {
  const old=new Map(before.creatures.map(c=>[c.id,c]));
  for(const c of after.creatures){
    const previous=old.get(c.id); if(!previous)continue;
    for(const skill of skillKeys){
      if(c.xp[skill]===previous.xp[skill])continue;
      const from=skillLevel(previous,skill),to=skillLevel(c,skill);
      for(const level of config.offline.summary.skillMilestones)if(from<level&&to>=level)
        output.changes.push({tick:after.clock.tick,kind:'skillMilestone',creatureId:c.id,name:c.displayName,detail:`${config.skillCatalog[skill].name} level ${level}`});
      const part=({run:'feet',swim:'tail fin',fly:'wings',strength:'arms',stamina:null} as const)[skill];
      if(part&&from<config.dynasty.art.developmentStart&&to>=config.dynasty.art.developmentStart)
        output.changes.push({tick:after.clock.tick,kind:'bodyPart',creatureId:c.id,name:c.displayName,detail:`${part} began developing`});
    }
  }
}
