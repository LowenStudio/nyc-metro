import {describe,it,expect} from 'vitest';
import {planJourney,journeyStations,complexOf} from '../src/game/journey-router';
import {stationFeatures} from '../src/game/map-stations';
const id=(name:string)=>journeyStations.find(s=>s.name===name)!.id;
describe('station dots across transfers',()=>{
 const j=planJourney(id('South Ferry'),id('Grand Central–42 St'))!;
 const markers=j.legs.flatMap(l=>l.stations.map(station=>({station,color:l.service.color,visited:complexOf(station)===id('South Ferry')})));
 it('retains dots for every leg before and after boarding',()=>{
  const expected=new Set(markers.map(m=>m.station.gtfsStopId.replace(/[NS]$/,'')));
  for(const leg of j.legs){const data=stationFeatures(leg.stations,leg.stations[0].id,0,leg.service.color,markers);expect(data.features).toHaveLength(expected.size);expect(data.features.filter(f=>f.properties.current)).toHaveLength(1);expect(data.features.some(f=>f.properties.name==='Grand Central–42 St')).toBe(true);}
 });
 it('preserves completed station colours when the active line changes',()=>{
  const leg=j.legs[1],data=stationFeatures(leg.stations,leg.stations[0].id,0,leg.service.color,markers);
  const first=data.features.find(f=>f.properties.id===j.legs[0].stations[0].id)!;expect(first.properties.visited).toBe(true);expect(first.properties.color).toBe(j.legs[0].service.color);
 });
 it('still creates dots for normal single-line journeys',()=>{const l=j.legs[0];expect(stationFeatures(l.stations,l.stations[0].id,1,l.service.color).features[0].properties.visited).toBe(true);});
});
