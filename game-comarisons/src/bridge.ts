/**
 * Sender half of the Jisr Almadaris (schools-bridge) game-reporting contract.
 *
 * Contract verified against the DEPLOYED receiver (not guessed):
 * - repo: github.com/jisr-almadaris/schools-bridge, INTEGRATION.md +
 *   PR #9 (merged 2026-10-07, live on `main` → GitHub Pages).
 * - Receiver validation rules (from app.js diff + tests/game-bridge.test.cjs):
 *   1. `event.origin` must be an origin present in the games/vocabulary
 *      catalog (this game: https://01a0cd6d-83ae-7de8-9b94-b5f56306d66f.arena.site).
 *   2. `event.data.source === 'schools-bridge-game'`.
 *   3. The attempt key is `event.origin + '::' + activityId` and must match
 *      an attempt registered IN MEMORY when the student clicked the card.
 *   4. type 'completed' requires finite `score` and `maxScore`.
 *      type 'certificate' requires finite `score` (receiver's own test
 *      fixture uses a percentage-like value: `{ type:'certificate', score: 95 }`).
 *   5. Each accepted message produces exactly one production API record —
 *      therefore we send each genuine event EXACTLY ONCE (no blind retries,
 *      which could create duplicate production records).
 *
 * Message shapes (verbatim from the receiver):
 *   { source:'schools-bridge-game', activityId:'game-comparisons', type:'completed', score, maxScore }
 *   { source:'schools-bridge-game', activityId:'game-comparisons', type:'certificate', score, title? }
 */

export const BRIDGE_ORIGIN = "https://jisr-almadaris.github.io";
export const BRIDGE_SOURCE = "schools-bridge-game";
export const ACTIVITY_ID = "game-comparisons";
/** Deploy marker — lets ops verify which sender build is live. */
export const SENDER_VERSION = "2";

export type BridgeStatus = "sent" | "no-bridge" | "error";

interface CompletedMessage {
  source: typeof BRIDGE_SOURCE;
  activityId: typeof ACTIVITY_ID;
  type: "completed";
  score: number;
  maxScore: number;
}

interface CertificateMessage {
  source: typeof BRIDGE_SOURCE;
  activityId: typeof ACTIVITY_ID;
  type: "certificate";
  score: number;
  title?: string;
}

/**
 * Capture the opener/parent references at module load — BEFORE any later
 * code, navigation, or library could clear `window.opener`. On the real
 * launch path (Jisr's `launchGameTab` uses a tracked `window.open` without
 * the `noopener` feature, per PR #9), `window.opener` is the Jisr tab.
 * iOS/mobile Safari also preserves `opener` for `window.open` from a user
 * gesture, so the same path works there.
 */
const openerAtLoad: Window | null = (() => {
  try {
    return window.opener && window.opener !== window ? (window.opener as Window) : null;
  } catch {
    return (window.opener as Window | null) ?? null;
  }
})();

function bridgeTargets(): Window[] {
  const wins: Window[] = [];
  // Prefer the reference captured at load; fall back to the live value.
  let op: Window | null = openerAtLoad;
  if (!op) {
    try {
      op = window.opener && window.opener !== window ? (window.opener as Window) : null;
    } catch {
      op = (window.opener as Window | null) ?? null;
    }
  }
  if (op) {
    // `closed` is on the cross-origin-allowed property list; guard anyway.
    let closed = false;
    try {
      closed = op.closed === true;
    } catch {
      closed = false;
    }
    if (!closed) wins.push(op);
  }
  try {
    if (window.parent && window.parent !== window) wins.push(window.parent);
  } catch {
    /* ignore */
  }
  return wins;
}

function post(message: CompletedMessage | CertificateMessage): BridgeStatus {
  const targets = bridgeTargets();
  if (targets.length === 0) {
    // Honest limitation, console-only (never shown to the student): the game
    // was not launched from the Jisr Almadaris site, or the opener tab was
    // closed, so there is no window to report to.
    console.warn(
      `[${BRIDGE_SOURCE} v${SENDER_VERSION}] No window.opener/parent — "${message.type}" for ` +
        `"${ACTIVITY_ID}" cannot reach the Teacher Control Center. ` +
        `The receiver also requires the ORIGINAL Jisr tab to still hold this ` +
        `attempt in memory. Payload (kept local):`,
      JSON.stringify(message)
    );
    return "no-bridge";
  }
  let delivered = false;
  for (const w of targets) {
    try {
      // Explicit target origin — never "*" — so the score can only be
      // delivered to the Jisr Almadaris origin the receiver runs on.
      w.postMessage(message, BRIDGE_ORIGIN);
      delivered = true;
    } catch (err) {
      console.warn(`[${BRIDGE_SOURCE} v${SENDER_VERSION}] postMessage failed:`, err);
    }
  }
  if (delivered) {
    console.info(
      `[${BRIDGE_SOURCE} v${SENDER_VERSION}] Dispatched "${message.type}" for "${ACTIVITY_ID}" → ${BRIDGE_ORIGIN}:`,
      JSON.stringify(message)
    );
    return "sent";
  }
  return "error";
}

/* Idempotence guards: one genuine completion/certificate per finished run.
   (A voluntary full replay constructs a new App session via restart(), which
   calls these again only after genuinely re-finishing all questions.) */
let completedSentFor: string | null = null;
let certSentFor: string | null = null;

/** Report a genuine game completion with the student's real score. */
export function reportCompleted(score: number, maxScore: number): BridgeStatus {
  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0) {
    console.warn(`[${BRIDGE_SOURCE}] Refusing invalid score`, { score, maxScore });
    return "error";
  }
  const key = `${score}/${maxScore}@${Date.now() >> 14}`; // coarse window guard
  if (completedSentFor === key) return "sent";
  const status = post({ source: BRIDGE_SOURCE, activityId: ACTIVITY_ID, type: "completed", score, maxScore });
  if (status === "sent") completedSentFor = key;
  return status;
}

/**
 * Report the certificate at the moment it is actually earned.
 * `score`/`maxScore` are the real result; the wire `score` field is sent as a
 * percentage (0–100), matching the receiver's own certificate test fixture.
 */
export function reportCertificate(score: number, maxScore: number, title?: string): BridgeStatus {
  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0) {
    console.warn(`[${BRIDGE_SOURCE}] Refusing invalid certificate score`, { score, maxScore });
    return "error";
  }
  const pct = Math.round((score / maxScore) * 100);
  const key = `${pct}@${Date.now() >> 14}`;
  if (certSentFor === key) return "sent";
  const msg: CertificateMessage = { source: BRIDGE_SOURCE, activityId: ACTIVITY_ID, type: "certificate", score: pct };
  if (title) msg.title = title;
  const status = post(msg);
  if (status === "sent") certSentFor = key;
  return status;
}

/* Startup diagnostic (console-only): makes the live build and launch context
   verifiable from DevTools during a production test. */
try {
  console.info(
    `[${BRIDGE_SOURCE} v${SENDER_VERSION}] sender ready — opener:${openerAtLoad ? "yes" : "no"}, ` +
      `embedded:${window.parent !== window ? "yes" : "no"}, target:${BRIDGE_ORIGIN}, activity:${ACTIVITY_ID}`
  );
} catch {
  /* ignore */
}
