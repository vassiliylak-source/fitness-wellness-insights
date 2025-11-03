// Application constants
export const APP_CONFIG = {
  name: 'FitWellnionaire',
  author: 'FitWellnionaire',
} as const;

// URLs
export const EXTERNAL_URLS = {
  aiInsights: 'https://chatgpt.com/g/g-67c6e2ead288819186d3be7d91466783-fitness-sleep-metrics-insights',
  paypal: 'https://paypal.me/vaskenzy',
} as const;

// Wellness scale defaults
export const WELLNESS_DEFAULTS = {
  mood: 5,
  energy: 5,
  stress: 5,
  sleep: 5,
  recovery: 5,
} as const;

// Breathing exercise configs
export const BREATHING_TECHNIQUES = {
  relaxation: {
    name: '4-6 Relaxation Breathing',
    description: 'Inhale for 4 counts, exhale for 6 counts to promote relaxation',
    icon: '🌬️',
    inhaleCount: 4,
    exhaleCount: 6,
    holdCount: 0,
    color: 'blue',
    benefits: [
      '🧘 Reduces stress and anxiety: Slows breathing to lower heart rate',
      '💆 Promotes relaxation: Extended exhale calms the nervous system',
      '🎯 Improves focus: Enhances attention and concentration',
      '😴 May aid sleep: Helps relax the body and mind'
    ]
  },
  box: {
    name: 'Box Breathing',
    description: 'Inhale, hold, exhale, hold - each for 4 counts for balance',
    icon: '📦',
    inhaleCount: 4,
    exhaleCount: 4,
    holdCount: 4,
    color: 'green',
    benefits: [
      '⚖️ Creates mental balance: Equal timing promotes equilibrium',
      '🎯 Enhances focus: Used by Navy SEALs for concentration',
      '💪 Builds lung capacity: Strengthens respiratory muscles',
      '🧠 Reduces anxiety: Structured pattern calms the mind'
    ]
  },
  triangle: {
    name: 'Triangle Breathing',
    description: 'Inhale for 4, hold for 4, exhale for 4 - simple and effective',
    icon: '🔺',
    inhaleCount: 4,
    exhaleCount: 4,
    holdCount: 4,
    color: 'purple',
    benefits: [
      '🌟 Simple yet effective: Easy to learn and practice',
      '🧘 Promotes mindfulness: Three-phase pattern increases awareness',
      '💆 Gentle relaxation: Less intense than other techniques',
      '⏰ Quick stress relief: Can be done anywhere, anytime'
    ]
  },
  physiological: {
    name: '4-7-8 Sleep Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8 - powerful for sleep',
    icon: '😴',
    inhaleCount: 4,
    exhaleCount: 8,
    holdCount: 7,
    color: 'indigo',
    benefits: [
      '😴 Promotes deep sleep: Designed to induce sleepiness',
      '🧠 Calms nervous system: Long exhale activates parasympathetic response',
      '💤 Reduces insomnia: Helps quiet racing thoughts',
      '🌙 Evening ritual: Perfect for bedtime routine'
    ]
  }
} as const;

export const BREATHING_CONFIG = {
  baseScale: 1,
  maxScale: 1.5,
} as const;

// Storage keys
export const STORAGE_KEYS = {
  wellnessEntries: 'wellness-entries',
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  breathingCycle: 1000,
  scaleTransition: 1000,
} as const;