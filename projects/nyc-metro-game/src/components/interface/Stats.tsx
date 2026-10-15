import { accuracy, clock, LIMIT, wpm, type GameState, type Mode } from '../../game/engine';
export default function Stats({ state, total, mode }: { state: GameState; total: number; mode: Mode }) {
  const acc = accuracy(state);
  return <div className="stats" aria-label="Journey statistics">
    <div><small>stations</small><strong>{state.completed}<span>/{mode === 'timed' ? '∞' : total}</span></strong><div className="hairline" role="progressbar" aria-label="Stations completed" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.min(state.completed,total)}><i style={{ width: `${Math.min(100, state.completed / total * 100)}%` }}/></div></div>
    <div><small>accuracy</small><strong>{acc}<span>%</span></strong><div className="hairline"><i style={{width:`${acc}%`}}/></div></div>
    <div><small>{mode === 'timed' ? 'remaining' : 'time'}</small><strong>{clock(mode === 'timed' ? Math.max(0,LIMIT-state.elapsed) : state.elapsed)}</strong></div>
    <div><small>wpm</small><strong>{wpm(state)}</strong></div>
  </div>;
}
