import { describe,it,expect } from 'vitest';
import { stations } from '../src/data/stations';
import { initial,reducer,matches,accuracy,LIMIT } from '../src/game/engine';
describe('typing journeys',()=>{
 it('accepts case and dash variants, preserving words and digits',()=>{expect(matches('times sq-42 st','Times Sq–42 St')).toBe(true);expect(matches('Times Sq','Times Sq–42 St')).toBe(false);});
 it('keeps corrected mistakes in accuracy',()=>{let s=reducer(initial,{type:'input',value:'x',target:'50 St',now:100});s=reducer(s,{type:'input',value:'',target:'50 St',now:200});s=reducer(s,{type:'input',value:'50 St',target:'50 St',now:300});expect(s.errors).toBe(1);expect(accuracy(s)).toBe(83);});
 it('does not advance wrong submissions and finishes exact journeys',()=>{let s=reducer(initial,{type:'input',value:'50',target:'50 St',now:100});s=reducer(s,{type:'submit',target:'50 St',mode:'journey',total:1,now:200});expect(s.completed).toBe(0);s=reducer(s,{type:'input',value:'50 St',target:'50 St',now:300});s=reducer(s,{type:'submit',target:'50 St',mode:'journey',total:1,now:1000});expect(s.status).toBe('done');expect(s.accepted).toBe(5);});
 it('excludes paused time and freezes at timed limit',()=>{let s=reducer(initial,{type:'input',value:'5',target:'50 St',now:100});s=reducer(s,{type:'pause',now:1100});s=reducer(s,{type:'resume',now:10100});s=reducer(s,{type:'tick',mode:'timed',now:11100});expect(s.elapsed).toBe(2000);s=reducer(s,{type:'tick',mode:'timed',now:100000});expect(s.elapsed).toBe(LIMIT);expect(s.status).toBe('done');});
});

describe('full 1 line',()=>{
 it('contains 38 unique stops and both terminals',()=>{expect(stations).toHaveLength(38);expect(new Set(stations.map(s=>s.id)).size).toBe(38);expect(stations[0].name).toBe('Van Cortlandt Park–242 St');expect(stations.at(-1)?.name).toBe('South Ferry');});
 for(const reverse of [false,true]) it(`completes all stops ${reverse?'uptown':'downtown'} without early termination`,()=>{
  const route=reverse?[...stations].reverse():stations;let s={...initial};let now=100;
  for(let i=0;i<route.length;i++){
   s=reducer(s,{type:'input',value:route[i].name,target:route[i].name,now:now++});
   s=reducer(s,{type:'submit',target:route[i].name,total:route.length,mode:'journey',now:now++});
   expect(s.completed).toBe(i+1);expect(s.status).toBe(i===route.length-1?'done':'running');
  }
 });
});

describe('geographic station positions',()=>{
 it('places the whole route in NYC and runs north to south',()=>{
  for(const s of stations){expect(s.longitude).toBeGreaterThan(-74.1);expect(s.longitude).toBeLessThan(-73.8);expect(s.latitude).toBeGreaterThan(40.6);expect(s.latitude).toBeLessThan(41);expect(s.gtfsStopId.endsWith('S')).toBe(true);}
  expect(stations[0].latitude).toBeGreaterThan(stations.at(-1)!.latitude);
 });
});


describe('case-sensitive typing preference',()=>{
 it('requires capitalisation while preserving dash equivalence',()=>{
  expect(matches('Times Sq-42 St','Times Sq–42 St',true)).toBe(true);
  expect(matches('times sq-42 st','Times Sq–42 St',true)).toBe(false);
  expect(matches('times sq-42 st','Times Sq–42 St',false)).toBe(true);
 });
 it('scores wrong-case characters as errors and prevents advancing',()=>{
  let s=reducer(initial,{type:'input',value:'50 st',target:'50 St',caseSensitive:true,now:100});
  expect(s.errors).toBe(1);expect(s.correct).toBe(4);
  s=reducer(s,{type:'submit',target:'50 St',caseSensitive:true,total:2,mode:'journey',now:200});
  expect(s.completed).toBe(0);expect(s.message).toContain('capitalisation');
  s=reducer(s,{type:'input',value:'50 St',target:'50 St',caseSensitive:true,now:300});
  s=reducer(s,{type:'submit',target:'50 St',caseSensitive:true,total:2,mode:'journey',now:400});
  expect(s.completed).toBe(1);expect(s.errors).toBe(1);
 });
 it('accepts an existing wrong-case entry after switching sensitivity off',()=>{
  let s=reducer(initial,{type:'input',value:'south ferry',target:'South Ferry',caseSensitive:true,now:100});
  s=reducer(s,{type:'submit',target:'South Ferry',caseSensitive:false,total:2,mode:'journey',now:200});
  expect(s.completed).toBe(1);
 });
});
