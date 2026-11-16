// Minimalist, zero-latency Web Audio UI haptics inspired by Apple acoustic design.
class UIHaptics {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    } catch {}
  }

  resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Soft tactile click (like iOS haptic feedback)
  click() {
    if (!this.ctx || !this.enabled) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.012);

    gain.gain.setValueAtTime(0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.015);
  }

  // Gentle acoustic pop on object switch
  step() {
    if (!this.ctx || !this.enabled) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.035);

    gain.gain.setValueAtTime(0.045, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  // Harmonic chord on summon / assemble
  summon() {
    if (!this.ctx || !this.enabled) return;
    this.resume();
    const t = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + i * 0.025;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startT);

      gain.gain.setValueAtTime(0.03, startT);
      gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.25);
    });
  }

  // Harmonic gentle descending chord on dissolve
  dissolve() {
    if (!this.ctx || !this.enabled) return;
    this.resume();
    const t = this.ctx.currentTime;
    const freqs = [783.99, 659.25, 523.25];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + i * 0.02;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startT);

      gain.gain.setValueAtTime(0.025, startT);
      gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.2);
    });
  }
}

export const haptics = new UIHaptics();
