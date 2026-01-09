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
  instructions: string; // How to perform the exercise
  videoUrl?: string; // YouTube embed URL for demonstration
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
    instructions: 'Start standing. Drop into a squat, place hands on floor. Jump feet back to plank. Do a push-up. Jump feet forward to hands. Explosively jump up with hands overhead. Land softly and repeat.',
    videoUrl: 'https://www.youtube.com/embed/dZgVxmf6jkA',
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
    instructions: 'Stand with feet together, arms at sides. Jump while spreading legs shoulder-width and raising arms overhead. Jump back to starting position. Keep a steady rhythm.',
    videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
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
    instructions: 'Run in place, driving knees up toward chest. Each knee lift counts as one rep. Pump arms in opposition to legs. Stay on balls of feet, maintain quick pace.',
    videoUrl: 'https://www.youtube.com/embed/tx5rgpDAJRI',
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
    instructions: 'Start in plank position, hands under shoulders. Drive one knee toward chest, then quickly switch legs. Each knee drive counts as one rep. Keep hips low and core tight.',
    videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM',
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
    instructions: 'Stand facing a sturdy box or platform. Swing arms back, then explosively jump onto the box, landing softly with both feet. Stand fully, then step or jump down. Reset and repeat.',
    videoUrl: 'https://www.youtube.com/embed/NBY9-kTuHEk',
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
    instructions: 'Hold rope handles at hip height. Swing rope overhead and jump as it passes under feet. Keep jumps low (1-2 inches). Stay on balls of feet, wrists do the work.',
    videoUrl: 'https://www.youtube.com/embed/u3zgHI8QnqE',
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
    instructions: 'Stand with feet shoulder-width apart. Push hips back and bend knees, lowering until thighs are parallel to floor. Keep chest up and weight in heels. Stand back up fully.',
    videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
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
    instructions: 'Start in plank with hands slightly wider than shoulders. Lower chest to floor by bending elbows (keep body straight). Push back up to start. Modify on knees if needed.',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
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
    instructions: 'Step forward with one leg, lowering until both knees are at 90°. Push through front heel to step forward with back leg. Alternate legs. Each step counts as one rep.',
    videoUrl: 'https://www.youtube.com/embed/L8fvypPrzzs',
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
    instructions: 'Place hands on edge of bench, fingers forward. Extend legs out. Lower body by bending elbows to 90°, keeping back close to bench. Push back up. Keep shoulders down.',
    videoUrl: 'https://www.youtube.com/embed/6kALZikXxLc',
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
    instructions: 'Hang from bar with overhand grip, hands wider than shoulders. Pull body up until chin clears bar. Lower with control. Modify with resistance band or jumping pull-ups.',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
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
    instructions: 'Stand with feet wider than shoulders, kettlebell between feet. Hinge at hips, grab bell. Swing back between legs, then thrust hips forward explosively to swing bell to chest height. Control the descent.',
    videoUrl: 'https://www.youtube.com/embed/YSxHifyI6s8',
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
    instructions: 'Hold kettlebell by horns at chest level. Feet shoulder-width, toes slightly out. Squat down keeping chest up and elbows between knees. Stand back up fully.',
    videoUrl: 'https://www.youtube.com/embed/MeIiIdhvXT4',
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
    instructions: 'Start with kettlebell on floor. Clean it to rack position at shoulder (bell resting on forearm). Press overhead until arm is straight. Lower to rack, then to floor. Alternate sides.',
    videoUrl: 'https://www.youtube.com/embed/0aLPw-BLwio',
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
    instructions: 'Stand with feet hip-width, bar over mid-foot. Hinge at hips, grip bar outside knees. Keep back flat, drive through heels to stand, pulling bar up legs. Hinge back down with control.',
    videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q',
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
    instructions: 'Hold weights at shoulders (front rack). Squat down fully. Explosively stand and press weights overhead in one fluid motion. Lower weights back to shoulders as you descend into next squat.',
    videoUrl: 'https://www.youtube.com/embed/L219ltL15zk',
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
    measureType: 'seconds',
    sufferingCoefficient: 4,
    description: 'Active recovery. Do not drop.',
    instructions: 'Support body on forearms and toes. Keep body in straight line from head to heels. Engage core, squeeze glutes. Do not let hips sag or pike up. Breathe steadily.',
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
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
    instructions: 'Lie on back, knees bent, feet flat. Hands behind head or crossed on chest. Curl torso up toward knees using abs. Lower back down with control. Avoid pulling on neck.',
    videoUrl: 'https://www.youtube.com/embed/1fbU_MkV7NE',
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
    instructions: 'Lie flat on back, arms extended overhead. Simultaneously lift legs and torso, reaching hands toward toes to form a V shape. Lower back down with control. Keep legs straight.',
    videoUrl: 'https://www.youtube.com/embed/iP2fjvG0g3w',
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
    instructions: 'Sit with knees bent, feet off floor, torso leaned back 45°. Rotate torso side to side, touching floor beside hip each time. Each touch counts as one rep. Keep core tight.',
    videoUrl: 'https://www.youtube.com/embed/wkD8rjkodUI',
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
    instructions: 'Lie on back, legs straight, hands under hips for support. Raise legs together until perpendicular to floor. Lower slowly, stopping just before touching ground. Keep lower back pressed down.',
    videoUrl: 'https://www.youtube.com/embed/JB2oyawG9KI',
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
    measureType: 'seconds',
    sufferingCoefficient: 6,
    description: 'Gymnastic core tension',
    instructions: 'Lie on back. Press lower back into floor. Raise shoulders and legs slightly off ground, arms extended. Create a banana shape. Hold position, breathing steadily. Do not let back arch.',
    videoUrl: 'https://www.youtube.com/embed/44ScXWFaVBs',
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
    instructions: 'Stand with back against wall. Slide down until thighs are parallel to floor, knees at 90°. Keep back flat against wall. Hold position. Do not rest hands on thighs.',
    videoUrl: 'https://www.youtube.com/embed/y-wV4Lk-BiI',
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
    instructions: 'Lie face down, arms extended overhead. Simultaneously lift arms, chest, and legs off floor. Squeeze glutes and back muscles. Hold position, breathing steadily. Keep neck neutral.',
    videoUrl: 'https://www.youtube.com/embed/z6PJMT2y8GQ',
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

// Check if user can generate (3 per day for free)
export const canGenerate = (): { canGen: boolean; remaining: number } => {
  const today = new Date().toDateString();
  const lastGen = localStorage.getItem(STORAGE_KEY_LAST_GEN);
  const genCount = parseInt(localStorage.getItem(STORAGE_KEY_GEN_COUNT) || '0');
  
  if (lastGen !== today) {
    // New day, reset count
    localStorage.setItem(STORAGE_KEY_LAST_GEN, today);
    localStorage.setItem(STORAGE_KEY_GEN_COUNT, '0');
    return { canGen: true, remaining: 3 };
  }
  
  const maxFreeGens = 3;
  return { canGen: genCount < maxFreeGens, remaining: Math.max(0, maxFreeGens - genCount) };
};

// Record a generation
export const recordGeneration = () => {
  const today = new Date().toDateString();
  localStorage.setItem(STORAGE_KEY_LAST_GEN, today);
  const current = parseInt(localStorage.getItem(STORAGE_KEY_GEN_COUNT) || '0');
  localStorage.setItem(STORAGE_KEY_GEN_COUNT, (current + 1).toString());
};
