import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, Play, Square, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';

interface LockedTimerProps {
  targetTime: number;
  onComplete: (time: number, beatTarget: boolean) => void;
  onAbort: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const LockedTimer = ({ targetTime, onComplete, onAbort }: LockedTimerProps) => {
  const { applyWeaknessTax, isStaked, vault } = useChaosEngine();
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showPenaltyWarning, setShowPenaltyWarning] = useState(false);
  const [penaltyCountdown, setPenaltyCountdown] = useState(10);
  const [isLocked, setIsLocked] = useState(true);
  const [minTimeReached, setMinTimeReached] = useState(false);
  const penaltyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Minimum time before finish becomes available (30% of target)
  const minimumTime = Math.floor(targetTime * 0.3);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Check if minimum time reached
  useEffect(() => {
    if (elapsed >= minimumTime) {
      setMinTimeReached(true);
      setIsLocked(false);
    }
  }, [elapsed, minimumTime]);

  // Handle visibility change (user switching tabs/apps)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning && isStaked) {
        triggerPenaltyWarning();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning && isStaked) {
        e.preventDefault();
        e.returnValue = 'Abort detected. Weakness Tax will be applied.';
        triggerPenaltyWarning();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning, isStaked]);

  const triggerPenaltyWarning = useCallback(() => {
    if (showPenaltyWarning) return;
    
    setShowPenaltyWarning(true);
    setPenaltyCountdown(10);

    let count = 10;
    penaltyTimeoutRef.current = setInterval(() => {
      count -= 1;
      setPenaltyCountdown(count);
      
      if (count <= 0) {
        if (penaltyTimeoutRef.current) {
          clearInterval(penaltyTimeoutRef.current);
        }
        // Apply penalty
        const taxAmount = vault.depositAmount <= 20 ? 2 : 5;
        applyWeaknessTax(taxAmount, 'Timer Abandonment');
        setShowPenaltyWarning(false);
        onAbort();
      }
    }, 1000);
  }, [showPenaltyWarning, applyWeaknessTax, vault.depositAmount, onAbort]);

  const dismissPenaltyWarning = useCallback(() => {
    if (penaltyTimeoutRef.current) {
      clearInterval(penaltyTimeoutRef.current);
    }
    setShowPenaltyWarning(false);
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    setElapsed(0);
    setIsLocked(true);
    setMinTimeReached(false);
  };

  const handleFinish = () => {
    if (!minTimeReached) return;
    
    setIsRunning(false);
    const beatTarget = elapsed < targetTime;
    onComplete(elapsed, beatTarget);
  };

  const isOverTarget = elapsed > targetTime;
  const progress = Math.min((elapsed / targetTime) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Penalty Warning Overlay */}
      {showPenaltyWarning && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center scanlines">
          <div className="text-center space-y-6 p-8 max-w-md animate-shake">
            <Skull className="w-20 h-20 text-destructive mx-auto animate-warning-pulse" />
            <h2 className="text-3xl font-bold text-destructive uppercase danger-glow">
              ABORT DETECTED
            </h2>
            <p className="text-lg text-foreground">
              Weakness Tax will be applied in:
            </p>
            <div className="text-6xl font-bold text-destructive danger-glow">
              {penaltyCountdown}
            </div>
            <Button
              onClick={dismissPenaltyWarning}
              className="btn-terminal w-full"
            >
              RESUME PROTOCOL
            </Button>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="text-center space-y-4">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          EXECUTION TIMER
        </div>
        
        <div className={`timer-display ${isOverTarget ? 'text-destructive danger-glow' : 'text-primary terminal-glow'}`}>
          {formatTime(elapsed)}
        </div>

        {/* Target comparison */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-muted-foreground">TARGET:</span>
          <span className={elapsed <= targetTime ? 'text-primary' : 'text-destructive'}>
            {formatTime(targetTime)}
          </span>
          {isOverTarget && (
            <span className="text-destructive animate-warning-pulse">
              +{formatTime(elapsed - targetTime)} OVER
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted overflow-hidden">
          <div 
            className={`h-full transition-all ${
              isOverTarget ? 'bg-destructive' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lock indicator */}
      {isLocked && isRunning && (
        <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border">
          <AlertTriangle className="w-4 h-4 text-energy" />
          <span className="text-xs text-energy uppercase">
            Finish unlocks at {formatTime(minimumTime)} ({Math.round((minimumTime / targetTime) * 100)}% minimum)
          </span>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            className="btn-terminal flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            INITIATE SEQUENCE
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={!minTimeReached}
            className={`flex-1 ${minTimeReached ? 'btn-terminal' : 'btn-danger opacity-50'}`}
          >
            <Square className="w-4 h-4 mr-2" />
            {minTimeReached ? 'PROTOCOL COMPLETE' : `LOCKED (${formatTime(minimumTime - elapsed)})`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LockedTimer;
