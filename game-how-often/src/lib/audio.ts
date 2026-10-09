// Tiny WebAudio synth for machine SFX + light background music. No external files.
let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicNodes: { osc: OscillatorNode[]; gain: GainNode | null } = { osc: [], gain: null };
let musicOn = false;
let muted = false;

function ensureCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.9;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch { return null; }
}

export function setMuted(m: boolean) {
  muted = m;
  if (masterGain && ctx) masterGain.gain.value = m ? 0 : 0.9;
  if (m) stopMusic(); 
}
export function isMuted() { return muted; }

function tone(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.18, slideTo?: number, delay = 0) {
  if (muted) return;
  const c = ensureCtx(); if (!c || !masterGain) return;
  try {
    const t = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + dur + 0.05);
  } catch {}
}

function noise(dur: number, vol = 0.2, delay = 0, filterFreq = 1200) {
  if (muted) return;
  const c = ensureCtx(); if (!c || !masterGain) return;
  try {
    const t = c.currentTime + delay;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = filterFreq; f.Q.value = 0.8;
    const g = c.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(masterGain);
    src.start(t);
  } catch {}
}

export const sfx = {
  unlock() { ensureCtx(); },
  click() { tone(880, 0.08, 'square', 0.12); tone(1320, 0.06, 'square', 0.08, undefined, 0.03); },
  clank() { noise(0.18, 0.35, 0, 700); tone(180, 0.22, 'square', 0.22, 90); tone(520, 0.1, 'triangle', 0.14, 260, 0.02); },
  whirr() { tone(120, 0.9, 'sawtooth', 0.12, 520); noise(0.9, 0.08, 0, 2000); tone(240, 0.9, 'triangle', 0.08, 880, 0.05); },
  zap() { tone(1400, 0.28, 'sawtooth', 0.16, 120); noise(0.2, 0.18, 0, 4000); },
  steam() { noise(0.7, 0.22, 0, 3000); },
  beep() { tone(660, 0.12, 'sine', 0.2); tone(990, 0.14, 'sine', 0.2, undefined, 0.13); },
  beepBad() { tone(220, 0.2, 'sawtooth', 0.16); tone(160, 0.25, 'sawtooth', 0.16, undefined, 0.16); },
  gear() { noise(0.35, 0.16, 0, 500); tone(90, 0.35, 'square', 0.1, 140); },
  tube() { tone(300, 0.5, 'sine', 0.14, 900); tone(600, 0.4, 'sine', 0.1, 1400, 0.1); },
  lock() { tone(140, 0.12, 'square', 0.22); tone(110, 0.16, 'square', 0.22, undefined, 0.12); noise(0.1, 0.2, 0.05, 600); },
  alarm() { for (let i = 0; i < 2; i++) { tone(520, 0.18, 'square', 0.14, undefined, i * 0.28); tone(390, 0.18, 'square', 0.14, undefined, i * 0.28 + 0.14); } },
  powerup() {
    const seq = [262, 330, 392, 523, 659, 784, 1046];
    seq.forEach((f, i) => tone(f, 0.16, 'square', 0.14, undefined, i * 0.09));
    noise(0.6, 0.1, 0.2, 5000);
  },
  success() { tone(523, 0.14, 'triangle', 0.2); tone(659, 0.14, 'triangle', 0.2, undefined, 0.12); tone(784, 0.22, 'triangle', 0.22, undefined, 0.24); },
  pop() { tone(500, 0.09, 'sine', 0.18, 900); },
  error() { tone(200, 0.3, 'sawtooth', 0.16, 120); noise(0.25, 0.14, 0, 400); },
  keypad() { tone(700 + Math.random() * 300, 0.07, 'square', 0.12); },
  core() { tone(80, 1.2, 'sawtooth', 0.16, 320); tone(160, 1.2, 'sine', 0.14, 640, 0.1); noise(1.0, 0.08, 0.1, 1500); },
  cheer() { [523,587,659,784,880,1046].forEach((f,i)=>tone(f,0.18,'triangle',0.16,undefined,i*0.1)); },
};

export function startMusic(intense = false) {
  if (muted) return;
  const c = ensureCtx(); if (!c || !masterGain) return;
  stopMusic();
  try {
    musicOn = true;
    const g = c.createGain(); g.gain.value = intense ? 0.055 : 0.035; g.connect(masterGain);
    musicNodes.gain = g;
    const bassNotes = intense ? [110, 110, 130.8, 98] : [110, 130.8, 98, 110];
    const arpNotes = intense ? [220, 277, 330, 440, 330, 277] : [220, 262, 330, 262];
    let step = 0;
    const playStep = () => {
      if (!musicOn || muted) return;
      const t = c.currentTime;
      const mk = (freq: number, dur: number, type: OscillatorType, vol: number) => {
        const o = c.createOscillator(); const og = c.createGain();
        o.type = type; o.frequency.value = freq;
        og.gain.setValueAtTime(0.0001, t);
        og.gain.exponentialRampToValueAtTime(vol, t + 0.03);
        og.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(og); og.connect(g);
        o.start(t); o.stop(t + dur + 0.05);
        musicNodes.osc.push(o);
      };
      const bn = bassNotes[step % bassNotes.length];
      mk(bn, 0.42, 'triangle', 0.5);
      mk(arpNotes[step % arpNotes.length] * 2, 0.2, 'sine', 0.28);
      if (intense && step % 2 === 0) mk(bn * 2, 0.15, 'square', 0.12);
      step++;
      (musicNodes as any)._timer = window.setTimeout(playStep, intense ? 300 : 460);
    };
    playStep();
  } catch {}
}
export function stopMusic() {
  musicOn = false;
  try {
    if ((musicNodes as any)._timer) clearTimeout((musicNodes as any)._timer);
    musicNodes.osc.forEach(o => { try { o.stop(); } catch {} });
    musicNodes.osc = [];
    if (musicNodes.gain) { try { musicNodes.gain.disconnect(); } catch {} musicNodes.gain = null; }
  } catch {}
}
