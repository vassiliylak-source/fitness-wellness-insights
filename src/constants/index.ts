// Application constants
export const APP_CONFIG = {
  name: 'Wellness Tracker',
  author: 'Vassiliy Lakhonin',
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

// Breathing exercise config
export const BREATHING_CONFIG = {
  inhaleCount: 4,
  exhaleCount: 6,
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