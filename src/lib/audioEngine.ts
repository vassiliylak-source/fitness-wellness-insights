// Audio Engine - Industrial sounds, BPM metronome, and voice commands
// Uses Web Audio API for sound synthesis

export type SoundType = 'shutter' | 'hydraulic' | 'siren' | 'beep' | 'glitch' | 'complete';

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;
  private bpmInterval: number | null = null;
  private currentBPM: number = 0;
  
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopMetronome();
    }
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  // Industrial shutter sound
  playShutter() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  // Hydraulic press sound
  playHydraulic() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(ctx.currentTime);
  }

  // Alarm siren
  playSiren() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sawtooth';
    
    // Siren sweep
    for (let i = 0; i < 4; i++) {
      osc.frequency.setValueAtTime(400, ctx.currentTime + i * 0.25);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + i * 0.25 + 0.125);
      osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + i * 0.25 + 0.25);
    }
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);
  }

  // System glitch sound
  playGlitch() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    
    // Create multiple oscillators for glitchy sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.value = 100 + Math.random() * 400;
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
      }, i * 30);
    }
  }

  // Completion fanfare
  playComplete() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    
    const notes = [400, 500, 600, 800];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      const startTime = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Timer tick sound
  playTick() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.value = 1000;
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }

  // BPM Metronome - beats per minute
  startMetronome(bpm: number = 130) {
    if (!this.isEnabled) return;
    this.stopMetronome();
    this.currentBPM = bpm;
    
    const interval = 60000 / bpm; // ms per beat
    
    this.bpmInterval = window.setInterval(() => {
      this.playMetronomeBeat();
    }, interval);
    
    // Play first beat immediately
    this.playMetronomeBeat();
  }

  private playMetronomeBeat() {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.value = 80;
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  }

  stopMetronome() {
    if (this.bpmInterval) {
      clearInterval(this.bpmInterval);
      this.bpmInterval = null;
    }
    this.currentBPM = 0;
  }

  getCurrentBPM(): number {
    return this.currentBPM;
  }

  // Play named sound
  play(sound: SoundType) {
    switch (sound) {
      case 'shutter':
        this.playShutter();
        break;
      case 'hydraulic':
        this.playHydraulic();
        break;
      case 'siren':
        this.playSiren();
        break;
      case 'glitch':
        this.playGlitch();
        break;
      case 'complete':
        this.playComplete();
        break;
      case 'beep':
        this.playTick();
        break;
    }
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();
