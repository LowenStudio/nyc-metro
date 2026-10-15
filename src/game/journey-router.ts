import { services, type Service } from '../data/services';
import type { Station } from '../data/stations';
import complexes from '../data/station-complexes.json';
export const complexOf=(s:Station)=>(complexes as Record<string,string>)[s.gtfsStopId.replace(/[NS]$/,'')]??s.gtfsStopId.replace(/[NS]$/,'');
interface Node {key:string;service:Service;index:number;station:Station}
const nodes:Node[]=services.flatMap(service=>service.stations.map((station,index)=>({key:`${service.id}:${index}`,service,index,station})));
const byKey=new Map(nodes.map(n=>[n.key,n]));
const byComplex=new Map<string,Node[]>();
for(const n of nodes){const id=complexOf(n.station);byComplex.set(id,[...(byComplex.get(id)??[]),n]);}
export const journeyStations=[...byComplex].map(([id,group])=>({id,name:group[0].station.name,borough:group[0].station.borough,serviceIds:[...new Set(group.map(n=>n.service.id))],services:[...new Set(group.map(n=>n.service.bullet??n.service.id))].join(' ')})).sort((a,b)=>a.name.localeCompare(b.name)||a.borough.localeCompare(b.borough));
export interface JourneyStep {station:Station;serviceId:string;transferFrom?:string}
export interface JourneyLeg {service:Service;stations:Station[];coordinates:number[][]}
export interface Journey {steps:JourneyStep[];legs:JourneyLeg[];transfers:number;stops:number}
function segment(service:Service,from:number,to:number){
 const points=service.coordinates;
 const nearest=(s:Station)=>{let best=0,d=Infinity;points.forEach((p,i)=>{const e=(p[0]-s.longitude)**2+(p[1]-s.latitude)**2;if(e<d){d=e;best=i;}});return best;};
 const a=nearest(service.stations[from]),b=nearest(service.stations[to]);
 const result=points.slice(Math.min(a,b),Math.max(a,b)+1);return a>b?result.reverse():result;
}
/** Lexicographic shortest path: transfers first, then station-to-station rides. */
export function planJourney(from:string,to:string):Journey|null{
 if(from===to||!byComplex.has(from)||!byComplex.has(to))return null;
 const costs=new Map<string,[number,number]>(),previous=new Map<string,string>();
 const open=new Set<string>();for(const n of byComplex.get(from)!){costs.set(n.key,[0,0]);open.add(n.key);}
 const less=(a:number[],b:number[])=>a[0]<b[0]||(a[0]===b[0]&&a[1]<b[1]);
 let end:Node|undefined;
 while(open.size){let key=[...open][0];for(const k of open)if(less(costs.get(k)!,costs.get(key)!))key=k;open.delete(key);const n=byKey.get(key)!;
  if(complexOf(n.station)===to){end=n;break;}
  const neighbours=[byKey.get(`${n.service.id}:${n.index-1}`),byKey.get(`${n.service.id}:${n.index+1}`),...(byComplex.get(complexOf(n.station))??[]).filter(m=>m.service.id!==n.service.id)].filter((m):m is Node=>!!m);
  for(const next of neighbours){const c=costs.get(key)!,transfer=next.service.id!==n.service.id;const candidate:[number,number]=[c[0]+Number(transfer),c[1]+Number(!transfer)];const old=costs.get(next.key);if(!old||less(candidate,old)){costs.set(next.key,candidate);previous.set(next.key,key);open.add(next.key);}}
 }
 if(!end)return null;
 const path:Node[]=[];let cursor:string|undefined=end.key;while(cursor){path.unshift(byKey.get(cursor)!);cursor=previous.get(cursor);}
 const steps:JourneyStep[]=[],legs:JourneyLeg[]=[];
 for(let i=0;i<path.length;i++){
  const n=path[i],last=steps.at(-1);
  if(last&&complexOf(last.station)===complexOf(n.station)){last.transferFrom=last.transferFrom??last.serviceId;last.serviceId=n.service.id;last.station=n.station;}
  else steps.push({station:n.station,serviceId:n.service.id});
  if(i===0||path[i-1].service.id!==n.service.id)legs.push({service:n.service,stations:[n.station],coordinates:[]});else legs.at(-1)!.stations.push(n.station);
 }
 for(const leg of legs){const a=leg.service.stations.indexOf(leg.stations[0]),b=leg.service.stations.indexOf(leg.stations.at(-1)!);leg.coordinates=segment(leg.service,a,b);}
 const usable=legs.filter(l=>l.stations.length>1);
 return {steps,legs:usable,transfers:costs.get(end.key)![0],stops:costs.get(end.key)![1]};
}
