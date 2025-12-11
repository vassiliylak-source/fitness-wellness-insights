import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/constants/wod';

interface TimerProps {
  initialTime?: number;
  isCountdown?: boolean;
  targetTime?: number; // AI prediction to beat
  onComplete?: () => void;
}

const Timer = ({ initialTime = 0, isCountdown = false, targetTime, onComplete }: TimerProps) => {
  const [time, setTime] = useState(isCountdown ? initialTime : 0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [beatTarget, setBeatTarget] = useState<boolean | null>(null);

  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => {
          if (isCountdown) {
            if (prev <= 1) {
              setIsRunning(false);
              setHasCompleted(true);
              playBeep();
              onComplete?.();
              return 0;
            }
            if (prev <= 4) playBeep();
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isCountdown, onComplete, playBeep]);

  const reset = () => {
    setTime(isCountdown ? initialTime : 0);
    setIsRunning(false);
    setHasCompleted(false);
    setBeatTarget(null);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const completeWorkout = () => {
    setIsRunning(false);
    setHasCompleted(true);
    if (targetTime) {
      setBeatTarget(time < targetTime);
    }
    playBeep();
    onComplete?.();
  };

  // Calculate progress against target
  const progressPercent = targetTime ? Math.min((time / targetTime) * 100, 100) : 0;
  const isOverTarget = targetTime ? time >= targetTime : false;

  return (
    <div className="text-center py-6">
      {/* Target time display */}
      {targetTime && !hasCompleted && (
        <div className="mb-6 p-4 bg-card/50 border border-border rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Algorithm Prediction
            </span>
          </div>
          <div className="text-2xl font-black text-foreground">
            Target: <span className="fire-text">{formatTime(targetTime)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Beat the machine. Prove you're not average.
          </p>
        </div>
      )}

      {/* Timer display */}
      <div 
        className={`
          timer-display mb-6 transition-all duration-300
          ${isRunning ? 'fire-text animate-glow-pulse' : 'text-foreground'}
          ${hasCompleted && beatTarget ? 'text-accent' : ''}
          ${hasCompleted && beatTarget === false ? 'text-destructive' : ''}
          ${isOverTarget && isRunning ? 'text-destructive' : ''}
        `}
      >
        {formatTime(time)}
      </div>

      {/* Progress bar vs target */}
      {targetTime && !isCountdown && !hasCompleted && (
        <div className="max-w-md mx-auto mb-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${progressPercent}%`,
                background: isOverTarget ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>00:00</span>
            <span className={isOverTarget ? 'text-destructive' : ''}>{formatTime(targetTime)}</span>
          </div>
        </div>
      )}
      
      {/* Completion message */}
      {hasCompleted && (
        <div className={`text-xl font-black uppercase mb-6 animate-fade-in ${beatTarget ? 'text-accent' : 'text-destructive'}`}>
          {beatTarget === true && '⚡ ALGORITHM DEFEATED ⚡'}
          {beatTarget === false && '💀 MACHINE WINS 💀'}
          {beatTarget === null && '🔥 SEQUENCE COMPLETE 🔥'}
        </div>
      )}
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={toggleTimer}
          className={`
            btn-brutal w-20 h-20 rounded-full p-0
            ${isRunning ? 'bg-accent hover:bg-accent/90' : ''}
          `}
          disabled={hasCompleted}
        >
          {isRunning ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </Button>
        
        {/* Complete button (for stopwatch mode) */}
        {!isCountdown && isRunning && (
          <Button
            onClick={completeWorkout}
            className="btn-brutal h-16 px-6"
          >
            COMPLETE
          </Button>
        )}
        
        <Button
          onClick={reset}
          variant="outline"
          className="w-16 h-16 rounded-full p-0 border-2 border-muted-foreground hover:border-primary"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
        
        <Button
          onClick={() => setSoundEnabled(!soundEnabled)}
          variant="ghost"
          className="w-12 h-12 rounded-full p-0"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-muted-foreground" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      {/* Progress ring for countdown */}
      {isCountdown && initialTime > 0 && (
        <div className="mt-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden max-w-md mx-auto">
            <div 
              className="h-full transition-all duration-1000 ease-linear"
              style={{ 
                width: `${(time / initialTime) * 100}%`,
                background: time <= 10 ? 'hsl(var(--destructive))' : 'var(--gradient-fire)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
