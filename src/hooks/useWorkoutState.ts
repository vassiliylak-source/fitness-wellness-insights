import { useState, useCallback } from 'react';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { generateStruggleWorkout, ProtocolType, calculateSPEarned } from '@/lib/struggleEngine';
import { GeneratedExercise } from '@/constants/wod';
import { toast } from '@/hooks/use-toast';

interface VerificationStats {
  passed: number;
  total: number;
}

interface WorkoutState {
  exercises: GeneratedExercise[];
  criticalOverload: GeneratedExercise | null;
  targetTime: number;
  protocolName: string;
  workoutGenerated: boolean;
  integrityPassed: boolean;
  showTimer: boolean;
  showProofCapture: boolean;
  selectedProtocol: ProtocolType;
  pendingCompletion: {
    actualTime: number;
    beatTarget: boolean;
    verificationStats: VerificationStats;
  } | null;
}

const initialState: WorkoutState = {
  exercises: [],
  criticalOverload: null,
  targetTime: 180,
  protocolName: '',
  workoutGenerated: false,
  integrityPassed: false,
  showTimer: false,
  showProofCapture: false,
  selectedProtocol: 'GRAVITY',
  pendingCompletion: null,
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
      showProofCapture: false,
      pendingCompletion: null,
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

  const handleTimerComplete = useCallback((
    actualTime: number, 
    beatTarget: boolean, 
    verificationStats?: VerificationStats
  ) => {
    // Store completion data and show proof capture
    setState(prev => ({
      ...prev,
      showTimer: false,
      showProofCapture: true,
      pendingCompletion: {
        actualTime,
        beatTarget,
        verificationStats: verificationStats || { passed: 0, total: 0 },
      },
    }));
  }, []);

  const handleProofSubmitted = useCallback((photoUrl: string | null) => {
    setState(prev => {
      if (!prev.pendingCompletion) return prev;
      
      const { actualTime, beatTarget, verificationStats } = prev.pendingCompletion;
      const spEarned = calculateSPEarned(actualTime, prev.targetTime, prev.selectedProtocol);
      
      // Bonus SP for verified workouts
      const verificationBonus = verificationStats.passed === verificationStats.total && verificationStats.total > 0 ? 5 : 0;
      const photoBonus = photoUrl ? 10 : 0;
      const totalSP = spEarned + verificationBonus + photoBonus;
      
      completeProtocol(totalSP);
      
      const bonusText = [];
      if (verificationBonus > 0) bonusText.push(`+${verificationBonus} integrity`);
      if (photoBonus > 0) bonusText.push(`+${photoBonus} proof`);
      
      toast({
        title: beatTarget ? 'PROTOCOL COMPLETE' : 'PROTOCOL SURVIVED',
        description: `+${totalSP} SP earned. ${bonusText.length > 0 ? `(${bonusText.join(', ')})` : ''} ${beatTarget ? 'Target beaten.' : 'Keep pushing.'}`,
      });
      
      return {
        ...initialState,
        selectedProtocol: prev.selectedProtocol,
      };
    });
  }, [completeProtocol]);

  const handleProofSkipped = useCallback(() => {
    setState(prev => {
      if (!prev.pendingCompletion) return prev;
      
      const { actualTime, beatTarget, verificationStats } = prev.pendingCompletion;
      const spEarned = calculateSPEarned(actualTime, prev.targetTime, prev.selectedProtocol);
      
      // Reduced SP for unverified workouts
      const verificationPenalty = verificationStats.passed < verificationStats.total ? 5 : 0;
      const totalSP = Math.max(spEarned - verificationPenalty, 1);
      
      completeProtocol(totalSP);
      
      toast({
        title: 'WORKOUT UNVERIFIED',
        description: `+${totalSP} SP earned. No proof submitted.`,
        variant: 'destructive',
      });
      
      return {
        ...initialState,
        selectedProtocol: prev.selectedProtocol,
      };
    });
  }, [completeProtocol]);

  const handleTimerAbort = useCallback(() => {
    setState(prev => ({
      ...prev,
      showTimer: false,
      showProofCapture: false,
      workoutGenerated: false,
      integrityPassed: false,
      pendingCompletion: null,
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
    handleProofSubmitted,
    handleProofSkipped,
    resetWorkout,
  };
};
