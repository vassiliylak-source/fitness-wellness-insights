import { useState, useCallback, useEffect } from 'react';
import { Zap, Clock, Target, AlertTriangle, Skull, History } from 'lucide-react';
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
import SlotMachine from './SlotMachine';
import Timer from './Timer';
import GenerateButton from './GenerateButton';
import PackageSelector from './PackageSelector';
import StreakCounter from './Chronicle/StreakCounter';
import HallOfPain from './Chronicle/HallOfPain';
import PostWorkoutSurvey from './Chronicle/PostWorkoutSurvey';
import PreWorkoutChecklist from './Rituals/PreWorkoutChecklist';
import RareRoll from './EasterEggs/RareRoll';
import GhostMode from './GhostMode';
import GlobalStats from './GlobalStats';
import { audioEngine } from '@/lib/audioEngine';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { Button } from '@/components/ui/button';

// Mythic challenges for rare rolls
const MYTHIC_CHALLENGES = [
  { name: 'DEATH BY BURPEES', description: '100 burpees for time' },
  { name: 'CENTURY SQUATS', description: '100 air squats, no breaks' },
  { name: 'IRON PLANK', description: '5 minute plank hold' },
  { name: 'PUSH-UP GAUNTLET', description: '75 push-ups, any partition' }
];

const WODGenerator = () => {
  const [selectedPackage, setSelectedPackage] = useState('bodyweight');
  const [currentWOD, setCurrentWOD] = useState<GeneratedWOD | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [algorithmPhrase, setAlgorithmPhrase] = useState('');
  const [remainingGenerations, setRemainingGenerations] = useState(1);
  const [sabotageActive, setSabotageActive] = useState(false);
  const [sabotageExercise, setSabotageExercise] = useState<GeneratedExercise | null>(null);
  const [isScaledDown, setIsScaledDown] = useState(false);
  const [isCheatDay, setIsCheatDay] = useState(false);
  
  // Retention system states
  const [showChecklist, setShowChecklist] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showChronicle, setShowChronicle] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [beatTarget, setBeatTarget] = useState(false);
  const [showRareRoll, setShowRareRoll] = useState(false);
  const [rareChallenge, setRareChallenge] = useState<typeof MYTHIC_CHALLENGES[0] | null>(null);
  const [globalStats, setGlobalStats] = useState<{
    total_completions: number;
    average_time: number;
    fastest_time: number | null;
  } | null>(null);

  // Workout session hook
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
    const { canGen } = canGenerate();
    if (!canGen) return;

    // Check for rare roll (1/100 chance)
    if (Math.random() < 0.01) {
      const challenge = MYTHIC_CHALLENGES[Math.floor(Math.random() * MYTHIC_CHALLENGES.length)];
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
  }, [selectedPackage]);

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
    setShowRareRoll(false);
    // Generate the mythic challenge as a special WOD
    handleGenerate();
  }, [handleGenerate]);

  const handleRareRollDecline = useCallback(() => {
    setShowRareRoll(false);
    setRareChallenge(null);
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

  // Rare Roll Modal
  if (showRareRoll && rareChallenge) {
    return (
      <RareRoll
        challengeName={rareChallenge.name}
        completedCount={Math.floor(Math.random() * 50) + 10}
        onAccept={handleRareRollAccept}
        onDecline={handleRareRollDecline}
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
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
            The algorithm creates. You execute.
            <br />
            <span className="text-primary">
              Procedurally generated. No mercy protocol.
            </span>
          </p>

          {/* Chronicle Toggle */}
          <Button
            onClick={() => setShowChronicle(!showChronicle)}
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
