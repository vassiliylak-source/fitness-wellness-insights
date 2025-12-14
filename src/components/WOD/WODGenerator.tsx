import { useState, useCallback, useEffect } from 'react';
import { Zap, Clock, Target, AlertTriangle, Skull, History, LogOut } from 'lucide-react';
import { 
  generateWOD, 
  GeneratedWOD, 
  GeneratedExercise,
  ALGORITHM_PHRASES,
  formatTime,
  canGenerate,
  recordGeneration,
  EXERCISES
} from '@/constants/wod';
import { 
  MythicRoll, 
  SecretChallenge,
  getRandomMythicRoll, 
  getNextUnlockable,
  getUnlockedSecrets
} from '@/constants/secretChallenges';
import SlotMachine from './SlotMachine';
import Timer from './Timer';
import GenerateButton from './GenerateButton';
import PackageSelector from './PackageSelector';
import StreakCounter from './Chronicle/StreakCounter';
import HallOfPain from './Chronicle/HallOfPain';
import PostWorkoutSurvey from './Chronicle/PostWorkoutSurvey';
import PreWorkoutChecklist from './Rituals/PreWorkoutChecklist';
import RareRoll from './EasterEggs/RareRoll';
import SecretUnlock from './EasterEggs/SecretUnlock';
import UnlockProgress from './EasterEggs/UnlockProgress';
import GhostMode from './GhostMode';
import GlobalStats from './GlobalStats';
import { audioEngine } from '@/lib/audioEngine';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AuthRequiredModal from '@/components/AuthRequiredModal';

