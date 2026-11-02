/* Unified Schools Bridge connection for this game (new-tab + iframe + channel fallback).
   Reports only real gameplay completion/certificate; never trusts a typed name as identity. */
const HOST_ORIGIN = 'https://jisr-almadaris.github.io';
const ACTIVITY_ID = 'game-gerund-infinitive';
const GAME_KEYS: string[] = ["gi-adventure-park-v1"];
const OWNER_KEY = 'sb_game_owner::' + ACTIVITY_ID;
const SNAPSHOT_PREFIX = 'sb_game_progress::' + ACTIVITY_ID + '::';
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
    // Preserve last verified student's journey before starting a standalone demo.
    try {
      const owner = localStorage.getItem(OWNER_KEY);
      if (owner) for (const progressKey of GAME_KEYS) {
        const value = localStorage.getItem(progressKey);
        if (value !== null) localStorage.setItem(SNAPSHOT_PREFIX + owner + '::' + progressKey, value);
      }
      localStorage.removeItem(OWNER_KEY);
    } catch { /* storage disabled */ }
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
      const key = typeof d.visitor_id === 'string' && d.visitor_id.startsWith('v-')
        ? 'id:' + d.visitor_id : JSON.stringify([norm(d.name), norm(d.school)]);
      try {
        const previous = localStorage.getItem(OWNER_KEY);
        if (previous !== key) {
          // Back up each pupil's local journey before switching to another.
          // Never attach unidentified legacy data to a different student.
          for (const progressKey of GAME_KEYS) {
            const value = localStorage.getItem(progressKey);
            if (value !== null) {
              const destination = previous
                ? SNAPSHOT_PREFIX + previous + '::' + progressKey
                : SNAPSHOT_PREFIX + 'legacy-unattributed::' + progressKey;
              if (previous || localStorage.getItem(destination) === null)
                localStorage.setItem(destination, value);
            }
          }
          for (const progressKey of GAME_KEYS) {
            let snapshot = localStorage.getItem(SNAPSHOT_PREFIX + key + '::' + progressKey);
            // One-time migration for the same pupil from the prior name/school
            // key, without changing the old saved record.
            const legacyOwner = JSON.stringify([norm(d.name), norm(d.school)]);
            if (snapshot === null && previous === legacyOwner)
              snapshot = localStorage.getItem(SNAPSHOT_PREFIX + previous + '::' + progressKey);
            if (snapshot === null) localStorage.removeItem(progressKey);
            else localStorage.setItem(progressKey, snapshot);
          }
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
    const timer = window.setTimeout(() => {
      // Fail closed on an unverified bridge launch; this session must not
      // display old names or submit another pupil's results.
      const root = document.getElementById('root');
      if (root) root.innerHTML = '<p dir="rtl" style="padding:2rem;text-align:center">تعذّر التحقق من الطالبة. أغلقي اللعبة وافتحيها من بوابة جسر المدارس.</p>';
      window.removeEventListener('message', receive);
      settled = true;
    }, 6000);
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
  flushBridgeQuestions();
  if (!completed && send('completed', score, maxScore)) completed = true;
}
export function reportCertificate(score: number, maxScore: number, title: string) {
  flushBridgeQuestions();
  if (certified) return;
  reportCompleted(score, maxScore);
  if (send('certificate', score, maxScore, title)) certified = true;
}

/** Optional, non-identifying per-question evidence. This never blocks scores or certificates. */
export type BridgeQuestionEvidence = {question_index:number;correct:boolean;response_ms:number;hint_used:boolean};
export function reportLearningTrace(chunk:number, items:BridgeQuestionEvidence[]):boolean {
  if (!student || !Number.isInteger(chunk) || chunk<0 || chunk>4 ||
      !Array.isArray(items) || items.length===0 || items.length>20 ||
      items.some(it => !Number.isInteger(it.question_index) || it.question_index<0 ||
        it.question_index>30 || typeof it.correct!=='boolean' ||
        typeof it.hint_used!=='boolean' || !Number.isInteger(it.response_ms) ||
        it.response_ms<0 || it.response_ms>120000)) return false;
  const payload={source:'schools-bridge-game',activityId:ACTIVITY_ID,type:'learning-trace',chunk,items};
  const sessionId=sessionIdFromHash();
  const deliver=():boolean=>{
    let posted=false;
    if (sessionChannel && sessionId) {
      try {sessionChannel.postMessage({...payload,sessionId});posted=true;} catch { /* opener fallback */ }
    }
    try {const host=openerWindow();if(host){host.postMessage(payload,HOST_ORIGIN);posted=true;}}
    catch { /* channel fallback */ }
    return posted;
  };
  const posted=deliver();
  if(posted){window.setTimeout(deliver,1000);window.setTimeout(deliver,3000);}
  return posted;
}

/** First-attempt evidence, never names or answer text. Duration=0 means not measured.
 * Batches are queued by the host; reporting cannot interrupt the game. */
type LocalAnswer = {question_index:number;question_id:string;correct:boolean;response_ms:number;hint_used:boolean};
const pendingAnswers: LocalAnswer[] = [];
const answerKeys = new Set<string>();
let traceSent = false;
export function recordBridgeQuestion(id: string, correctOnFirstTry: boolean, hintUsed = false): void {
  if (!student) return;
  if (traceSent) {
    traceSent=false;completed=false;certified=false;
    pendingAnswers.length=0;answerKeys.clear();
    const roundId=window.crypto?.randomUUID?.() ||
      ('r-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
    const msg={source:'schools-bridge-game',activityId:ACTIVITY_ID,type:'new-round',round_id:roundId};
    const sid=sessionIdFromHash();
    try {if(sessionChannel && sid) sessionChannel.postMessage({...msg,sessionId:sid});}catch{}
    try {openerWindow()?.postMessage(msg,HOST_ORIGIN);}catch{}
  }
  const qid=String(id || '').replace(/[^A-Za-z0-9._:-]/g,'-').slice(0,64);
  if (!qid || answerKeys.has(qid) || pendingAnswers.length >= 31) return;
  answerKeys.add(qid);
  pendingAnswers.push({question_index:pendingAnswers.length,question_id:qid,
    correct:Boolean(correctOnFirstTry),response_ms:0,hint_used:Boolean(hintUsed)});
}
function flushBridgeQuestions(): void {
  if (!student || traceSent || pendingAnswers.length===0) return;
  traceSent=true;
  for (let offset=0;offset<pendingAnswers.length;offset+=20) {
    const chunk=Math.floor(offset/20);
    const items=pendingAnswers.slice(offset,offset+20);
    reportLearningTrace(chunk,items);
  }
}
