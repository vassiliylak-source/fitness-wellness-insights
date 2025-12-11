// CHAOS PROTOCOL GENERATOR - Exercise Database and Configuration

export interface Exercise {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'core' | 'flexibility';
  equipment: string[];
  minValue: number;
  maxValue: number;
  measureType: 'reps' | 'seconds'; // Fixed: proper measurement type
  sufferingCoefficient: number; // 1-10 scale, higher = harder
  description: string;
  icon: string;
  estimatedSecondsPerRep?: number; // For time calculation
}

export interface WorkoutPackage {
  id: string;
  name: string;
  codename: string; // Technical-sounding name
  description: string;
  icon: string;
  isPremium: boolean;
  exercises: string[];
  color: string;
}

export type WorkoutFormat = 'reps' | 'time' | 'amrap';

export interface GeneratedExercise {
  exercise: Exercise;
  value: number;
  format: 'reps' | 'seconds';
  estimatedTime: number; // seconds to complete
}

export interface GeneratedWOD {
  exercises: GeneratedExercise[];
  totalEstimatedTime: number; // AI prediction in seconds
  targetTime: number; // Slightly faster than estimated
  format: WorkoutFormat;
  package: string;
  sequenceId: string; // Unique ID for the sequence
}

// Core exercises database with suffering coefficients and proper measurement
export const EXERCISES: Exercise[] = [
  // Cardio - High Intensity
  { 
    id: 'burpees', 
    name: 'Burpee Overs', 
    category: 'cardio', 
    equipment: [], 
    minValue: 10, 
    maxValue: 30,
    measureType: 'reps',
    sufferingCoefficient: 9,
    description: 'High heart rate spike',
    icon: '🔥',
    estimatedSecondsPerRep: 4
  },
  { 
    id: 'jumping_jacks', 
    name: 'Jumping Jacks', 
    category: 'cardio', 
    equipment: [], 
    minValue: 30, 
    maxValue: 80,
    measureType: 'reps',
    sufferingCoefficient: 3,
    description: 'Active warm-up',
    icon: '⭐',
    estimatedSecondsPerRep: 1
  },
  { 
    id: 'high_knees', 
    name: 'High Knees', 
    category: 'cardio', 
    equipment: [], 
    minValue: 40, 
    maxValue: 80,
    measureType: 'reps',
    sufferingCoefficient: 5,
    description: 'Cardio acceleration',
    icon: '🦵',
    estimatedSecondsPerRep: 0.8
  },
  { 
    id: 'mountain_climbers', 
    name: 'Mountain Climbers', 
    category: 'cardio', 
    equipment: [], 
    minValue: 30, 
    maxValue: 60,
    measureType: 'reps',
    sufferingCoefficient: 7,
    description: 'Final burner',
    icon: '⛰️',
    estimatedSecondsPerRep: 1.2
  },
  { 
    id: 'box_jumps', 
    name: 'Box Jumps', 
    category: 'cardio', 
    equipment: ['box'], 
    minValue: 10, 
    maxValue: 25,
    measureType: 'reps',
    sufferingCoefficient: 8,
    description: 'Explosive power',
    icon: '📦',
    estimatedSecondsPerRep: 3
  },
  { 
    id: 'jump_rope', 
    name: 'Jump Rope', 
    category: 'cardio', 
    equipment: ['rope'], 
    minValue: 60, 
    maxValue: 120,
    measureType: 'seconds',
    sufferingCoefficient: 4,
    description: 'Steady state cardio',
    icon: '🪢'
  },
  
  // Strength
  { 
    id: 'squats', 
    name: 'Air Squats', 
    category: 'strength', 
    equipment: [], 
    minValue: 20, 
    maxValue: 50,
    measureType: 'reps',
    sufferingCoefficient: 5,
    description: 'Leg foundation',
    icon: '🏋️',
    estimatedSecondsPerRep: 2
  },
  { 
    id: 'pushups', 
    name: 'Push-Ups', 
    category: 'strength', 
    equipment: [], 
    minValue: 10, 
    maxValue: 35,
    measureType: 'reps',
    sufferingCoefficient: 6,
    description: 'Upper body staple',
    icon: '💪',
    estimatedSecondsPerRep: 2.5
  },
  { 
    id: 'lunges', 
    name: 'Walking Lunges', 
    category: 'strength', 
    equipment: [], 
    minValue: 16, 
    maxValue: 32,
    measureType: 'reps',
    sufferingCoefficient: 6,
    description: 'Total leg engagement',
    icon: '🦿',
    estimatedSecondsPerRep: 2
  },
  { 
    id: 'dips', 
    name: 'Tricep Dips', 
    category: 'strength', 
    equipment: ['bench'], 
    minValue: 12, 
    maxValue: 25,
    measureType: 'reps',
    sufferingCoefficient: 5,
    description: 'Arm definition',
    icon: '🪑',
    estimatedSecondsPerRep: 2
  },
  { 
    id: 'pullups', 
    name: 'Pull-Ups', 
    category: 'strength', 
    equipment: ['bar'], 
    minValue: 5, 
    maxValue: 15,
    measureType: 'reps',
    sufferingCoefficient: 9,
    description: 'Back dominance',
    icon: '🧗',
    estimatedSecondsPerRep: 4
  },
  { 
    id: 'kb_swings', 
    name: 'KB Swings', 
    category: 'strength', 
    equipment: ['kettlebell'], 
    minValue: 15, 
    maxValue: 35,
    measureType: 'reps',
    sufferingCoefficient: 7,
    description: 'Posterior chain blast',
    icon: '🔔',
    estimatedSecondsPerRep: 2
  },
  { 
    id: 'kb_goblet', 
    name: 'Goblet Squats', 
    category: 'strength', 
    equipment: ['kettlebell'], 
    minValue: 10, 
    maxValue: 25,
    measureType: 'reps',
    sufferingCoefficient: 6,
    description: 'Loaded squat pattern',
    icon: '🏆',
    estimatedSecondsPerRep: 3
  },
  { 
    id: 'kb_clean', 
    name: 'KB Clean & Press', 
    category: 'strength', 
    equipment: ['kettlebell'], 
    minValue: 8, 
    maxValue: 16,
    measureType: 'reps',
    sufferingCoefficient: 8,
    description: 'Full body compound',
    icon: '🎯',
    estimatedSecondsPerRep: 4
  },
  { 
    id: 'deadlifts', 
    name: 'Deadlifts', 
    category: 'strength', 
    equipment: ['barbell'], 
    minValue: 8, 
    maxValue: 15,
    measureType: 'reps',
    sufferingCoefficient: 8,
    description: 'Hip hinge mastery',
    icon: '🔩',
    estimatedSecondsPerRep: 4
  },
  { 
    id: 'thrusters', 
    name: 'Thrusters', 
    category: 'strength', 
    equipment: ['barbell', 'dumbbells'], 
    minValue: 10, 
    maxValue: 20,
    measureType: 'reps',
    sufferingCoefficient: 10,
    description: 'Maximum suffering',
    icon: '🚀',
    estimatedSecondsPerRep: 4
  },
  
  // Core - TIME-BASED (fixed)
  { 
    id: 'plank', 
    name: 'Plank Hold', 
    category: 'core', 
    equipment: [], 
    minValue: 30, 
    maxValue: 90,
    measureType: 'seconds', // FIXED: Planks are measured in seconds
    sufferingCoefficient: 4,
    description: 'Active recovery. Do not drop.',
    icon: '📏'
  },
  { 
    id: 'situps', 
    name: 'Sit-Ups', 
    category: 'core', 
    equipment: [], 
    minValue: 15, 
    maxValue: 40,
    measureType: 'reps',
    sufferingCoefficient: 4,
    description: 'Classic core work',
    icon: '🎭',
    estimatedSecondsPerRep: 2
  },
  { 
    id: 'v_ups', 
    name: 'V-Ups', 
    category: 'core', 
    equipment: [], 
    minValue: 10, 
    maxValue: 25,
    measureType: 'reps',
    sufferingCoefficient: 6,
    description: 'Advanced core activation',
    icon: '✌️',
    estimatedSecondsPerRep: 3
  },
  { 
    id: 'russian_twists', 
    name: 'Russian Twists', 
    category: 'core', 
    equipment: [], 
    minValue: 20, 
    maxValue: 40,
    measureType: 'reps',
    sufferingCoefficient: 5,
    description: 'Rotational power',
    icon: '🌀',
    estimatedSecondsPerRep: 1.5
  },
  { 
    id: 'leg_raises', 
    name: 'Leg Raises', 
    category: 'core', 
    equipment: [], 
    minValue: 12, 
    maxValue: 25,
    measureType: 'reps',
    sufferingCoefficient: 5,
    description: 'Lower ab focus',
    icon: '🦶',
    estimatedSecondsPerRep: 2.5
  },
  { 
    id: 'hollow_hold', 
    name: 'Hollow Body Hold', 
    category: 'core', 
    equipment: [], 
    minValue: 20, 
    maxValue: 60,
    measureType: 'seconds', // Time-based
    sufferingCoefficient: 6,
    description: 'Gymnastic core tension',
    icon: '🥄'
  },
  
  // Flexibility/Static - TIME-BASED
  { 
    id: 'wall_sit', 
    name: 'Wall Sit', 
    category: 'flexibility', 
    equipment: [], 
    minValue: 30, 
    maxValue: 75,
    measureType: 'seconds',
    sufferingCoefficient: 5,
    description: 'Isometric leg burn',
    icon: '🧱'
  },
  { 
    id: 'superman', 
    name: 'Superman Hold', 
    category: 'flexibility', 
    equipment: [], 
    minValue: 20, 
    maxValue: 45,
    measureType: 'seconds',
    sufferingCoefficient: 3,
    description: 'Posterior chain activation',
    icon: '🦸'
  },
];

