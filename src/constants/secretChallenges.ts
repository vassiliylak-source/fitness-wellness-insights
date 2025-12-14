// SECRET CHALLENGES - Unlockable WODs and Mythic Challenges
// These are hidden from the UI until unlocked

export interface SecretChallenge {
  id: string;
  name: string;
  codename: string;
  description: string;
  exercises: {
    name: string;
    value: number;
    measureType: 'reps' | 'seconds';
  }[];
  unlockCondition: string;
  unlockRequirement: {
    type: 'streak' | 'total_workouts' | 'mythic_completion';
    value: number;
  };
  globalCompletions: number; // Simulated count for FOMO
  difficulty: 'legendary' | 'mythic' | 'omega';
  icon: string;
}

export interface MythicRoll {
  id: string;
  name: string;
  tagline: string;
  exercises: {
    name: string;
    value: number;
    measureType: 'reps' | 'seconds';
  }[];
  globalCompletions: number;
  probability: string;
  icon: string;
}

// Mythic Rolls - 1/100 chance during generation
export const MYTHIC_ROLLS: MythicRoll[] = [
  {
    id: 'death_by_burpees',
    name: 'DEATH BY BURPEES',
    tagline: 'The ultimate cardio punishment',
    exercises: [
      { name: 'Burpee Overs', value: 100, measureType: 'reps' }
    ],
    globalCompletions: 23,
    probability: '1/100',
    icon: '💀'
  },
  {
    id: 'century_squats',
    name: 'CENTURY SQUATS',
    tagline: 'Your legs will remember this',
    exercises: [
      { name: 'Air Squats', value: 100, measureType: 'reps' }
    ],
    globalCompletions: 47,
    probability: '1/100',
    icon: '🦵'
  },
  {
    id: 'iron_plank',
    name: 'IRON PLANK PROTOCOL',
    tagline: 'Mental fortitude test',
    exercises: [
      { name: 'Plank Hold', value: 300, measureType: 'seconds' }
    ],
    globalCompletions: 12,
    probability: '1/100',
    icon: '🪨'
  },
  {
    id: 'push_up_gauntlet',
    name: 'PUSH-UP GAUNTLET',
    tagline: 'Upper body destruction sequence',
    exercises: [
      { name: 'Push-Ups', value: 75, measureType: 'reps' }
    ],
    globalCompletions: 31,
    probability: '1/100',
    icon: '💪'
  },
  {
    id: 'burner_protocol',
    name: 'THE BURNER PROTOCOL',
    tagline: 'Everything burns',
    exercises: [
      { name: 'Burpee Overs', value: 21, measureType: 'reps' },
      { name: 'Air Squats', value: 42, measureType: 'reps' },
      { name: 'Push-Ups', value: 21, measureType: 'reps' }
    ],
    globalCompletions: 18,
    probability: '1/100',
    icon: '🔥'
  },
  {
    id: 'hollow_nightmare',
    name: 'HOLLOW NIGHTMARE',
    tagline: 'Core destruction imminent',
    exercises: [
      { name: 'Hollow Body Hold', value: 60, measureType: 'seconds' },
      { name: 'V-Ups', value: 30, measureType: 'reps' },
      { name: 'Hollow Body Hold', value: 60, measureType: 'seconds' }
    ],
    globalCompletions: 8,
    probability: '1/100',
    icon: '🥄'
  }
];

