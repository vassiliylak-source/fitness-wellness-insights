import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, Play, Square, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChaosEngine } from '@/contexts/ChaosEngineContext';
import { formatTime } from '@/utils/formatTime';
import VerificationCheck from './VerificationCheck';
import { audioEngine } from '@/lib/audioEngine';

interface LockedTimerProps {
  targetTime: number;
  onComplete: (time: number, beatTarget: boolean, verificationStats?: { passed: number; total: number }) => void;
  onAbort: () => void;
}

const LockedTimer = ({ targetTime, onComplete, onAbort }: LockedTimerProps) => {
  const { applyWeaknessTax, isStaked, vault } = useChaosEngine();
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showPenaltyWarning, setShowPenaltyWarning] = useState(false);
  const [penaltyCountdown, setPenaltyCountdown] = useState(10);
  const [isLocked, setIsLocked] = useState(true);
  const [minTimeReached, setMinTimeReached] = useState(false);
  
  // Verification check state
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCheckNumber, setVerificationCheckNumber] = useState(0);
  const [verificationsPassed, setVerificationsPassed] = useState(0);
  const [verificationsTotal, setVerificationsTotal] = useState(0);
  const [scheduledChecks, setScheduledChecks] = useState<number[]>([]);
  const [pausedForVerification, setPausedForVerification] = useState(false);
  
  const penaltyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Minimum time before finish becomes available (30% of target)
  const minimumTime = Math.floor(targetTime * 0.3);

  // Schedule random verification checks when workout starts
  useEffect(() => {
    if (isRunning && scheduledChecks.length === 0 && elapsed === 0) {
      // Schedule 1-3 random checks during the workout
      const numChecks = Math.floor(Math.random() * 2) + 1; // 1-2 checks
      const checks: number[] = [];
      
      for (let i = 0; i < numChecks; i++) {
        // Schedule checks between 20% and 80% of target time
        const minCheckTime = Math.floor(targetTime * 0.2);
        const maxCheckTime = Math.floor(targetTime * 0.8);
        const checkTime = minCheckTime + Math.floor(Math.random() * (maxCheckTime - minCheckTime));
        checks.push(checkTime);
      }
      
      setScheduledChecks(checks.sort((a, b) => a - b));
      setVerificationsTotal(numChecks);
    }
  }, [isRunning, targetTime, scheduledChecks.length, elapsed]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !pausedForVerification) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, pausedForVerification]);

  // Check for scheduled verification times
  useEffect(() => {
    if (!isRunning || pausedForVerification) return;
    
    const nextCheck = scheduledChecks.find(checkTime => 
      elapsed >= checkTime && elapsed < checkTime + 2
    );
    
    if (nextCheck !== undefined) {
      // Remove this check from scheduled
      setScheduledChecks(prev => prev.filter(t => t !== nextCheck));
      // Trigger verification
      setVerificationCheckNumber(prev => prev + 1);
      setShowVerification(true);
      setPausedForVerification(true);
    }
  }, [elapsed, scheduledChecks, isRunning, pausedForVerification]);

  // Check if minimum time reached
  useEffect(() => {
    if (elapsed >= minimumTime && !minTimeReached) {
      setMinTimeReached(true);
      setIsLocked(false);
      audioEngine.playProgress(); // Sound when timer unlocks
    }
  }, [elapsed, minimumTime, minTimeReached]);

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

  const handleVerificationSuccess = useCallback(() => {
    setVerificationsPassed(prev => prev + 1);
    setTimeout(() => {
      setShowVerification(false);
      setPausedForVerification(false);
    }, 1500);
  }, []);

  const handleVerificationFailed = useCallback(() => {
    setShowVerification(false);
    setPausedForVerification(false);
    // Apply penalty for failed verification if staked
    if (isStaked) {
      const taxAmount = vault.depositAmount <= 20 ? 1 : 2;
      applyWeaknessTax(taxAmount, 'Failed Integrity Check');
    }
  }, [isStaked, vault.depositAmount, applyWeaknessTax]);

  const triggerPenaltyWarning = useCallback(() => {
    if (showPenaltyWarning) return;
    
    audioEngine.playSiren(); // Play siren for penalty warning
    setShowPenaltyWarning(true);
    setPenaltyCountdown(10);

    let count = 10;
    penaltyTimeoutRef.current = setInterval(() => {
      count -= 1;
      setPenaltyCountdown(count);
      audioEngine.playTick(); // Tick sound for countdown
      
      if (count <= 0) {
        if (penaltyTimeoutRef.current) {
          clearInterval(penaltyTimeoutRef.current);
        }
        // Apply penalty
        audioEngine.playGlitch(); // Glitch sound for penalty applied
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
    audioEngine.playHydraulic(); // Industrial start sound
    setIsRunning(true);
    setElapsed(0);
    setIsLocked(true);
    setMinTimeReached(false);
    setScheduledChecks([]);
    setVerificationsPassed(0);
    setVerificationsTotal(0);
    setVerificationCheckNumber(0);
  };

  const handleFinish = () => {
    if (!minTimeReached) return;
    
    audioEngine.playComplete(); // Completion fanfare
    setIsRunning(false);
    const beatTarget = elapsed < targetTime;
    onComplete(elapsed, beatTarget, { 
      passed: verificationsPassed, 
      total: verificationsTotal 
    });
  };

  const isOverTarget = elapsed > targetTime;
  const progress = Math.min((elapsed / targetTime) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Verification Check Overlay */}
      {showVerification && (
        <VerificationCheck
          onVerified={handleVerificationSuccess}
          onFailed={handleVerificationFailed}
          checkNumber={verificationCheckNumber}
        />
      )}

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
          {pausedForVerification && (
            <span className="ml-2 text-energy animate-pulse">• PAUSED FOR CHECK</span>
          )}
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

        {/* Verification status */}
        {verificationsTotal > 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>INTEGRITY CHECKS:</span>
            <span className={verificationsPassed === verificationsTotal ? 'text-primary' : 'text-energy'}>
              {verificationsPassed}/{verificationsTotal} PASSED
            </span>
          </div>
        )}

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
            disabled={!minTimeReached || pausedForVerification}
            className={`flex-1 ${minTimeReached && !pausedForVerification ? 'btn-terminal' : 'btn-danger opacity-50'}`}
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
