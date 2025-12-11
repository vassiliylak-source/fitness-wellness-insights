import { useState, useEffect } from 'react';
import { Zap, RefreshCw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ALGORITHM_PHRASES } from '@/constants/wod';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  hasWorkout: boolean;
  remainingGenerations: number;
}

const GenerateButton = ({ onClick, isGenerating, hasWorkout, remainingGenerations }: GenerateButtonProps) => {
  const [phrase, setPhrase] = useState('');

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setPhrase(ALGORITHM_PHRASES[Math.floor(Math.random() * ALGORITHM_PHRASES.length)]);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const canGen = remainingGenerations > 0;

  return (
    <div className="text-center">
      <Button
        onClick={onClick}
        disabled={isGenerating || !canGen}
        className={`
          btn-brutal text-xl md:text-2xl py-8 px-12 
          group relative overflow-hidden
          ${!canGen ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isGenerating ? (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            <span className="animate-pulse font-mono text-sm">{phrase || 'COMPILING...'}</span>
          </div>
        ) : !canGen ? (
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6" />
            <span>DAILY LIMIT REACHED</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {hasWorkout ? (
              <>
                <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                <span>REROLL SEQUENCE</span>
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>INITIATE SEQUENCE</span>
              </>
            )}
          </div>
        )}
      </Button>
      
      <div className="mt-4 text-sm text-muted-foreground">
        {canGen ? (
          <span>
            <span className="text-primary font-bold">{remainingGenerations}</span> generation{remainingGenerations !== 1 ? 's' : ''} remaining today
          </span>
        ) : (
          <span className="text-muted-foreground/60">
            Return tomorrow for a new challenge • <span className="text-primary">PRO removes limits</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default GenerateButton;