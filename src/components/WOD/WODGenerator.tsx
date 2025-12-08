import { useState, useCallback } from 'react';
import { Flame, Clock, Repeat } from 'lucide-react';
import { generateWOD, GeneratedWOD, FORMATS, MOTIVATIONAL_PHRASES } from '@/constants/wod';
import SlotMachine from './SlotMachine';
import Timer from './Timer';
import GenerateButton from './GenerateButton';
import PackageSelector from './PackageSelector';

const WODGenerator = () => {
  const [selectedPackage, setSelectedPackage] = useState('classic');
  const [currentWOD, setCurrentWOD] = useState<GeneratedWOD | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [motivationalPhrase, setMotivationalPhrase] = useState('');

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setIsSpinning(true);
    setShowTimer(false);
    
    // Simulate suspense
    setTimeout(() => {
      const wod = generateWOD(selectedPackage, 3);
      setCurrentWOD(wod);
      setIsGenerating(false);
      setIsSpinning(false);
      setMotivationalPhrase(MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)]);
    }, 800);
  }, [selectedPackage]);

  const handleSpinComplete = useCallback(() => {
    setShowTimer(true);
  }, []);

  const formatInfo = currentWOD ? FORMATS.find(f => f.id === currentWOD.format) : null;

  return (
    <div className="min-h-screen px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Flame className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Workout of the Day
            </span>
            <Flame className="w-8 h-8 text-primary animate-pulse" />
          </div>
          
          <h1 className="brutal-header fire-text mb-4">
            WOD RANDOMIZER
          </h1>
          
          <p className="text-muted-foreground max-w-md mx-auto">
            Don't know what to do? Let fate decide. Hit generate and embrace the pain.
          </p>
        </header>

        {/* Package Selector */}
        <section className="mb-10">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <span>Select Package</span>
            <span className="text-xs text-accent">(Premium coming soon)</span>
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
          />
        </section>

        {/* Generated Workout */}
        {currentWOD && (
          <section className="animate-fade-in">
            {/* Format badge */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg">
                {currentWOD.format === 'reps' && <Repeat className="w-4 h-4 text-primary" />}
                {currentWOD.format === 'time' && <Clock className="w-4 h-4 text-primary" />}
                {currentWOD.format === 'amrap' && <Flame className="w-4 h-4 text-primary" />}
                <span className="text-sm font-bold uppercase">{formatInfo?.name}</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {formatInfo?.description}
              </div>
            </div>

            {/* Motivational phrase */}
            {motivationalPhrase && (
              <div className="text-center mb-8">
                <span className="text-2xl md:text-3xl font-black fire-text animate-glow-pulse">
                  {motivationalPhrase}
                </span>
              </div>
            )}

            {/* Slot Machine Results */}
            <div className="card-brutal p-6 md:p-8 mb-8">
              <SlotMachine 
                exercises={currentWOD.exercises}
                isSpinning={isSpinning}
                onSpinComplete={handleSpinComplete}
              />
            </div>

            {/* Timer */}
            {showTimer && (
              <div className="card-brutal p-6 md:p-8 animate-slide-up">
                <h3 className="text-center text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  {currentWOD.format === 'amrap' ? 'AMRAP Timer' : 'Stopwatch'}
                </h3>
                <Timer 
                  initialTime={currentWOD.format === 'amrap' ? 600 : 0}
                  isCountdown={currentWOD.format === 'amrap'}
                />
              </div>
            )}
          </section>
        )}

        {/* Footer tip */}
        <footer className="text-center mt-16 text-muted-foreground text-sm">
          <p>🔥 Tip: Each roll is unique. No two workouts are the same!</p>
        </footer>
      </div>
    </div>
  );
};

export default WODGenerator;
