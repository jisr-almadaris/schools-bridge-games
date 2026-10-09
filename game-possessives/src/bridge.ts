/* Schools Bridge game adapter — only reports achievements actually reached in this run. */
const HOST_ORIGIN = 'https://jisr-almadaris.github.io';
const ACTIVITY_ID = 'game-possessives';
const GAME_KEYS = ["jm_name", "jm_solved", "jm_score"];
const OWNER_KEY = 'sb_game_owner::' + ACTIVITY_ID;
let student: { name: string; school: string } | null = null;
let completed = false;
let certified = false;

const norm = (v: string) => String(v || '').trim().replace(/\s+/g, ' ').toLowerCase();
function forgetOldProgress() {
  for (const key of GAME_KEYS) {
    try { localStorage.removeItem(key); } catch { /* storage disabled */ }
  }
}
/** Called before React mounts so the previous student's save can never flash on screen. */
export function prepareBridgeSession(): Promise<void> {
  const host = window.opener && !window.opener.closed ? window.opener :
    (window.parent !== window ? window.parent : null);
  if (!host) {
    // An unregistered/direct launch is a fresh trial, never another child's saved session.
    forgetOldProgress();
    return Promise.resolve();
  }
  return new Promise(resolve => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener('message', receive);
      window.clearTimeout(timer);
      resolve();
    };
    const receive = (event: MessageEvent) => {
      if (event.origin !== HOST_ORIGIN || event.source !== host) return;
      const d = event.data;
      if (!d || d.source !== 'schools-bridge-host' || d.type !== 'identity' || d.activityId !== ACTIVITY_ID) return;
      if (typeof d.name !== 'string' || typeof d.school !== 'string' || !d.name.trim() || !d.school.trim()) return;
      const key = JSON.stringify([norm(d.name), norm(d.school)]);
      try {
        if (localStorage.getItem(OWNER_KEY) !== key) {
          forgetOldProgress();
          localStorage.setItem(OWNER_KEY, key);
        }
      } catch { forgetOldProgress(); }
      student = { name: d.name.trim(), school: d.school.trim() };
      finish();
    };
    window.addEventListener('message', receive);
    // Prevent a standalone/new-tab user from waiting indefinitely when no bridge responds.
    const timer = window.setTimeout(() => { forgetOldProgress(); finish(); }, 2500);
    try { host.postMessage({ source: 'schools-bridge-game', type: 'ready', activityId: ACTIVITY_ID }, HOST_ORIGIN); }
    catch { forgetOldProgress(); finish(); }
  });
}
export function bridgeStudentName(): string { return student?.name || ''; }
function send(type: 'completed' | 'certificate', score: number, maxScore: number, title?: string) {
  if (!student) return; // do not invent students or scores outside a verified gateway launch
  const host = window.opener && !window.opener.closed ? window.opener :
    (window.parent !== window ? window.parent : null);
  if (!host) return;
  const scoreValue = Number(score), maxValue = Number(maxScore);
  if (!Number.isFinite(scoreValue) || !Number.isFinite(maxValue) || maxValue <= 0) return;
  const safeScore = Math.max(0, Math.min(scoreValue, maxValue));
  const message: Record<string, unknown> = {
    source: 'schools-bridge-game', activityId: ACTIVITY_ID, type,
    score: type === 'certificate' ? Math.round(safeScore / maxValue * 100) : safeScore,
  };
  if (type === 'completed') message.maxScore = maxValue;
  if (type === 'certificate' && title) message.title = title;
  host.postMessage(message, HOST_ORIGIN);
}
export function reportCompleted(score: number, maxScore: number) {
  if (completed) return;
  completed = true;
  send('completed', score, maxScore);
}
export function reportCertificate(score: number, maxScore: number, title: string) {
  if (certified) return;
  reportCompleted(score, maxScore);
  certified = true;
  send('certificate', score, maxScore, title);
}
