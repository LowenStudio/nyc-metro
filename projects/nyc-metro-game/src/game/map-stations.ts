import type { Station } from '../data/stations';
export interface MapStation {station:Station;color:string;visited:boolean}
/** Keep every leg's markers, preferring the active platform when routes overlap. */
export function stationFeatures(stops:Station[],currentId:string,completed:number,color:string,journey:MapStation[]=[]) {
 const entries=new Map<string,MapStation>();
 const key=(s:Station)=>s.gtfsStopId.replace(/[NS]$/,'');
 for(const item of journey)entries.set(key(item.station),item);
 for(const [i,station] of stops.entries()){
  const existing=entries.get(key(station));
  entries.set(key(station),{station,color,visited:existing?.visited??i<completed});
 }
 return {type:'FeatureCollection' as const,features:[...entries.values()].map(({station:s,color,visited})=>({type:'Feature' as const,properties:{name:s.name,id:s.id,current:s.id===currentId,visited,color},geometry:{type:'Point' as const,coordinates:[s.longitude,s.latitude]}}))};
}
