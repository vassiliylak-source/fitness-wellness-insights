// WOD Randomizer - Exercise Database and Configuration

export interface Exercise {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'core' | 'flexibility';
  equipment: string[];
  minReps: number;
  maxReps: number;
  timeBasedMin?: number; // seconds
  timeBasedMax?: number; // seconds
  icon: string;
}

export interface WorkoutPackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  isPremium: boolean;
  exercises: string[]; // exercise IDs
  color: string;
}

export type WorkoutFormat = 'reps' | 'time' | 'amrap';

export interface GeneratedExercise {
  exercise: Exercise;
  value: number;
  format: 'reps' | 'seconds';
}

export interface GeneratedWOD {
  exercises: GeneratedExercise[];
  totalTime?: number;
  format: WorkoutFormat;
  package: string;
}

// Core exercises database
export const EXERCISES: Exercise[] = [
  // Cardio
  { id: 'burpees', name: 'Burpees', category: 'cardio', equipment: [], minReps: 10, maxReps: 50, timeBasedMin: 30, timeBasedMax: 120, icon: '🔥' },
  { id: 'jumping_jacks', name: 'Jumping Jacks', category: 'cardio', equipment: [], minReps: 20, maxReps: 100, timeBasedMin: 30, timeBasedMax: 90, icon: '⭐' },
  { id: 'high_knees', name: 'High Knees', category: 'cardio', equipment: [], minReps: 30, maxReps: 100, timeBasedMin: 30, timeBasedMax: 60, icon: '🦵' },
  { id: 'mountain_climbers', name: 'Mountain Climbers', category: 'cardio', equipment: [], minReps: 20, maxReps: 60, timeBasedMin: 30, timeBasedMax: 90, icon: '⛰️' },
  { id: 'box_jumps', name: 'Box Jumps', category: 'cardio', equipment: ['box'], minReps: 10, maxReps: 30, icon: '📦' },
  { id: 'jump_rope', name: 'Jump Rope', category: 'cardio', equipment: ['rope'], minReps: 50, maxReps: 200, timeBasedMin: 60, timeBasedMax: 180, icon: '🪢' },
  
  // Strength
  { id: 'squats', name: 'Air Squats', category: 'strength', equipment: [], minReps: 20, maxReps: 100, icon: '🏋️' },
  { id: 'pushups', name: 'Push-Ups', category: 'strength', equipment: [], minReps: 10, maxReps: 50, icon: '💪' },
  { id: 'lunges', name: 'Lunges', category: 'strength', equipment: [], minReps: 10, maxReps: 40, icon: '🦿' },
  { id: 'dips', name: 'Tricep Dips', category: 'strength', equipment: ['bench'], minReps: 10, maxReps: 30, icon: '🪑' },
  { id: 'pullups', name: 'Pull-Ups', category: 'strength', equipment: ['bar'], minReps: 5, maxReps: 20, icon: '🧗' },
  { id: 'kb_swings', name: 'Kettlebell Swings', category: 'strength', equipment: ['kettlebell'], minReps: 15, maxReps: 50, icon: '🔔' },
  { id: 'kb_goblet', name: 'Goblet Squats', category: 'strength', equipment: ['kettlebell'], minReps: 10, maxReps: 30, icon: '🏆' },
  { id: 'kb_clean', name: 'KB Clean & Press', category: 'strength', equipment: ['kettlebell'], minReps: 8, maxReps: 20, icon: '🎯' },
  { id: 'deadlifts', name: 'Deadlifts', category: 'strength', equipment: ['barbell'], minReps: 5, maxReps: 15, icon: '🔩' },
  { id: 'thrusters', name: 'Thrusters', category: 'strength', equipment: ['barbell', 'dumbbells'], minReps: 10, maxReps: 30, icon: '🚀' },
  
  // Core
  { id: 'plank', name: 'Plank Hold', category: 'core', equipment: [], minReps: 30, maxReps: 120, timeBasedMin: 30, timeBasedMax: 120, icon: '📏' },
  { id: 'situps', name: 'Sit-Ups', category: 'core', equipment: [], minReps: 20, maxReps: 60, icon: '🎭' },
  { id: 'v_ups', name: 'V-Ups', category: 'core', equipment: [], minReps: 10, maxReps: 30, icon: '✌️' },
  { id: 'russian_twists', name: 'Russian Twists', category: 'core', equipment: [], minReps: 20, maxReps: 50, icon: '🌀' },
  { id: 'leg_raises', name: 'Leg Raises', category: 'core', equipment: [], minReps: 10, maxReps: 30, icon: '🦶' },
  { id: 'hollow_hold', name: 'Hollow Hold', category: 'core', equipment: [], timeBasedMin: 20, timeBasedMax: 60, minReps: 20, maxReps: 60, icon: '🥄' },
  
  // Flexibility/Mobility
  { id: 'wall_sit', name: 'Wall Sit', category: 'flexibility', equipment: [], timeBasedMin: 30, timeBasedMax: 90, minReps: 30, maxReps: 90, icon: '🧱' },
  { id: 'superman', name: 'Superman Hold', category: 'flexibility', equipment: [], timeBasedMin: 20, timeBasedMax: 60, minReps: 20, maxReps: 60, icon: '🦸' },
];

