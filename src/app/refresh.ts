/** Explicit time/visibility inputs keep the scheduler headless-testable. */
export function shouldRefresh(last:number,now:number,hz:number,visible:boolean):boolean{return visible&&hz>0&&now-last>=1000/hz;}
