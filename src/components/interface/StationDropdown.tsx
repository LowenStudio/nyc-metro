import {useEffect,useId,useRef,useState} from 'react';
import {journeyStations} from '../../game/journey-router';
import {services} from '../../data/services';
type Choice=typeof journeyStations[number];
function Badges({station}:{station:Choice}){
 return <span className="station-choice-badges">{station.serviceIds.map(id=>{const s=services.find(s=>s.id===id)!;return <span key={id} className="station-choice-bullet" style={{background:s.color,color:s.textColor??'#fff'}} title={s.name}>{s.bullet??id}</span>;})}</span>;
}
export default function StationDropdown({label,value,onChange}:{label:string;value:string;onChange:(id:string)=>void}){
 const [open,setOpen]=useState(false),[active,setActive]=useState(0);
 const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null),list=useRef<HTMLDivElement>(null),search=useRef({text:'',time:0});const id=useId();
 const selected=journeyStations.find(s=>s.id===value)!;
 const choose=(index:number)=>{onChange(journeyStations[index].id);setOpen(false);trigger.current?.focus();};
 useEffect(()=>{if(!open)return;setActive(journeyStations.findIndex(s=>s.id===value));list.current?.focus();const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open,value]);
 useEffect(()=>{if(open)document.getElementById(`${id}-${active}`)?.scrollIntoView({block:'nearest'});},[open,active,id]);
 return <div className="station-dropdown" ref={root}>
  <span id={`${id}-label`} className="station-dropdown-label">{label}</span>
  <button ref={trigger} type="button" className="station-dropdown-trigger" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={open?`${id}-list`:undefined} onClick={()=>setOpen(!open)} onKeyDown={e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setOpen(true);}}}>
   <span className="station-choice-text"><span>{selected.name}</span><small>{selected.borough}</small></span><Badges station={selected}/><span className="dropdown-chevron" aria-hidden="true">⌄</span>
  </button>
  {open&&<div ref={list} id={`${id}-list`} className="station-dropdown-menu" role="listbox" tabIndex={-1} aria-labelledby={`${id}-label`} aria-activedescendant={`${id}-${active}`} onKeyDown={e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setOpen(false);trigger.current?.focus();}
   else if(e.key==='Tab')setOpen(false);
   else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setActive(i=>Math.max(0,Math.min(journeyStations.length-1,i+(e.key==='ArrowDown'?1:-1))));}
   else if(e.key==='Home'||e.key==='End'){e.preventDefault();setActive(e.key==='Home'?0:journeyStations.length-1);}
   else if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(active);}
   else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();const now=Date.now();search.current={text:(now-search.current.time<700?search.current.text:'')+e.key.toLowerCase(),time:now};const next=journeyStations.findIndex(s=>s.name.toLowerCase().startsWith(search.current.text));if(next>=0)setActive(next);}
  }}>
   {journeyStations.map((s,i)=><div key={s.id} id={`${id}-${i}`} role="option" aria-label={`${s.name} · ${s.borough} · ${s.services}`} aria-selected={s.id===value} className={`station-dropdown-option${active===i?' is-highlighted':''}`} onClick={()=>choose(i)}><span className="station-choice-text"><span>{s.name}</span><small>{s.borough}</small></span><Badges station={s}/>{s.id===value&&<span className="station-choice-check" aria-hidden="true">✓</span>}</div>)}
  </div>}
 </div>;
}
