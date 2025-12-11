import { useState, useCallback, useEffect } from 'react';
import { Zap, Clock, Target } from 'lucide-react';
import { 
  generateWOD, 
  GeneratedWOD, 
  ALGORITHM_PHRASES,
  formatTime,
  canGenerate,
  recordGeneration
} from '@/constants/wod';
import SlotMachine from './SlotMachine';
import Timer from './Timer';
import GenerateButton from './GenerateButton';
import PackageSelector from './PackageSelector';

const WODGenerator = () => {
  const [selectedPackage, setSelectedPackage] = useState('bodyweight');
  const [currentWOD, setCurrentWOD] = useState<GeneratedWOD | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [algorithmPhrase, setAlgorithmPhrase] = useState('');
  const [remainingGenerations, setRemainingGenerations] = useState(1);

  // Check generation limit on mount
  useEffect(() => {
    const { remaining } = canGenerate();
    setRemainingGenerations(remaining);
  }, []);

  const handleGenerate = useCallback(() => {
    const { canGen } = canGenerate();
    if (!canGen) return;

    setIsGenerating(true);
    setIsSpinning(true);
    setShowTimer(false);
    
    setTimeout(() => {
      const wod = generateWOD(selectedPackage, 3);
      setCurrentWOD(wod);
      setIsGenerating(false);
      setIsSpinning(false);
      setAlgorithmPhrase(ALGORITHM_PHRASES[Math.floor(Math.random() * ALGORITHM_PHRASES.length)]);
      
      // Record generation and update remaining
      recordGeneration();
      const { remaining } = canGenerate();
      setRemainingGenerations(remaining);
    }, 800);
  }, [selectedPackage]);

  const handleSpinComplete = useCallback(() => {
    setShowTimer(true);
  }, []);

  const handleRerollExercise = useCallback((index: number) => {
    // Premium feature - would reroll specific exercise
    console.log('Reroll exercise at index:', index);
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-mono">
              CHAOS ENGINE v1.0
            </span>
            <Zap className="w-6 h-6 text-primary" />
          </div>
          
          <h1 className="brutal-header fire-text mb-4">
            CHAOS PROTOCOL
          </h1>
          
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            The algorithm creates. You execute.
            <br />
            <span className="text-primary font-medium">
              Procedurally generated challenges. No mercy protocol.
            </span>
          </p>
        </header>

        {/* Package Selector */}
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono flex items-center gap-2">
            <span className="text-primary">//</span> SELECT VARIABLE
          </h2>
          <PackageSelector 
            selectedPackage={selectedPackage} 
            onSelect={setSelectedPackage} 
          />
        </section>

        {/* Generate Button */}
        <section className="mb-10">
          <GenerateButton 
            onClick={handleGenerate} 
            isGenerating={isGenerating}
            hasWorkout={!!currentWOD}
            remainingGenerations={remainingGenerations}
          />
        </section>

        {/* Generated Workout */}
        {currentWOD && (
          <section className="animate-fade-in">
            {/* Sequence header */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
                <span className="text-xs text-muted-foreground font-mono">SEQUENCE</span>
                <span className="text-lg font-black text-primary">#{currentWOD.sequenceId}</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  Target: <span className="font-black text-primary">{formatTime(currentWOD.targetTime)}</span>
                </span>
              </div>
            </div>

            {/* Algorithm phrase */}
            {algorithmPhrase && (
              <div className="text-center mb-8">
                <span className="text-xl md:text-2xl font-black fire-text animate-glow-pulse font-mono tracking-wider">
                  {algorithmPhrase}
                </span>
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

            {/* Timer */}
            {showTimer && (
              <div className="card-brutal p-6 md:p-8 animate-slide-up">
                <h3 className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                  <Clock className="w-4 h-4 inline mr-2" />
                  STOPWATCH vs ALGORITHM
                </h3>
                <Timer 
                  initialTime={0}
                  isCountdown={false}
                  targetTime={currentWOD.targetTime}
                />
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground text-xs font-mono space-y-2">
          <p className="text-primary/60">⚡ Each sequence is unique. Algorithm never repeats.</p>
          <p className="text-muted-foreground/40">
            PRO: Unlimited generations • Exercise reroll • Smart scaling
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WODGenerator;
