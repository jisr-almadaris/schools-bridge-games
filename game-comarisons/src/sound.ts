/* Sound manager built on Web Audio API — no external files needed. */

class SoundManager {
  private ctx: AudioContext | null = null;
  private musicTimer: number | null = null;
  private musicStep = 0;
  muted = false;

  private ensure(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  private tone(
    freq: number,
    startDelay: number,
    dur: number,
    type: OscillatorType = "sine",
    vol = 0.14,
    slideTo?: number
  ) {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    const t = ctx.currentTime + startDelay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  click() {
    this.tone(660, 0, 0.09, "triangle", 0.1);
    this.tone(880, 0.05, 0.08, "triangle", 0.07);
  }

  correct() {
    this.tone(523.25, 0, 0.16, "triangle", 0.16);
    this.tone(659.25, 0.11, 0.16, "triangle", 0.16);
    this.tone(783.99, 0.22, 0.18, "triangle", 0.16);
    this.tone(1046.5, 0.33, 0.32, "triangle", 0.18);
  }

  wrong() {
    this.tone(220, 0, 0.22, "sawtooth", 0.08);
    this.tone(174, 0.18, 0.32, "sawtooth", 0.08);
  }

  star() {
    this.tone(880, 0, 0.12, "sine", 0.15);
    this.tone(1174.66, 0.09, 0.12, "sine", 0.15);
    this.tone(1567.98, 0.18, 0.14, "sine", 0.15);
    this.tone(2093, 0.27, 0.4, "sine", 0.13);
  }

  ship() {
    this.tone(98, 0, 0.9, "sawtooth", 0.07);
    this.tone(147, 0.05, 0.85, "sawtooth", 0.05);
    this.tone(196, 0.1, 0.7, "triangle", 0.06);
  }

  fanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    notes.forEach((n, i) => this.tone(n, i * 0.14, 0.22, "triangle", 0.16));
    this.tone(1568, 1.05, 0.6, "triangle", 0.15);
  }

  /* -------- Background music: gentle looping pentatonic melody -------- */
  startMusic() {
    if (this.musicTimer !== null) return;
    const melody = [392, 440, 523.25, 587.33, 659.25, 523.25, 440, 392, 440, 523.25, 659.25, 783.99, 659.25, 523.25, 440, 392];
    const bass = [130.81, 146.83, 164.81, 98];
    const play = () => {
      if (this.muted) return;
      const n = melody[this.musicStep % melody.length];
      this.tone(n, 0, 0.55, "sine", 0.035);
      this.tone(n * 2, 0.02, 0.4, "sine", 0.012);
      if (this.musicStep % 4 === 0) {
        this.tone(bass[(this.musicStep / 4) % bass.length | 0], 0, 1.6, "sine", 0.03);
      }
      this.musicStep++;
    };
    play();
    this.musicTimer = window.setInterval(play, 480);
  }

  stopMusic() {
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (m) this.stopMusic();
    else this.startMusic();
  }
}

export const sound = new SoundManager();
