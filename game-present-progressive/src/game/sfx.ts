/* Synthesised ocean sound engine (Web Audio API) — no files, no voices.
   Every public method is fail-safe: if audio is unavailable the game keeps working. */

type ToneOpts = {
  type?: OscillatorType;
  vol?: number;
  attack?: number;
  slideTo?: number;
  reverb?: number;
  bus?: GainNode | null;
};

type NoiseOpts = {
  type?: BiquadFilterType;
  freq?: number;
  freqTo?: number;
  q?: number;
  vol?: number;
  attack?: number;
  reverb?: number;
  bus?: GainNode | null;
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private ambBus: GainNode | null = null;
  private reverbIn: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private ambientOn = false;
  private bubbleTimer: number | null = null;
  private listeners = new Set<(m: boolean) => void>();
  muted = false;

  init() {
    try {
      if (!this.ctx) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        const ctx = new Ctor();
        const master = ctx.createGain();
        master.gain.value = this.muted ? 0 : 0.9;
        master.connect(ctx.destination);

        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -16;
        comp.knee.value = 18;
        comp.ratio.value = 4;
        comp.connect(master);

        const sfxBus = ctx.createGain();
        sfxBus.gain.value = 0.85;
        sfxBus.connect(comp);

        const ambBus = ctx.createGain();
        ambBus.gain.value = 0;
        ambBus.connect(comp);

        this.ctx = ctx;
        this.master = master;
        this.sfxBus = sfxBus;
        this.ambBus = ambBus;

        const conv = ctx.createConvolver();
        conv.buffer = this.makeImpulse(2.4, 3.2);
        const rin = ctx.createGain();
        rin.gain.value = 0.35;
        rin.connect(conv);
        conv.connect(comp);
        this.reverbIn = rin;

        this.noiseBuf = this.makeNoise(3, false);
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  onMuteChange(fn: (m: boolean) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  setMuted(m: boolean) {
    this.muted = m;
    try {
      if (this.ctx && this.master) {
        this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.06);
        if (!m && this.ctx.state === "suspended") void this.ctx.resume();
      }
    } catch {
      /* ignore */
    }
    this.listeners.forEach((l) => l(m));
  }

  toggle() {
    this.setMuted(!this.muted);
  }

  private makeNoise(sec: number, brown: boolean) {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.2;
      } else {
        d[i] = w;
      }
    }
    // cross-fade the tail into the head so loops are seamless
    const n = Math.min(4000, Math.floor(len / 4));
    for (let i = 0; i < n; i++) {
      const k = i / n;
      d[len - n + i] = d[len - n + i] * (1 - k) + d[i] * k;
    }
    return buf;
  }

  private makeImpulse(sec: number, decay: number) {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  /** Calm sea: slow swelling filtered noise + deep hum + random soft bubbles. */
  startAmbient() {
    if (!this.ctx || this.ambientOn || !this.ambBus) return;
    try {
      const ctx = this.ctx;
      this.ambientOn = true;
      const brown = this.makeNoise(8, true);

      const src = ctx.createBufferSource();
      src.buffer = brown;
      src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 480;
      lp.Q.value = 0.6;
      const g = ctx.createGain();
      g.gain.value = 0.16;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.085;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 0.1;
      lfo.connect(lfoG);
      lfoG.connect(g.gain);
      const lfo2 = ctx.createOscillator();
      lfo2.frequency.value = 0.05;
      const lfo2G = ctx.createGain();
      lfo2G.gain.value = 200;
      lfo2.connect(lfo2G);
      lfo2G.connect(lp.frequency);
      src.connect(lp);
      lp.connect(g);
      g.connect(this.ambBus);

      const src2 = ctx.createBufferSource();
      src2.buffer = brown;
      src2.loop = true;
      src2.playbackRate.value = 0.6;
      const lp2 = ctx.createBiquadFilter();
      lp2.type = "lowpass";
      lp2.frequency.value = 150;
      const g2 = ctx.createGain();
      g2.gain.value = 0.26;
      src2.connect(lp2);
      lp2.connect(g2);
      g2.connect(this.ambBus);

      const t = ctx.currentTime;
      this.ambBus.gain.setValueAtTime(0, t);
      this.ambBus.gain.linearRampToValueAtTime(0.9, t + 3);
      src.start();
      src2.start();
      lfo.start();
      lfo2.start();
      this.scheduleBubbles();
    } catch {
      /* ignore */
    }
  }

  private scheduleBubbles() {
    const tick = () => {
      if (!this.muted) {
        const n = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < n; i++) {
          window.setTimeout(() => this.bubble(0.03 + Math.random() * 0.03, true), i * (90 + Math.random() * 140));
        }
      }
      this.bubbleTimer = window.setTimeout(tick, 1800 + Math.random() * 3400);
    };
    if (this.bubbleTimer) window.clearTimeout(this.bubbleTimer);
    this.bubbleTimer = window.setTimeout(tick, 1500);
  }

  private tone(freq: number, start: number, dur: number, o: ToneOpts = {}) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = o.type ?? "sine";
    osc.frequency.setValueAtTime(freq, start);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, start + dur);
    const g = ctx.createGain();
    const vol = o.vol ?? 0.2;
    const a = o.attack ?? 0.01;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + a);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(o.bus ?? this.sfxBus!);
    if (o.reverb && this.reverbIn) {
      const s = ctx.createGain();
      s.gain.value = o.reverb;
      g.connect(s);
      s.connect(this.reverbIn);
    }
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  private noise(start: number, dur: number, o: NoiseOpts = {}) {
    const ctx = this.ctx!;
    if (!this.noiseBuf) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = o.type ?? "bandpass";
    f.frequency.setValueAtTime(o.freq ?? 1000, start);
    if (o.freqTo) f.frequency.exponentialRampToValueAtTime(o.freqTo, start + dur);
    f.Q.value = o.q ?? 1;
    const g = ctx.createGain();
    const vol = o.vol ?? 0.3;
    const a = o.attack ?? 0.01;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + a);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(f);
    f.connect(g);
    g.connect(o.bus ?? this.sfxBus!);
    if (o.reverb && this.reverbIn) {
      const s = ctx.createGain();
      s.gain.value = o.reverb;
      g.connect(s);
      s.connect(this.reverbIn);
    }
    src.start(start, Math.random() * 1.4);
    src.stop(start + dur + 0.05);
  }

  private run(fn: (t: number) => void) {
    if (!this.ctx || this.muted) return;
    try {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      fn(this.ctx.currentTime + 0.01);
    } catch {
      /* ignore */
    }
  }

  bubble(vol = 0.15, ambient = false) {
    this.run((t) => {
      const f = 260 + Math.random() * 380;
      this.tone(f, t, 0.13, { vol, slideTo: f * 2.6, attack: 0.008, bus: ambient ? this.ambBus : this.sfxBus });
    });
  }

  bubbles(count = 4) {
    for (let i = 0; i < count; i++) window.setTimeout(() => this.bubble(0.08 + Math.random() * 0.07), i * 110);
  }

  pop() {
    this.run((t) => {
      this.noise(t, 0.06, { type: "bandpass", freq: 2200, q: 1.2, vol: 0.32, attack: 0.002 });
      this.tone(900, t, 0.08, { vol: 0.22, slideTo: 180, attack: 0.002 });
      this.tone(1500, t + 0.03, 0.14, { vol: 0.07, slideTo: 2600 });
    });
  }

  splash() {
    this.run((t) => {
      this.tone(160, t, 0.35, { vol: 0.45, slideTo: 45, attack: 0.005 });
      this.noise(t, 1.2, { type: "lowpass", freq: 5200, freqTo: 320, q: 0.7, vol: 0.55, attack: 0.008 });
      this.noise(t + 0.04, 0.5, { type: "highpass", freq: 3000, q: 0.5, vol: 0.16, attack: 0.01 });
      for (let i = 0; i < 10; i++) {
        const tt = t + 0.35 + i * 0.09 + Math.random() * 0.05;
        const f = 300 + Math.random() * 500;
        this.tone(f, tt, 0.12, { vol: 0.07 + Math.random() * 0.06, slideTo: f * 2.4, attack: 0.006 });
      }
    });
  }

  whoosh() {
    this.run((t) => {
      this.noise(t, 0.9, { type: "bandpass", freq: 300, freqTo: 1600, q: 0.8, vol: 0.2, attack: 0.25 });
    });
  }

  shellOpen() {
    this.run((t) => {
      this.noise(t, 0.35, { type: "bandpass", freq: 500, freqTo: 2200, q: 1, vol: 0.12, attack: 0.05 });
      [784, 988, 1175, 1568, 1976].forEach((f, i) =>
        this.tone(f, t + 0.08 + i * 0.07, 0.6, { type: "triangle", vol: 0.11, reverb: 0.5 })
      );
    });
  }

  pearl() {
    this.run((t) => {
      [
        [1318.5, 0],
        [1975.5, 0.09],
        [2637, 0.18],
      ].forEach(([f, d]) => {
        this.tone(f, t + d, 1.0, { vol: 0.13, reverb: 0.6 });
        this.tone(f * 2.01, t + d, 0.5, { vol: 0.035 });
      });
    });
  }

  sparkle() {
    this.run((t) => {
      [1568, 2093, 2637, 3136].forEach((f, i) => this.tone(f, t + i * 0.06, 0.35, { vol: 0.07, reverb: 0.6 }));
    });
  }

  success() {
    this.run((t) => {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        this.tone(f, t + i * 0.09, 0.45, { type: "triangle", vol: 0.15, reverb: 0.4 })
      );
      [1046.5, 1318.5, 1568].forEach((f) => this.tone(f, t + 0.4, 0.9, { vol: 0.06, reverb: 0.6 }));
    });
  }

  tryAgain() {
    this.run((t) => {
      this.tone(587.33, t, 0.22, { vol: 0.13, reverb: 0.3 });
      this.tone(493.88, t + 0.16, 0.34, { vol: 0.11, reverb: 0.3 });
    });
  }

  magic() {
    this.run((t) => {
      const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1568, 1760, 2093];
      scale.forEach((f, i) => this.tone(f, t + i * 0.055, 0.5, { type: "triangle", vol: 0.08, reverb: 0.7 }));
      for (let i = 0; i < 10; i++) {
        const f = 1800 + Math.random() * 1800;
        this.tone(f, t + 0.6 + i * 0.12, 0.4, { vol: 0.045, reverb: 0.8 });
      }
      [261.63, 329.63, 392, 493.88].forEach((f) =>
        this.tone(f, t + 0.1, 2.4, { vol: 0.05, attack: 0.5, reverb: 0.6 })
      );
    });
  }
}

export const sfx = new SoundEngine();
