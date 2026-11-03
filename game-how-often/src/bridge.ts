/* Unified Schools Bridge connection for this game (new-tab + iframe + channel fallback).
   Reports only real gameplay completion/certificate; never trusts a typed name as identity. */
const HOST_ORIGIN = 'https://jisr-almadaris.github.io';
const ACTIVITY_ID = 'game-how-often';
const GAME_KEYS: string[] = ["hm_phase", "hm_name", "hm_power", "hm_chips", "hm_done"];
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
    const root=document.getElementById('root');
    if(root) root.innerHTML='<p dir="rtl" style="padding:2rem;text-align:center">افتحي اللعبة من بوابة الجسر وسجلي اسمك الثلاثي ومدرستك أولًا، حتى تُحفظ نتيجتك.</p>';
    return new Promise<void>(()=>{});
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
          d.name.trim().split(/\s+/).length < 3 || !d.school.trim()) return;
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
      restorePendingPackets();
      finish();
    };
    const receive = (event: MessageEvent) => {
      if (event.origin !== HOST_ORIGIN || event.source !== host) return;
      accept(event.data);
    };
    if (sessionChannel) sessionChannel.onmessage = event => { accept(event.data); acceptSavedPacket(event.data); };
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

/* Persistent, per-student delivery until the gateway confirms database save.
 * A postMessage alone never proves a score reached the teacher. */
const PENDING_PREFIX = 'jisr-result-pending-v2::' + ACTIVITY_ID + '::';
const pendingPackets = new Map<string, {packet: any; studentKey: string; timer: number}>();
const ownerDeliveryKey = () => student ? JSON.stringify([norm(student.name),norm(student.school)]) : '';
const freshDeliveryId = () => window.crypto?.randomUUID?.() ||
  ('ev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
function transmitSavedPacket(packet: any): boolean {
  let sent = false;
  const sid = sessionIdFromHash();
  if (sessionChannel && sid) {
    try {sessionChannel.postMessage({...packet,sessionId:sid});sent=true;} catch {}
  }
  try { const host=openerWindow(); if(host){host.postMessage(packet,HOST_ORIGIN);sent=true;} } catch {}
  return sent;
}
function retryPendingPacket(key: string): void {
  const item = pendingPackets.get(key);
  if (!item || item.studentKey !== ownerDeliveryKey()) return;
  transmitSavedPacket(item.packet);
}
function rememberPendingPacket(packet:any, studentKey:string):void {
  const key=PENDING_PREFIX+packet.delivery_id;
  if(pendingPackets.has(key))return;
  try {localStorage.setItem(key,JSON.stringify({packet,studentKey}));} catch {}
  const timer=window.setInterval(()=>retryPendingPacket(key),3000);
  pendingPackets.set(key,{packet,studentKey,timer});
  retryPendingPacket(key);
}
function sendReliablePacket(packet:any):boolean {
  if(!student)return false;
  const full={...packet,delivery_id:freshDeliveryId()};
  const studentKey=ownerDeliveryKey();
  rememberPendingPacket(full,studentKey);
  return true; // queued locally, not a claim that the server saved anything
}
function acceptSavedPacket(data:any):void {
  if(!data || data.source!=='schools-bridge-host' || data.type!=='saved' ||
     data.activityId!==ACTIVITY_ID || typeof data.delivery_id!=='string')return;
  const key=PENDING_PREFIX+data.delivery_id;
  const entry=pendingPackets.get(key);
  if(!entry || entry.studentKey!==ownerDeliveryKey())return;
  clearInterval(entry.timer);
  pendingPackets.delete(key);
  try{localStorage.removeItem(key);}catch{}
}
function restorePendingPackets():void {
  if(!student)return;
  try{
    const keys=[] as string[];
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(k?.startsWith(PENDING_PREFIX))keys.push(k);
    }
    for(const key of keys.slice(0,70)){
      const data=JSON.parse(localStorage.getItem(key)||'null');
      if(data?.packet?.delivery_id && data.studentKey===ownerDeliveryKey())
        rememberPendingPacket(data.packet,data.studentKey);
    }
  }catch{}
}
window.addEventListener('message',(event:MessageEvent)=>{
  if(event.origin===HOST_ORIGIN && event.source===openerWindow()) acceptSavedPacket(event.data);
});
window.addEventListener('online',()=>{for(const key of pendingPackets.keys())retryPendingPacket(key);});

export function bridgeStudentName(): string { return student?.name || ''; }
function send(type: 'completed' | 'certificate', score: number, maxScore: number, title?: string): boolean {
  if (!student) return false;
  const value=Number(score), max=Number(maxScore);
  if (!Number.isFinite(value) || !Number.isFinite(max) || max<=0 || value<0 || value>max) return false;
  const payload: Record<string,unknown>={
    source:'schools-bridge-game',activityId:ACTIVITY_ID,type,
    score:type==='certificate'?Math.round(value/max*100):value
  };
  if(type==='completed')payload.maxScore=max;
  if(type==='certificate' && title)payload.title=title;
  return sendReliablePacket(payload);
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
  return sendReliablePacket(payload);
}

/** New classroom practice round for this verified student; independent of certificate reprints. */
export function startBridgeReplay(): void {
  if (!student) return;
  completed=false;certified=false;
  const roundId=window.crypto?.randomUUID?.() ||
    ('r-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
  const message={source:'schools-bridge-game',activityId:ACTIVITY_ID,type:'new-round',round_id:roundId};
  const sid=sessionIdFromHash();
  try {if(sessionChannel && sid)sessionChannel.postMessage({...message,sessionId:sid});} catch {}
  try {openerWindow()?.postMessage(message,HOST_ORIGIN);}catch {}
}
