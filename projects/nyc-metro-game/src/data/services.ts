import { stations, type Station } from './stations';
import line1 from './line1-geometry.json';
import green from './green-services.json';
import regular from './regular-services.json';
import { LINE1_COLOR } from './route';
export interface Service { id:string; bullet?:string; textColor?:string; name:string; color:string; pattern:string; stations:Station[]; coordinates:number[][] }
const order=['1','2','3','4','5','6','7','A','C','E','B','D','F','M','G','J','Z','L','N','Q','R','W','GS','FS','H'];
const all:Service[]=[{id:'1',name:'Broadway–7 Av Local',color:LINE1_COLOR,pattern:'242 St → South Ferry · 38 stops',stations,coordinates:line1},...green as Service[],...regular as Service[]];
export const services=order.map(id=>all.find(s=>s.id===id)!);
export function bestKey(serviceId:string, mode:string){return `nyc-metro-full-${serviceId}-best-${mode}`;}
