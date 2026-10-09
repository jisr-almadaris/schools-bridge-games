// Gentle synthesized sounds via Web Audio API + natural TTS via speechSynthesis.
// Everything is wrapped in try/catch so audio failures never break the game.

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(m: boolean) {
  muted = m;
  if (m) {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
  }
}
export function isMuted() {
  return muted;
}

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

type OscType = OscillatorType;

function tone(
  freq: number,
  start: number,
  dur: number,
  opts: { type?: OscType; vol?: number; slideTo?: number; attack?: number } = {},
) {
  const c = getCtx();
  if (!c || muted) return;
  try {
    const { type = "sine", vol = 0.18, slideTo, attack = 0.01 } = opts;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    const t0 = c.currentTime + start;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  } catch {
    /* ignore */
  }
}

function noise(start: number, dur: number, vol = 0.08, filterFreq = 800) {
  const c = getCtx();
  if (!c || muted) return;
  try {
    const buffer = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = filterFreq;
    const g = c.createGain();
    const t0 = c.currentTime + start;
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t0);
  } catch {
    /* ignore */
  }
}

export const sfx = {
  click() {
    tone(660, 0, 0.08, { type: "triangle", vol: 0.08 });
  },
  tick() {
    tone(1200, 0, 0.04, { type: "square", vol: 0.04 });
  },
  clockBack() {
    for (let i = 0; i < 8; i++) tone(900 + i * 60, i * 0.22, 0.05, { type: "square", vol: 0.04 });
    tone(300, 0, 1.8, { type: "sine", vol: 0.05, slideTo: 90 });
  },
  door() {
    noise(0, 1.4, 0.06, 500);
    tone(120, 0, 1.4, { type: "sawtooth", vol: 0.03, slideTo: 60 });
    tone(523, 1.2, 0.5, { type: "sine", vol: 0.08 });
    tone(784, 1.35, 0.6, { type: "sine", vol: 0.08 });
  },
  timeTravel() {
    tone(220, 0, 0.9, { type: "sine", vol: 0.12, slideTo: 880 });
    tone(330, 0.1, 0.9, { type: "triangle", vol: 0.06, slideTo: 1320 });
    noise(0.2, 0.7, 0.03, 2000);
  },
  machine() {
    for (let i = 0; i < 10; i++) tone(140 + (i % 3) * 30, i * 0.1, 0.09, { type: "square", vol: 0.035 });
    tone(440, 1.0, 0.25, { type: "sine", vol: 0.1 });
    tone(660, 1.15, 0.25, { type: "sine", vol: 0.1 });
    tone(990, 1.3, 0.5, { type: "sine", vol: 0.12 });
  },
  success() {
    tone(523, 0, 0.18, { type: "triangle", vol: 0.14 });
    tone(659, 0.14, 0.18, { type: "triangle", vol: 0.14 });
    tone(784, 0.28, 0.32, { type: "triangle", vol: 0.16 });
    tone(1047, 0.42, 0.5, { type: "sine", vol: 0.12 });
  },
  wrong() {
    tone(380, 0, 0.18, { type: "sine", vol: 0.1 });
    tone(300, 0.18, 0.28, { type: "sine", vol: 0.1 });
  },
  album() {
    noise(0, 0.25, 0.05, 3000);
    tone(880, 0.05, 0.2, { type: "sine", vol: 0.06 });
    tone(1175, 0.15, 0.3, { type: "sine", vol: 0.06 });
  },
  sparkle() {
    tone(1568, 0, 0.12, { type: "sine", vol: 0.07 });
    tone(2093, 0.08, 0.2, { type: "sine", vol: 0.06 });
  },
  celebrate() {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((n, i) => tone(n, i * 0.13, 0.3, { type: "triangle", vol: 0.13 }));
    tone(1568, 0.95, 0.9, { type: "sine", vol: 0.1 });
  },
};

// ----- Speech (natural, slow, clear) -----
let voicesCache: SpeechSynthesisVoice[] = [];
function loadVoices() {
  try {
    voicesCache = window.speechSynthesis?.getVoices() || [];
  } catch {
    voicesCache = [];
  }
}
try {
  loadVoices();
  window.speechSynthesis?.addEventListener?.("voiceschanged", loadVoices);
} catch {
  /* ignore */
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  if (!voicesCache.length) loadVoices();
  const en = voicesCache.filter((v) => /^en(-|_)/i.test(v.lang));
  const preferred = [
    /Google US English/i,
    /Samantha/i,
    /Microsoft (Aria|Jenny|Zira)/i,
    /Karen/i,
    /Moira/i,
    /female/i,
  ];
  for (const re of preferred) {
    const v = en.find((x) => re.test(x.name));
    if (v) return v;
  }
  return en.find((v) => v.lang === "en-US") || en[0];
}

export function speak(text: string) {
  if (muted) return;
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.82;
    u.pitch = 1.05;
    u.volume = 1;
    const v = pickVoice();
    if (v) u.voice = v;
    synth.speak(u);
  } catch {
    /* ignore */
  }
}

export function unlockAudio() {
  getCtx();
}
