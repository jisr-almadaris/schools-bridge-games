// Lightweight Web Audio engine: synthesized SFX + soft carnival music + narrator.
// Everything is wrapped in try/catch so the game never breaks if audio fails.

type Ctx = AudioContext;
let ctx: Ctx | null = null;
let master: GainNode | null = null;
let sfxGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let muted = false;
let musicOn = false;
let musicTimer: number | null = null;
let nextNoteTime = 0;
let step = 0;

try {
  muted = localStorage.getItem("gi-park-muted") === "1";
} catch {
  /* ignore */
}

const listeners = new Set<(m: boolean) => void>();
export function onMuteChange(fn: (m: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
export function isMuted() {
  return muted;
}

export function initAudio() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.55;
      sfxGain.connect(master);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.16;
      musicGain.connect(master);
      ambGain = ctx.createGain();
      ambGain.gain.value = 0.9;
      ambGain.connect(master);
    }
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    ctx = null;
  }
}

export function setMuted(m: boolean) {
  muted = m;
  try {
    localStorage.setItem("gi-park-muted", m ? "1" : "0");
  } catch {
    /* ignore */
  }
  try {
    if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.05);
    if (m && "speechSynthesis" in window) window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(m));
}

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.2, dest?: GainNode | null, slideTo?: number) {
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g);
    g.connect(dest || sfxGain!);
    o.start(start);
    o.stop(start + dur + 0.05);
  } catch {
    /* ignore */
  }
}

function noise(start: number, dur: number, freq: number, vol = 0.3, q = 1, sweepTo?: number, type: BiquadFilterType = "bandpass", dest?: GainNode | null) {
  if (!ctx) return;
  try {
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(freq, start);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, start + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(f);
    f.connect(g);
    g.connect(dest || sfxGain!);
    src.start(start);
    src.stop(start + dur + 0.05);
  } catch {
    /* ignore */
  }
}

function run(fn: (t: number) => void) {
  try {
    initAudio();
    if (!ctx || muted) return;
    fn(ctx.currentTime + 0.01);
  } catch {
    /* ignore */
  }
}

export const sfx = {
  click: () => run((t) => tone(880, t, 0.07, "triangle", 0.12)),
  count: () => run((t) => tone(660, t, 0.18, "square", 0.07)),
  go: () =>
    run((t) => {
      tone(990, t, 0.45, "square", 0.07);
      tone(1320, t, 0.45, "triangle", 0.06);
    }),
  clunk: () =>
    run((t) => {
      tone(150, t, 0.12, "square", 0.12, null, 70);
      noise(t, 0.08, 1400, 0.2, 1);
    }),
  clap: () =>
    run((t) => {
      for (let i = 0; i < 6; i++) noise(t + i * 0.13 + Math.random() * 0.02, 0.05, 1500 + Math.random() * 600, 0.3, 0.8);
    }),
  curtain: () => run((t) => noise(t, 1.4, 400, 0.16, 0.5, 1800)),
  projector: () =>
    run((t) => {
      for (let i = 0; i < 26; i++) tone(2300, t + i * 0.06, 0.015, "square", 0.018);
    }),
  powerDown: () =>
    run((t) => {
      tone(420, t, 1.1, "sawtooth", 0.09, null, 40);
      noise(t, 1, 700, 0.14, 0.5, 80, "lowpass");
    }),
  powerUp: () =>
    run((t) => {
      tone(55, t, 0.5, "sine", 0.4, null, 110);
      noise(t, 0.25, 300, 0.4, 0.5);
      [60, 64, 67, 72, 76, 79, 84].forEach((n, i) => tone(mtof(n), t + 0.2 + i * 0.06, 0.7, "triangle", 0.1));
    }),
  creak: () =>
    run((t) => {
      for (let i = 0; i < 6; i++) tone(90 + (i % 2) * 25, t + i * 0.22, 0.09, "square", 0.035);
    }),
  key: () => run((t) => tone(1200, t, 0.08, "square", 0.06)),
  denied: () =>
    run((t) => {
      tone(180, t, 0.22, "sawtooth", 0.12);
      tone(140, t + 0.22, 0.3, "sawtooth", 0.12);
    }),
  granted: () =>
    run((t) => {
      [72, 76, 79, 84].forEach((n, i) => tone(mtof(n), t + i * 0.09, 0.3, "triangle", 0.16));
      tone(mtof(88), t + 0.36, 0.6, "sine", 0.12);
    }),
  gate: () =>
    run((t) => {
      noise(t, 2.2, 120, 0.25, 0.7, 400, "lowpass");
      for (let i = 0; i < 10; i++) tone(90 + (i % 2) * 20, t + i * 0.18, 0.08, "square", 0.05);
      [60, 67, 72, 79].forEach((n, i) => tone(mtof(n), t + 1.2 + i * 0.15, 0.8, "sine", 0.1));
    }),
  whoosh: () =>
    run((t) => {
      noise(t, 1.2, 300, 0.4, 0.8, 3000);
      tone(200, t, 1.1, "sawtooth", 0.03, null, 60);
    }),
  wheel: () =>
    run((t) => {
      for (let i = 0; i < 22; i++) {
        const dt = 0.05 + i * i * 0.0028;
        tone(1500, t + i * 0.06 + dt * i * 0.3, 0.03, "square", 0.05);
      }
    }),
  pop: () =>
    run((t) => {
      noise(t, 0.12, 1800, 0.6, 0.6);
      tone(600, t, 0.08, "triangle", 0.15, null, 120);
    }),
  stamp: () =>
    run((t) => {
      tone(110, t, 0.25, "sine", 0.4, null, 50);
      noise(t, 0.12, 500, 0.4, 0.5);
    }),
  success: () =>
    run((t) => {
      [76, 79, 84].forEach((n, i) => tone(mtof(n), t + i * 0.08, 0.35, "triangle", 0.16));
      tone(mtof(91), t + 0.26, 0.5, "sine", 0.08);
    }),
  retry: () =>
    run((t) => {
      tone(mtof(69), t, 0.18, "sine", 0.14);
      tone(mtof(65), t + 0.16, 0.26, "sine", 0.12);
    }),
  secret: () =>
    run((t) => {
      [84, 88, 91, 96, 91, 96].forEach((n, i) => tone(mtof(n), t + i * 0.07, 0.4, "sine", 0.08));
    }),
  chime: () =>
    run((t) => {
      [79, 84, 88].forEach((n, i) => tone(mtof(n), t + i * 0.12, 0.9, "sine", 0.12));
    }),
  firework: () =>
    run((t) => {
      tone(300, t, 0.5, "sine", 0.05, null, 1400);
      noise(t + 0.5, 0.8, 900, 0.5, 0.4, 200);
      for (let i = 0; i < 8; i++) noise(t + 0.6 + Math.random() * 0.6, 0.05, 4000, 0.15, 1);
    }),
  fanfare: () =>
    run((t) => {
      const seq: [number, number, number][] = [
        [67, 0, 0.18],
        [72, 0.18, 0.18],
        [76, 0.36, 0.18],
        [79, 0.54, 0.4],
        [76, 0.94, 0.18],
        [79, 1.12, 0.8],
      ];
      seq.forEach(([n, s, d]) => {
        tone(mtof(n), t + s, d + 0.1, "sawtooth", 0.06);
        tone(mtof(n + 12), t + s, d + 0.1, "triangle", 0.08);
      });
      tone(mtof(48), t + 1.12, 1, "triangle", 0.12);
    }),
};

