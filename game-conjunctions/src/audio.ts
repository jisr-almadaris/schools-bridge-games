// Magical synthesized audio – everything is generated with WebAudio (no files).
// Every call is wrapped so the game never breaks if audio is unavailable.

type SfxName =
  | "ding" | "creak" | "thump" | "key" | "buzz" | "beep" | "keyLock" | "sparkle" | "book"
  | "mirror" | "thunder" | "tick" | "elevator" | "rune" | "granted" | "success" | "finale"
  | "click" | "whoosh" | "wrong" | "gears" | "chime" | "crack" | "steps" | "drawer";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let ambStarted = false;
let muted = (() => { try { return localStorage.getItem("eh_muted") === "1"; } catch { return false; } })();
let chimeTimer: number | null = null;
let tickTimer: number | null = null;
let noiseBuf: AudioBuffer | null = null;
const listeners = new Set<(m: boolean) => void>();

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const C = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx!.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx!.destination);
      ambGain = ctx!.createGain();
      ambGain.gain.value = 0.55;
      ambGain.connect(master);
      sfxGain = ctx!.createGain();
      sfxGain.gain.value = 0.8;
      sfxGain.connect(master);
    }
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  } catch { return null; }
}

function noise(): AudioBuffer | null {
  const c = ac(); if (!c) return null;
  if (noiseBuf) return noiseBuf;
  const len = c.sampleRate * 2;
  noiseBuf = c.createBuffer(1, len, c.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}

function tone(freq: number, dur: number, opts: { type?: OscillatorType; vol?: number; delay?: number; attack?: number; to?: number; dest?: AudioNode } = {}) {
  const c = ac(); if (!c || !sfxGain) return;
  const t = c.currentTime + (opts.delay || 0);
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = opts.type || "sine";
  o.frequency.setValueAtTime(freq, t);
  if (opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
  const v = opts.vol ?? 0.2;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + (opts.attack ?? 0.01));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(opts.dest || sfxGain);
  o.start(t); o.stop(t + dur + 0.05);
}

function noiseBurst(dur: number, opts: { freq?: number; q?: number; type?: BiquadFilterType; vol?: number; delay?: number; to?: number } = {}) {
  const c = ac(); const b = noise(); if (!c || !b || !sfxGain) return;
  const t = c.currentTime + (opts.delay || 0);
  const s = c.createBufferSource(); s.buffer = b;
  const f = c.createBiquadFilter(); f.type = opts.type || "bandpass";
  f.frequency.setValueAtTime(opts.freq || 1000, t);
  if (opts.to) f.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
  f.Q.value = opts.q ?? 1;
  const g = c.createGain();
  g.gain.setValueAtTime(opts.vol ?? 0.3, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(sfxGain);
  s.start(t, Math.random()); s.stop(t + dur + 0.05);
}

function bell(freq: number, vol = 0.18, delay = 0, dur = 1.8) {
  tone(freq, dur, { vol, delay });
  tone(freq * 2.01, dur * 0.7, { vol: vol * 0.5, delay });
  tone(freq * 3.02, dur * 0.4, { vol: vol * 0.25, delay });
}

export function sfx(name: SfxName) {
  try {
    if (!ac()) return;
    switch (name) {
      case "ding": bell(1318, 0.25); bell(2637, 0.08, 0.01, 1.2); break;
      case "elevator": bell(1046, 0.22); bell(784, 0.22, 0.35); break;
      case "chime": [1568, 1976, 2349, 3136].forEach((f, i) => bell(f, 0.07, i * 0.09, 1.4)); break;
      case "creak": {
        const c = ctx!; const t = c.currentTime;
        const o = c.createOscillator(); o.type = "sawtooth";
        const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 700; f.Q.value = 8;
        const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        o.frequency.setValueAtTime(90, t);
        for (let i = 0; i < 16; i++) o.frequency.setValueAtTime(70 + Math.random() * 90, t + i * 0.1);
        o.connect(f); f.connect(g); g.connect(sfxGain!); o.start(t); o.stop(t + 1.7);
        break;
      }
      case "thump": tone(70, 0.5, { vol: 0.5, to: 40 }); noiseBurst(0.25, { freq: 200, type: "lowpass", vol: 0.4 }); break;
      case "beep": tone(880, 0.09, { type: "square", vol: 0.05 }); break;
      case "buzz": tone(110, 0.45, { type: "sawtooth", vol: 0.12 }); tone(116, 0.45, { type: "sawtooth", vol: 0.1 }); break;
      case "wrong": tone(330, 0.18, { type: "triangle", vol: 0.12 }); tone(262, 0.3, { type: "triangle", vol: 0.12, delay: 0.14 }); break;
      case "key": noiseBurst(0.08, { freq: 3000, vol: 0.2 }); tone(2200, 0.1, { type: "square", vol: 0.04, delay: 0.05 }); noiseBurst(0.1, { freq: 1500, vol: 0.25, delay: 0.18 }); break;
      case "keyLock": noiseBurst(0.06, { freq: 2500, vol: 0.3 }); tone(1800, 0.08, { type: "square", vol: 0.05, delay: 0.1 }); tone(600, 0.15, { vol: 0.15, delay: 0.12 }); break;
      case "click": noiseBurst(0.05, { freq: 3500, q: 3, vol: 0.4 }); tone(1500, 0.05, { type: "square", vol: 0.05 }); break;
      case "sparkle": [2093, 2637, 3136, 4186, 3520].forEach((f, i) => tone(f, 0.35, { vol: 0.06, delay: i * 0.06 })); break;
      case "book": noiseBurst(0.35, { freq: 2500, to: 800, vol: 0.2 }); noiseBurst(0.25, { freq: 1800, to: 600, vol: 0.15, delay: 0.25 }); break;
      case "drawer": noiseBurst(0.35, { freq: 400, to: 250, q: 2, vol: 0.35 }); tone(180, 0.1, { vol: 0.1, delay: 0.3 }); break;
      case "mirror": [880, 1109, 1319, 1661].forEach((f, i) => { tone(f, 1.6, { vol: 0.05, delay: i * 0.12, attack: 0.3 }); tone(f * 1.005, 1.6, { vol: 0.04, delay: i * 0.12, attack: 0.3 }); }); break;
      case "thunder": noiseBurst(2.2, { freq: 400, to: 60, type: "lowpass", vol: 0.55 }); noiseBurst(0.3, { freq: 2000, vol: 0.2 }); break;
      case "tick": noiseBurst(0.03, { freq: 4000, q: 6, vol: 0.35 }); break;
      case "steps": [0, 0.45, 0.9, 1.35].forEach((d) => { tone(90, 0.12, { vol: 0.2, delay: d, to: 60 }); noiseBurst(0.06, { freq: 600, vol: 0.08, delay: d }); }); break;
      case "rune": tone(220, 1.2, { vol: 0.1, to: 880, attack: 0.2 }); tone(330, 1.2, { vol: 0.08, to: 1320, attack: 0.2 }); bell(1760, 0.08, 0.9); break;
      case "granted": [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.4, { type: "triangle", vol: 0.12, delay: i * 0.1 })); break;
      case "success": [784, 988, 1175, 1568].forEach((f, i) => bell(f, 0.09, i * 0.08, 1)); break;
      case "finale": [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => { tone(f, 0.6, { type: "triangle", vol: 0.1, delay: i * 0.16 }); bell(f * 2, 0.04, i * 0.16, 1); }); break;
      case "whoosh": noiseBurst(0.6, { freq: 300, to: 3000, vol: 0.25 }); break;
      case "gears": for (let i = 0; i < 8; i++) noiseBurst(0.04, { freq: 1200 + (i % 2) * 600, q: 5, vol: 0.25, delay: i * 0.12 }); break;
      case "crack": for (let i = 0; i < 5; i++) noiseBurst(0.05, { freq: 5000 - i * 500, q: 2, vol: 0.3, delay: i * 0.05 }); bell(2637, 0.05, 0.2); break;
    }
  } catch { /* ignore */ }
}

// ---------- ambience ----------
export function startAmbience() {
  try {
    const c = ac(); if (!c || !ambGain || ambStarted) return;
    ambStarted = true;
    // pad
    const padFilter = c.createBiquadFilter(); padFilter.type = "lowpass"; padFilter.frequency.value = 900;
    const padGain = c.createGain(); padGain.gain.value = 0.05;
    padFilter.connect(padGain); padGain.connect(ambGain);
    [146.8, 220, 277.2, 293.7].forEach((f, i) => {
      const o = c.createOscillator(); o.type = i % 2 ? "triangle" : "sine"; o.frequency.value = f;
      const lfo = c.createOscillator(); lfo.frequency.value = 0.07 + i * 0.03;
      const lg = c.createGain(); lg.gain.value = 1.8; lfo.connect(lg); lg.connect(o.frequency);
      o.connect(padFilter); o.start(); lfo.start();
    });
    // wind
    const b = noise();
    if (b) {
      const s = c.createBufferSource(); s.buffer = b; s.loop = true;
      const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 500; f.Q.value = 0.8;
      const lfo = c.createOscillator(); lfo.frequency.value = 0.09;
      const lg = c.createGain(); lg.gain.value = 250; lfo.connect(lg); lg.connect(f.frequency);
      const g = c.createGain(); g.gain.value = 0.035;
      s.connect(f); f.connect(g); g.connect(ambGain); s.start(); lfo.start();
    }
    // clock ticks
    tickTimer = window.setInterval(() => {
      if (!ctx || !ambGain) return;
      try {
        const t = ctx.currentTime; const bb = noise(); if (!bb) return;
        const s = ctx.createBufferSource(); s.buffer = bb;
        const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 3200; f.Q.value = 8;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
        s.connect(f); f.connect(g); g.connect(ambGain); s.start(t, Math.random()); s.stop(t + 0.05);
      } catch { /* */ }
    }, 1000);
    // distant chimes & tiny bells
    const scale = [1175, 1319, 1568, 1760, 2093, 2349];
    const chime = () => {
      try {
        if (ctx && ambGain) {
          const n = 2 + Math.floor(Math.random() * 3);
          for (let i = 0; i < n; i++) {
            const f = scale[Math.floor(Math.random() * scale.length)];
            tone(f, 2.2, { vol: 0.035, delay: i * 0.22, dest: ambGain });
            tone(f * 2, 1.2, { vol: 0.012, delay: i * 0.22, dest: ambGain });
          }
        }
      } catch { /* */ }
      chimeTimer = window.setTimeout(chime, 5000 + Math.random() * 6000);
    };
    chimeTimer = window.setTimeout(chime, 2500);
  } catch { /* ignore */ }
}

export function stopAmbience() {
  if (chimeTimer) clearTimeout(chimeTimer);
  if (tickTimer) clearInterval(tickTimer);
}

function duck(on: boolean) {
  try {
    if (!ctx || !ambGain) return;
    const t = ctx.currentTime;
    ambGain.gain.cancelScheduledValues(t);
    ambGain.gain.setTargetAtTime(on ? 0.12 : 0.55, t, 0.25);
  } catch { /* */ }
}

// ---------- hotel voice ----------
let chosenVoice: SpeechSynthesisVoice | null | undefined;
function pickVoice(): SpeechSynthesisVoice | null {
  try {
    if (!("speechSynthesis" in window)) return null;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return null;
    const en = voices.filter((v) => /^en[-_]/i.test(v.lang));
    // only accept high-quality / natural voices – otherwise we fall back to a chime
    const good = /natural|neural|online|premium|enhanced|google (uk|us) english|samantha|daniel|serena|karen|moira|aria|jenny|guy|libby|sonia|ryan/i;
    const best = en.find((v) => /natural|neural|online|premium|enhanced/i.test(v.name)) || en.find((v) => good.test(v.name));
    return best || null;
  } catch { return null; }
}
try { if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => { chosenVoice = pickVoice(); }; } catch { /* */ }

export function hotelVoice(text: string) {
  sfx("chime");
  if (muted) return;
  try {
    if (chosenVoice === undefined) chosenVoice = pickVoice();
    if (!chosenVoice) return; // chime + subtitle only
    const u = new SpeechSynthesisUtterance(text);
    u.voice = chosenVoice; u.lang = chosenVoice.lang; u.rate = 0.86; u.pitch = 0.92; u.volume = 1;
    u.onstart = () => duck(true);
    u.onend = () => duck(false);
    u.onerror = () => duck(false);
    window.setTimeout(() => { try { speechSynthesis.speak(u); } catch { duck(false); } }, 600);
  } catch { duck(false); }
}

export function isMuted() { return muted; }
export function setMuted(m: boolean) {
  muted = m;
  try { localStorage.setItem("eh_muted", m ? "1" : "0"); } catch { /* */ }
  try { if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.05); } catch { /* */ }
  try { if (m && "speechSynthesis" in window) speechSynthesis.cancel(); } catch { /* */ }
  listeners.forEach((l) => l(m));
}
export function onMute(l: (m: boolean) => void) { listeners.add(l); return () => { listeners.delete(l); }; }
export function unlockAudio() { ac(); startAmbience(); }
