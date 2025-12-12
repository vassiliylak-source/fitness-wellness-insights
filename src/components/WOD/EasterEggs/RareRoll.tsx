import { Sparkles, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RareRollProps {
  challengeName: string;
  completedCount: number;
  onAccept: () => void;
  onDecline: () => void;
}

const RareRoll = ({ challengeName, completedCount, onAccept, onDecline }: RareRollProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/98 flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-lg text-center">
        {/* Glowing effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
          <Sparkles className="w-20 h-20 mx-auto text-primary animate-glow-pulse relative z-10" />
        </div>

        <div className="text-[10px] font-mono text-primary uppercase tracking-[0.5em] mb-4 animate-pulse">
          ◈ RARE EVENT DETECTED ◈
        </div>

        <h2 className="text-3xl md:text-4xl font-mono font-black text-foreground uppercase mb-4">
          MYTHIC CHALLENGE
        </h2>

        <div className="text-xl font-mono font-bold fire-text mb-6">
          {challengeName}
        </div>

        <p className="text-sm font-mono text-muted-foreground mb-2">
          Probability: 1/100 rolls
        </p>
        
        <p className="text-sm font-mono text-foreground mb-8">
          Only <span className="text-primary font-bold">{completedCount}</span> operators have completed this protocol.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onAccept}
            className="btn-brutal px-8"
          >
            <Skull className="w-5 h-5 mr-2" />
            ACCEPT CHALLENGE
          </Button>
          
          <Button
            onClick={onDecline}
            variant="ghost"
            className="font-mono text-sm uppercase text-muted-foreground"
          >
            DECLINE
          </Button>
        </div>

        <p className="mt-8 text-[10px] font-mono text-muted-foreground/40 uppercase">
          This challenge will not appear again
        </p>
      </div>
    </div>
  );
};

export default RareRoll;
