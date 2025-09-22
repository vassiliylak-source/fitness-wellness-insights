import { BreathingPhase } from '@/types/ui';

export const getPhaseDisplay = (phase: BreathingPhase): string => {
  const displays = {
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    pause: 'Pause'
  };
  return displays[phase];
};

export const getPhaseColor = (phase: BreathingPhase, baseColor: string) => {
  const colorMap: Record<string, Record<BreathingPhase, any>> = {
    blue: {
      inhale: {
        border: 'border-blue-500',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        textLight: 'text-blue-600'
      },
      hold: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        textLight: 'text-yellow-600'
      },
      exhale: {
        border: 'border-cyan-500',
        bg: 'bg-cyan-100',
        text: 'text-cyan-700',
        textLight: 'text-cyan-600'
      },
      pause: {
        border: 'border-gray-500',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        textLight: 'text-gray-600'
      }
    },
    green: {
      inhale: {
        border: 'border-green-500',
        bg: 'bg-green-100',
        text: 'text-green-700',
        textLight: 'text-green-600'
      },
      hold: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        textLight: 'text-yellow-600'
      },
      exhale: {
        border: 'border-emerald-500',
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        textLight: 'text-emerald-600'
      },
      pause: {
        border: 'border-gray-500',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        textLight: 'text-gray-600'
      }
    },
    purple: {
      inhale: {
        border: 'border-purple-500',
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        textLight: 'text-purple-600'
      },
      hold: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        textLight: 'text-yellow-600'
      },
      exhale: {
        border: 'border-violet-500',
        bg: 'bg-violet-100',
        text: 'text-violet-700',
        textLight: 'text-violet-600'
      },
      pause: {
        border: 'border-gray-500',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        textLight: 'text-gray-600'
      }
    }
  };

  return colorMap[baseColor]?.[phase] || colorMap.blue[phase];
};

export const getBreathingInstruction = (phase: BreathingPhase): string => {
  const instructions = {
    inhale: 'Breathe In',
    hold: 'Hold Your Breath',
    exhale: 'Breathe Out',
    pause: 'Pause'
  };
  return instructions[phase];
};