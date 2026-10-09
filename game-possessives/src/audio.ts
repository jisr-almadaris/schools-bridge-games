// Synthesized sound engine using the Web Audio API.
// No external files -> nothing to fail to load. Every call is wrapped in try/catch
// so any audio problem can never break the game.

type OscType = OscillatorType;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private musicStep = 0;
  muted = false;
  musicOn = false;

  private ensure() {
    try {
      if (!this.ctx) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.9;
        this.master.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.0;
        this.musicGain.connect(this.master);
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
    } catch {
      /* ignore */
    }
    return this.ctx;
  }

  setMuted(m: boolean) {
    this.muted = m;
    try {
      if (this.master && this.ctx)
        this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.05);
    } catch {
      /* ignore */
    }
  }

  private tone(
    freq: number,
    start: number,
    dur: number,
    type: OscType = "sine",
    peak = 0.3,
    dest?: AudioNode,
  ) {
    try {
      const ctx = this.ensure();
      if (!ctx || !this.master) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime + start);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      g.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + start + 0.02);
      g.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + start + dur,
      );
      o.connect(g);
      g.connect(dest || this.master);
      o.start(ctx.currentTime + start);
      o.stop(ctx.currentTime + start + dur + 0.05);
    } catch {
      /* ignore */
    }
  }

  private noise(start: number, dur: number, peak = 0.2, filterFreq = 1000) {
    try {
      const ctx = this.ensure();
      if (!ctx || !this.master) return;
      const len = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = filterFreq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(peak, ctx.currentTime + start);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      src.connect(filt);
      filt.connect(g);
      g.connect(this.master);
      src.start(ctx.currentTime + start);
      src.stop(ctx.currentTime + start + dur + 0.02);
    } catch {
      /* ignore */
    }
  }

  // ------- named effects -------
  correct() {
    this.tone(523.25, 0, 0.14, "triangle", 0.3);
    this.tone(659.25, 0.12, 0.14, "triangle", 0.3);
    this.tone(783.99, 0.24, 0.22, "triangle", 0.32);
    this.tone(1046.5, 0.36, 0.3, "sine", 0.28);
  }

  wrong() {
    this.tone(320, 0, 0.16, "sine", 0.22);
    this.tone(247, 0.14, 0.22, "sine", 0.2);
  }

  step() {
    this.noise(0, 0.08, 0.12, 500);
    this.tone(120, 0, 0.06, "sine", 0.1);
  }

  door() {
    this.tone(90, 0, 0.5, "sawtooth", 0.14);
    this.noise(0, 0.5, 0.08, 700);
    this.tone(300, 0.4, 0.18, "sine", 0.15);
  }

  box() {
    this.tone(200, 0, 0.12, "square", 0.14);
    this.noise(0.02, 0.14, 0.1, 900);
    this.tone(420, 0.1, 0.12, "triangle", 0.16);
  }

  drawer() {
    this.noise(0, 0.28, 0.1, 600);
    this.tone(160, 0, 0.28, "sawtooth", 0.1);
    this.tone(240, 0.24, 0.1, "sine", 0.14);
  }

  lens() {
    this.tone(700, 0, 0.12, "sine", 0.16);
    this.tone(1100, 0.08, 0.18, "sine", 0.14);
  }

  key() {
    this.tone(880, 0, 0.1, "triangle", 0.2);
    this.tone(1318.5, 0.09, 0.14, "triangle", 0.22);
    this.noise(0.02, 0.08, 0.06, 3000);
  }

  unlock() {
    this.tone(150, 0, 0.14, "square", 0.16);
    this.tone(150, 0.16, 0.14, "square", 0.16);
    this.noise(0.3, 0.3, 0.12, 1200);
    this.tone(523, 0.5, 0.2, "triangle", 0.24);
    this.tone(784, 0.66, 0.3, "triangle", 0.24);
  }

  celebrate() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((n, i) => this.tone(n, i * 0.12, 0.4, "triangle", 0.3));
    this.noise(0.1, 0.5, 0.08, 4000);
    this.tone(1568, 0.6, 0.5, "sine", 0.2);
  }

  click() {
    this.tone(600, 0, 0.05, "sine", 0.14);
  }

  // ------- gentle background music loop -------
  startMusic() {
    try {
      const ctx = this.ensure();
      if (!ctx || !this.musicGain) return;
      this.musicOn = true;
      this.musicGain.gain.setTargetAtTime(0.09, ctx.currentTime, 0.6);
      if (this.musicTimer != null) return;
      // gentle, curious loop in A minor pentatonic
      const seq = [220, 261.63, 293.66, 329.63, 293.66, 261.63, 246.94, 220];
      const bass = [110, 110, 146.83, 146.83, 130.81, 130.81, 98, 98];
      const beat = 460;
      const tick = () => {
        try {
          const c = this.ensure();
          if (!c || !this.musicGain || !this.musicOn) return;
          const i = this.musicStep % seq.length;
          this.tone(seq[i], 0, 0.4, "triangle", 0.5, this.musicGain);
          this.tone(bass[i], 0, 0.42, "sine", 0.6, this.musicGain);
          if (i % 2 === 0)
            this.tone(seq[i] * 2, 0.22, 0.18, "sine", 0.25, this.musicGain);
          this.musicStep++;
        } catch {
          /* ignore */
        }
      };
      tick();
      this.musicTimer = window.setInterval(tick, beat);
    } catch {
      /* ignore */
    }
  }

  stopMusic() {
    try {
      this.musicOn = false;
      if (this.musicGain && this.ctx)
        this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
      if (this.musicTimer != null) {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
    } catch {
      /* ignore */
    }
  }
}

export const audio = new AudioEngine();
