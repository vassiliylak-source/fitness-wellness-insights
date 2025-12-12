import { Ghost } from 'lucide-react';
import { formatTime } from '@/constants/wod';

interface GhostModeProps {
  ghostTime: number; // Previous best time in seconds
  currentTime: number; // Current elapsed time
  isActive: boolean;
}

const GhostMode = ({ ghostTime, currentTime, isActive }: GhostModeProps) => {
  if (!isActive || ghostTime === 0) return null;

  const difference = currentTime - ghostTime;
  const isAhead = difference < 0;
  const diffFormatted = formatTime(Math.abs(difference));

  return (
    <div className={`flex items-center justify-center gap-2 p-3 border ${
      isAhead ? 'border-accent/30 bg-accent/5' : 'border-destructive/30 bg-destructive/5'
    }`}>
      <Ghost className={`w-4 h-4 ${isAhead ? 'text-accent' : 'text-destructive'}`} />
      
      <span className="text-xs font-mono text-muted-foreground uppercase">
        vs PREVIOUS:
      </span>
      
      <span className={`font-mono font-bold ${isAhead ? 'text-accent' : 'text-destructive'}`}>
        {isAhead ? '-' : '+'}{diffFormatted}
      </span>
      
      <span className="text-xs font-mono text-muted-foreground">
        (GHOST: {formatTime(ghostTime)})
      </span>
    </div>
  );
};

export default GhostMode;
