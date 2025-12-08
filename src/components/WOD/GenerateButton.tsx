import { Dices, Loader2 } from 'lucide-react';
import { MOTIVATIONAL_PHRASES } from '@/constants/wod';
import { useState, useEffect } from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  hasWorkout: boolean;
}

const GenerateButton = ({ onClick, isGenerating, hasWorkout }: GenerateButtonProps) => {
  const [phrase, setPhrase] = useState(MOTIVATIONAL_PHRASES[0]);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        const randomPhrase = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
        setPhrase(randomPhrase);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  return (
    <div className="text-center">
      <button
        onClick={onClick}
        disabled={isGenerating}
        className={`
          btn-brutal group relative
          ${isGenerating ? 'animate-pulse-fire' : 'hover:animate-pulse-fire'}
          ${hasWorkout ? 'px-8' : 'px-12 py-6 text-xl'}
        `}
      >
        <span className="flex items-center gap-3">
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-black">{phrase}</span>
            </>
          ) : (
            <>
              <Dices className="w-6 h-6 group-hover:animate-shake" />
              <span className="font-black">
                {hasWorkout ? 'REROLL' : 'GENERATE WOD'}
              </span>
            </>
          )}
        </span>
        
        {/* Fire effect on hover */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent blur-xl" />
        </div>
      </button>
      
      {!hasWorkout && (
        <p className="text-muted-foreground text-sm mt-4 uppercase tracking-wider">
          Press to reveal your fate
        </p>
      )}
    </div>
  );
};

export default GenerateButton;
