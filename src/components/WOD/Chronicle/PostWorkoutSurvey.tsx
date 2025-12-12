import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/constants/wod';

interface PostWorkoutSurveyProps {
  actualTime: number;
  targetTime: number;
  beatTarget: boolean;
  onSubmit: (feeling: 'dead' | 'ok' | 'more', rating?: number) => void;
  onSkip: () => void;
}

const PostWorkoutSurvey = ({ 
  actualTime, 
  targetTime, 
  beatTarget,
  onSubmit, 
  onSkip 
}: PostWorkoutSurveyProps) => {
  const [selectedFeeling, setSelectedFeeling] = useState<'dead' | 'ok' | 'more' | null>(null);

  const handleSubmit = () => {
    if (selectedFeeling) {
      onSubmit(selectedFeeling);
    }
  };

  const improvement = targetTime > 0 
    ? Math.round(((targetTime - actualTime) / targetTime) * 100)
    : 0;

  return (
    <div className="animate-fade-in text-center py-6">
      {/* Result */}
      <div className="mb-8">
        <div className={`text-4xl md:text-6xl font-mono font-black mb-2 ${
          beatTarget ? 'text-accent' : 'text-foreground'
        }`}>
          {formatTime(actualTime)}
        </div>
        
        {beatTarget ? (
          <div className="text-sm font-mono text-accent uppercase tracking-widest">
            ⚡ ALGORITHM DEFEATED BY {Math.abs(improvement)}% ⚡
          </div>
        ) : (
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            MACHINE PREDICTION: {formatTime(targetTime)}
          </div>
        )}
      </div>

      {/* Feeling selector */}
      <div className="mb-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
          STATUS REPORT
        </p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setSelectedFeeling('dead')}
            className={`p-4 md:p-6 border-2 transition-all ${
              selectedFeeling === 'dead' 
                ? 'border-destructive bg-destructive/10 scale-110' 
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <span className="text-4xl">😫</span>
            <div className="text-[10px] font-mono text-muted-foreground uppercase mt-2">
              DESTROYED
            </div>
          </button>
          
          <button
            onClick={() => setSelectedFeeling('ok')}
            className={`p-4 md:p-6 border-2 transition-all ${
              selectedFeeling === 'ok' 
                ? 'border-energy bg-energy/10 scale-110' 
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <span className="text-4xl">😐</span>
            <div className="text-[10px] font-mono text-muted-foreground uppercase mt-2">
              ACCEPTABLE
            </div>
          </button>
          
          <button
            onClick={() => setSelectedFeeling('more')}
            className={`p-4 md:p-6 border-2 transition-all ${
              selectedFeeling === 'more' 
                ? 'border-accent bg-accent/10 scale-110' 
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <span className="text-4xl">💪</span>
            <div className="text-[10px] font-mono text-muted-foreground uppercase mt-2">
              MORE
            </div>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedFeeling}
          className="btn-brutal"
        >
          RECORD RESULT
        </Button>
        <Button
          onClick={onSkip}
          variant="ghost"
          className="font-mono text-xs uppercase text-muted-foreground"
        >
          SKIP
        </Button>
      </div>
    </div>
  );
};

export default PostWorkoutSurvey;
