import mapSvg from '../assets/dynasty/Map.svg?raw';
import { berrySvg, plantSvg, svgImage } from './dynasty-art';
import { createDerbilRenderer } from './dynasty-art';
import { createMapCamera } from './camera';
import { createDaylight } from './daylight';
import { movementRoute, sampleRoute, visiblePosition } from './movement';
import { config } from '../data/config';
import { decodeTerrain, tileIndex } from '../sim/map';
import type { Creature, DeepReadonly, SaveState, Terrain } from '../sim/types';
import { thought } from './labels';

type Snapshot = DeepReadonly<SaveState>;

/** Owns only drawing resources. Every simulation argument is recursively read-only. */
export function createScene(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is unavailable in this browser.');
  const ctx = context;
  const camera = createMapCamera(), derbils = createDerbilRenderer(),daylight=createDaylight();
  const map = svgImage(mapSvg);
  let drawnPoses: { creature: DeepReadonly<Creature>; x: number; y: number }[] = [];
  let width = 0;
  let height = 0;
  let ratio = 1;
  let cachedRuns: Snapshot['world']['terrainRle'] | undefined;
  let terrain: Terrain[] = [];
  let lastTick = -1, lastWorld = '', animationTick = 0, lastFrameAt = 0;
  let routes = new WeakMap<DeepReadonly<Creature>, { before: DeepReadonly<Creature>; path: ReturnType<typeof movementRoute> }>();
  const facing = new Map<string, boolean>();
  const departures = new Map<string, { creature: DeepReadonly<Creature>; started: number }>();

  function resize() {
    const box = canvas.getBoundingClientRect();
    width = box.width; height = box.height;
    ratio = window.devicePixelRatio || 1;
    const pixelsWide=Math.round(width*ratio),pixelsHigh=Math.round(height*ratio);
    // Assigning even the same size erases the canvas between frames.
    if(canvas.width!==pixelsWide)canvas.width=pixelsWide;
    if(canvas.height!==pixelsHigh)canvas.height=pixelsHigh;

  }

  function draw(state: Snapshot, previous: Snapshot, alpha: number, selectedId: string | null, reducedMotion: boolean, socialOverlays = true, actionBubbles = true) {
    const now = performance.now();
    const elapsed = lastFrameAt ? Math.min((now-lastFrameAt)/1000,config.presentation.maximumAnimationDeltaSeconds) : 0;
    lastFrameAt=now;
    if(!reducedMotion)animationTick+=elapsed*Math.min(state.clock.speed,config.presentation.maximumAnimationSpeed);
    const renderTick = animationTick;
    if (state.saveId !== lastWorld || state.clock.tick < lastTick) departures.clear();
    if (state.saveId === lastWorld && state.clock.tick !== lastTick) {
      for (const c of previous.creatures) if (!state.creatures.some(current => current.id === c.id)) departures.set(c.id, { creature: c, started: now });
    }
    lastWorld = state.saveId; lastTick = state.clock.tick;
    if (!width || !height || ratio !== (window.devicePixelRatio || 1)) resize();
    if (cachedRuns !== state.world.terrainRle) {
      cachedRuns = state.world.terrainRle;
      terrain = decodeTerrain(state.world.terrainRle);
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const zoom = camera.zoom, tile = width / state.world.width * zoom;
    const origin = camera.project(0, 0, width, height);
    // Draw the original vector image at the current camera scale, keeping zoom sharp.
    ctx.save(); ctx.translate(origin.x, origin.y); ctx.scale(width / state.world.width * zoom, height / state.world.height * zoom);
    if (map.complete && map.naturalWidth) ctx.drawImage(map, 0, 0, state.world.width, state.world.height);

    const venue=config.competitions.venue;
    ctx.strokeStyle=venue.color;ctx.lineWidth=.12;ctx.setLineDash([.25,.18]);
    ctx.strokeRect(venue.position.x,venue.position.y,venue.width,venue.height);ctx.setLineDash([]);
    ctx.fillStyle=venue.color;ctx.font='.5px system-ui';ctx.textAlign='center';ctx.fillText('COMPETITION',venue.position.x+venue.width/2,venue.position.y+venue.height/2);
    const staged=state.competitions[0];if(staged?.prize){ctx.font='.4px system-ui';ctx.fillText(staged.prize.placements.map(p=>`#${p.rank} ${p.quantity} ${p.id.replaceAll('_',' ')}`).join(' · '),venue.position.x+venue.width/2,venue.position.y-.5);}
    for (const item of state.world.items) {
      ctx.fillStyle = '#7a8c9a'; ctx.strokeStyle = '#415e69'; ctx.lineWidth = .08;
      ctx.beginPath(); ctx.roundRect(item.x + .1, item.y + .1, item.width - .2, item.height - .2, .15); ctx.fill(); ctx.stroke();
    }
    for (const source of state.world.plants) {
      const img=svgImage(plantSvg(source.kind,source.berries??[source.ripe>0,source.ripe>1],terrain[tileIndex(source,state.world.width)]===3));
      if(img.complete&&img.naturalWidth)ctx.drawImage(img,source.x-1,source.y-1,3,3*36/42);
    }
    for (const fruit of state.world.looseFruit) {
      ctx.fillStyle = '#38574720';
      ctx.beginPath(); ctx.ellipse(fruit.x, fruit.y + .3, .48, .18, 0, 0, Math.PI * 2); ctx.fill();
      const img=svgImage(berrySvg(fruit.kind));if(img.complete&&img.naturalWidth)ctx.drawImage(img,fruit.x-.5,fruit.y-.5,1,1);
    }
    const poses = state.creatures.map(c => {
      const before = previous.creatures.find(p => p.id === c.id) ?? c;
      let route = routes.get(c);
      if (!route || route.before !== before) { route = { before, path: movementRoute(previous, before, c) }; routes.set(c, route); }
      const position = visiblePosition(sampleRoute(route.path, alpha), c, state.world.width, state.world.height);
      const oldPose = drawnPoses.find(p => p.creature.id === c.id);
      const dx = oldPose ? position.x-oldPose.x : c.position.x-before.position.x;
      if(Math.abs(dx)>1e-8)facing.set(c.id,dx<0);
      return { creature: c, ...position };
    }).sort((a, b) => a.y - b.y || a.creature.id.localeCompare(b.creature.id));
    drawnPoses = poses;
    // Presentation state follows living/fading lives, never the entire world history.
    const retained = new Set([...poses.map(p => p.creature.id), ...departures.keys()]);
    for (const id of facing.keys()) if (!retained.has(id)) facing.delete(id);
    derbils.retain(retained);
    for(const id of facing.keys())if(!state.creatures.some(c=>c.id===id)&&!departures.has(id))facing.delete(id);
    for (const [id, departure] of departures) {
      const opacity = 1 - (now - departure.started) / (config.lifecycle.deathFadeRealSeconds * 1000);
      if (opacity <= 0) { departures.delete(id); continue; }
      ctx.save(); ctx.globalAlpha = opacity;
      drawLife(ctx, visiblePosition(departure.creature.position,departure.creature,state.world.width,state.world.height).x, visiblePosition(departure.creature.position,departure.creature,state.world.width,state.world.height).y, departure.creature, false, renderTick,
        reducedMotion, derbils, facing.get(departure.creature.id)??false, state.clock.tick); ctx.restore();
    }
    const selection=config.appearance.selection;
    const margin=Math.max(config.dynasty.art.sizeTiles,selection.radiusTiles.x,
      selection.radiusTiles.y+Math.abs(selection.offsetYTiles),config.appearance.cues.levelUpRadiusTiles)+selection.strokeWidthTiles;
    for (const pose of poses) {
      const screen=camera.project(pose.x/state.world.width,pose.y/state.world.height,width,height),scale=config.lifecycle.stages[pose.creature.stage].scale;
      const padX=margin*scale*tile,padY=margin*scale*height/state.world.height*zoom;
      if(screen.x < -padX || screen.x > width+padX || screen.y < -padY || screen.y > height+padY)continue;
      drawLife(ctx, pose.x, pose.y, pose.creature, pose.creature.id === selectedId, renderTick,
        reducedMotion, derbils, facing.get(pose.creature.id)??false, state.clock.tick);
    }
    const shade=daylight.update(state.clock.tick,state.clock.speed,reducedMotion,elapsed);
    if (shade>0) {
      ctx.fillStyle = `rgba(30, 54, 76, ${shade})`;
      ctx.fillRect(0, 0, state.world.width, state.world.height);
    }
    ctx.restore();
    ctx.font = '600 10px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#263f4d';
    for (const item of state.world.items) {
      const point = camera.project((item.x + item.width / 2) / state.world.width, (item.y - .4) / state.world.height, width, height);
      ctx.fillText(config.skillCatalog[item.skill].name, point.x, point.y);
    }
    const recent=state.competitionHistory.filter(e=>e.status==='resolved'&&state.clock.tick-e.finishedTick!<config.competitions.venue.resultTicks).at(-1);
    const winner=recent?.results?.placements[0],winnerCreature=winner&&state.creatures.find(c=>c.id===winner.id);
    if(winnerCreature){const winnerPoint=camera.project(winnerCreature.position.x/state.world.width,winnerCreature.position.y/state.world.height,width,height);ctx.save();ctx.fillStyle=config.competitions.venue.color;ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.fillText(reducedMotion?'#1':'✦ #1 ✦',winnerPoint.x,winnerPoint.y-tile*1.6);ctx.restore();}
    // Keep the selected creature's actual thought legible in a crowded nursery.
    const labels = [...poses.filter(p=>p.creature.id!==selectedId),...poses.filter(p=>p.creature.id===selectedId)];
    for (const pose of labels) {
      const { x, y } = camera.project(pose.x / state.world.width, pose.y / state.world.height, width, height);
      if (x < 0 || x > width || y < 0 || y > height) continue;
      if (actionBubbles) drawBubble(ctx, thought(pose.creature, state), x, Math.max(32, y - tile * config.appearance.frame.thoughtOffsetTiles), width);
      ctx.font = '600 12px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#304b40';
      const courting = state.sessions.some(s=>s.workStartedTick!==null && s.participants.includes(pose.creature.id));
      const blocked = state.breedingRules.blockedIndividuals.includes(pose.creature.organismId) || state.breedingRules.blockedPairs.some(p=>p.includes(pose.creature.organismId));
      if (courting || blocked) { ctx.fillStyle=courting?'#b85674':'#614e66';ctx.fillText(courting?'♥':'⊘',x+tile,y-tile); }
      if(socialOverlays){
        const shared=state.social.sessions.find(s=>s.participants.includes(pose.creature.id)),recent=pose.creature.social.lastInteraction;
        const kind=shared?.kind??(pose.creature.currentAction?.kind==='avoid'?'avoid':recent&&state.clock.tick-recent.tick<config.social.overlays.effectTicks?recent.kind:null);
        const icon=kind==='contest'?'✧':kind==='avoid'?'☹':kind==='play'||kind==='comfort'?'♪':null;
        if(icon){ctx.font='700 18px system-ui, sans-serif';ctx.fillStyle=kind==='contest'||kind==='avoid'?config.social.overlays.hostile:config.social.overlays.friendly;ctx.fillText(icon,x+tile,y-tile);}
      }
      ctx.fillText(pose.creature.displayName+(pose.creature.lifeIndex?` ↻${pose.creature.lifeIndex}`:''), x, y + tile * config.appearance.frame.nameOffsetTiles);
    }
  }

  function selectAt(state: Snapshot, clientX: number, clientY: number): string | null {
    const box = canvas.getBoundingClientRect();
    const point = camera.unproject(clientX - box.left, clientY - box.top, box.width, box.height);
    const x = point.x * state.world.width, y = point.y * state.world.height;
    const visible = new Map(drawnPoses.map(p => [p.creature.id, p]));
    return state.creatures.map(c => { const p = visible.get(c.id); return { id: c.id, distance: Math.hypot((p?.x ?? c.position.x) - x, (p?.y ?? c.position.y) - y), radius: config.appearance.frame.hitRadiusTiles * config.lifecycle.stages[c.stage].scale }; })
      .filter(c => c.distance <= c.radius).sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id))[0]?.id ?? null;
  }
  return { draw, resize, selectAt, camera, reset() { derbils.reset(); daylight.reset(); drawnPoses=[]; departures.clear(); lastTick=-1; lastWorld=''; cachedRuns=undefined;routes=new WeakMap();facing.clear();lastFrameAt=0;animationTick=0; } };
}

