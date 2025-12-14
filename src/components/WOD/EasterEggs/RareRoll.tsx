import { Sparkles, Skull, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MythicRoll } from '@/constants/secretChallenges';

interface RareRollProps {
  challenge: MythicRoll;
  onAccept: () => void;
  onDecline: () => void;
}

const RareRoll = ({ challenge, onAccept, onDecline }: RareRollProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/98 flex items-center justify-center p-4 animate-fade-in">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      <div className="max-w-lg text-center relative z-10">
        {/* Glowing effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/30 blur-3xl animate-pulse" />
          <div className="text-6xl relative z-10 animate-bounce">
            {challenge.icon}
          </div>
          <Sparkles className="w-8 h-8 absolute -top-2 -right-2 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          <Sparkles className="w-6 h-6 absolute -bottom-1 -left-1 text-accent animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
        </div>

        {/* Rare event badge */}
        <div className="text-[10px] font-mono text-primary uppercase tracking-[0.5em] mb-4 animate-pulse flex items-center justify-center gap-2">
          <Zap className="w-3 h-3" />
          RARE EVENT DETECTED
          <Zap className="w-3 h-3" />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-mono font-black text-foreground uppercase mb-2 tracking-wider">
          MYTHIC CHALLENGE
        </h2>

        {/* Challenge name */}
        <div className="text-2xl md:text-3xl font-mono font-bold fire-text mb-3 animate-glow-pulse">
          {challenge.name}
        </div>

        {/* Tagline */}
        <p className="text-sm font-mono text-muted-foreground mb-6 italic">
          "{challenge.tagline}"
        </p>

        {/* Exercise list */}
        <div className="bg-card/50 border border-border/50 p-4 mb-6 rounded-none">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
            CHALLENGE PARAMETERS
          </div>
          <div className="space-y-2">
            {challenge.exercises.map((ex, idx) => (
              <div key={idx} className="flex items-center justify-between font-mono text-sm">
                <span className="text-foreground">{ex.name}</span>
                <span className="text-primary font-bold">
                  {ex.value} {ex.measureType === 'seconds' ? 'SEC' : 'REPS'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mb-6 text-sm font-mono">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Probability:</span>
            <span className="text-primary font-bold">{challenge.probability}</span>
          </div>
        </div>

        {/* Completion count - FOMO */}
        <p className="text-sm font-mono text-foreground mb-8">
          Only <span className="text-primary font-bold text-lg">{challenge.globalCompletions}</span> operators have completed this protocol.
          <br />
          <span className="text-xs text-muted-foreground">Will you be next?</span>
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onAccept}
            className="btn-brutal px-8 py-3 text-lg group"
          >
            <Skull className="w-5 h-5 mr-2 group-hover:animate-shake" />
            ACCEPT CHALLENGE
          </Button>
          
          <Button
            onClick={onDecline}
            variant="ghost"
            className="font-mono text-sm uppercase text-muted-foreground hover:text-destructive transition-colors"
          >
            DECLINE (COWARD MODE)
          </Button>
        </div>

        {/* Warning */}
        <p className="mt-8 text-[10px] font-mono text-muted-foreground/40 uppercase">
          ⚠️ This challenge will not appear again today
        </p>
      </div>
    </div>
  );
};

export default RareRoll;
