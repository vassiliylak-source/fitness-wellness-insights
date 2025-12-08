import { useState, useEffect } from 'react';
import { GeneratedExercise } from '@/constants/wod';

interface SlotMachineProps {
  exercises: GeneratedExercise[];
  isSpinning: boolean;
  onSpinComplete: () => void;
}

const SlotMachine = ({ exercises, isSpinning, onSpinComplete }: SlotMachineProps) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!isSpinning && exercises.length > 0) {
      setRevealedCount(0);
      setShowAll(false);
      
      // Reveal exercises one by one with delay
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
        <div className="text-6xl mb-6">🎰</div>
        <p className="text-muted-foreground text-lg uppercase tracking-wider">
          Hit Generate to roll your WOD
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((item, index) => {
        const isRevealed = index < revealedCount;
        
        return (
          <div
            key={`${item.exercise.id}-${index}`}
            className={`
              exercise-card overflow-hidden
              transition-all duration-500
              ${isRevealed ? 'animate-slot-reveal opacity-100' : 'opacity-0 translate-y-full'}
              ${showAll ? 'hover:border-primary' : ''}
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{item.exercise.icon}</span>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                    {item.exercise.name}
                  </h3>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {item.exercise.category}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl md:text-4xl font-black fire-text animate-glow-pulse">
                  {item.value}
                </div>
                <span className="text-sm text-muted-foreground uppercase">
                  {item.format === 'seconds' ? 'seconds' : 'reps'}
                </span>
              </div>
            </div>
            
            {/* Fire bar indicator */}
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: isRevealed ? `${(item.value / item.exercise.maxReps) * 100}%` : '0%',
                  background: 'var(--gradient-fire)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SlotMachine;
