import { Users, Zap, Trophy } from 'lucide-react';
import { formatTime } from '@/constants/wod';

interface GlobalStatsProps {
  totalCompletions: number;
  averageTime: number;
  fastestTime: number | null;
  currentTime?: number;
}

const GlobalStats = ({ totalCompletions, averageTime, fastestTime, currentTime }: GlobalStatsProps) => {
  const percentile = currentTime && averageTime > 0
    ? Math.round((1 - (currentTime / averageTime)) * 100 + 50)
    : null;

  return (
    <div className="p-4 bg-card/30 border border-border">
      <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
        <Users className="w-3 h-3" />
        GLOBAL PROTOCOL DATA
      </h4>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-mono font-bold text-foreground">
            {totalCompletions.toLocaleString()}
          </div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase">
            COMPLETED
          </div>
        </div>
        
        <div>
          <div className="text-lg font-mono font-bold text-primary">
            {formatTime(averageTime)}
          </div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase">
            AVG TIME
          </div>
        </div>
        
        <div>
          <div className="text-lg font-mono font-bold text-energy flex items-center justify-center gap-1">
            {fastestTime ? formatTime(fastestTime) : '--:--'}
            {fastestTime && <Trophy className="w-3 h-3" />}
          </div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase">
            RECORD
          </div>
        </div>
      </div>

      {percentile !== null && percentile > 0 && (
        <div className="mt-3 pt-3 border-t border-border text-center">
          <span className="text-xs font-mono text-muted-foreground">
            You are in the{' '}
            <span className={`font-bold ${percentile >= 75 ? 'text-accent' : percentile >= 50 ? 'text-primary' : 'text-foreground'}`}>
              top {Math.max(1, 100 - percentile)}%
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default GlobalStats;