// Workout packages - All accessible, premium = extra features
export const PACKAGES: WorkoutPackage[] = [
  {
    id: 'bodyweight',
    name: 'Bodyweight',
    codename: 'ZERO FRICTION',
    description: 'No equipment required',
    icon: '⚡',
    isPremium: false,
    exercises: ['burpees', 'squats', 'pushups', 'lunges', 'mountain_climbers', 'plank', 'situps', 'jumping_jacks', 'high_knees', 'v_ups'],
    color: 'from-primary to-accent'
  },
  {
    id: 'kettlebell',
    name: 'Kettlebell',
    codename: 'BALLISTIC LOAD',
    description: 'One bell, maximum output',
    icon: '🔔',
    isPremium: false,
    exercises: ['kb_swings', 'kb_goblet', 'kb_clean', 'squats', 'lunges', 'plank', 'russian_twists'],
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'hell',
    name: 'Hell Mode',
    codename: 'MAXIMUM SUFFERING',
    description: 'Algorithm shows no mercy',
    icon: '👹',
    isPremium: false,
    exercises: ['burpees', 'thrusters', 'pullups', 'box_jumps', 'v_ups', 'mountain_climbers', 'kb_swings'],
    color: 'from-red-700 to-black'
  },
  {
    id: 'hotel',
    name: 'Hotel Room',
    codename: 'COMPACT SPACE OPT.',
    description: 'Zero equipment protocol',
    icon: '🏨',
    isPremium: false,
    exercises: ['burpees', 'squats', 'pushups', 'plank', 'situps', 'lunges', 'high_knees', 'wall_sit', 'superman'],
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'core_crusher',
    name: 'Core Protocol',
    codename: 'ABDOMINAL ASSAULT',
    description: 'Core-focused destruction',
    icon: '💎',
    isPremium: false,
    exercises: ['plank', 'situps', 'v_ups', 'russian_twists', 'leg_raises', 'hollow_hold', 'superman', 'mountain_climbers'],
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'quick_burn',
    name: 'Quick Burn',
    codename: 'RAPID DEPLOYMENT',
    description: '10-minute annihilation',
    icon: '🔥',
    isPremium: false,
    exercises: ['burpees', 'squats', 'pushups', 'high_knees', 'plank'],
    color: 'from-yellow-500 to-orange-500'
  }
];

