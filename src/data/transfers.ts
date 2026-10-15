import connections from './station-connections.json';
import { services } from './services';
import type { Station } from './stations';
/** Published daytime services within the same MTA station complex; not live service. */
export function transfersAt(station:Station, selectedId:string) {
 const id=station.gtfsStopId.replace(/[NS]$/, '');
 const ids=(connections as Record<string,string[]>)[id]??[];
 return services.filter(service=>service.id!==selectedId&&ids.includes(service.id));
}
export function otherRoutes(selectedId:string) {
 return {type:'FeatureCollection' as const,features:services.filter(s=>s.id!==selectedId).map(s=>({type:'Feature' as const,properties:{id:s.id,color:s.color},geometry:{type:'LineString' as const,coordinates:s.coordinates}}))};
}
