import { useState, useEffect } from 'react';
import { RefreshCw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GeneratedExercise, formatTime } from '@/constants/wod';

interface SlotMachineProps {
  exercises: GeneratedExercise[];
  isSpinning: boolean;
  onSpinComplete: () => void;
  onRerollExercise?: (index: number) => void;
  isPremium?: boolean;
}

const SlotMachine = ({ 
  exercises, 
  isSpinning, 
  onSpinComplete, 
  onRerollExercise,
  isPremium = false 
}: SlotMachineProps) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!isSpinning && exercises.length > 0) {
      setRevealedCount(0);
      setShowAll(false);
      
      exercises.forEach((_, index) => {
        setTimeout(() => {
          setRevealedCount(prev => prev + 1);
          if (index === exercises.length - 1) {
            setTimeout(() => {
              setShowAll(true);
              onSpinComplete();
            }, 300);
          }
        }, (index + 1) * 400);
      });
    }
  }, [isSpinning, exercises, onSpinComplete]);

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-6 opacity-50">◈</div>
        <p className="text-muted-foreground text-lg uppercase tracking-wider text-center font-mono">
          INITIATE SEQUENCE TO GENERATE CHALLENGE
        </p>
        <p className="text-muted-foreground/60 text-xs mt-2 font-mono">
          Procedurally generated. No two sequences identical.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((item, index) => {
        const isRevealed = index < revealedCount;
        const isTimeBased = item.format === 'seconds';
        const intensityPercent = (item.exercise.sufferingCoefficient / 10) * 100;
        
        return (
          <div
            key={`${item.exercise.id}-${index}`}
            className={`
              exercise-card overflow-hidden relative rounded-none
              transition-all duration-500
              ${isRevealed ? 'animate-slot-reveal opacity-100' : 'opacity-0 translate-y-full'}
              ${showAll ? 'hover:border-primary' : ''}
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <span className="text-4xl">{item.exercise.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-mono font-black uppercase tracking-tight text-foreground">
                    {item.exercise.name}
                  </h3>
                  <span className="text-xs text-muted-foreground/80 font-mono block mt-0.5">
                    {item.exercise.description}
                  </span>
                </div>
              </div>
              
              <div className="text-right flex items-center gap-3">
                <div>
                  <div className="text-2xl md:text-3xl font-mono font-black fire-text animate-glow-pulse">
                    {isTimeBased ? formatTime(item.value) : item.value}
                  </div>
                  <span className="text-xs text-muted-foreground uppercase font-mono">
                    {isTimeBased ? 'DURATION' : 'REPS'}
                  </span>
                </div>
                
                {showAll && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`
                      w-10 h-10 rounded-none 
                      ${isPremium 
                        ? 'hover:bg-primary/20 text-muted-foreground hover:text-primary' 
                        : 'text-muted-foreground/30 cursor-not-allowed'}
                    `}
                    onClick={() => isPremium && onRerollExercise?.(index)}
                    disabled={!isPremium}
                    title={isPremium ? 'Reroll this exercise' : 'Premium: Reroll specific exercises'}
                  >
                    {isPremium ? (
                      <RefreshCw className="w-4 h-4" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Intensity bar */}
            <div className="mt-4 h-1 bg-muted rounded-none overflow-hidden">
              <div 
                className="h-full rounded-none transition-all duration-1000"
                style={{ 
                  width: isRevealed ? `${intensityPercent}%` : '0%',
                  background: intensityPercent > 70 
                    ? 'hsl(var(--destructive))' 
                    : intensityPercent > 50 
                      ? 'var(--gradient-fire)' 
                      : 'hsl(var(--primary))'
                }}
              />
            </div>
            
            {/* Suffering coefficient indicator */}
            <div className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground/40 uppercase">
              S:{item.exercise.sufferingCoefficient}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SlotMachine;
