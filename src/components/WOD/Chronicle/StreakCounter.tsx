import { Flame, Trophy, Zap } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
}

const StreakCounter = ({ currentStreak, longestStreak, totalWorkouts }: StreakCounterProps) => {
  return (
    <div className="card-brutal p-4 md:p-6">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono flex items-center gap-2">
        <span className="text-primary">//</span> OPERATOR STATUS
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Current Streak */}
        <div className="text-center p-4 bg-card/50 border border-border">
          <Flame className={`w-6 h-6 mx-auto mb-2 ${currentStreak > 0 ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
          <div className="text-3xl font-mono font-black fire-text">
            {currentStreak}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-mono">
            STREAK
          </div>
          {currentStreak >= 3 && (
            <div className="text-[9px] text-primary/60 mt-2 font-mono">
              Do not break the chain
            </div>
          )}
        </div>

        {/* Longest Streak */}
        <div className="text-center p-4 bg-card/50 border border-border">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-energy" />
          <div className="text-3xl font-mono font-black text-energy">
            {longestStreak}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-mono">
            RECORD
          </div>
        </div>

        {/* Total Workouts */}
        <div className="text-center p-4 bg-card/50 border border-border">
          <Zap className="w-6 h-6 mx-auto mb-2 text-accent" />
          <div className="text-3xl font-mono font-black text-accent">
            {totalWorkouts}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-mono">
            EXECUTED
          </div>
        </div>
      </div>

      {/* Streak message */}
      {currentStreak >= 7 && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 text-center">
          <span className="text-xs font-mono text-primary uppercase tracking-widest">
            ⚡ {currentStreak} days. Protocol Omega unlocked. ⚡
          </span>
        </div>
      )}
    </div>
  );
};

export default StreakCounter;
