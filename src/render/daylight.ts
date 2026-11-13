import { config } from '../data/config';

const smoothstep=(x:number)=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};

/** Fast simulation days must not become full-map flashes. The real simulation
 * calendar continues normally; only its lighting is averaged at high speed. */
export function daylightTarget(tick:number,speed:number,reducedMotion:boolean):number {
  const {world,clock,presentation}=config,night=1-world.nightStart;
  if(reducedMotion||speed>presentation.daylight.maximumCycleSpeed)return world.nightOverlayAlpha*night;
  const phase=(tick%clock.dayTicks)/clock.dayTicks,center=(1+world.nightStart)/2;
  const distance=Math.abs(((phase-center+1.5)%1)-.5),twilight=presentation.daylight.twilightFraction;
  return world.nightOverlayAlpha*smoothstep((night/2+twilight/2-distance)/twilight);
}

/** Render-only state; changes of speed and pause blend in real time. */
export function createDaylight(){
  let opacity:number|null=null;
  return {
    update(tick:number,speed:number,reducedMotion:boolean,elapsedSeconds:number):number {
      const target=daylightTarget(tick,speed,reducedMotion);
      opacity=opacity===null?target:opacity+(target-opacity)*(1-Math.exp(-Math.max(0,elapsedSeconds)/config.presentation.daylight.transitionSeconds));
      return opacity;
    },
    reset(){opacity=null;}
  };
}