// Secret unlockable WODs
export const SECRET_CHALLENGES: SecretChallenge[] = [
  {
    id: 'protocol_omega',
    name: 'PROTOCOL OMEGA',
    codename: 'THE FINAL TEST',
    description: 'Only those who prove dedication unlock this.',
    exercises: [
      { name: 'Burpee Overs', value: 50, measureType: 'reps' },
      { name: 'Air Squats', value: 100, measureType: 'reps' },
      { name: 'Push-Ups', value: 50, measureType: 'reps' },
      { name: 'Plank Hold', value: 120, measureType: 'seconds' }
    ],
    unlockCondition: 'Complete 10 workouts total',
    unlockRequirement: { type: 'total_workouts', value: 10 },
    globalCompletions: 156,
    difficulty: 'omega',
    icon: 'Ω'
  },
  {
    id: 'seven_day_crucible',
    name: 'SEVEN DAY CRUCIBLE',
    codename: 'CONSISTENCY PROTOCOL',
    description: 'Unlocked by 7-day streak warriors.',
    exercises: [
      { name: 'Burpee Overs', value: 7, measureType: 'reps' },
      { name: 'Air Squats', value: 49, measureType: 'reps' },
      { name: 'Push-Ups', value: 28, measureType: 'reps' },
      { name: 'Mountain Climbers', value: 70, measureType: 'reps' },
      { name: 'Plank Hold', value: 70, measureType: 'seconds' }
    ],
    unlockCondition: 'Maintain a 7-day streak',
    unlockRequirement: { type: 'streak', value: 7 },
    globalCompletions: 89,
    difficulty: 'legendary',
    icon: '🔥'
  },
  {
    id: 'spartan_initiation',
    name: 'SPARTAN INITIATION',
    codename: 'WARRIOR RITE',
    description: 'The entry exam for dedicated operators.',
    exercises: [
      { name: 'Burpee Overs', value: 30, measureType: 'reps' },
      { name: 'Air Squats', value: 60, measureType: 'reps' },
      { name: 'Push-Ups', value: 30, measureType: 'reps' },
      { name: 'Lunges', value: 40, measureType: 'reps' },
      { name: 'Plank Hold', value: 90, measureType: 'seconds' }
    ],
    unlockCondition: 'Complete 25 workouts total',
    unlockRequirement: { type: 'total_workouts', value: 25 },
    globalCompletions: 67,
    difficulty: 'legendary',
    icon: '⚔️'
  },
  {
    id: 'void_protocol',
    name: 'VOID PROTOCOL',
    codename: 'BEYOND LIMITS',
    description: 'For those who have conquered a Mythic Challenge.',
    exercises: [
      { name: 'Burpee Overs', value: 40, measureType: 'reps' },
      { name: 'Push-Ups', value: 60, measureType: 'reps' },
      { name: 'Air Squats', value: 80, measureType: 'reps' },
      { name: 'V-Ups', value: 40, measureType: 'reps' },
      { name: 'Mountain Climbers', value: 60, measureType: 'reps' },
      { name: 'Plank Hold', value: 120, measureType: 'seconds' }
    ],
    unlockCondition: 'Complete any Mythic Challenge',
    unlockRequirement: { type: 'mythic_completion', value: 1 },
    globalCompletions: 23,
    difficulty: 'mythic',
    icon: '🕳️'
  },
  {
    id: 'iron_month',
    name: 'IRON MONTH FINALE',
    codename: 'MONTH OF IRON',
    description: 'The ultimate reward for 30-day warriors.',
    exercises: [
      { name: 'Burpee Overs', value: 30, measureType: 'reps' },
      { name: 'Air Squats', value: 30, measureType: 'reps' },
      { name: 'Push-Ups', value: 30, measureType: 'reps' },
      { name: 'Lunges', value: 30, measureType: 'reps' },
      { name: 'Mountain Climbers', value: 30, measureType: 'reps' },
      { name: 'V-Ups', value: 30, measureType: 'reps' },
      { name: 'Plank Hold', value: 30, measureType: 'seconds' }
    ],
    unlockCondition: 'Complete 50 workouts total',
    unlockRequirement: { type: 'total_workouts', value: 50 },
    globalCompletions: 11,
    difficulty: 'mythic',
    icon: '🏆'
  }
];

// Check if a secret challenge is unlocked
export const isSecretUnlocked = (
  challengeId: string,
  unlockedFeatures: string[]
): boolean => {
  return unlockedFeatures.includes(challengeId);
};

// Get all unlocked secret challenges
export const getUnlockedSecrets = (
  unlockedFeatures: string[]
): SecretChallenge[] => {
  return SECRET_CHALLENGES.filter(c => unlockedFeatures.includes(c.id));
};

// Check what secrets are close to being unlocked
export const getNextUnlockable = (
  currentStreak: number,
  totalWorkouts: number,
  unlockedFeatures: string[]
): { challenge: SecretChallenge; progress: number; remaining: number } | null => {
  for (const challenge of SECRET_CHALLENGES) {
    if (unlockedFeatures.includes(challenge.id)) continue;
    
    const req = challenge.unlockRequirement;
    let currentValue = 0;
    
    if (req.type === 'streak') {
      currentValue = currentStreak;
    } else if (req.type === 'total_workouts') {
      currentValue = totalWorkouts;
    }
    
    if (currentValue < req.value) {
      return {
        challenge,
        progress: (currentValue / req.value) * 100,
        remaining: req.value - currentValue
      };
    }
  }
  
  return null;
};

// Get a random mythic roll
export const getRandomMythicRoll = (): MythicRoll => {
  return MYTHIC_ROLLS[Math.floor(Math.random() * MYTHIC_ROLLS.length)];
};
