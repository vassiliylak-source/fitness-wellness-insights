import { Lock, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SecretChallenge } from '@/constants/secretChallenges';

interface UnlockProgressProps {
  challenge: SecretChallenge;
  progress: number;
  remaining: number;
}

const UnlockProgress = ({ challenge, progress, remaining }: UnlockProgressProps) => {
  return (
    <div className="bg-card/30 border border-border/30 p-4 rounded-none font-mono">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-muted/50 border border-border/50">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Next Secret
            </span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-primary uppercase tracking-widest font-bold">
              {challenge.name}
            </span>
          </div>
        </div>
      </div>

      <Progress value={progress} className="h-2 mb-2" />

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {challenge.unlockCondition}
        </span>
        <span className="text-primary font-bold">
          {remaining} remaining
        </span>
      </div>
    </div>
  );
};

export default UnlockProgress;
