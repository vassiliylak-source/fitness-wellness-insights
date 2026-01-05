import { useState, useCallback } from 'react';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { generateStruggleWorkout, ProtocolType, calculateSPEarned } from '@/lib/struggleEngine';
import { GeneratedExercise } from '@/constants/wod';
import { toast } from '@/hooks/use-toast';

interface WorkoutState {
  exercises: GeneratedExercise[];
  criticalOverload: GeneratedExercise | null;
  targetTime: number;
  protocolName: string;
  workoutGenerated: boolean;
  integrityPassed: boolean;
  showTimer: boolean;
  selectedProtocol: ProtocolType;
}

const initialState: WorkoutState = {
  exercises: [],
  criticalOverload: null,
  targetTime: 180,
  protocolName: '',
  workoutGenerated: false,
  integrityPassed: false,
  showTimer: false,
  selectedProtocol: 'GRAVITY',
};

export const useWorkoutState = () => {
  const { canGenerate, recordGeneration, completeProtocol } = useChaosEngine();
  
  const [state, setState] = useState<WorkoutState>(initialState);

  const setSelectedProtocol = useCallback((protocol: ProtocolType) => {
    setState(prev => ({ ...prev, selectedProtocol: protocol }));
  }, []);

  const handleGenerate = useCallback(() => {
    const { canGen } = canGenerate();
    if (!canGen) {
      toast({
        title: 'GENERATION LIMIT',
        description: 'Daily protocol limit reached. Upgrade to PRO for unlimited.',
        variant: 'destructive',
      });
      return;
    }
    
    recordGeneration();
    
    const workout = generateStruggleWorkout(state.selectedProtocol);
    
    setState(prev => ({
      ...prev,
      exercises: workout.exercises,
      criticalOverload: workout.criticalOverload,
      targetTime: workout.targetTime,
      protocolName: workout.protocol.name,
      workoutGenerated: true,
      integrityPassed: false,
      showTimer: false,
    }));
    
    toast({
      title: 'PROTOCOL COMPILED',
      description: `${workout.protocol.name} — Target: ${Math.floor(workout.targetTime / 60)}:${(workout.targetTime % 60).toString().padStart(2, '0')}`,
    });
  }, [canGenerate, recordGeneration, state.selectedProtocol]);

  const handleIntegrityComplete = useCallback(() => {
    setState(prev => ({ ...prev, integrityPassed: true }));
  }, []);

  const handleStartTimer = useCallback(() => {
    setState(prev => ({ ...prev, showTimer: true }));
  }, []);

  const handleTimerComplete = useCallback((actualTime: number, beatTarget: boolean) => {
    // Use setState callback to access current state values, avoiding stale closures
    setState(prev => {
      const spEarned = calculateSPEarned(actualTime, prev.targetTime, prev.selectedProtocol);
      completeProtocol(spEarned);
      
      toast({
        title: beatTarget ? 'PROTOCOL COMPLETE' : 'PROTOCOL SURVIVED',
        description: `+${spEarned} SP earned. ${beatTarget ? 'Target beaten.' : 'Keep pushing.'}`,
      });
      
      return {
        ...prev,
        showTimer: false,
        workoutGenerated: false,
        integrityPassed: false,
      };
    });
  }, [completeProtocol]);

  const handleTimerAbort = useCallback(() => {
    setState(prev => ({
      ...prev,
      showTimer: false,
      workoutGenerated: false,
      integrityPassed: false,
    }));
  }, []);

  const resetWorkout = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setSelectedProtocol,
    handleGenerate,
    handleIntegrityComplete,
    handleStartTimer,
    handleTimerComplete,
    handleTimerAbort,
    resetWorkout,
  };
};