// ---------------- Carnival night music (soft music-box waltz) ----------------
const chords = [
  [48, 64, 67],
  [43, 62, 67],
  [45, 64, 69],
  [41, 65, 69],
  [48, 64, 67],
  [43, 62, 65],
  [41, 65, 69],
  [43, 62, 67],
];
const melody = [
  [72, 76, 79],
  [83, 81, 79],
  [81, 76, 72],
  [77, 76, 74],
  [76, 79, 84],
  [83, 79, 74],
  [77, 81, 79],
  [74, 71, 0],
];
const beat = 0.34;

function scheduler() {
  if (!ctx || !musicGain) return;
  while (nextNoteTime < ctx.currentTime + 0.3) {
    const bar = Math.floor(step / 3) % 8;
    const b = step % 3;
    const ch = chords[bar];
    if (b === 0) tone(mtof(ch[0]), nextNoteTime, beat * 1.4, "triangle", 0.22, musicGain);
    else {
      tone(mtof(ch[1]), nextNoteTime, beat * 0.6, "sine", 0.08, musicGain);
      tone(mtof(ch[2]), nextNoteTime, beat * 0.6, "sine", 0.08, musicGain);
    }
    const m = melody[bar][b];
    if (m) {
      tone(mtof(m), nextNoteTime, beat * 1.3, "triangle", 0.12, musicGain);
      tone(mtof(m + 12), nextNoteTime, beat * 0.9, "sine", 0.03, musicGain);
    }
    nextNoteTime += beat;
    step++;
  }
}

export function startMusic() {
  try {
    initAudio();
    if (!ctx || musicOn) return;
    musicOn = true;
    nextNoteTime = ctx.currentTime + 0.1;
    musicTimer = window.setInterval(scheduler, 90);
    startAmbience();
  } catch {
    /* ignore */
  }
}
export function stopMusic() {
  musicOn = false;
  if (musicTimer) window.clearInterval(musicTimer);
  musicTimer = null;
}
let ducked = false;
function duck(on: boolean) {
  ducked = on;
  try {
    if (musicGain && ctx) musicGain.gain.setTargetAtTime(on ? 0.04 : 0.16, ctx.currentTime, 0.2);
    if (ambGain && ctx) ambGain.gain.setTargetAtTime((on ? 0.25 : 0.9) * ambLevel, ctx.currentTime, 0.2);
  } catch {
    /* ignore */
  }
}

// ---------------- Park ambience (distant crowd + rides) ----------------
let ambGain: GainNode | null = null;
let ambOn = false;
let ambLevel = 1;

