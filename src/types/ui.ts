export type FeatureType = 'screenshot' | 'breathing' | 'journal';

export type BreathingPhase = 'inhale' | 'exhale';

export interface BreathingState {
  isActive: boolean;
  phase: BreathingPhase;
  count: number;
  cycle: number;
}

export interface WellnessMetric {
  label: string;
  value: number;
}