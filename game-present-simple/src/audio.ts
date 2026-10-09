// Lightweight Web Audio sound engine – everything is synthesized, so no files can fail.
type AmbienceName = 'airport' | 'cabin' | 'engine' | 'none';

class AudioEngine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  ambGain: GainNode | null = null;
  ambNodes: AudioNode[] = [];
  ambTimer: number | null = null;
  current: AmbienceName = 'none';
  muted = false;
  ambLevel = 0.35;

  init() {
    this.loadVoices();
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return;
    }
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
      this.ambGain = this.ctx.createGain();
      this.ambGain.gain.value = 0;
      this.ambGain.connect(this.master);
    } catch {
      this.ctx = null;
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 1, this.ctx.currentTime, 0.05);
    if (m) window.speechSynthesis?.cancel();
  }

  private noiseBuffer(seconds = 2) {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02; // brown-ish noise
      d[i] = last * 3.5;
    }
    return buf;
  }

  private tone(freq: number, dur: number, opts: { type?: OscillatorType; gain?: number; at?: number; dest?: AudioNode; slide?: number } = {}) {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + (opts.at ?? 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = opts.type ?? 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (opts.slide) o.frequency.exponentialRampToValueAtTime(opts.slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(opts.gain ?? 0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(opts.dest ?? this.master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // ---------- Ambience ----------
  stopAmbience() {
    if (this.ambTimer) { clearInterval(this.ambTimer); this.ambTimer = null; }
    if (this.ctx && this.ambGain) this.ambGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
    const old = this.ambNodes;
    this.ambNodes = [];
    setTimeout(() => old.forEach(n => { try { (n as any).stop?.(); n.disconnect(); } catch {} }), 1500);
    this.current = 'none';
  }

  ambience(name: AmbienceName) {
    this.init();
    if (!this.ctx || !this.ambGain) return;
    if (this.current === name) return;
    this.stopAmbience();
    if (name === 'none') return;
    this.current = name;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(3);
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    const g = ctx.createGain();
    if (name === 'airport') { filt.type = 'bandpass'; filt.frequency.value = 600; filt.Q.value = 0.5; g.gain.value = 0.5; }
    if (name === 'cabin') { filt.type = 'lowpass'; filt.frequency.value = 500; g.gain.value = 0.5; }
    if (name === 'engine') { filt.type = 'lowpass'; filt.frequency.value = 220; g.gain.value = 1.1; }
    src.connect(filt).connect(g).connect(this.ambGain);
    src.start();
    this.ambNodes.push(src, filt, g);
    if (name === 'engine') {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 55;
      const og = ctx.createGain(); og.gain.value = 0.08;
      o.connect(og).connect(this.ambGain); o.start();
      this.ambNodes.push(o, og);
    }
    this.ambGain.gain.setTargetAtTime(this.ambLevel, ctx.currentTime, 0.8);
    // Murmur / footsteps / suitcase wheels for airport & cabin
    if (name !== 'engine') {
      this.ambTimer = window.setInterval(() => {
        if (Math.random() < 0.6) this.murmur();
        if (name === 'airport' && Math.random() < 0.4) this.footsteps(3);
        if (name === 'airport' && Math.random() < 0.2) this.wheels(1.2, 0.03);
      }, 1400);
    }
  }

  private murmur() {
    if (!this.ctx || !this.ambGain) return;
    const base = 120 + Math.random() * 120;
    for (let i = 0; i < 4; i++) {
      this.tone(base * (1 + Math.random() * 0.4), 0.18, { type: 'triangle', gain: 0.012, at: i * 0.16, dest: this.ambGain });
    }
  }

  duck(on: boolean) {
    if (!this.ctx || !this.ambGain || this.current === 'none') return;
    this.ambGain.gain.setTargetAtTime(on ? this.ambLevel * 0.25 : this.ambLevel, this.ctx.currentTime, on ? 0.15 : 0.8);
  }

  // ---------- SFX ----------
  click() { this.init(); this.tone(660, 0.08, { type: 'triangle', gain: 0.08 }); }
  pop() { this.init(); this.tone(400, 0.12, { type: 'sine', gain: 0.15, slide: 900 }); }
  success() {
    this.init();
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.35, { type: 'triangle', gain: 0.16, at: i * 0.1 }));
  }
  wrong() { this.init(); this.tone(300, 0.25, { type: 'sine', gain: 0.1, slide: 220 }); }
  chime() {
    this.init();
    [784, 988, 1175].forEach((f, i) => this.tone(f, 0.7, { type: 'sine', gain: 0.14, at: i * 0.45 }));
  }
  stamp() {
    this.init();
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuffer(0.3);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.9, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    src.connect(f).connect(g).connect(this.master); src.start();
    this.tone(90, 0.2, { type: 'sine', gain: 0.5, slide: 40 });
  }
  footsteps(n = 4, gap = 0.32) {
    this.init();
    for (let i = 0; i < n; i++) this.tone(150, 0.06, { type: 'triangle', gain: 0.05, at: i * gap, slide: 80, dest: this.ambGain ?? undefined });
  }
  wheels(dur = 1.5, gain = 0.08) {
    this.init();
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuffer(dur);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(f).connect(g).connect(this.master); src.start();
  }
  seatbelt() { this.init(); this.tone(2000, 0.05, { type: 'square', gain: 0.08 }); this.tone(1200, 0.08, { type: 'square', gain: 0.08, at: 0.06 }); }
  zip() { this.init(); this.tone(300, 0.4, { type: 'sawtooth', gain: 0.05, slide: 1400 }); }
  takeoff() {
    this.init();
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuffer(6);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(200, ctx.currentTime);
    f.frequency.linearRampToValueAtTime(900, ctx.currentTime + 5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 4);
    g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 6);
    src.connect(f).connect(g).connect(this.master); src.start();
  }
  landing() {
    this.init();
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuffer(4);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2);
    g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 4);
    src.connect(f).connect(g).connect(this.master); src.start();
    this.tone(120, 0.3, { type: 'sine', gain: 0.4, at: 2, slide: 60 });
  }
  celebrate() {
    this.init();
    const notes = [523, 659, 784, 1046, 784, 1046, 1318];
    notes.forEach((f, i) => this.tone(f, 0.4, { type: 'triangle', gain: 0.15, at: i * 0.13 }));
  }

  // ---------- Announcer ----------
  voices: SpeechSynthesisVoice[] = [];
  loadVoices() {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const set = () => { this.voices = synth.getVoices(); };
    set();
    synth.onvoiceschanged = set;
  }
  /* Prefer the most natural-sounding English voices available on the device */
  pickVoice(): SpeechSynthesisVoice | undefined {
    const vs = this.voices.length ? this.voices : (window.speechSynthesis?.getVoices() ?? []);
    const en = vs.filter(v => /^en(-|_)?(US|GB|AU)?/i.test(v.lang));
    const prefs = [
      /natural/i,                                   // Microsoft "Natural" neural voices (Edge)
      /Google (US|UK) English/i,                    // Chrome Google voices
      /Samantha|Ava|Allison|Karen|Moira|Serena/i,   // Apple premium voices
      /Aria|Jenny|Michelle|Sonia|Libby|Zira/i,      // Microsoft female voices
      /female/i,
    ];
    for (const p of prefs) { const v = en.find(v => p.test(v.name)); if (v) return v; }
    return en.find(v => !v.localService) ?? en[0];
  }

  announce(text: string, onEnd?: () => void, opts: { volume?: number; chime?: boolean } = {}) {
    this.init();
    const synth = window.speechSynthesis;
    if (this.muted || !synth) { onEnd?.(); return; }
    try {
      synth.cancel();
      if (opts.chime !== false) this.chime();
      this.duck(true);
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.92;
      u.pitch = 1.0;
      u.volume = opts.volume ?? 1;
      const v = this.pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; }
      let done = false;
      const finish = () => { if (done) return; done = true; this.duck(false); onEnd?.(); };
      u.onend = finish;
      u.onerror = finish;
      setTimeout(() => synth.speak(u), 1300);
      setTimeout(finish, 1500 + text.length * 120);
    } catch {
      this.duck(false);
      onEnd?.();
    }
  }
}

export const audio = new AudioEngine();
