type OscKind = OscillatorType;

export type SfxName = "click" | "correct" | "wrong" | "star" | "celebrate" | "whoosh";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private enabled = true;
  private musicOn = false;
  private musicTimer: number | null = null;
  private step = 0;

  setEnabled(value: boolean) {
    this.enabled = value;
    if (!value) this.stopMusic();
    else if (this.musicOn) this.startMusic();
  }

  isEnabled() {
    return this.enabled;
  }

  unlock() {
    const ctx = this.ensure();
    if (ctx.state === "suspended") void ctx.resume();
  }

  private ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.72;
      this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.11;
      this.musicGain.connect(this.master);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscKind = "sine",
    volume = 0.16,
    delay = 0,
    dest?: GainNode,
  ) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    const start = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(dest || this.master!);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  play(name: SfxName) {
    if (!this.enabled) return;
    this.unlock();
    switch (name) {
      case "click":
        this.tone(720, 0.08, "triangle", 0.09);
        break;
      case "whoosh":
        this.tone(420, 0.18, "sine", 0.07);
        this.tone(640, 0.16, "sine", 0.05, 0.05);
        break;
      case "correct":
        this.tone(523.25, 0.16, "sine", 0.14);
        this.tone(659.25, 0.18, "sine", 0.13, 0.09);
        this.tone(783.99, 0.28, "sine", 0.12, 0.18);
        break;
      case "wrong":
        this.tone(247, 0.2, "triangle", 0.1);
        this.tone(196, 0.28, "sine", 0.09, 0.1);
        break;
      case "star":
        this.tone(880, 0.12, "sine", 0.1);
        this.tone(1320, 0.16, "sine", 0.09, 0.08);
        this.tone(1760, 0.22, "triangle", 0.06, 0.14);
        break;
      case "celebrate":
        [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => {
          this.tone(f, 0.22, "sine", 0.12, i * 0.11);
        });
        break;
      default:
        break;
    }
  }

  startMusic() {
    this.musicOn = true;
    if (!this.enabled) return;
    this.unlock();
    if (this.musicTimer != null) return;
    const melody = [261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 261.63];
    const tick = () => {
      if (!this.enabled || !this.musicOn) return;
      const note = melody[this.step % melody.length];
      this.tone(note, 0.85, "sine", 0.045, 0, this.musicGain || undefined);
      this.tone(note * 2, 0.7, "triangle", 0.012, 0.04, this.musicGain || undefined);
      this.step += 1;
    };
    tick();
    this.musicTimer = window.setInterval(tick, 900);
  }

  stopMusic() {
    this.musicOn = false;
    if (this.musicTimer != null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  toggleMusic(on: boolean) {
    if (on) this.startMusic();
    else this.stopMusic();
  }
}

export const audio = new AudioEngine();
