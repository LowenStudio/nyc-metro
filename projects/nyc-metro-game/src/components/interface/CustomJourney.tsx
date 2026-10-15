import { useEffect,useMemo,useReducer,useRef,useState, type CSSProperties } from 'react';
import { journeyStations,planJourney,complexOf } from '../../game/journey-router';
import { services } from '../../data/services';
import { initial,reducer } from '../../game/engine';
import StationDropdown from './StationDropdown';
import Stats from './Stats';
import TypingPanel from '../typing/TypingPanel';
import SubwayMap from '../map/SubwayMap';
const initialFrom=journeyStations.find(s=>s.name==='South Ferry')!.id;
const initialTo=journeyStations.find(s=>s.name==='Grand Central–42 St')!.id;
export default function CustomJourney({onClose,caseSensitive,onCaseChange}:{onClose:()=>void;caseSensitive:boolean;onCaseChange:(v:boolean)=>void}){
 const [from,setFrom]=useState(initialFrom),[to,setTo]=useState(initialTo),[started,setStarted]=useState(false);
 const [boardedIndex,setBoardedIndex]=useState(-1);
 const [arrivedComplex,setArrivedComplex]=useState('');
 const [state,dispatch]=useReducer(reducer,initial);const input=useRef<HTMLInputElement>(null);
 const journey=useMemo(()=>planJourney(from,to),[from,to]);
 const stepIndex=journey?Math.min(state.completed,journey.steps.length-1):0;
 const step=journey?.steps[stepIndex];
 const awaitingTransfer=!!step?.transferFrom&&boardedIndex!==stepIndex;
 const activeServiceId=awaitingTransfer?step!.transferFrom:step?.serviceId;
 const service=services.find(s=>s.id===activeServiceId)??services[0];
 const nextService=services.find(s=>s.id===step?.serviceId)??service;
 const leg=journey?.legs.find(l=>l.service.id===service.id&&l.stations.some(s=>complexOf(s)===complexOf(step!.station)))??journey?.legs[0];
 const localIndex=leg&&step?Math.max(0,leg.stations.findIndex(s=>complexOf(s)===complexOf(step.station))):0;
 const reset=()=>{setBoardedIndex(-1);setArrivedComplex('');dispatch({type:'reset'});setTimeout(()=>input.current?.focus(),0);};
 useEffect(()=>{if(state.status!=='running')return;const timer=setInterval(()=>dispatch({type:'tick',mode:'journey',now:performance.now()}),100);return()=>clearInterval(timer);},[state.status]);
 useEffect(()=>{const hidden=()=>{if(document.hidden)dispatch({type:'pause',now:performance.now()});};document.addEventListener('visibilitychange',hidden);return()=>document.removeEventListener('visibilitychange',hidden);},[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'&&started){e.preventDefault();dispatch({type:state.status==='paused'?'resume':'pause',now:performance.now()});}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[started,state.status]);
 return <main className="app custom-journey" style={{'--route-color':service.color,'--red':service.color,'--route-text-color':service.textColor??'#fff'} as CSSProperties}>
  <header className="header"><a href="./" className="brand">NYC METRO <span>custom journey</span></a><button className="text-button" onClick={onClose}>← back to lines</button></header>
  <section className="journey-header"><div className="route-title"><span className="bullet">{service.bullet??service.id}</span><div><h1>{started?'Your way through New York.':'Where are we going?'}</h1><p className="custom-subtitle">{started?`Ride ${service.bullet??service.id} · ${service.name}`:'Choose two stations. We’ll connect the lines.'}</p></div></div>{started&&journey&&<div className="progress-controls"><Stats state={state} total={journey.steps.length} mode="journey"/><div className="case-options"><button aria-pressed={caseSensitive} onClick={()=>{onCaseChange(!caseSensitive);input.current?.focus();}}>UPPERCASE</button></div></div>}</section>
  {leg&&journey&&<SubwayMap key={`${from}-${to}`} reversed={false} coordinates={leg.coordinates.length>1?leg.coordinates:leg.service.coordinates} color={leg.service.color} serviceId={leg.service.id} stops={leg.stations} index={started?localIndex:0} completed={0} journeyStations={journey.legs.flatMap(l=>l.stations.map(station=>({station,color:l.service.color,visited:started&&journey.steps.findIndex(s=>complexOf(s.station)===complexOf(station))<state.completed})))} exploring onSelect={()=>{}} overview={!started} onArrival={()=>{if(step)setArrivedComplex(complexOf(step.station));}} itinerary={journey.legs.map(l=>({color:l.service.color,coordinates:l.coordinates}))}/>}
  {!started?<section className="journey-planner"><div className="journey-fields"><StationDropdown label="Starting station" value={from} onChange={id=>{setFrom(id);reset();}}/><button aria-label="Swap starting station and destination" className="swap-stations" onClick={()=>{setFrom(to);setTo(from);reset();}}>⇄</button><StationDropdown label="Destination" value={to} onChange={id=>{setTo(id);reset();}}/></div>
   {journey?<><p className="journey-summary">{journey.stops} stops travelled · {journey.steps.length} stations to type · {journey.transfers} {journey.transfers===1?'transfer':'transfers'} · fewest transfers</p><ol className="journey-itinerary">{journey.legs.map((l,i)=><li key={i}><span className="transfer-bullet" style={{background:l.service.color,color:l.service.textColor??'#fff'}}>{l.service.bullet??l.service.id}</span><span>{l.stations[0].name} <span className="itinerary-arrow">→</span> {l.stations.at(-1)!.name}</span></li>)}</ol><button className="text-button" onClick={()=>{reset();setStarted(true);}}>Start this journey →</button></>:<p role="status" className="journey-summary">{from&&from===to?'Choose two different stations.':'Choose stations from the suggestions. No connected route is available until both are selected.'}</p>}
   <p className="route-note">Regular service patterns in this prototype · no live disruptions or travel-time estimates.</p>
  </section>:state.status==='done'?<section className="results"><small>you’ve arrived</small><h2>{journey?.steps.at(-1)!.station.name}</h2><p>{journey?.transfers} {journey?.transfers===1?'transfer':'transfers'}. One journey across New York.</p><button className="text-button" onClick={reset}>Ride again ↗</button><button className="text-button" onClick={()=>{setStarted(false);reset();}}>Plan another journey →</button></section>:state.status==='paused'?<section className="results"><h2>Your journey is paused.</h2><button className="text-button" onClick={()=>{dispatch({type:'resume',now:performance.now()});setTimeout(()=>input.current?.focus(),0);}}>Resume journey →</button></section>:step&&journey&&<><div className="journey-guidance" role="status">{step.transferFrom?<><span>Transfer at {step.station.name}</span><strong>{services.find(s=>s.id===step.transferFrom)?.bullet??step.transferFrom} → {nextService.bullet??nextService.id}</strong>{awaitingTransfer?<button className="text-button" disabled={arrivedComplex!==complexOf(step.station)} onClick={()=>{setBoardedIndex(stepIndex);setTimeout(()=>input.current?.focus(),0);}}>Board {nextService.bullet??nextService.id} →</button>:<span>Type this station to continue on {nextService.bullet??nextService.id}.</span>}</>:<span>Ride {service.bullet??service.id} towards {leg?.stations.at(-1)!.name}</span>}</div><TypingPanel ref={input} caseSensitive={caseSensitive} serviceId={service.id} target={step.station} previous={journey.steps[stepIndex-1]?.station} next={journey.steps[stepIndex+1]?.station} value={state.input} disabled={awaitingTransfer} message={state.message} onChange={value=>dispatch({type:'input',value,target:step.station.name,caseSensitive,now:performance.now()})} onSubmit={()=>dispatch({type:'submit',target:step.station.name,total:journey.steps.length,mode:'journey',caseSensitive,now:performance.now()})}/></>}
  <footer><button onClick={()=>{setStarted(false);reset();}}>edit journey</button>{started&&<button onClick={reset}>↻ restart</button>}<span>NYC / CUSTOM JOURNEY</span></footer>
 </main>;
}
