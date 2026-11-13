import type { TabLease } from './types';
/** Pure compare-and-swap arbitration. Only an explicit takeover or expiry changes a live owner. */
export function arbitrate(current:TabLease|null,request:{id:string;now:number;duration:number;takeOver?:boolean}):TabLease {
  if(current&&current.expiresAt>request.now&&current.owner!==request.id&&!request.takeOver)return current;
  return {owner:request.id,epoch:current&&current.owner===request.id?current.epoch:(current?.epoch??0)+1,expiresAt:request.now+request.duration};
}
export function ownsLease(lease:TabLease|null,id:string,epoch:number,now:number):boolean{return lease?.owner===id&&lease.epoch===epoch&&lease.expiresAt>now;}
