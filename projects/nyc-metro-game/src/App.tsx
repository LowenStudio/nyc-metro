import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { Station } from './data/stations';
import { services, bestKey } from './data/services';
import type { CSSProperties } from 'react';
import { accuracy, clock, initial, matches, reducer, wpm, type Mode } from './game/engine';
import CustomJourney from './components/interface/CustomJourney';
import Transfers from './components/interface/Transfers';
import Stats from './components/interface/Stats';
import TypingPanel from './components/typing/TypingPanel';
import SubwayMap from './components/map/SubwayMap';
export default function App(){
  const [custom,setCustom]=useState(false);
  const [state,dispatch]=useReducer(reducer,initial);
  const [serviceId,setServiceId]=useState('1');
  const [caseSensitive,setCaseSensitive]=useState(()=>{try{return localStorage.getItem('nyc-metro-case-sensitive')==='true';}catch{return false;}});
  const changeCase=(enabled:boolean)=>{setCaseSensitive(enabled);try{localStorage.setItem('nyc-metro-case-sensitive',String(enabled));}catch{}input.current?.focus({preventScroll:true});};
  const service=services.find(s=>s.id===serviceId)!;
  const [mode,setMode]=useState<Mode>('journey');
  const [reverse,setReverse]=useState(false), [settings,setSettings]=useState(false), [peek,setPeek]=useState<Station|null>(null);
  const [best,setBest]=useState(()=>{try{return Number(localStorage.getItem('nyc-metro-full-1-best-journey'))||0;}catch{return 0;}});
  const input=useRef<HTMLInputElement>(null), restart=useRef<HTMLButtonElement>(null), dialog=useRef<HTMLDialogElement>(null);
  const stops=useMemo(()=>reverse?[...service.stations].reverse():service.stations,[reverse,service]);
  const index=state.status==='done'&&mode==='journey'?stops.length-1:state.completed%stops.length;
  const target=stops[index];
  const explored=peek??stops[0];
  const exploredIndex=stops.findIndex(s=>s.id===explored.id);
  const reset=()=>{setPeek(null);dispatch({type:'reset'});setTimeout(()=>input.current?.focus(),0);};
  const switchService=(id:string)=>{setServiceId(id);setReverse(false);setPeek(null);dispatch({type:'reset'});try{setBest(Number(localStorage.getItem(bestKey(id,mode)))||0);}catch{setBest(0);}setTimeout(()=>input.current?.focus(),0);};
  const switchMode=(m:Mode)=>{setMode(m);try{setBest(Number(localStorage.getItem(bestKey(serviceId,m)))||0);}catch{setBest(0);}dispatch({type:'reset'});setPeek(null);setTimeout(()=>m!=='explore'&&input.current?.focus(),0);};
  useEffect(()=>{if(state.status!=='running')return;const id=window.setInterval(()=>dispatch({type:'tick',now:performance.now(),mode}),100);return()=>clearInterval(id);},[state.status,mode]);
  useEffect(()=>{if(state.status!=='done')return;const score=wpm(state);if(score>best){setBest(score);try{localStorage.setItem(bestKey(serviceId,mode),String(score));}catch{}}restart.current?.focus();},[state.status]);
  useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!settings&&mode!=='explore'){e.preventDefault();if(state.status==='paused'){dispatch({type:'resume',now:performance.now()});setTimeout(()=>input.current?.focus(),0);}else dispatch({type:'pause',now:performance.now()});}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);},[state.status,settings,mode]);
  useEffect(()=>{const onHidden=()=>{if(document.hidden)dispatch({type:'pause',now:performance.now()});};document.addEventListener('visibilitychange',onHidden);return()=>document.removeEventListener('visibilitychange',onHidden);},[]);
  useEffect(()=>{if(settings)dialog.current?.showModal();else dialog.current?.close();},[settings]);
  useEffect(()=>{if(!settings && mode!=='explore' && (state.status==='ready'||state.status==='running')) input.current?.focus({preventScroll:true});},[settings,mode,state.status]);
  // Restore typing after background clicks without capturing controls or IME.
  useEffect(()=>{const typeAnywhere=(e:KeyboardEvent)=>{
    if(settings||mode==='explore'||!['ready','running'].includes(state.status)||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||e.key.length!==1)return;
    const el=e.target as HTMLElement|null;
    if(el?.closest('input,textarea,select,button,a,[contenteditable="true"],[role="button"]'))return;
    e.preventDefault();input.current?.focus({preventScroll:true});
    if(e.key===' '&&matches(state.input,target.name)){if(!e.repeat)dispatch({type:'submit',caseSensitive,target:target.name,total:stops.length,mode,now:performance.now()});return;}
    if(e.key===' '&&e.repeat)return;
    dispatch({type:'input',caseSensitive,value:state.input+e.key,target:target.name,now:performance.now()});
  };window.addEventListener('keydown',typeAnywhere);return()=>window.removeEventListener('keydown',typeAnywhere);},[settings,mode,state.status,state.input,target.name,caseSensitive]);
  if(custom)return <CustomJourney caseSensitive={caseSensitive} onCaseChange={changeCase} onClose={()=>{setCustom(false);switchMode('journey');}}/>;
  return <main className={`app${state.status==='running'?' is-typing':''}`} style={{'--route-color':service.color,'--red':service.color,'--route-text-color':service.textColor??'#fff'} as CSSProperties}>
    <header className="header"><a href="./" className="brand" aria-label="NYC Metro home">NYC METRO <span>station typing</span></a><nav aria-label="Game mode">{(['journey','timed','explore'] as Mode[]).map(m=><button key={m} className={mode===m?'active':''} aria-pressed={mode===m} onClick={()=>switchMode(m)}>{m}</button>)}<button onClick={()=>{switchMode('explore');setCustom(true);}}>custom</button></nav><button className="settings-button" aria-label="Open settings" onClick={()=>{dispatch({type:'pause',now:performance.now()});setSettings(true);}}>⚙</button></header>
    <div className="service-switcher" role="group" aria-label="Subway service">
      <label className="mobile-service-label">Service<select aria-label="Choose subway service" value={serviceId} onChange={e=>switchService(e.target.value)}>{services.map(s=><option key={s.id} value={s.id}>{s.bullet??s.id} · {s.name}</option>)}</select></label>
      <div className="service-bullets">{services.map(s=><button key={s.id} onClick={()=>switchService(s.id)} aria-label={`Service ${s.id}: ${s.name}`} aria-pressed={s.id===serviceId} title={`${s.bullet??s.id} · ${s.name}`} style={{'--service-color':s.color,'--service-text-color':s.textColor??'#fff'} as CSSProperties}>{s.bullet??s.id}{s.bullet==='S'&&<small>{s.id==='GS'?'42':s.id==='FS'?'F':'R'}</small>}</button>)}</div>
      <span className="service-pattern">{service.pattern}</span>
    </div>
    <section className="journey-header"><div className="route-title"><span className="bullet">{service.bullet??service.id}</span><div><h1>{service.name}</h1><button className="direction" onClick={()=>{setReverse(!reverse);dispatch({type:'reset'});setPeek(null);setTimeout(()=>input.current?.focus(),0);}} aria-label="Reverse journey direction">To {stops.at(-1)!.name} <span>·</span> {mode==='explore'&&peek?peek.borough:target.borough} <span className="swap">⇅</span></button></div></div>{mode!=='explore'&&<div className="progress-controls"><Stats state={state} total={stops.length} mode={mode}/><div className="case-options"><button aria-pressed={caseSensitive} title="Require exact capitalisation" onClick={()=>changeCase(!caseSensitive)}>UPPERCASE</button></div></div>}</section>
    <SubwayMap reversed={reverse} key={service.id} coordinates={service.coordinates} color={service.color} serviceId={service.id} stops={stops} index={mode==='explore'?exploredIndex:index} completed={mode==='timed'?state.completed%stops.length:state.completed} exploring={mode==='explore'} onSelect={s=>setPeek(s)}/>
    {mode==='explore'?<section className="explore-panel"><small>explore the {service.id} line</small><div className="explore-controls"><button aria-label="Previous station" disabled={exploredIndex===0} onClick={()=>setPeek(stops[exploredIndex-1])}>←</button><div className="explore-station-picker"><label htmlFor="explore-stop">station {exploredIndex+1} / {stops.length}</label><select id="explore-stop" aria-label="Choose station" value={explored.id} onChange={e=>setPeek(stops.find(s=>s.id===e.target.value)??null)}>{stops.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div><button aria-label="Next station" disabled={exploredIndex===stops.length-1} onClick={()=>setPeek(stops[exploredIndex+1])}>→</button></div><h2 aria-live="polite">{explored.name}</h2><Transfers station={explored} serviceId={serviceId}/><p>{explored.borough} · Choose a station or use the arrows. The map follows automatically.</p><button className="text-button" onClick={()=>switchMode('journey')}>Start a journey →</button></section>:state.status==='done'?<section className="results" aria-live="polite"><small>{mode==='timed'?'time’s up':'you’ve arrived'}</small><h2>{mode==='timed'?`${state.completed} stations. One minute.`:'A little more New York.'}</h2><p>{wpm(state)} wpm <span>·</span> {accuracy(state)}% accuracy <span>·</span> {clock(state.elapsed)} <span>·</span> best {best} wpm</p><button ref={restart} className="text-button" onClick={reset}>Ride again ↗</button></section>:state.status==='paused'?<section className="results"><small>take a breath</small><h2>Next stop, whenever you’re ready.</h2><button className="text-button" onClick={()=>{dispatch({type:'resume',now:performance.now()});setTimeout(()=>input.current?.focus(),0);}}>Resume journey →</button></section>:<TypingPanel caseSensitive={caseSensitive} serviceId={serviceId} ref={input} target={target} previous={index>0?stops[index-1]:undefined} next={stops[index+1]??(mode==='timed'?stops[0]:undefined)} value={state.input} disabled={settings} message={state.message} onChange={value=>dispatch({type:'input',caseSensitive,value,target:target.name,now:performance.now()})} onSubmit={()=>dispatch({type:'submit',caseSensitive,target:target.name,total:stops.length,mode,now:performance.now()})}/>}
    <footer><div><button ref={state.status!=='done'?restart:undefined} onClick={reset}>↻ restart</button><span>esc <em>pause</em></span></div><p>{mode==='timed'?'60 SECOND RUN':`${stops[0].name} → ${stops.at(-1)!.name}`}</p><span>NYC / {mode.toUpperCase()} {service.id}</span></footer>
    <dialog ref={dialog} onCancel={()=>setSettings(false)} onClose={()=>setSettings(false)}><div className="dialog-head"><h2>A few things to know.</h2><button aria-label="Close settings" onClick={()=>setSettings(false)}>×</button></div><p>Type the station name, then press Space or Enter to continue. Spaces inside an unfinished name type normally. With case-sensitive typing on, match the station’s capitalisation. With it off, either case works. A normal hyphen works in place of a dash.</p><p>Service {service.id}: {service.pattern}. Journey has {stops.length} stops, from {stops[0].name} to {stops.at(-1)!.name}. Timed gives you 60 seconds and repeats the route. Explore lets you inspect stations without a clock.</p><p>WPM counts accepted station characters ÷ 5 ÷ active minutes. Accuracy measures correct character entries, including corrected mistakes. The clock begins with your first character and pauses when you leave the tab.</p><p>Motion follows your device’s reduced-motion preference. Personal bests stay in this browser.</p><small>Independent prototype · selected GTFS service patterns · no live service information</small><a href="https://www.mta.info/map/5256" target="_blank" rel="noreferrer">Official MTA map ↗</a></dialog>
  </main>;
}
