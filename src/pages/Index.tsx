import { Helmet } from 'react-helmet-async';
import LiveLossFeed from '@/components/ChaosEngine/LiveLossFeed';
import VaultDisplay from '@/components/ChaosEngine/VaultDisplay';
import StakingInterface from '@/components/ChaosEngine/StakingInterface';
import IntegrityChecks from '@/components/ChaosEngine/IntegrityChecks';
import LockedTimer from '@/components/ChaosEngine/LockedTimer';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { useState, useCallback } from 'react';
import { Skull, Zap, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isStaked, canGenerate, recordGeneration, completeProtocol, vault } = useChaosEngine();
  const [integrityPassed, setIntegrityPassed] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);

  const handleGenerate = useCallback(() => {
    const { canGen } = canGenerate();
    if (!canGen) return;
    
    recordGeneration();
    setWorkoutGenerated(true);
    setIntegrityPassed(false);
    setShowTimer(false);
  }, [canGenerate, recordGeneration]);

  const handleIntegrityComplete = useCallback(() => {
    setIntegrityPassed(true);
  }, []);

  const handleStartTimer = useCallback(() => {
    setShowTimer(true);
  }, []);

  const handleTimerComplete = useCallback((time: number, beatTarget: boolean) => {
    const spEarned = beatTarget ? 50 : 25;
    completeProtocol(spEarned);
    setShowTimer(false);
    setWorkoutGenerated(false);
    setIntegrityPassed(false);
  }, [completeProtocol]);

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
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
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

          {/* Main Terminal Content */}
          {isStaked && !workoutGenerated && (
            <div className="card-terminal p-6 space-y-6">
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
          )}

          {/* Workout Generated - Integrity Checks */}
          {workoutGenerated && !showTimer && (
            <div className="card-terminal p-6 space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-primary terminal-glow">
                  [PROTOCOL COMPILED]
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Complete integrity verification to proceed
                </div>
              </div>

              <IntegrityChecks 
                onAllChecked={handleIntegrityComplete}
                disabled={showTimer}
              />

              {integrityPassed && (
                <Button
                  onClick={handleStartTimer}
                  className="btn-terminal w-full animate-fade-in"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  ENGAGE EXECUTION TERMINAL
                </Button>
              )}
            </div>
          )}

          {/* Locked Timer */}
          {showTimer && (
            <div className="card-terminal p-6 animate-fade-in">
              <LockedTimer
                targetTime={180}
                onComplete={handleTimerComplete}
                onAbort={handleTimerAbort}
              />
            </div>
          )}

          {/* Footer */}
          <footer className="text-center text-xs text-muted-foreground space-y-2 pt-8">
            <p>Evolution is not optional. Discipline is the only currency.</p>
            <p className="text-primary/40">
              SP: {vault.sweatPoints} | Streak: {vault.streakDays} days
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
