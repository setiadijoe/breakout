export class BreakoutAudio {
  constructor() {
    this.context = null;
  }

  unlock() {
    const AudioContext = window.AudioContext;
    if (!AudioContext) return;
    this.context ??= new AudioContext();
    if (this.context.state === "suspended") {
      void this.context.resume().catch((error) => {
        console.warn("Audio game tidak dapat diaktifkan", error);
      });
    }
  }

  play(type) {
    if (!this.context) return;

    const context = this.context;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const isPaddle = type === "paddle";
    const duration = isPaddle ? 0.11 : 0.07;

    oscillator.type = isPaddle ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(isPaddle ? 280 : 680, now);
    oscillator.frequency.exponentialRampToValueAtTime(isPaddle ? 190 : 420, now + duration);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}
