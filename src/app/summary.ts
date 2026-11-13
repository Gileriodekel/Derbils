import type { Config, SaveState, SummaryAccumulator, TickOutput } from '../sim/types';

export function createSummary(state: SaveState, realAwaySeconds=0, capped=false): SummaryAccumulator {
  const generation=Math.max(0,...state.lineage.map(l=>l.generation));
  return { startTick:state.clock.tick,endTick:state.clock.tick,realAwaySeconds,capped,skipped:false,
    births:0,hatchings:0,deaths:{egg:0,baby:0,juvenile:0,adult:0,elder:0,cocoon:0},rebirths:0,arrivals:0,
    initialGeneration:generation,maximumGeneration:generation,generationsPassed:0,
    competitionsHeld:0,competitionsCancelled:0,competitionsResolved:0,prizesAwarded:0,
    friendships:0,rivalries:0,mateBonds:0,bodyParts:0,skillMilestones:0,rescueEggs:0,notable:[] };
}

/** Counts consume the uncapped tick output; only the separately ranked notable list is capped. */
export function accumulateSummary(summary: SummaryAccumulator, after: SaveState, output: TickOutput, config: Config): SummaryAccumulator {
  const next={...summary,endTick:after.clock.tick,deaths:{...summary.deaths},notable:[...summary.notable]};
  function notable(tick:number,kind:string,id:string,name:string,detail:string){
    const priority=config.offline.summary.priorities[kind];if(priority===undefined)return;
    next.notable.push({tick,kind,creatureId:id,name,detail,priority});
  }
  for(const e of output.events){
    const record=after.lineage.find(l=>l.id===e.creatureId),name=record?.displayName??e.creatureId;
    let detail=e.competitionEvent?.reason??e.kind;
    switch(e.kind){
      case 'eggLaid':next.births++;next.maximumGeneration=Math.max(next.maximumGeneration,record?.generation??0);break;
      case 'hatch':next.hatchings++;break;
      case 'death':next.deaths[e.from??'elder']++;break;
      case 'rebirth':next.rebirths++;break;
      case 'spawn':next.arrivals++;break;
      case 'rescue':next.rescueEggs++;break;
      case 'competitionStarted':next.competitionsHeld++;break;
      case 'competitionCancelled':next.competitionsCancelled++;break;
      case 'competitionResult':{
        next.competitionsResolved++;
        const event=after.competitionHistory.find(c=>c.id===e.competitionEvent?.id)??after.competitions.find(c=>c.id===e.competitionEvent?.id);
        next.prizesAwarded+=event?.deliveries.filter(d=>d.destination!=='inventory').length??0;
        const scheduled=after.dynasty.events.find(d=>d.id===e.competitionEvent?.id);
        if(scheduled){next.competitionsHeld++;if(scheduled.winnerId)next.prizesAwarded++;}
        const winner=event?.results?.placements[0]?.id??scheduled?.winnerId;
        detail=winner?`${event?.id??scheduled!.id}: ${after.lineage.find(l=>l.id===winner)?.displayName??winner} won`:detail;
        break;
      }

      case 'friendship':next.friendships++;break;
      case 'rivalry':next.rivalries++;break;
      case 'mateBondFormed':next.mateBonds++;break;
    }
    notable(e.tick,e.kind,e.creatureId,name,detail);
  }
  for(const e of output.changes){
    if(e.kind==='bodyPart')next.bodyParts++;else next.skillMilestones++;
    notable(e.tick,e.kind,e.creatureId,e.name,e.detail);
  }
  next.generationsPassed=Math.max(0,next.maximumGeneration-next.initialGeneration);
  next.notable.sort((a,b)=>b.priority-a.priority||b.tick-a.tick||a.creatureId.localeCompare(b.creatureId)||a.detail.localeCompare(b.detail));
  next.notable.length=Math.min(next.notable.length,config.offline.summary.notableLimit);
  return next;
}