// Algorithm phrases (techno-spartan tone)
export const ALGORITHM_PHRASES = [
  "SEQUENCE COMPILED",
  "PROTOCOL INITIATED",
  "CHALLENGE GENERATED",
  "PARAMETERS SET",
  "RESISTANCE CALCULATED",
  "SUFFERING OPTIMIZED",
  "NO MERCY PROTOCOL",
  "ALGORITHM COMPLETE",
  "SEQUENCE READY",
  "EXECUTE OR FAIL"
];

// Balanced WOD generation with suffering coefficient
export const generateWOD = (packageId: string = 'bodyweight', exerciseCount: number = 3): GeneratedWOD => {
  const pkg = PACKAGES.find(p => p.id === packageId) || PACKAGES[0];
  const availableExercises = EXERCISES.filter(e => pkg.exercises.includes(e.id));
  
  // Shuffle and select initial exercises
  const shuffled = [...availableExercises].sort(() => Math.random() - 0.5);
  
  // Smart selection: balance suffering coefficients
  const selected: Exercise[] = [];
  let totalSuffering = 0;
  const targetAvgSuffering = 5.5; // Medium difficulty target
  
  for (const exercise of shuffled) {
    if (selected.length >= exerciseCount) break;
    
    // If we already have high suffering, prefer lower ones
    const currentAvg = selected.length > 0 ? totalSuffering / selected.length : 0;
    
    if (selected.length === 0) {
      // First exercise can be anything
      selected.push(exercise);
      totalSuffering += exercise.sufferingCoefficient;
    } else if (currentAvg > targetAvgSuffering && exercise.sufferingCoefficient <= 5) {
      // Need easier exercise for balance
      selected.push(exercise);
      totalSuffering += exercise.sufferingCoefficient;
    } else if (currentAvg <= targetAvgSuffering) {
      // Can add harder exercise
      selected.push(exercise);
      totalSuffering += exercise.sufferingCoefficient;
    }
  }
  
  // Fill remaining slots if needed
  while (selected.length < exerciseCount && shuffled.length > 0) {
    const remaining = shuffled.filter(e => !selected.includes(e));
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }
  
  // Generate values for each exercise
  const generatedExercises: GeneratedExercise[] = selected.map(exercise => {
    // Calculate value based on suffering coefficient (harder = fewer reps)
    const range = exercise.maxValue - exercise.minValue;
    const sufferingFactor = 1 - ((exercise.sufferingCoefficient - 1) / 9) * 0.3; // 0.7 to 1.0
    const value = Math.round((exercise.minValue + range * sufferingFactor * Math.random()) / 5) * 5;
    
    // Calculate estimated time
    let estimatedTime: number;
    if (exercise.measureType === 'seconds') {
      estimatedTime = value;
    } else {
      estimatedTime = value * (exercise.estimatedSecondsPerRep || 2);
    }
    
    return {
      exercise,
      value,
      format: exercise.measureType,
      estimatedTime
    };
  });
  
  // Calculate total estimated time (with rest between exercises)
  const totalEstimatedTime = generatedExercises.reduce((sum, ex) => sum + ex.estimatedTime, 0) + (exerciseCount - 1) * 15; // 15s rest between
  
  // Target time is slightly faster (challenge the user)
  const targetTime = Math.round(totalEstimatedTime * 0.85);
  
  // Generate unique sequence ID
  const sequenceId = Math.floor(Math.random() * 9000 + 1000).toString();
  
  return {
    exercises: generatedExercises,
    totalEstimatedTime,
    targetTime,
    format: 'reps',
    package: pkg.name,
    sequenceId
  };
};

