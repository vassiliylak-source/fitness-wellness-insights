import { useState, useEffect } from 'react';
import { Zap, AlertTriangle, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SabotageModeProps {
  isVisible: boolean;
  onDismiss: () => void;
  addedExercise: {
    name: string;
    reps: number;
  };
}

const SABOTAGE_MESSAGES = [
  "SYSTEM GLITCH DETECTED",
  "PROTOCOL CORRUPTED", 
  "ALGORITHM MALFUNCTION",
  "UNEXPECTED INTERRUPT",
  "SYSTEM OVERRIDE"
];

const SabotageMode = ({ isVisible, onDismiss, addedExercise }: SabotageModeProps) => {
  const [showContent, setShowContent] = useState(false);
  const [glitchPhase, setGlitchPhase] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Initial flash phases
      const flashTimer = setTimeout(() => setGlitchPhase(1), 100);
      const flashTimer2 = setTimeout(() => setGlitchPhase(2), 300);
      const flashTimer3 = setTimeout(() => setGlitchPhase(3), 500);
      const contentTimer = setTimeout(() => setShowContent(true), 700);
      
      return () => {
        clearTimeout(flashTimer);
        clearTimeout(flashTimer2);
        clearTimeout(flashTimer3);
        clearTimeout(contentTimer);
      };
    } else {
      setShowContent(false);
      setGlitchPhase(0);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const randomMessage = SABOTAGE_MESSAGES[Math.floor(Math.random() * SABOTAGE_MESSAGES.length)];

  return (
    <div 
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        transition-all duration-100
        ${glitchPhase >= 1 ? 'bg-destructive/90' : 'bg-transparent'}
        ${glitchPhase >= 2 ? 'animate-shake' : ''}
      `}
    >
      {/* Scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
        }}
        aria-hidden="true"
      />

      {/* Glitch effect borders */}
      {glitchPhase >= 2 && (
        <>
          <div className="absolute top-0 left-0 w-full h-2 bg-foreground animate-pulse" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-foreground animate-pulse" aria-hidden="true" />
          <div className="absolute top-0 left-0 w-2 h-full bg-foreground animate-pulse" aria-hidden="true" />
          <div className="absolute top-0 right-0 w-2 h-full bg-foreground animate-pulse" aria-hidden="true" />
        </>
      )}

      {showContent && (
        <div className="relative z-10 text-center px-4 animate-scale-in">
          {/* Warning icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Skull className="w-24 h-24 text-foreground animate-pulse" />
              <AlertTriangle className="w-8 h-8 text-energy absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>

          {/* Glitch message */}
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-[0.5em] text-foreground/60">
              ⚠ {randomMessage} ⚠
            </span>
          </div>

          {/* Main message */}
          <h2 className="text-4xl md:text-6xl font-mono font-black text-foreground uppercase mb-6 animate-pulse">
            +{addedExercise.reps} {addedExercise.name}
          </h2>

          <p className="text-lg font-mono text-foreground/80 mb-2">
            ADDED TO YOUR PROTOCOL
          </p>

          <p className="text-sm font-mono text-foreground/60 mb-8">
            The algorithm does not negotiate.
          </p>

          {/* Accept button */}
          <Button
            onClick={onDismiss}
            className="bg-foreground text-destructive hover:bg-foreground/90 font-mono font-bold uppercase px-8 py-6 text-lg rounded-none border-4 border-foreground"
          >
            <Zap className="w-5 h-5 mr-2" />
            ACKNOWLEDGED
          </Button>

          {/* Bottom text */}
          <p className="mt-6 text-xs font-mono text-foreground/40 uppercase tracking-widest">
            Adapt or fail. There is no third option.
          </p>
        </div>
      )}
    </div>
  );
};

export default SabotageMode;
