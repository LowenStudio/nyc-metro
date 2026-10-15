import {describe,it,expect} from 'vitest';
import {services} from '../src/data/services';
import {initial,reducer} from '../src/game/engine';
describe('regular subway catalogue',()=>{
 it('includes every regular service, keeps shuttles distinct, excludes diamond variants and SIR',()=>{expect(services.map(s=>s.id).sort()).toEqual(['1','2','3','4','5','6','7','A','B','C','D','E','F','G','J','L','M','N','Q','R','W','Z','GS','FS','H'].sort());});
 for(const service of services){
  it(`${service.id} has valid geographic data`,()=>{expect(service.stations.length).toBeGreaterThanOrEqual(2);expect(service.coordinates.length).toBeGreaterThan(1);expect(service.color).toMatch(/^#[0-9A-F]{6}$/);for(const stop of service.stations){expect(stop.longitude).toBeGreaterThan(-74.3);expect(stop.longitude).toBeLessThan(-73.6);expect(stop.latitude).toBeGreaterThan(40.4);expect(stop.latitude).toBeLessThan(41);expect(stop.borough).toBeTruthy();}const first=service.stations[0],point=service.coordinates[0];expect(Math.hypot(first.longitude-point[0],first.latitude-point[1])).toBeLessThan(.02);});
  for(const reversed of [false,true])it(`${service.id} completes the ${reversed?'reverse':'forward'} pattern`,()=>{let state={...initial};let now=0;const stops=reversed?[...service.stations].reverse():service.stations;for(const stop of stops){state=reducer(state,{type:'input',value:stop.name,target:stop.name,now:++now});state=reducer(state,{type:'submit',target:stop.name,total:stops.length,mode:'journey',now:++now});}expect(state.status).toBe('done');expect(state.completed).toBe(stops.length);});
 }
});
