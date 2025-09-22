import { useState, useEffect } from 'react';
import { BREATHING_TECHNIQUES, ANIMATION_DURATIONS } from '@/constants';
import { BreathingState, BreathingTechnique } from '@/types/ui';

export const useBreathing = (initialTechnique: BreathingTechnique = 'relaxation') => {
  const [breathingState, setBreathingState] = useState<BreathingState>({
    isActive: false,
    phase: 'inhale',
    count: BREATHING_TECHNIQUES[initialTechnique].inhaleCount,
    cycle: 0,
    technique: initialTechnique
  });

  const currentTechnique = BREATHING_TECHNIQUES[breathingState.technique];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (breathingState.isActive) {
      interval = setInterval(() => {
        setBreathingState(prev => {
          const technique = BREATHING_TECHNIQUES[prev.technique];
          
          if (prev.phase === 'inhale' && prev.count <= 1) {
            return technique.holdCount > 0 
              ? { ...prev, phase: 'hold', count: technique.holdCount }
              : { ...prev, phase: 'exhale', count: technique.exhaleCount };
          }
          
          if (prev.phase === 'hold' && prev.count <= 1) {
            return { ...prev, phase: 'exhale', count: technique.exhaleCount };
          }
          
          if (prev.phase === 'exhale' && prev.count <= 1) {
            if (prev.technique === 'box') {
              return { ...prev, phase: 'pause', count: technique.holdCount };
            }
            return {
              ...prev,
              phase: 'inhale',
              count: technique.inhaleCount,
              cycle: prev.cycle + 1
            };
          }
          
          if (prev.phase === 'pause' && prev.count <= 1) {
            return {
              ...prev,
              phase: 'inhale',
              count: technique.inhaleCount,
              cycle: prev.cycle + 1
            };
          }
          
          return { ...prev, count: prev.count - 1 };
        });
      }, ANIMATION_DURATIONS.breathingCycle);
    }
    
    return () => clearInterval(interval);
  }, [breathingState.isActive, breathingState.phase, breathingState.technique]);

  const toggleBreathing = () => {
    setBreathingState(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetBreathing = () => {
    const technique = BREATHING_TECHNIQUES[breathingState.technique];
    setBreathingState({
      isActive: false,
      phase: 'inhale',
      count: technique.inhaleCount,
      cycle: 0,
      technique: breathingState.technique
    });
  };

  const changeTechnique = (newTechnique: BreathingTechnique) => {
    const technique = BREATHING_TECHNIQUES[newTechnique];
    setBreathingState({
      isActive: false,
      phase: 'inhale',
      count: technique.inhaleCount,
      cycle: 0,
      technique: newTechnique
    });
  };

  return {
    breathingState,
    currentTechnique,
    toggleBreathing,
    resetBreathing,
    changeTechnique
  };
};