const WODGenerator = () => {
  const [selectedPackage, setSelectedPackage] = useState('bodyweight');
  const [currentWOD, setCurrentWOD] = useState<GeneratedWOD | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [algorithmPhrase, setAlgorithmPhrase] = useState('');
  const [remainingGenerations, setRemainingGenerations] = useState(3);
  const [sabotageActive, setSabotageActive] = useState(false);
  const [sabotageExercise, setSabotageExercise] = useState<GeneratedExercise | null>(null);
  const [isScaledDown, setIsScaledDown] = useState(false);
  const [isCheatDay, setIsCheatDay] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Retention system states
  const [showChecklist, setShowChecklist] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showChronicle, setShowChronicle] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [beatTarget, setBeatTarget] = useState(false);
  const [showRareRoll, setShowRareRoll] = useState(false);
  const [rareChallenge, setRareChallenge] = useState<MythicRoll | null>(null);
  const [showSecretUnlock, setShowSecretUnlock] = useState(false);
  const [unlockedSecret, setUnlockedSecret] = useState<SecretChallenge | null>(null);
  const [globalStats, setGlobalStats] = useState<{
    total_completions: number;
    average_time: number;
    fastest_time: number | null;
  } | null>(null);

  // Auth and workout session hooks
  const { signOut, user } = useAuth();
  const { 
    streakData, 
    workoutHistory, 
    recordWorkout, 
    getGlobalStats,
    getGhostTime,
    isLoading 
  } = useWorkoutSession();

  // Check for "Cheat Day" - late night recovery
  useEffect(() => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    if ((day === 5 || day === 6) && (hour >= 23 || hour < 5)) {
      setIsCheatDay(true);
    }
  }, []);

  // Check generation limit on mount
  useEffect(() => {
    const { remaining } = canGenerate();
    setRemainingGenerations(remaining);
  }, []);

  // Fetch global stats when WOD is generated
  useEffect(() => {
    const fetchStats = async () => {
      if (currentWOD) {
        const stats = await getGlobalStats(currentWOD);
        setGlobalStats(stats);
      }
    };
    fetchStats();
  }, [currentWOD, getGlobalStats]);

  const handleGenerate = useCallback(() => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const { canGen } = canGenerate();
    if (!canGen) return;

    // Check for rare roll (1/100 chance)
    if (Math.random() < 0.01) {
      const challenge = getRandomMythicRoll();
      setRareChallenge(challenge);
      setShowRareRoll(true);
      audioEngine.play('glitch');
      return;
    }

    setIsGenerating(true);
    setIsSpinning(true);
    setShowTimer(false);
    setShowChecklist(false);
    setShowSurvey(false);
    setSabotageActive(false);
    setSabotageExercise(null);
    setIsScaledDown(false);
    setGlobalStats(null);
    
    audioEngine.play('hydraulic');
    
    setTimeout(() => {
      const wod = generateWOD(selectedPackage, 3);
      setCurrentWOD(wod);
      setIsGenerating(false);
      setIsSpinning(false);
      setAlgorithmPhrase(ALGORITHM_PHRASES[Math.floor(Math.random() * ALGORITHM_PHRASES.length)]);
      
      recordGeneration();
      const { remaining } = canGenerate();
      setRemainingGenerations(remaining);
      
      audioEngine.play('shutter');
    }, 800);
  }, [selectedPackage, user]);

  const handleSpinComplete = useCallback(() => {
    // Show pre-workout checklist instead of timer directly
    setShowChecklist(true);
  }, []);

  const handleChecklistComplete = useCallback(() => {
    setShowChecklist(false);
    setShowTimer(true);
  }, []);

  const handleChecklistSkip = useCallback(() => {
    setShowChecklist(false);
    setShowTimer(true);
  }, []);

  const handleWorkoutComplete = useCallback((time: number, didBeatTarget: boolean) => {
    setWorkoutTime(time);
    setBeatTarget(didBeatTarget);
    setShowSurvey(true);
  }, []);

  const handleSurveySubmit = useCallback(async (feeling: 'dead' | 'ok' | 'more') => {
    if (currentWOD) {
      await recordWorkout(currentWOD, workoutTime, undefined, feeling);
    }
    setShowSurvey(false);
  }, [currentWOD, workoutTime, recordWorkout]);

  const handleSurveySkip = useCallback(async () => {
    if (currentWOD) {
      await recordWorkout(currentWOD, workoutTime);
    }
    setShowSurvey(false);
  }, [currentWOD, workoutTime, recordWorkout]);

  const handleRareRollAccept = useCallback(() => {
    if (!rareChallenge) return;
    
    // Convert mythic roll to a special WOD
    const mythicExercises: GeneratedExercise[] = rareChallenge.exercises.map(ex => ({
      exercise: EXERCISES.find(e => e.name === ex.name) || EXERCISES[0],
      value: ex.value,
      format: ex.measureType,
      estimatedTime: ex.measureType === 'seconds' ? ex.value : ex.value * 3
    }));

    const totalTime = mythicExercises.reduce((sum, ex) => sum + ex.estimatedTime, 0);
    
    setCurrentWOD({
      exercises: mythicExercises,
      totalEstimatedTime: totalTime,
      targetTime: Math.round(totalTime * 0.9),
      format: 'reps',
      package: 'MYTHIC',
      sequenceId: `MYTH-${Math.floor(Math.random() * 1000)}`
    });
    
    setAlgorithmPhrase('MYTHIC PROTOCOL ENGAGED');
    setShowRareRoll(false);
    setShowChecklist(true);
    audioEngine.play('shutter');
  }, [rareChallenge]);

  const handleRareRollDecline = useCallback(() => {
    setShowRareRoll(false);
    setRareChallenge(null);
  }, []);

  const handleSecretAccept = useCallback(() => {
    if (!unlockedSecret) return;
    
    // Convert secret challenge to a special WOD
    const secretExercises: GeneratedExercise[] = unlockedSecret.exercises.map(ex => ({
      exercise: EXERCISES.find(e => e.name === ex.name) || EXERCISES[0],
      value: ex.value,
      format: ex.measureType,
      estimatedTime: ex.measureType === 'seconds' ? ex.value : ex.value * 3
    }));

    const totalTime = secretExercises.reduce((sum, ex) => sum + ex.estimatedTime, 0);
    
    setCurrentWOD({
      exercises: secretExercises,
      totalEstimatedTime: totalTime,
      targetTime: Math.round(totalTime * 0.85),
      format: 'reps',
      package: unlockedSecret.name,
      sequenceId: `SEC-${Math.floor(Math.random() * 1000)}`
    });
    
    setAlgorithmPhrase(unlockedSecret.codename);
    setShowSecretUnlock(false);
    setShowChecklist(true);
    audioEngine.play('shutter');
  }, [unlockedSecret]);

  const handleSecretDismiss = useCallback(() => {
    setShowSecretUnlock(false);
    setUnlockedSecret(null);
  }, []);

  const handleRerollExercise = useCallback((index: number) => {
    console.log('Reroll exercise at index:', index);
  }, []);

  const handleScaleDown = useCallback(() => {
    if (!currentWOD) return;
    
    const scaledExercises = currentWOD.exercises.map(ex => ({
      ...ex,
      value: Math.round(ex.value * 0.7)
    }));
    
    setCurrentWOD({
      ...currentWOD,
      exercises: scaledExercises,
      targetTime: Math.round(currentWOD.targetTime * 0.7)
    });
    
    setIsScaledDown(true);
  }, [currentWOD]);

  const handleSabotage = useCallback(() => {
    if (!currentWOD) return;
    
    const availableExercises = EXERCISES.filter(
      e => !currentWOD.exercises.find(ex => ex.exercise.id === e.id)
    );
    
    if (availableExercises.length === 0) return;
    
    const randomExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    const sabotageValue = Math.round(randomExercise.minValue + (randomExercise.maxValue - randomExercise.minValue) * 0.3);
    
    const newExercise: GeneratedExercise = {
      exercise: randomExercise,
      value: sabotageValue,
      format: randomExercise.measureType,
      estimatedTime: randomExercise.measureType === 'seconds' 
        ? sabotageValue 
        : sabotageValue * (randomExercise.estimatedSecondsPerRep || 2)
    };
    
    setSabotageExercise(newExercise);
    setSabotageActive(true);
    
    setCurrentWOD({
      ...currentWOD,
      exercises: [...currentWOD.exercises, newExercise],
      totalEstimatedTime: currentWOD.totalEstimatedTime + newExercise.estimatedTime
    });
  }, [currentWOD]);

  // Get ghost time for current WOD
  const ghostTime = currentWOD ? getGhostTime(currentWOD) : null;

  // Get next unlockable progress
  const nextUnlockable = streakData 
    ? getNextUnlockable(
        streakData.current_streak, 
        streakData.total_workouts, 
        streakData.unlocked_features
      ) 
    : null;

  // Get unlocked secrets
  const unlockedSecrets = streakData 
    ? getUnlockedSecrets(streakData.unlocked_features) 
    : [];

  // Rare Roll Modal
  if (showRareRoll && rareChallenge) {
    return (
      <RareRoll
        challenge={rareChallenge}
        onAccept={handleRareRollAccept}
        onDecline={handleRareRollDecline}
      />
    );
  }

  // Secret Unlock Modal
  if (showSecretUnlock && unlockedSecret) {
    return (
      <SecretUnlock
        challenge={unlockedSecret}
        onAccept={handleSecretAccept}
        onDismiss={handleSecretDismiss}
      />
    );
  }

  // Cheat Day Easter Egg
  if (isCheatDay) {
    return (
      <div className="min-h-screen px-4 py-8 md:py-16 flex items-center justify-center scanlines">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-8">😴</div>
          <h1 className="text-2xl md:text-4xl font-mono font-bold text-foreground uppercase mb-4">
            SYSTEM OVERRIDE
          </h1>
          <p className="text-muted-foreground font-mono text-lg mb-8">
            Recovery is part of the process.
            <br />
            <span className="text-primary">Go to sleep.</span>
          </p>
          <button 
            onClick={() => setIsCheatDay(false)}
            className="text-xs text-muted-foreground/40 font-mono uppercase hover:text-muted-foreground transition-colors"
          >
            [OVERRIDE RECOVERY PROTOCOL]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-8 md:py-16 ${sabotageActive ? 'sabotage-flash' : ''}`}>
      <AuthRequiredModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <div className="max-w-4xl mx-auto">
        {/* Sign Out Button - only show when authenticated */}
        {user && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="font-mono text-xs uppercase text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              SIGN OUT
            </Button>
          </div>
        )}

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4" aria-hidden="true">
            <span className="text-primary">◈</span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-mono">
              CHAOS ENGINE v2.0
            </span>
            <span className="text-primary">◈</span>
          </div>
          
          <h1 className="brutal-header fire-text mb-4 terminal-cursor">
            CHAOS PROTOCOL
          </h1>
          
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base font-mono">
            Free AI-powered workout generator for CrossFit-style WODs.
            <br />
            <span className="text-primary">
              Procedurally generated. No mercy protocol.
            </span>
          </p>

          {/* Chronicle Toggle */}
          <Button
            onClick={() => {
              if (!user) {
                setShowAuthModal(true);
                return;
              }
              setShowChronicle(!showChronicle);
            }}
            variant="ghost"
            className="mt-4 font-mono text-xs uppercase"
          >
            <History className="w-4 h-4 mr-2" />
            {showChronicle ? 'HIDE CHRONICLE' : 'VIEW CHRONICLE'}
          </Button>
        </header>

        {/* Chronicle View */}
        {showChronicle && streakData && (
          <section className="mb-12 animate-fade-in space-y-6">
            <StreakCounter
              currentStreak={streakData.current_streak}
              longestStreak={streakData.longest_streak}
              totalWorkouts={streakData.total_workouts}
            />
            
            {/* Next Unlock Progress */}
            {nextUnlockable && (
              <UnlockProgress
                challenge={nextUnlockable.challenge}
                progress={nextUnlockable.progress}
                remaining={nextUnlockable.remaining}
              />
            )}

            {/* Unlocked Secrets */}
            {unlockedSecrets.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <span className="text-primary">◈</span> UNLOCKED PROTOCOLS
                </h3>
                <div className="grid gap-3">
                  {unlockedSecrets.map(secret => (
                    <button
                      key={secret.id}
                      onClick={() => {
                        setUnlockedSecret(secret);
                        setShowSecretUnlock(true);
                      }}
                      className="bg-card/50 border border-primary/30 p-4 text-left font-mono hover:bg-primary/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{secret.icon}</span>
                        <div>
                          <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {secret.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {secret.codename}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <HallOfPain workouts={workoutHistory} />
          </section>
        )}

        {/* Sabotage Alert */}
        {sabotageActive && sabotageExercise && (
          <div className="mb-8 animate-shake">
            <div className="card-brutal p-6 border-destructive bg-destructive/10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Skull className="w-6 h-6 text-destructive" />
                <span className="font-mono font-bold text-destructive uppercase tracking-widest">
                  SYSTEM GLITCH DETECTED
                </span>
                <Skull className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-center font-mono text-foreground">
                <span className="text-destructive font-bold">+{sabotageExercise.value}</span>
                {' '}{sabotageExercise.exercise.name.toUpperCase()}{' '}
                <span className="text-muted-foreground">ADDED</span>
              </p>
              <p className="text-center text-xs text-muted-foreground/60 font-mono mt-2">
                Chaos is inevitable. Adapt or fail.
              </p>
            </div>
          </div>
        )}

        {/* Scale Down Notification */}
        {isScaledDown && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-energy/10 border border-energy/30 rounded-none">
              <AlertTriangle className="w-4 h-4 text-energy" />
              <span className="font-mono text-sm text-energy uppercase">
                Protocol adjusted. Keep moving.
              </span>
            </div>
          </div>
        )}

        {/* Package Selector */}
        {!showChronicle && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono flex items-center gap-2">
              <span className="text-primary">//</span> SELECT VARIABLE
            </h2>
            <PackageSelector 
              selectedPackage={selectedPackage} 
              onSelect={setSelectedPackage} 
            />
          </section>
        )}

        {/* Generate Button */}
        {!showChronicle && (
          <section className="mb-10">
            <GenerateButton 
              onClick={handleGenerate} 
              isGenerating={isGenerating}
              hasWorkout={!!currentWOD}
              remainingGenerations={remainingGenerations}
            />
          </section>
        )}

        {/* Generated Workout */}
        {currentWOD && !showChronicle && (
          <section className="animate-fade-in">
            {/* Sequence header */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-none">
                <span className="text-xs text-muted-foreground font-mono">SEQUENCE</span>
                <span className="text-lg font-mono font-black text-primary">#{currentWOD.sequenceId}</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-none">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono font-medium">
                  TARGET: <span className="font-black text-primary">{formatTime(currentWOD.targetTime)}</span>
                </span>
              </div>
            </div>

            {/* Algorithm phrase */}
            {algorithmPhrase && (
              <div className="text-center mb-8">
                <span className="text-xl md:text-2xl font-mono font-black fire-text animate-glow-pulse tracking-widest">
                  [{algorithmPhrase}]
                </span>
              </div>
            )}

            {/* Global Stats */}
            {globalStats && globalStats.total_completions > 0 && (
              <div className="mb-6">
                <GlobalStats
                  totalCompletions={globalStats.total_completions}
                  averageTime={globalStats.average_time}
                  fastestTime={globalStats.fastest_time}
                />
              </div>
            )}

            {/* Slot Machine Results */}
            <div className="card-brutal p-6 md:p-8 mb-8">
              <SlotMachine 
                exercises={currentWOD.exercises}
                isSpinning={isSpinning}
                onSpinComplete={handleSpinComplete}
                onRerollExercise={handleRerollExercise}
                isPremium={false}
              />
            </div>

            {/* Pre-Workout Checklist */}
            {showChecklist && (
              <PreWorkoutChecklist
                onComplete={handleChecklistComplete}
                onSkip={handleChecklistSkip}
              />
            )}

            {/* Post-Workout Survey */}
            {showSurvey && (
              <div className="card-brutal p-6 md:p-8 scanlines">
                <PostWorkoutSurvey
                  actualTime={workoutTime}
                  targetTime={currentWOD.targetTime}
                  beatTarget={beatTarget}
                  onSubmit={handleSurveySubmit}
                  onSkip={handleSurveySkip}
                />
              </div>
            )}

            {/* Timer */}
            {showTimer && !showSurvey && !showChecklist && (
              <div className="card-brutal p-6 md:p-8 animate-slide-up scanlines">
                <h3 className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                  <Clock className="w-4 h-4 inline mr-2" />
                  STOPWATCH vs ALGORITHM
                </h3>
                
                {/* Ghost Mode */}
                {ghostTime && (
                  <div className="mb-4">
                    <GhostMode
                      ghostTime={ghostTime}
                      currentTime={0}
                      isActive={true}
                    />
                  </div>
                )}
                
                <Timer 
                  initialTime={0}
                  isCountdown={false}
                  targetTime={currentWOD.targetTime}
                  onScaleDown={handleScaleDown}
                  onSabotage={handleSabotage}
                  onComplete={(time, didBeat) => handleWorkoutComplete(time || 0, didBeat || false)}
                />
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground text-xs font-mono space-y-2">
          <p className="text-primary/60">◈ Each sequence is unique. Algorithm never repeats. ◈</p>
          <p className="text-muted-foreground/40">
            PRO: Unlimited generations • Exercise reroll • Smart scaling
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WODGenerator;
