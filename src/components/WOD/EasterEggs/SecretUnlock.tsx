import { Lock, Unlock, Trophy, Flame, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecretChallenge } from '@/constants/secretChallenges';

interface SecretUnlockProps {
  challenge: SecretChallenge;
  onAccept: () => void;
  onDismiss: () => void;
}

const getDifficultyColor = (difficulty: SecretChallenge['difficulty']) => {
  switch (difficulty) {
    case 'legendary':
      return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
    case 'mythic':
      return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    case 'omega':
      return 'text-primary border-primary/30 bg-primary/10';
    default:
      return 'text-primary border-primary/30 bg-primary/10';
  }
};

const getDifficultyIcon = (difficulty: SecretChallenge['difficulty']) => {
  switch (difficulty) {
    case 'legendary':
      return <Flame className="w-4 h-4" />;
    case 'mythic':
      return <Star className="w-4 h-4" />;
    case 'omega':
      return <Zap className="w-4 h-4" />;
    default:
      return <Trophy className="w-4 h-4" />;
  }
};

const SecretUnlock = ({ challenge, onAccept, onDismiss }: SecretUnlockProps) => {
  const difficultyClass = getDifficultyColor(challenge.difficulty);

  return (
    <div className="fixed inset-0 z-50 bg-background/98 flex items-center justify-center p-4 animate-fade-in">
      {/* Animated unlock effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent animate-pulse" />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-lg text-center relative z-10">
        {/* Unlock animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <Lock className="w-16 h-16 text-muted-foreground/30 absolute inset-0 animate-ping opacity-50" />
              <Unlock className="w-16 h-16 text-primary relative z-10" />
            </div>
            <div className="text-5xl mt-4 animate-bounce">
              {challenge.icon}
            </div>
          </div>
        </div>

        {/* Secret unlocked badge */}
        <div className="text-[10px] font-mono text-primary uppercase tracking-[0.5em] mb-4 flex items-center justify-center gap-2">
          <span className="animate-pulse">◈</span>
          SECRET PROTOCOL UNLOCKED
          <span className="animate-pulse">◈</span>
        </div>

        {/* Challenge name */}
        <h2 className="text-3xl md:text-4xl font-mono font-black text-foreground uppercase mb-2 tracking-wider fire-text">
          {challenge.name}
        </h2>

        {/* Codename */}
        <div className="text-sm font-mono text-muted-foreground mb-4">
          {challenge.codename}
        </div>

        {/* Difficulty badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 border ${difficultyClass} font-mono text-xs uppercase tracking-widest mb-6`}>
          {getDifficultyIcon(challenge.difficulty)}
          {challenge.difficulty} CHALLENGE
        </div>

        {/* Description */}
        <p className="text-sm font-mono text-muted-foreground mb-6 italic">
          "{challenge.description}"
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

        {/* Global completions - FOMO */}
        <p className="text-sm font-mono text-foreground mb-8">
          <span className="text-primary font-bold text-lg">{challenge.globalCompletions}</span> operators have conquered this protocol.
          <br />
          <span className="text-xs text-muted-foreground">Join the elite.</span>
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onAccept}
            className="btn-brutal px-8 py-3 text-lg group"
          >
            <Trophy className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            BEGIN PROTOCOL
          </Button>
          
          <Button
            onClick={onDismiss}
            variant="ghost"
            className="font-mono text-sm uppercase text-muted-foreground"
          >
            LATER
          </Button>
        </div>

        {/* Unlock condition */}
        <p className="mt-8 text-[10px] font-mono text-muted-foreground/60 uppercase">
          Unlocked by: {challenge.unlockCondition}
        </p>
      </div>
    </div>
  );
};

export default SecretUnlock;