function drawLife(ctx: CanvasRenderingContext2D, x: number, y: number, c: DeepReadonly<Creature>, selected: boolean, tick: number,
  reducedMotion: boolean, derbils: ReturnType<typeof createDerbilRenderer>, facingLeft: boolean, simTick: number) {
  const bodyScale = config.lifecycle.stages[c.stage].scale;
  ctx.save(); ctx.translate(x, y);
  if (selected) {
    const selection = config.appearance.selection;
    ctx.strokeStyle = selection.color; ctx.lineWidth = selection.strokeWidthTiles; ctx.setLineDash(selection.dashTiles);
    ctx.beginPath(); ctx.ellipse(0, selection.offsetYTiles, selection.radiusTiles.x * bodyScale,
      selection.radiusTiles.y * bodyScale, 0, 0, Math.PI * 2);
    ctx.stroke(); ctx.setLineDash([]);
  }
  if (c.lastLevelUp && simTick - c.lastLevelUp.tick < config.skills.levelUpMessageTicks) {
    const cue = config.appearance.cues;
    ctx.strokeStyle = cue.levelUpColor; ctx.lineWidth = cue.levelUpLineWidthTiles;
    ctx.beginPath(); ctx.arc(0, 0, cue.levelUpRadiusTiles * bodyScale, 0, Math.PI * 2); ctx.stroke();
  }
  derbils.draw(ctx, c, config.dynasty.art.sizeTiles, tick, !reducedMotion, facingLeft); ctx.restore();
}

function drawBubble(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, canvasWidth: number) {
  ctx.font = '500 12px system-ui, sans-serif';
  const w = Math.min(ctx.measureText(label).width + 24, canvasWidth - 16);
  const left = Math.min(canvasWidth - w - 8, Math.max(8, x - w / 2));
  ctx.fillStyle = '#fcfbf2'; ctx.strokeStyle = '#7d967c50'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(left, y - 28, w, 29, 10); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 4, y + 1); ctx.lineTo(x, y + 6); ctx.lineTo(x + 4, y + 1); ctx.fill();
  ctx.fillStyle = '#344c3e'; ctx.textAlign = 'center'; ctx.fillText(label, left + w / 2, y - 9, w - 24);
}
