// Lightweight synthesized sounds (Web Audio API) — no audio files, no voice.
// Every call is wrapped in try/catch so the game never breaks if audio fails.

export type Sfx =
  | 'click'
  | 'pop'
  | 'beep'
  | 'go'
  | 'launch'
  | 'whoosh'
  | 'star'
  | 'success'
  | 'error'
  | 'land'
  | 'celebrate';

interface ToneOpts {
  type?: OscillatorType;
  vol?: number;
  attack?: number;
  glide?: number;
  bus?: AudioNode;
}

const CHORDS = [
  [261.63, 329.63, 392.0, 493.88],
  [220.0, 261.63, 329.63, 392.0],
  [174.61, 220.0, 261.63, 329.63],
  [196.0, 246.94, 293.66, 392.0],
];
const TWINKLE = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private chordTimer: number | null = null;
  private twinkleTimer: number | null = null;
  private chordIdx = 0;
  private wantMusic = false;
  muted = false;

  constructor() {
    try {
      this.muted = localStorage.getItem('whsa-muted') === '1';
    } catch {
      /* ignore */
    }
  }

  unlock() {
    try {
      if (!this.ctx) {
        const w = window as unknown as {
          AudioContext?: typeof AudioContext;
          webkitAudioContext?: typeof AudioContext;
        };
        const AC = w.AudioContext || w.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.9;
        this.master.connect(this.ctx.destination);
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2400;
        this.music = this.ctx.createGain();
        this.music.gain.value = 0.6;
        this.music.connect(lp);
        lp.connect(this.master);
      }
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => undefined);
      }
    } catch {
      /* ignore */
    }
  }

  private tone(freq: number, at: number, dur: number, o: ToneOpts = {}) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(freq, at);
    if (o.glide) osc.frequency.exponentialRampToValueAtTime(o.glide, at + dur);
    const vol = o.vol ?? 0.15;
    const atk = Math.min(o.attack ?? 0.01, dur / 2);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g);
    g.connect(o.bus ?? this.master);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  }

  private noise(at: number, dur: number, from: number, to: number, vol: number, type: BiquadFilterType = 'lowpass') {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = type === 'bandpass' ? 1.2 : 0.7;
    f.frequency.setValueAtTime(from, at);
    f.frequency.exponentialRampToValueAtTime(to, at + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + Math.min(0.25, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(f);
    f.connect(g);
    g.connect(this.master);
    src.start(at);
    src.stop(at + dur + 0.05);
  }

  play(name: Sfx) {
    if (this.muted) return;
    try {
      this.unlock();
      const ctx = this.ctx;
      if (!ctx) return;
      const t = ctx.currentTime + 0.02;
      switch (name) {
        case 'click':
          this.tone(700, t, 0.09, { type: 'triangle', vol: 0.1 });
          break;
        case 'pop':
          this.tone(500, t, 0.14, { vol: 0.13, glide: 950 });
          break;
        case 'beep':
          this.tone(660, t, 0.22, { type: 'triangle', vol: 0.16 });
          break;
        case 'go':
          this.tone(990, t, 0.45, { type: 'triangle', vol: 0.17 });
          break;
        case 'launch':
          this.noise(t, 2.6, 900, 120, 0.5);
          this.tone(70, t, 2.4, { type: 'sawtooth', vol: 0.045, glide: 260, attack: 0.3 });
          break;
        case 'whoosh':
          this.noise(t, 0.9, 300, 2600, 0.22, 'bandpass');
          break;
        case 'star':
          [1318.5, 1568, 2093, 2637].forEach((f, i) => this.tone(f, t + i * 0.07, 0.35, { vol: 0.08 }));
          break;
        case 'success':
          [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
            this.tone(f, t + i * 0.09, 0.4, { type: 'triangle', vol: 0.14 }),
          );
          break;
        case 'error':
          this.tone(330, t, 0.2, { vol: 0.11 });
          this.tone(262, t + 0.16, 0.28, { vol: 0.11 });
          break;
        case 'land':
          this.tone(420, t, 0.5, { type: 'triangle', vol: 0.1, glide: 130 });
          this.noise(t + 0.4, 0.45, 500, 90, 0.28);
          break;
        case 'celebrate':
          [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((f, i) =>
            this.tone(f, t + i * 0.11, 0.35, { type: 'triangle', vol: 0.12 }),
          );
          [2093, 2637, 3136].forEach((f, i) => this.tone(f, t + 0.85 + i * 0.08, 0.4, { vol: 0.05 }));
          break;
      }
    } catch {
      /* ignore */
    }
  }

  private pad() {
    const ctx = this.ctx;
    if (!ctx || !this.music) return;
    const t = ctx.currentTime + 0.05;
    const chord = CHORDS[this.chordIdx % CHORDS.length];
    this.chordIdx++;
    const dur = 9;
    chord.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.value = f;
      osc.detune.value = i % 2 ? 4 : -4;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.026, t + 2.5);
      g.gain.setValueAtTime(0.026, t + dur - 3);
      g.gain.linearRampToValueAtTime(0, t + dur);
      osc.connect(g);
      g.connect(this.music as GainNode);
      osc.start(t);
      osc.stop(t + dur + 0.1);
    });
    const b = ctx.createOscillator();
    const bg = ctx.createGain();
    b.type = 'sine';
    b.frequency.value = chord[0] / 2;
    bg.gain.setValueAtTime(0, t);
    bg.gain.linearRampToValueAtTime(0.03, t + 2);
    bg.gain.linearRampToValueAtTime(0, t + dur);
    b.connect(bg);
    bg.connect(this.music);
    b.start(t);
    b.stop(t + dur + 0.1);
  }

  private twinkle() {
    const ctx = this.ctx;
    if (!ctx || !this.music) return;
    if (Math.random() > 0.55) return;
    const f = TWINKLE[Math.floor(Math.random() * TWINKLE.length)];
    this.tone(f, ctx.currentTime + 0.02, 1.4, { vol: 0.022, bus: this.music });
  }

  startMusic() {
    this.wantMusic = true;
    if (this.muted) return;
    try {
      this.unlock();
      if (!this.ctx || this.chordTimer !== null) return;
      this.pad();
      this.chordTimer = window.setInterval(() => {
        try {
          this.pad();
        } catch {
          /* ignore */
        }
      }, 7000);
      this.twinkleTimer = window.setInterval(() => {
        try {
          this.twinkle();
        } catch {
          /* ignore */
        }
      }, 1300);
    } catch {
      /* ignore */
    }
  }

  stopMusic() {
    if (this.chordTimer !== null) {
      clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    if (this.twinkleTimer !== null) {
      clearInterval(this.twinkleTimer);
      this.twinkleTimer = null;
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    try {
      localStorage.setItem('whsa-muted', m ? '1' : '0');
    } catch {
      /* ignore */
    }
    try {
      if (m) this.stopMusic();
      if (this.ctx && this.master) {
        const t = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(t);
        this.master.gain.setTargetAtTime(m ? 0 : 0.9, t, 0.05);
      }
      if (!m) {
        this.unlock();
        if (this.wantMusic) this.startMusic();
      }
    } catch {
      /* ignore */
    }
  }
}

export const sound = new SoundEngine();
