import {describe,it,expect} from 'vitest';
import {planJourney,journeyStations,complexOf} from '../src/game/journey-router';
import {services} from '../src/data/services';
import {initial,reducer} from '../src/game/engine';
const id=(name:string)=>journeyStations.find(s=>s.name===name)!.id;
describe('custom journey routing',()=>{
 it('rejects invalid and identical endpoints',()=>{expect(planJourney('missing',id('South Ferry'))).toBeNull();expect(planJourney(id('South Ferry'),id('South Ferry'))).toBeNull();});
 it('finds a direct ride in both directions',()=>{for(const [a,b] of [['South Ferry','Rector St'],['Rector St','South Ferry']]){const j=planJourney(id(a),id(b))!;expect(j.transfers).toBe(0);expect(j.steps[0].station.name).toBe(a);expect(j.steps.at(-1)!.station.name).toBe(b);}});
 it('prioritises transfers, avoids duplicate typing at interchanges and completes the game',()=>{
  const j=planJourney(id('South Ferry'),id('Grand Central–42 St'))!;expect(j.transfers).toBe(1);expect(j.steps.filter(s=>s.transferFrom)).toHaveLength(1);
  for(let i=1;i<j.steps.length;i++)expect(complexOf(j.steps[i-1].station)).not.toBe(complexOf(j.steps[i].station));
  let s={...initial};j.steps.forEach((step,i)=>{s=reducer(s,{type:'input',value:step.station.name,target:step.station.name,now:i*1000});s=reducer(s,{type:'submit',target:step.station.name,total:j.steps.length,mode:'journey',now:i*1000+500});});expect(s.status).toBe('done');expect(s.completed).toBe(j.steps.length);
 });
 it('builds connected ride legs with actual geometry, including reverse travel',()=>{
  for(const [a,b] of [['South Ferry','Grand Central–42 St'],['Grand Central–42 St','South Ferry'],['Van Cortlandt Park–242 St','Canarsie–Rockaway Pkwy']]){
   const j=planJourney(id(a),id(b))!;expect(j).not.toBeNull();
   j.legs.forEach((leg,i)=>{expect(leg.coordinates.length).toBeGreaterThan(1);const indices=leg.stations.map(s=>leg.service.stations.indexOf(s));for(let k=1;k<indices.length;k++)expect(Math.abs(indices[k]-indices[k-1])).toBe(1);if(i)expect(complexOf(j.legs[i-1].stations.at(-1)!)).toBe(complexOf(leg.stations[0]));});
  }
 });
 it('keeps distinct stations named 23 St separate',()=>{const stations=services.flatMap(s=>s.stations).filter(s=>s.name==='23 St');expect(new Set(stations.map(complexOf)).size).toBeGreaterThan(1);});
});
