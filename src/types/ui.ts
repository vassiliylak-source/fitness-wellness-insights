export type FeatureType = 'screenshot' | 'breathing' | 'journal';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';
export type BreathingTechnique = 'relaxation' | 'box' | 'triangle' | 'physiological';

export interface BreathingState {
  isActive: boolean;
  phase: BreathingPhase;
  count: number;
  cycle: number;
  technique: BreathingTechnique;
}

export interface WellnessMetric {
  label: string;
  value: number;
}