import { EXERCISES, GeneratedExercise, Exercise } from '@/constants/wod';

// Struggle Weight constants from the spec
export const STRUGGLE_WEIGHTS: Record<string, number> = {
  'Burpee Overs': 1.0,
  'KB Swings': 0.5,
  'Push-Ups': 0.4,
  'Air Squats': 0.3,
  'Mountain Climbers': 0.15,
  'Plank Hold': 0.02, // per second
  // Expanded mappings
  'Burpees': 1.0,
  'Burpee Box Jumps': 1.0,
  'Devil Press': 1.0,
  'Thrusters': 0.8,
  'Man-Makers': 0.9,
  'KB Snatches': 0.6,
  'Box Jumps': 0.5,
  'Jumping Lunges': 0.5,
  'Broad Jumps': 0.5,
  'Wall Balls': 0.4,
  'Deadlifts': 0.4,
  'Goblet Squats': 0.35,
  'Lunges': 0.3,
  'Jump Squats': 0.35,
  'Hollow Rocks': 0.2,
  'V-Ups': 0.2,
  'Sit-Ups': 0.15,
  'High Knees': 0.12,
  'Jumping Jacks': 0.1,
  'Dead Bugs': 0.1,
};

export const getStruggleWeight = (exerciseName: string): number => {
  return STRUGGLE_WEIGHTS[exerciseName] ?? 0.3; // Default to 0.3
};

// Protocol types with struggle allocations
export const PROTOCOLS = {
  GRAVITY: { name: 'PROTOCOL: GRAVITY', struggleTarget: 50, tier: 'free' },
  OMEGA: { name: 'PROTOCOL: OMEGA', struggleTarget: 100, tier: 'pro' },
  BALLISTIC: { name: 'PROTOCOL: BALLISTIC', struggleTarget: 75, tier: 'pro' },
} as const;

export type ProtocolType = keyof typeof PROTOCOLS;

interface GeneratedWorkout {
  exercises: GeneratedExercise[];
  protocol: typeof PROTOCOLS[ProtocolType];
  targetTime: number;
  criticalOverload: GeneratedExercise | null;
}

// Calculate reps using formula: R = S_allocated / W
const calculateReps = (exercise: Exercise, struggleAllocated: number): number => {
  const weight = getStruggleWeight(exercise.name);
  const reps = Math.round(struggleAllocated / weight);
  
  // Apply min/max bounds from exercise
  const minReps = exercise.minValue;
  const maxReps = exercise.maxValue;
  
  return Math.max(minReps, Math.min(maxReps, reps));
};

// Calculate estimated time for an exercise
const calculateEstimatedTime = (exercise: Exercise, value: number): number => {
  if (exercise.measureType === 'seconds') {
    return value;
  }
  return Math.round(value * (exercise.estimatedSecondsPerRep || 2));
};

// Balance algorithm: high-W exercises followed by low-W recovery
const balanceExercises = (exercises: Exercise[]): Exercise[] => {
  const sorted = [...exercises].sort((a, b) => {
    const wA = getStruggleWeight(a.name);
    const wB = getStruggleWeight(b.name);
    return wB - wA; // Sort by weight descending
  });
  
  const balanced: Exercise[] = [];
  const high = sorted.filter(e => getStruggleWeight(e.name) >= 0.4);
  const low = sorted.filter(e => getStruggleWeight(e.name) < 0.4);
  
  // Interleave high and low
  let hIdx = 0, lIdx = 0;
  while (hIdx < high.length || lIdx < low.length) {
    if (hIdx < high.length) balanced.push(high[hIdx++]);
    if (lIdx < low.length) balanced.push(low[lIdx++]);
  }
  
  return balanced;
};

// Generate workout with Struggle Weight balancing
export const generateStruggleWorkout = (
  protocol: ProtocolType = 'GRAVITY',
  exercisePool: Exercise[] = EXERCISES
): GeneratedWorkout => {
  const protocolConfig = PROTOCOLS[protocol];
  const struggleTarget = protocolConfig.struggleTarget;
  
  // Select 4-6 exercises randomly
  const shuffled = [...exercisePool].sort(() => Math.random() - 0.5);
  const selectedCount = 4 + Math.floor(Math.random() * 3); // 4-6
  const selected = shuffled.slice(0, selectedCount);
  
  // Balance the exercise order
  const balanced = balanceExercises(selected);
  
  // Allocate struggle points evenly
  const perExercise = struggleTarget / balanced.length;
  
  const exercises: GeneratedExercise[] = balanced.map(exercise => {
    const value = calculateReps(exercise, perExercise);
    return {
      exercise,
      value,
      format: exercise.measureType,
      estimatedTime: calculateEstimatedTime(exercise, value),
    };
  });
  
  // Calculate target time based on total estimated time (slightly faster)
  const totalEstimated = exercises.reduce((sum, e) => sum + e.estimatedTime, 0);
  const targetTime = Math.round(totalEstimated * 0.9); // 10% faster than estimate
  
  // Generate CRITICAL OVERLOAD (1.25x volume on last exercise)
  const lastExercise = exercises[exercises.length - 1];
  const overloadValue = Math.round(lastExercise.value * 1.25);
  const criticalOverload: GeneratedExercise = {
    exercise: lastExercise.exercise,
    value: overloadValue,
    format: lastExercise.format,
    estimatedTime: calculateEstimatedTime(lastExercise.exercise, overloadValue),
  };
  
  return {
    exercises,
    protocol: protocolConfig,
    targetTime,
    criticalOverload,
  };
};

// Calculate SP earned based on performance
export const calculateSPEarned = (
  actualTime: number,
  targetTime: number,
  protocol: ProtocolType
): number => {
  const baseMultiplier = protocol === 'OMEGA' ? 2 : protocol === 'BALLISTIC' ? 1.5 : 1;
  
  if (actualTime <= targetTime * 0.8) {
    return Math.round(75 * baseMultiplier); // Crushed it
  } else if (actualTime <= targetTime) {
    return Math.round(50 * baseMultiplier); // Beat target
  } else if (actualTime <= targetTime * 1.2) {
    return Math.round(30 * baseMultiplier); // Close
  }
  return Math.round(15 * baseMultiplier); // Completed
};
