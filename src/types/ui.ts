export type FeatureType = 'screenshot' | 'breathing' | 'journal' | 'meditation';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';
export type BreathingTechnique = 'relaxation' | 'box' | 'triangle' | 'physiological';

export interface BreathingState {
  isActive: boolean;
  phase: BreathingPhase;
  count: number;
  cycle: number;
  technique: BreathingTechnique;
}

export interface TechniqueConfig {
  name: string;
  description: string;
  icon: string;
  color: string;
  inhaleCount: number;
  holdCount: number;
  exhaleCount: number;
  benefits: string[];
}

export interface WellnessMetric {
  label: string;
  value: number;
}