// Workout packages
export const PACKAGES: WorkoutPackage[] = [
  {
    id: 'classic',
    name: 'Classic WOD',
    description: 'No equipment, pure sweat',
    icon: '🔥',
    isPremium: false,
    exercises: ['burpees', 'squats', 'pushups', 'lunges', 'mountain_climbers', 'plank', 'situps', 'jumping_jacks', 'high_knees'],
    color: 'from-primary to-accent'
  },
  {
    id: 'kettlebell',
    name: 'Kettlebell Only',
    description: 'One bell, maximum pain',
    icon: '🔔',
    isPremium: true,
    exercises: ['kb_swings', 'kb_goblet', 'kb_clean', 'squats', 'lunges', 'plank', 'russian_twists'],
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'hell',
    name: 'Hell Mode',
    description: 'For the truly insane',
    icon: '👹',
    isPremium: true,
    exercises: ['burpees', 'thrusters', 'pullups', 'box_jumps', 'v_ups', 'mountain_climbers', 'kb_swings'],
    color: 'from-red-700 to-black'
  },
  {
    id: 'hotel',
    name: 'Hotel Room',
    description: 'Zero equipment, zero excuses',
    icon: '🏨',
    isPremium: true,
    exercises: ['burpees', 'squats', 'pushups', 'plank', 'situps', 'lunges', 'high_knees', 'wall_sit', 'superman'],
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'core_crusher',
    name: 'Core Crusher',
    description: 'Abs of steel or bust',
    icon: '💎',
    isPremium: true,
    exercises: ['plank', 'situps', 'v_ups', 'russian_twists', 'leg_raises', 'hollow_hold', 'superman', 'mountain_climbers'],
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'quick_burn',
    name: 'Quick Burn',
    description: '10-minute destroyer',
    icon: '⚡',
    isPremium: false,
    exercises: ['burpees', 'squats', 'pushups', 'high_knees', 'plank'],
    color: 'from-yellow-500 to-orange-500'
  }
];

// Workout formats
export const FORMATS: { id: WorkoutFormat; name: string; description: string }[] = [
  { id: 'reps', name: 'For Reps', description: 'Complete all reps as fast as possible' },
  { id: 'time', name: 'For Time', description: 'Complete within the time cap' },
  { id: 'amrap', name: 'AMRAP', description: 'As Many Rounds As Possible' }
];

// Motivational phrases
export const MOTIVATIONAL_PHRASES = [
  "CRUSH IT! 💀",
  "NO MERCY!",
  "SUFFER NOW, GLORY LATER",
  "PAIN IS TEMPORARY",
  "EMBRACE THE SUCK",
  "BEAST MODE: ON",
  "TIME TO BLEED",
  "NO EXCUSES",
  "DIG DEEPER",
  "FINISH STRONG"
];

// Generate random WOD
export const generateWOD = (packageId: string = 'classic', exerciseCount: number = 3): GeneratedWOD => {
  const pkg = PACKAGES.find(p => p.id === packageId) || PACKAGES[0];
  const availableExercises = EXERCISES.filter(e => pkg.exercises.includes(e.id));
  
  const shuffled = [...availableExercises].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(exerciseCount, availableExercises.length));
  
  const generatedExercises: GeneratedExercise[] = selected.map(exercise => {
    const useTime = exercise.timeBasedMin && Math.random() > 0.6;
    
    if (useTime && exercise.timeBasedMin && exercise.timeBasedMax) {
      const timeValue = Math.round((Math.random() * (exercise.timeBasedMax - exercise.timeBasedMin) + exercise.timeBasedMin) / 10) * 10;
      return { exercise, value: timeValue, format: 'seconds' as const };
    } else {
      const repValue = Math.round((Math.random() * (exercise.maxReps - exercise.minReps) + exercise.minReps) / 5) * 5;
      return { exercise, value: repValue, format: 'reps' as const };
    }
  });
  
  const formats: WorkoutFormat[] = ['reps', 'time', 'amrap'];
  const format = formats[Math.floor(Math.random() * formats.length)];
  
  return {
    exercises: generatedExercises,
    format,
    package: pkg.name
  };
};

// Format time display
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
