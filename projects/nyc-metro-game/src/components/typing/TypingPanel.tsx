import Transfers from '../interface/Transfers';
import { forwardRef } from 'react';
import { normalise, matches } from '../../game/engine';
import type { Station } from '../../data/stations';
interface Props { caseSensitive:boolean; serviceId:string; target: Station; previous?: Station; next?: Station; value: string; disabled: boolean; message: string; onChange: (v:string)=>void; onSubmit:()=>void }
const TypingPanel = forwardRef<HTMLInputElement, Props>(function TypingPanel(p, ref) {
  return <section className="typing-zone" aria-label="Station typing">
    <div className="neighbour"><small>previous</small><span>{p.previous?.name ?? 'All aboard'}</span></div>
    <div className="typing-centre"><label htmlFor="station-input">type this station</label>
      <div className={`type-surface ${p.message ? 'has-error' : ''}`} onClick={() => { if (ref && typeof ref !== 'function') ref.current?.focus(); }}>
        <div className={`prompt ${p.target.name.length>20?'long-name':''}`} aria-hidden="true">{Array.from(p.target.name).map((char, i) => <span key={i} className={`${i < p.value.length ? normalise(p.value[i],p.caseSensitive) === normalise(char,p.caseSensitive) ? 'correct' : 'incorrect' : 'pending'} ${i === p.value.length ? 'caret' : ''}`}>{char}</span>)}{p.value.length >= p.target.name.length && <span className="caret extra">{p.value.slice(p.target.name.length) || '​'}</span>}</div>
        <input autoFocus ref={ref} id="station-input" aria-label={`Type ${p.target.name}`} aria-describedby="typing-instruction" value={p.value} onChange={e=>p.onChange(e.target.value)} onKeyDown={e=>{if(e.nativeEvent.isComposing)return;if(e.key===' '&&e.repeat){e.preventDefault();return;}if(e.key==='Enter'||(e.key===' '&&matches(p.value,p.target.name))){e.preventDefault();if(!e.repeat)p.onSubmit();}}} disabled={p.disabled} autoComplete="off" autoCapitalize="off" spellCheck={false} autoCorrect="off" maxLength={90}/>
      </div><Transfers station={p.target} serviceId={p.serviceId}/><p id="typing-instruction" className={p.message ? 'error-message' : ''} aria-live="polite">{p.message || 'space or enter to continue'}</p>
    </div>
    <div className="neighbour next"><small>next</small><span>{p.next?.name ?? 'End of the line'}</span></div>
  </section>;
});
export default TypingPanel;