// Format time display
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Storage key for generation limit
export const STORAGE_KEY_LAST_GEN = 'chaos_protocol_last_gen';
export const STORAGE_KEY_GEN_COUNT = 'chaos_protocol_gen_count';

// Check if user can generate (1 per day for free)
export const canGenerate = (): { canGen: boolean; remaining: number } => {
  const today = new Date().toDateString();
  const lastGen = localStorage.getItem(STORAGE_KEY_LAST_GEN);
  const genCount = parseInt(localStorage.getItem(STORAGE_KEY_GEN_COUNT) || '0');
  
  if (lastGen !== today) {
    // New day, reset count
    localStorage.setItem(STORAGE_KEY_LAST_GEN, today);
    localStorage.setItem(STORAGE_KEY_GEN_COUNT, '0');
    return { canGen: true, remaining: 1 };
  }
  
  const maxFreeGens = 1;
  return { canGen: genCount < maxFreeGens, remaining: Math.max(0, maxFreeGens - genCount) };
};

// Record a generation
export const recordGeneration = () => {
  const today = new Date().toDateString();
  localStorage.setItem(STORAGE_KEY_LAST_GEN, today);
  const current = parseInt(localStorage.getItem(STORAGE_KEY_GEN_COUNT) || '0');
  localStorage.setItem(STORAGE_KEY_GEN_COUNT, (current + 1).toString());
};
