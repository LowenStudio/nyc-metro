export type Mode = 'journey' | 'timed' | 'explore';
export type Status = 'ready' | 'running' | 'paused' | 'done';
export const LIMIT = 60_000;
export function normalise(s: string, caseSensitive = false) { const text=s.replace(/[–—−]/g, '-'); return caseSensitive ? text : text.toLowerCase(); }
export function matches(input: string, target: string, caseSensitive = false) { return normalise(input.trim(),caseSensitive) === normalise(target,caseSensitive); }
export interface GameState { status: Status; input: string; completed: number; correct: number; errors: number; accepted: number; elapsed: number; base: number; started: number | null; message: string }
export const initial: GameState = { status: 'ready', input: '', completed: 0, correct: 0, errors: 0, accepted: 0, elapsed: 0, base: 0, started: null, message: '' };
export type Action = { type: 'reset' } | { type: 'input'; value: string; target: string; now: number; caseSensitive?: boolean } | { type: 'submit'; target: string; total: number; mode: Mode; now: number; caseSensitive?: boolean } | { type: 'tick'; now: number; mode: Mode } | { type: 'pause'; now: number } | { type: 'resume'; now: number };
export function elapsedAt(s: GameState, now: number) { return s.started === null ? s.elapsed : s.base + Math.max(0, now - s.started); }
export function reducer(s: GameState, a: Action): GameState {
  if (a.type === 'reset') return { ...initial };
  if (a.type === 'input') {
    if (s.status === 'paused' || s.status === 'done') return s;
    let prefix = 0;
    while (prefix < s.input.length && prefix < a.value.length && s.input[prefix] === a.value[prefix]) prefix++;
    let correct = s.correct, errors = s.errors;
    for (let i = prefix; i < a.value.length; i++) {
      if (normalise(a.value[i],a.caseSensitive) === normalise(a.target[i] ?? '',a.caseSensitive)) correct++; else errors++;
    }
    const start = s.status === 'ready' && a.value.length > 0;
    return { ...s, input: a.value, correct, errors, message: '', status: start ? 'running' : s.status, started: start ? a.now : s.started };
  }
  if (a.type === 'resume') return s.status === 'paused' ? { ...s, status: 'running', base: s.elapsed, started: a.now } : s;
  if (a.type === 'pause') return s.status === 'running' ? { ...s, status: 'paused', elapsed: elapsedAt(s, a.now), started: null } : s;
  if (s.status !== 'running') return s;
  if (a.type === 'tick') {
    const elapsed = elapsedAt(s, a.now);
    return a.mode === 'timed' && elapsed >= LIMIT ? { ...s, status: 'done', elapsed: LIMIT, started: null } : { ...s, elapsed };
  }
  if (a.type === 'submit') {
    if (a.mode === 'timed' && elapsedAt(s, a.now) >= LIMIT) return { ...s, status: 'done', elapsed: LIMIT, started: null };
    if (!matches(s.input, a.target,a.caseSensitive)) return { ...s, message: a.caseSensitive && matches(s.input,a.target) ? 'Match the station’s capitalisation, then press Space or Enter.' : 'Check the highlighted letters, then press Space or Enter.' };
    const completed = s.completed + 1, done = a.mode === 'journey' && completed >= a.total;
    return { ...s, completed, input: '', accepted: s.accepted + a.target.length, message: '', elapsed: elapsedAt(s, a.now), status: done ? 'done' : 'running', started: done ? null : s.started };
  }
  return s;
}
export function accuracy(s: GameState) { return s.correct + s.errors ? Math.round(100 * s.correct / (s.correct + s.errors)) : 100; }
export function wpm(s: GameState) { return s.elapsed > 0 ? Math.round((s.accepted / 5) / (s.elapsed / 60_000)) : 0; }
export function clock(ms: number) { const seconds = Math.floor(ms / 1000); return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }
