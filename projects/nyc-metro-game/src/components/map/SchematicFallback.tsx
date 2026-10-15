import { motion, useReducedMotion } from 'motion/react';
import type { Station } from '../../data/stations';
export default function SubwayMap({ stops, index, completed, exploring, onSelect, color = '#D82233' }: { color?:string; stops: Station[]; index: number; completed: number; exploring: boolean; onSelect:(s:Station)=>void }) {
  const reduced=useReducedMotion();
  const current=stops[Math.min(index,stops.length-1)];
  const route=stops;
  const line=route.map(s=>`${s.x},${s.y}`).join(' ');
  const done=stops.slice(0,Math.max(1,Math.min(completed,stops.length)));
  return <div className="map-area">
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="subway-map" role="group" aria-label="Illustrative route map, automatically following the current station">
      <defs><pattern id="streetgrid" width="22" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(26)"><path d="M 0 0 L 22 0 M 0 0 L 0 32" fill="none" stroke="#c3c7c9" strokeWidth=".6" opacity=".1"/></pattern></defs>
      <motion.g initial={false} animate={{x:720-current.x*1.2,y:350-current.y*1.2}} transition={{duration:reduced?0:.65,ease:'easeInOut'}}>
        <g transform="scale(1.2)">
        <g className="land"><path d="M 1070 -1460 L 1450 -1460 1400 -1030 1230 -880 1150 -930 1110 -1130Z"/><path d="M 1030 -1120 L 1170 -1050 1050 -780 990 -600 905 -400 820 -190 760 0 650 180 610 163 745 -220 830 -470 900 -700Z"/><path d="M -500 -1600 L 900 -1600 895 -1210 800 -930 655 -580 520 -200 335 151 -500 100Z"/><path d="M 1140 -810 L 1900 -1000 1900 1600 570 1600 430 1050 610 710 760 515 914 292 1040 -150Z"/><path d="M 430 607 L 575 615 535 760 505 870 410 1010 350 960 370 810Z"/><path d="M 692 -90 L 1002 -90 839 156 769 274 666 476 575 615 481 700 421 669 430 607 492 484 554 325 610 163Z"/><path d="M -50 94 L 335 151 429 263 370 437 239 650 -50 650Z"/><path d="M 1015 -30 L 1490 -30 1490 700 628 700 760 515 827 373 914 292 956 131Z"/></g>
        <path d="M 692 -90 L 1002 -90 839 156 769 274 666 476 575 615 481 700 421 669 430 607 492 484 554 325 610 163Z" fill="url(#streetgrid)"/>
        <path d="M 830 -35 L 903 -4 798 198 733 166Z" className="park"/>
        <text x="819" y="65" className="park-label" transform="rotate(-63 819 65)">CENTRAL PARK</text>
        <g className="context" fill="none" strokeWidth="4" strokeLinejoin="round"><path d="M 685 -30 L 654 72 611 155 611 224 676 289 761 337 833 435 854 650" stroke="#345075"/><path d="M 900 -30 L 850 111 823 196 773 251 773 307 892 365 976 405 1130 490 1350 650" stroke="#65523d"/><path d="M 1149 -30 L 1118 107 1030 161 1000 233 1046 288 1046 367 1152 473 1170 650" stroke="#355346"/><path d="M 185 100 L 344 233 488 257 624 257 816 257 957 214 1117 214 1330 60" stroke="#4b4655"/>
          {[0,1,2,3,4,5,6].map(i=><circle key={i} cx={1046+i*22} cy={367+i*22} r="4" fill="#68716e" stroke="none"/>)}</g>
        <g className="place-names"><text x="1250" y="-1090">THE BRONX</text><text x="860" y="-580" transform="rotate(-70 860 -580)">UPPER MANHATTAN</text><text x="560" y="850">LOWER MANHATTAN</text><text x="270" y="200">HUDSON</text><text x="284" y="222">RIVER</text><text x="146" y="540">NEW JERSEY</text><text x="518" y="337" transform="rotate(-63 518 337)">MANHATTAN</text><text x="1194" y="240">QUEENS</text><text x="1100" y="550">BROOKLYN</text><text x="811" y="535">EAST RIVER</text></g>
        <polyline points={line} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="1"/>
        <polyline points={done.map(s=>`${s.x},${s.y}`).join(' ')} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"/>
        {stops.map((s,i)=><g key={s.id} className={`station ${s.id===current.id?'current':''}`} role="button" tabIndex={exploring?0:-1} aria-label={`Inspect ${s.name}`} onClick={()=>onSelect(s)} onKeyDown={e=>{if(exploring&&(e.key==='Enter'||e.key===' ')){e.preventDefault();onSelect(s);}}}>
          <circle cx={s.x} cy={s.y} r="18" fill="transparent"/><circle cx={s.x} cy={s.y} r={s.interchange?6.5:4.5} fill={i<completed?color:'#f3f0e8'} stroke="#17191c" strokeWidth="2"/>
          <text x={s.x+20} y={s.y+5}>{s.name}</text></g>)}
        <motion.g animate={{x:current.x,y:current.y}} initial={false} transition={{duration:reduced?0:.5,ease:'easeInOut'}}><circle r="14" fill={color} stroke="#f4f1e9" strokeWidth="3"/><rect x="-5" y="-8" width="10" height="13" rx="2" fill="none" stroke="#fff" strokeWidth="1.3"/><path d="M-3 -4H3M-3 1H-2M2 1H3M-3 5L-5 8M3 5L5 8" stroke="#fff" strokeWidth="1.2"/></motion.g>
        </g>
      </motion.g>
    </svg>

  </div>;
}
