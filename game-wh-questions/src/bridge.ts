/* Unified Schools Bridge connection for this game (new-tab + iframe + channel fallback).
   Reports only real gameplay completion/certificate; never trusts a typed name as identity. */
const HOST_ORIGIN = 'https://jisr-almadaris.github.io';
const ACTIVITY_ID = 'game-wh-questions';
const GAME_KEYS: string[] = ["wh-space-adventure-v1"];
const OWNER_KEY = 'sb_game_owner::' + ACTIVITY_ID;
const SESSION_PREFIX = 'schools-bridge-session-v1::';
let student: { name: string; school: string } | null = null;
let completed = false;
let certified = false;
let sessionChannel: BroadcastChannel | null = null;

const norm = (v: string) => String(v || '').trim().replace(/\s+/g, ' ').toLowerCase();
function forgetOldProgress() {
  for (const key of GAME_KEYS) {
    try { localStorage.removeItem(key); } catch { /* storage disabled */ }
  }
}
function openerWindow(): Window | null {
  try {
    if (window.opener && !window.opener.closed) return window.opener;
    return window.parent !== window ? window.parent : null;
  } catch { return null; }
}
export function prepareBridgeSession(): Promise<void> {
  const host = openerWindow();
  const sessionId = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('sb_session');
  try {
    if (sessionId && /^[a-zA-Z0-9_-]{16,100}$/.test(sessionId) &&
        window.location.origin === HOST_ORIGIN && 'BroadcastChannel' in window) {
      sessionChannel = new BroadcastChannel(SESSION_PREFIX + sessionId);
    }
  } catch { sessionChannel = null; }
  if (!host && !sessionChannel) {
    // Standalone visit cannot inherit progress of a previous student.
    forgetOldProgress();
    return Promise.resolve();
  }
  return new Promise(resolve => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener('message', receive);
      window.clearTimeout(timer);
      resolve();
    };
    const accept = (d: any) => {
      if (settled || !d || d.source !== 'schools-bridge-host' ||
          d.type !== 'identity' || d.activityId !== ACTIVITY_ID) return;
      if (sessionChannel && d.sessionId !== sessionId) return;
      if (typeof d.name !== 'string' || typeof d.school !== 'string' ||
          !d.name.trim() || !d.school.trim()) return;
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
    const receive = (event: MessageEvent) => {
      if (event.origin !== HOST_ORIGIN || event.source !== host) return;
      accept(event.data);
    };
    if (sessionChannel) sessionChannel.onmessage = event => accept(event.data);
    window.addEventListener('message', receive);
    const timer = window.setTimeout(() => { forgetOldProgress(); finish(); }, 6000);
    // Reply can arrive over either route; the broadcast route works even if
    // browsers detach window.opener on new tabs.
    try { host?.postMessage({ source: 'schools-bridge-game', type: 'ready',
      activityId: ACTIVITY_ID, ...(sessionId ? { sessionId } : {}) }, HOST_ORIGIN); } catch { /* fallback */ }
    try { sessionChannel?.postMessage({ source: 'schools-bridge-game', type: 'ready',
      activityId: ACTIVITY_ID, sessionId }); } catch { /* opener fallback */ }
  });
}
export function bridgeStudentName(): string { return student?.name || ''; }
function send(type: 'completed' | 'certificate', score: number, maxScore: number, title?: string): boolean {
  if (!student) return false; // typing a name in the game never counts as gateway registration
  const scoreValue = Number(score), maxValue = Number(maxScore);
  if (!Number.isFinite(scoreValue) || !Number.isFinite(maxValue) ||
      maxValue <= 0 || scoreValue < 0 || scoreValue > maxValue) return false;
  const payload: Record<string, unknown> = {
    source: 'schools-bridge-game', activityId: ACTIVITY_ID, type,
    score: type === 'certificate' ? Math.round(scoreValue / maxValue * 100) : scoreValue,
  };
  if (type === 'completed') payload.maxScore = maxValue;
  if (type === 'certificate' && title) payload.title = title;
  // Prefer a session-bound channel: both pages are github.io, and the host
  // already holds the matching unguessable per-launch session token.
  if (sessionChannel && sessionIdFromHash()) {
    try { sessionChannel.postMessage({ ...payload, sessionId: sessionIdFromHash() }); return true; }
    catch { /* use window messaging */ }
  }
  try { const host = openerWindow(); if (host) { host.postMessage(payload, HOST_ORIGIN); return true; } }
  catch { /* disconnected */ }
  return false;
}
function sessionIdFromHash(): string | null {
  try { return new URLSearchParams(window.location.hash.replace(/^#/, '')).get('sb_session'); }
  catch { return null; }
}
export function reportCompleted(score: number, maxScore: number) {
  if (!completed && send('completed', score, maxScore)) completed = true;
}
export function reportCertificate(score: number, maxScore: number, title: string) {
  if (certified) return;
  reportCompleted(score, maxScore);
  if (send('certificate', score, maxScore, title)) certified = true;
}
