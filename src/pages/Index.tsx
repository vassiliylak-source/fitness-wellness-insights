import { Helmet } from 'react-helmet-async';
import LiveLossFeed from '@/components/ChaosEngine/LiveLossFeed';
import VaultDisplay from '@/components/ChaosEngine/VaultDisplay';
import StakingInterface from '@/components/ChaosEngine/StakingInterface';
import IntegrityChecks from '@/components/ChaosEngine/IntegrityChecks';
import LockedTimer from '@/components/ChaosEngine/LockedTimer';
import ProtocolSelector from '@/components/ChaosEngine/ProtocolSelector';
import WorkoutDisplay from '@/components/ChaosEngine/WorkoutDisplay';
import SPStore from '@/components/ChaosEngine/SPStore';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { useState, useCallback } from 'react';
import { Skull, Terminal, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateStruggleWorkout, ProtocolType, calculateSPEarned } from '@/lib/struggleEngine';
import { GeneratedExercise } from '@/constants/wod';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { isStaked, canGenerate, recordGeneration, completeProtocol, vault } = useChaosEngine();
  const [integrityPassed, setIntegrityPassed] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>('GRAVITY');
  const [showStore, setShowStore] = useState(false);
  
  // Workout state
  const [exercises, setExercises] = useState<GeneratedExercise[]>([]);
  const [criticalOverload, setCriticalOverload] = useState<GeneratedExercise | null>(null);
  const [targetTime, setTargetTime] = useState(180);
  const [protocolName, setProtocolName] = useState('');

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
    
    // Generate workout using struggle engine
    const workout = generateStruggleWorkout(selectedProtocol);
    setExercises(workout.exercises);
    setCriticalOverload(workout.criticalOverload);
    setTargetTime(workout.targetTime);
    setProtocolName(workout.protocol.name);
    
    setWorkoutGenerated(true);
    setIntegrityPassed(false);
    setShowTimer(false);
    
    toast({
      title: 'PROTOCOL COMPILED',
      description: `${workout.protocol.name} — Target: ${Math.floor(workout.targetTime / 60)}:${(workout.targetTime % 60).toString().padStart(2, '0')}`,
    });
  }, [canGenerate, recordGeneration, selectedProtocol]);

  const handleIntegrityComplete = useCallback(() => {
    setIntegrityPassed(true);
  }, []);

  const handleStartTimer = useCallback(() => {
    setShowTimer(true);
  }, []);

  const handleTimerComplete = useCallback((actualTime: number, beatTarget: boolean) => {
    const spEarned = calculateSPEarned(actualTime, targetTime, selectedProtocol);
    completeProtocol(spEarned);
    
    toast({
      title: beatTarget ? 'PROTOCOL COMPLETE' : 'PROTOCOL SURVIVED',
      description: `+${spEarned} SP earned. ${beatTarget ? 'Target beaten.' : 'Keep pushing.'}`,
    });
    
    setShowTimer(false);
    setWorkoutGenerated(false);
    setIntegrityPassed(false);
  }, [completeProtocol, targetTime, selectedProtocol]);

  const handleTimerAbort = useCallback(() => {
    setShowTimer(false);
    setWorkoutGenerated(false);
    setIntegrityPassed(false);
  }, []);

  const { remaining } = canGenerate();

  return (
    <>
      <Helmet>
        <title>CHAOS ENGINE v4.0 | Biological Evolution Terminal</title>
        <meta name="description" content="Discipline contract system. Stake capital, execute protocols, or face the Weakness Tax. Evolution is not optional." />
      </Helmet>
      
      <div className="min-h-screen bg-background scanlines">
        {/* Live Loss Feed */}
        <LiveLossFeed />

        {/* Main Terminal */}
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <header className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                BIOLOGICAL EVOLUTION TERMINAL
              </span>
            </div>
            
            <h1 className="terminal-header text-primary terminal-glow terminal-cursor">
              CHAOS ENGINE
            </h1>
            
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              v4.0 — Loss Aversion Protocol Active
              <br />
              <span className="text-secondary">Discipline is the only currency.</span>
            </p>
          </header>

          {/* Vault Display (if staked) */}
          <VaultDisplay />

          {/* Staking Interface (if not staked) */}
          {!isStaked && <StakingInterface />}

          {/* Main Terminal Content - Protocol Selection & Generation */}
          {isStaked && !workoutGenerated && (
            <div className="space-y-4">
              {/* Protocol Selector */}
              <div className="card-terminal p-6">
                <ProtocolSelector
                  selected={selectedProtocol}
                  onSelect={setSelectedProtocol}
                />
              </div>

              {/* Generate Button */}
              <div className="card-terminal p-6">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
                    // PROTOCOL GENERATOR
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={remaining <= 0}
                    className="btn-terminal text-lg px-12 py-6"
                  >
                    <Skull className="w-5 h-5 mr-3" />
                    INITIATE SEQUENCE
                  </Button>
                  <div className="text-xs text-muted-foreground mt-4">
                    {remaining > 0 ? `${remaining} generations remaining today` : 'Daily limit reached'}
                  </div>
                </div>
              </div>

              {/* SP Store Toggle */}
              <button
                onClick={() => setShowStore(!showStore)}
                className="w-full flex items-center justify-between p-3 border border-border hover:border-energy/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    SURVIVAL STORE
                  </span>
                </div>
                {showStore ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              
              {showStore && <SPStore />}
            </div>
          )}

          {/* Workout Generated - Show Workout + Integrity Checks */}
          {workoutGenerated && !showTimer && (
            <div className="space-y-4 animate-fade-in">
              {/* Workout Display */}
              <div className="card-terminal p-6">
                <WorkoutDisplay
                  exercises={exercises}
                  criticalOverload={criticalOverload}
                  protocolName={protocolName}
                  targetTime={targetTime}
                />
              </div>

              {/* Integrity Checks */}
              <div className="card-terminal p-6">
                <IntegrityChecks 
                  onAllChecked={handleIntegrityComplete}
                  disabled={showTimer}
                />

                {integrityPassed && (
                  <Button
                    onClick={handleStartTimer}
                    className="btn-terminal w-full mt-6 animate-fade-in"
                  >
                    <Skull className="w-4 h-4 mr-2" />
                    ENGAGE EXECUTION TERMINAL
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Locked Timer */}
          {showTimer && (
            <div className="card-terminal p-6 animate-fade-in">
              <LockedTimer
                targetTime={targetTime}
                onComplete={handleTimerComplete}
                onAbort={handleTimerAbort}
              />
            </div>
          )}

          {/* Footer */}
          <footer className="text-center text-xs text-muted-foreground space-y-2 pt-8 border-t border-border">
            <p>Evolution is not optional. Discipline is the only currency.</p>
            <p className="text-primary/40">
              SP: {vault.sweatPoints} | Streak: {vault.streakDays} days | Tier: {vault.tier.toUpperCase()}
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
