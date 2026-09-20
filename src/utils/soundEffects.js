/**
 * soundEffects.js - Web Audio API Sound Synthesizer
 * 100% Client-side, không tải bất kỳ file mp3 bên ngoài nào,
 * hoạt động 100% Offline với độ trễ 0ms.
 */

class SoundEffectsManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setEnabled(val) {
    this.enabled = Boolean(val);
  }

  isEnabled() {
    return this.enabled;
  }

  /**
   * Âm thanh ghép đôi thành công (Match Success Chime)
   * Chuỗi 3 nốt ngân bổng du dương: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
   */
  playMatchSuccess(combo = 1) {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Nâng cao cao độ nếu combo cao
    const pitchOffset = Math.min((combo - 1) * 30, 180);
    const notes = [523.25 + pitchOffset, 659.25 + pitchOffset, 783.99 + pitchOffset];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  /**
   * Âm thanh ghép đôi thất bại (Mismatch Soft Buzz)
   * 2 nốt trầm ngắn nhẹ nhàng, không gây ức chế
   */
  playMatchError() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [293.66, 220.0]; // D4 -> A3

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.22);
    });
  }

  /**
   * Âm thanh đếm nhịp giây cuối (Tick Tock)
   */
  playTick(isUrgent = false) {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isUrgent ? 880 : 440, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Khúc nhạc chiến thắng (Victory Fanfare)
   * Hợp âm rộn rã chúc mừng dọn sạch bàn cờ
   */
  playVictory() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chordNotes = [
      { f: 523.25, t: 0.0 },  // C5
      { f: 659.25, t: 0.12 }, // E5
      { f: 783.99, t: 0.24 }, // G5
      { f: 1046.5, t: 0.38 }, // C6
      { f: 1318.5, t: 0.54 }  // E6
    ];

    chordNotes.forEach((item) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.f, now + item.t);

      gain.gain.setValueAtTime(0.001, now + item.t);
      gain.gain.exponentialRampToValueAtTime(0.2, now + item.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + item.t);
      osc.stop(now + item.t + 0.6);
    });
  }
}

export const soundEffects = new SoundEffectsManager();
