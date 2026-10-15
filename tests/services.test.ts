import {describe,it,expect} from 'vitest';
import {services,bestKey} from '../src/data/services';
import {initial,reducer} from '../src/game/engine';
describe('selectable green services',()=>{
 const expected:{[id:string]:[number,string,string]}={'4':[28,'Woodlawn','Crown Hts–Utica Av'],'5':[36,'Eastchester–Dyre Av','Flatbush Av–Brooklyn College'],'6':[38,'Pelham Bay Park','Brooklyn Bridge–City Hall']};
 for(const id of ['4','5','6']){
  const service=services.find(s=>s.id===id)!;
  it(`${id} has the correct colour, terminals and shape`,()=>{expect(service.color).toBe('#009952');expect(service.stations).toHaveLength(expected[id][0]);expect(service.stations[0].name).toBe(expected[id][1]);expect(service.stations.at(-1)!.name).toBe(expected[id][2]);expect(service.coordinates.length).toBeGreaterThan(30);expect(new Set(service.stations.map(s=>s.id)).size).toBe(service.stations.length);});
  for(const reverse of [false,true])it(`${id} completes ${reverse?'uptown':'downtown'}`,()=>{const route=reverse?[...service.stations].reverse():service.stations;let s={...initial};let now=100;for(const stop of route){s=reducer(s,{type:'input',value:stop.name,target:stop.name,now:now++});s=reducer(s,{type:'submit',target:stop.name,total:route.length,mode:'journey',now:now++});}expect(s.status).toBe('done');expect(s.completed).toBe(route.length);});
 }
 it('keeps service and mode records separate',()=>{expect(bestKey('1','journey')).not.toBe(bestKey('4','journey'));expect(bestKey('4','journey')).not.toBe(bestKey('4','timed'));});
});