function startAmbience() {
  if (!ctx || !ambGain || ambOn) return;
  ambOn = true;
  try {
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 650;
    bp.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.value = 0.045;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.11;
    const lg = ctx.createGain();
    lg.gain.value = 0.02;
    lfo.connect(lg);
    lg.connect(g.gain);
    lfo.start();
    src.connect(bp);
    bp.connect(g);
    g.connect(ambGain);
    src.start();
  } catch {
    /* ignore */
  }
  const tick = () => {
    ambientEvent();
    window.setTimeout(tick, 7000 + Math.random() * 9000);
  };
  window.setTimeout(tick, 4000);
}

function ambientEvent() {
  if (!ctx || muted || !ambGain) return;
  try {
    const t = ctx.currentTime + 0.05;
    const r = Math.random();
    if (r < 0.3) {
      // distant roller coaster passing
      noise(t, 2.4, 220, 0.1, 0.7, 1000, "bandpass", ambGain);
      noise(t + 0.9, 1.2, 1800, 0.025, 1.5, 2600, "bandpass", ambGain);
    } else if (r < 0.55) {
      // game booth bells
      tone(mtof(88), t, 0.5, "sine", 0.03, ambGain);
      tone(mtof(91), t + 0.15, 0.6, "sine", 0.03, ambGain);
      tone(mtof(96), t + 0.3, 0.7, "sine", 0.02, ambGain);
    } else if (r < 0.8) {
      // ferris wheel mechanics
      for (let i = 0; i < 4; i++) tone(70 + i * 3, t + i * 0.35, 0.12, "square", 0.014, ambGain);
    } else {
      // distant crowd cheer
      noise(t, 1.8, 1000, 0.06, 0.8, 1300, "bandpass", ambGain);
    }
  } catch {
    /* ignore */
  }
}

/** 1 = normal park, lower for the cinema. */
export function setAmbience(level: number) {
  ambLevel = level;
  try {
    if (ambGain && ctx) ambGain.gain.setTargetAtTime((ducked ? 0.25 : 0.9) * level, ctx.currentTime, 0.4);
    if (musicGain && ctx && !ducked) musicGain.gain.setTargetAtTime(0.16 * Math.max(0.35, level), ctx.currentTime, 0.4);
  } catch {
    /* ignore */
  }
}

// ---------------- Narrator ----------------
// Only uses a high-quality natural voice. If none exists, we play a chime
// and the caption on screen carries the message (no robotic TTS).
let goodVoice: SpeechSynthesisVoice | null = null;
const GOOD = /(natural|neural|online|premium|enhanced|google us english|google uk english female|samantha|ava|allison|serena|aria|jenny|libby|sonia|zira)/i;

function pickVoice() {
  try {
    if (!("speechSynthesis" in window)) return;
    const vs = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
    const ranked = vs
      .filter((v) => GOOD.test(v.name))
      .sort((a, b) => score(b) - score(a));
    goodVoice = ranked[0] || null;
  } catch {
    goodVoice = null;
  }
}
function score(v: SpeechSynthesisVoice) {
  let s = 0;
  if (/natural|neural/i.test(v.name)) s += 10;
  if (/online|premium|enhanced/i.test(v.name)) s += 6;
  if (/google/i.test(v.name)) s += 4;
  if (/female|aria|jenny|ava|samantha|allison|serena|libby|sonia/i.test(v.name)) s += 2;
  if (v.lang === "en-US") s += 1;
  return s;
}
try {
  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }
} catch {
  /* ignore */
}

const capListeners = new Set<(l: string[] | null) => void>();
export function onCaption(fn: (l: string[] | null) => void) {
  capListeners.add(fn);
  return () => {
    capListeners.delete(fn);
  };
}
/** Narrator line + on-screen caption. Always shows text; speaks only with a natural voice. */
export async function announce(lines: string[], minMs = 2600) {
  capListeners.forEach((f) => f(lines));
  await Promise.all([narrate(lines), new Promise((r) => window.setTimeout(r, minMs))]);
  capListeners.forEach((f) => f(null));
}

export function narrate(lines: string[]): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (muted) return resolve();
      pickVoice();
      if (!goodVoice || !("speechSynthesis" in window)) {
        sfx.chime();
        return window.setTimeout(resolve, 1200);
      }
      const synth = window.speechSynthesis;
      synth.cancel();
      duck(true);
      let i = 0;
      const safety = window.setTimeout(() => {
        duck(false);
        resolve();
      }, 12000);
      const next = () => {
        if (i >= lines.length) {
          window.clearTimeout(safety);
          duck(false);
          return resolve();
        }
        const u = new SpeechSynthesisUtterance(lines[i++]);
        u.voice = goodVoice;
        u.lang = goodVoice!.lang;
        u.rate = 0.95;
        u.pitch = 1.05;
        u.volume = 1;
        u.onend = () => window.setTimeout(next, 250);
        u.onerror = () => {
          window.clearTimeout(safety);
          duck(false);
          resolve();
        };
        synth.speak(u);
      };
      next();
    } catch {
      duck(false);
      resolve();
    }
  });
}
