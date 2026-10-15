import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import * as maplibregl from 'maplibre-gl';
import type { GeoJSONSource, Map as MapInstance } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Station } from '../../data/stations';
import { otherRoutes } from '../../data/transfers';
import { projectRoute, routeMotion, type Point } from '../../game/route-motion';
import { stationFeatures, type MapStation } from '../../game/map-stations';
import SchematicFallback from './SchematicFallback';
maplibregl.setWorkerUrl(workerUrl);
interface Props { journeyStations?:MapStation[]; onArrival?:()=>void; overview?:boolean; itinerary?:{color:string;coordinates:number[][]}[]; reversed:boolean; coordinates:number[][]; color:string; serviceId:string; stops: Station[]; index: number; completed: number; exploring: boolean; onSelect:(s:Station)=>void }
const line = (points:number[][]) => ({type:'Feature' as const,properties:{},geometry:{type:'LineString' as const,coordinates:points}});
function nearest(points:number[][], s:Station) { let best=0,distance=Infinity; points.forEach((p,i)=>{const d=(p[0]-s.longitude)**2+(p[1]-s.latitude)**2;if(d<distance){distance=d;best=i;}});return best; }
export default function SubwayMap(props:Props) {
 const {stops,index,completed,coordinates,color,serviceId,reversed}=props;
 const current=stops[Math.min(index,stops.length-1)];
 const reduced=useReducedMotion();
 const container=useRef<HTMLDivElement>(null), map=useRef<MapInstance|null>(null), marker=useRef<maplibregl.Marker|null>(null);
 const position=useRef<Point|null>(null), previousDirection=useRef(reversed), previousIndex=useRef(index);
 const latest=useRef(props); latest.current=props;
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[offline,setOffline]=useState(false);
 useEffect(()=>{
  if(!container.current)return;
  setReady(false);
  let instance:MapInstance;
  try{
   instance=new maplibregl.Map({container:container.current,style:'https://tiles.openfreemap.org/styles/dark',center:[current.longitude,current.latitude],zoom:13.9,bearing:0,pitch:0,interactive:false,attributionControl:false,canvasContextAttributes:{preserveDrawingBuffer:true}});
   map.current=instance;
  }catch{setFailed(true);return;}
  const timeout=window.setTimeout(()=>{if(!instance.isStyleLoaded())setOffline(true);},15000);
  instance.on('error',()=>setOffline(true));
  instance.on('load',()=>{
   window.clearTimeout(timeout);setOffline(false);
   // Keep road geometry, shorelines, parks and building footprints; mute POIs.
   for(const layer of instance.getStyle().layers??[]){
    if(layer.type==='symbol' && /poi|housenumber|airport|aerodrome/i.test(layer.id))instance.setLayoutProperty(layer.id,'visibility','none');
   }
   // A little more geographic contrast than the stock dark theme.
   for(const layer of instance.getStyle().layers??[]){
    const sourceLayer='source-layer' in layer?String(layer['source-layer']):'';
    if(layer.type==='symbol'){instance.setPaintProperty(layer.id,'text-color','#88939d');instance.setPaintProperty(layer.id,'text-halo-color','#20262c');instance.setPaintProperty(layer.id,'text-halo-width',1);}
    if(layer.type==='background')instance.setPaintProperty(layer.id,'background-color','#262b30');
    if(layer.type==='fill'){
     if(sourceLayer==='water')instance.setPaintProperty(layer.id,'fill-color','#101c26');
     else if(sourceLayer==='building'){instance.setPaintProperty(layer.id,'fill-color','#3b444c');instance.setPaintProperty(layer.id,'fill-opacity',.6);}
     else if(sourceLayer==='landcover')instance.setPaintProperty(layer.id,'fill-color','#29382f');
     else if(sourceLayer==='landuse')instance.setPaintProperty(layer.id,'fill-color',['match',['get','class'],'park','#293b31','residential','#2b3035','#30363a']);
    }
    if(layer.type==='line' && sourceLayer==='transportation'){
     instance.setPaintProperty(layer.id,'line-color',/casing|case|outline/i.test(layer.id)?'#20262b':'#58636e');
     instance.setPaintProperty(layer.id,'line-opacity',.62);
    }
   }
   instance.addSource('other-routes',{type:'geojson',data:otherRoutes(serviceId)});
   instance.addLayer({id:'other-route-lines',type:'line',source:'other-routes',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':['get','color'],'line-width':3,'line-opacity':.52}});
   if(props.itinerary){instance.addSource('journey-route',{type:'geojson',data:{type:'FeatureCollection',features:props.itinerary.filter(l=>l.coordinates.length>1).map(l=>({...line(l.coordinates),properties:{color:l.color}}))}});instance.addLayer({id:'journey-route-lines',type:'line',source:'journey-route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':['get','color'],'line-width':5,'line-opacity':.9}});}
   instance.addSource('one-route',{type:'geojson',data:line(coordinates)});
   instance.addSource('one-travelled',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
   instance.addSource('one-stations',{type:'geojson',data:stationFeatures(latest.current.stops,latest.current.stops[latest.current.index].id,latest.current.completed,latest.current.color,latest.current.journeyStations)});
   instance.addLayer({id:'one-route-casing',type:'line',source:'one-route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#17191c','line-width':10}});
   instance.addLayer({id:'one-route-line',type:'line',source:'one-route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':color,'line-width':5,'line-opacity':1}});
   instance.addLayer({id:'one-travelled-line',type:'line',source:'one-travelled',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':color,'line-width':7}});
   instance.addLayer({id:'one-station-dots',type:'circle',source:'one-stations',paint:{'circle-radius':['case',['get','current'],8,4.5],'circle-color':['case',['get','visited'],['get','color'],'#f4f1e9'],'circle-stroke-color':'#17191c','circle-stroke-width':2}});
   instance.addLayer({id:'one-station-labels',type:'symbol',source:'one-stations',layout:{'text-field':['get','name'],'text-font':['Noto Sans Regular'],'text-size':['case',['get','current'],15,12],'text-anchor':'left','text-offset':[1.1,0],'text-allow-overlap':false,'text-optional':true},paint:{'text-color':['case',['get','current'],'#f4f1e9','#b6bbc1'],'text-halo-color':'#17191c','text-halo-width':2}});
   const element=document.createElement('div');element.className='geographic-train';element.setAttribute('aria-hidden','true');element.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18"><rect x="6" y="3" width="12" height="15" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h8M8 13h2m4 0h2M8 18l-3 4m11-4 3 4" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>';
   marker.current=new maplibregl.Marker({element}).setLngLat([latest.current.stops[latest.current.index].longitude,latest.current.stops[latest.current.index].latitude]).addTo(instance);
   setReady(true);
  });
  const resize=new ResizeObserver(()=>instance.resize());resize.observe(container.current);
  return()=>{window.clearTimeout(timeout);resize.disconnect();marker.current?.remove();marker.current=null;instance.remove();map.current=null;};
 },[]);
 useEffect(()=>{
  const instance=map.current;if(!instance||!ready||!instance.getSource('one-stations'))return;
  const points=reversed?[...coordinates].reverse():coordinates;
  const completedStop=completed>0?stops[Math.min(completed-1,stops.length-1)]:null;
  const visited=completedStop?points.slice(0,nearest(points,completedStop)+1):[];
  (instance.getSource('one-travelled') as GeoJSONSource).setData({type:'FeatureCollection',features:visited.length>1?[line(visited)]:[]});
  (instance.getSource('one-stations') as GeoJSONSource).setData(stationFeatures(stops,current.id,completed,color,props.journeyStations));
  (instance.getSource('one-route') as GeoJSONSource).setData(line(coordinates));
  (instance.getSource('other-routes') as GeoJSONSource).setData(otherRoutes(serviceId));
  instance.setPaintProperty('one-route-line','line-color',color);
  instance.setPaintProperty('one-travelled-line','line-color',color);
 },[ready,current.id,completed,stops,reduced,reversed,coordinates,color,serviceId,props.journeyStations]);
 useEffect(()=>{
  const instance=map.current;if(!instance||!ready)return;
  const destination=projectRoute(coordinates,[current.longitude,current.latitude]).point;
  if(props.overview&&props.itinerary){
   const bounds=new maplibregl.LngLatBounds();props.itinerary.forEach(l=>l.coordinates.forEach(p=>bounds.extend([p[0],p[1]])));
   const height=instance.getContainer().clientHeight;
   if(!bounds.isEmpty())instance.fitBounds(bounds,{padding:{top:height*.22,bottom:height*.4,left:45,right:45},maxZoom:13.5,duration:reduced?0:600});
   position.current=destination;marker.current?.setLngLat(destination);return;
  }
  const reset=previousDirection.current!==reversed||(!props.exploring&&index===0&&previousIndex.current>0);
  previousDirection.current=reversed;previousIndex.current=index;
  const move=(point:Point)=>{
   position.current=point;
   marker.current?.setLngLat(point);
   instance.easeTo({center:point,zoom:13.9,offset:[0,-instance.getContainer().clientHeight*.11],duration:0});
  };
  if(!position.current||reduced||reset){move(destination);latest.current.onArrival?.();return;}
  const path=routeMotion(coordinates,position.current,destination);
  if(path.distance<1e-10){move(destination);latest.current.onArrival?.();return;}
  // Interpolate distance along the shape, never a chord between stations.
  const duration=Math.min(2400,Math.max(850,path.distance*110000*1.1));
  let frame=0,start:number|null=null;
  const tick=(now:number)=>{
   if(start===null)start=now;
   const progress=Math.min(1,(now-start)/duration);
   move(path.at(progress*progress*(3-2*progress)));
   if(progress<1)frame=requestAnimationFrame(tick);else latest.current.onArrival?.();
  };
  frame=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(frame);
 },[ready,current.id,coordinates,reduced,reversed,props.exploring,props.overview]);
 return <>
  {failed?<SchematicFallback {...props}/>:<div className="map-area geographic-map" aria-label={`Detailed OpenStreetMap street map following the ${serviceId} train`}><div ref={container} className="maplibre-background"/></div>}
  <aside className="map-credit"><a href="https://openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a> · <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></aside>
  {(!ready||offline)&&!failed&&<span className="map-status" role="status">{offline?'Map connection interrupted. Reconnect to load street detail.':'Loading street map…'}</span>}
  {failed&&<span className="map-status" role="status">Detailed map needs WebGL. Showing schematic fallback.</span>}
 </>;
}
