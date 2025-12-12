import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Zap, 
  Maximize, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/constants/wod';
import { audioEngine } from '@/lib/audioEngine';

interface TimerProps {
  initialTime?: number;
  isCountdown?: boolean;
  targetTime?: number;
  onComplete?: (time?: number, beatTarget?: boolean) => void;
  onScaleDown?: () => void;
  onSabotage?: () => void;
}

const Timer = ({ 
  initialTime = 0, 
  isCountdown = false, 
  targetTime, 
  onComplete,
  onScaleDown,
  onSabotage
}: TimerProps) => {
  const [time, setTime] = useState(isCountdown ? initialTime : 0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [beatTarget, setBeatTarget] = useState<boolean | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [sabotageTriggered, setSabotageTriggered] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const sabotageCheckRef = useRef<number | null>(null);

  // Handle fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      if (timerRef.current?.parentElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (e) {
      console.log('Fullscreen not supported');
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Exit warning handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isRunning && document.hidden) {
        setShowExitWarning(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = 'Giving up creates a pattern of failure. Are you sure?';
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && isRunning) {
        setShowExitWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning]);

  // Sabotage mode - random exercise addition
  useEffect(() => {
    if (isRunning && !sabotageTriggered && targetTime) {
      // 30% chance of sabotage between 30-60% of target time
      const sabotageMinTime = targetTime * 0.3;
      const sabotageMaxTime = targetTime * 0.6;
      const sabotageTime = sabotageMinTime + Math.random() * (sabotageMaxTime - sabotageMinTime);
      
      sabotageCheckRef.current = window.setTimeout(() => {
        if (Math.random() < 0.3 && isRunning) { // 30% chance
          setSabotageTriggered(true);
          audioEngine.play('glitch');
          onSabotage?.();
        }
      }, sabotageTime * 1000);
    }

    return () => {
      if (sabotageCheckRef.current) {
        clearTimeout(sabotageCheckRef.current);
      }
    };
  }, [isRunning, targetTime, sabotageTriggered, onSabotage]);

  // Timer logic with metronome
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      // Start metronome at 130 BPM for HIIT intensity
      if (soundEnabled) {
        audioEngine.startMetronome(130);
      }
      
      interval = setInterval(() => {
        setTime(prev => {
          if (isCountdown) {
            if (prev <= 1) {
              setIsRunning(false);
              setHasCompleted(true);
              audioEngine.stopMetronome();
              audioEngine.play('complete');
              onComplete?.();
              return 0;
            }
            if (prev <= 4 && soundEnabled) audioEngine.play('beep');
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      audioEngine.stopMetronome();
    }
    
    return () => {
      clearInterval(interval);
      audioEngine.stopMetronome();
    };
  }, [isRunning, isCountdown, onComplete, soundEnabled]);

  // Sound toggle
  useEffect(() => {
    audioEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const reset = () => {
    setTime(isCountdown ? initialTime : 0);
    setIsRunning(false);
    setHasCompleted(false);
    setBeatTarget(null);
    setSabotageTriggered(false);
    setShowExitWarning(false);
    audioEngine.stopMetronome();
  };

  const toggleTimer = () => {
    if (!isRunning) {
      audioEngine.play('shutter');
    }
    setIsRunning(!isRunning);
  };

  const handleScaleDown = () => {
    audioEngine.play('hydraulic');
    onScaleDown?.();
  };

  const completeWorkout = () => {
    setIsRunning(false);
    setHasCompleted(true);
    audioEngine.stopMetronome();
    audioEngine.play('complete');
    const didBeatTarget = targetTime ? time < targetTime : false;
    if (targetTime) {
      setBeatTarget(didBeatTarget);
    }
    onComplete?.(time, didBeatTarget);
  };

  const dismissWarning = () => {
    setShowExitWarning(false);
  };

  const progressPercent = targetTime ? Math.min((time / targetTime) * 100, 100) : 0;
  const isOverTarget = targetTime ? time >= targetTime : false;

  return (
    <div ref={timerRef} className="text-center py-6 relative">
      {/* Exit Warning Modal */}
      {showExitWarning && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
          <div className="card-brutal p-8 max-w-md text-center animate-shake">
            <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-mono font-bold text-destructive uppercase mb-4">
              SYSTEM WARNING
            </h3>
            <p className="text-foreground font-mono text-sm mb-6">
              Giving up creates a pattern of failure.
              <br />
              <span className="text-muted-foreground">Are you sure you want to quit?</span>
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={dismissWarning}
                className="btn-brutal"
              >
                CONTINUE PROTOCOL
              </Button>
              <Button
                onClick={() => {
                  reset();
                  exitFullscreen();
                }}
                variant="outline"
                className="font-mono uppercase"
              >
                ABORT
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Target time display */}
      {targetTime && !hasCompleted && (
        <div className="mb-6 p-4 bg-card/50 border border-border rounded-none">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              ALGORITHM PREDICTION
            </span>
          </div>
          <div className="text-2xl font-mono font-black text-foreground">
            TARGET: <span className="fire-text">{formatTime(targetTime)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Beat the machine. Prove you are not average.
          </p>
        </div>
      )}

      {/* Timer display */}
      <div 
        className={`
          timer-display mb-6 transition-all duration-300 font-mono
          ${isRunning ? 'fire-text animate-glow-pulse' : 'text-foreground'}
          ${hasCompleted && beatTarget ? 'text-accent' : ''}
          ${hasCompleted && beatTarget === false ? 'text-destructive' : ''}
          ${isOverTarget && isRunning ? 'text-destructive' : ''}
        `}
      >
        {formatTime(time)}
      </div>

      {/* BPM indicator when running */}
      {isRunning && soundEnabled && (
        <div className="mb-4 text-xs font-mono text-primary/60 uppercase tracking-widest animate-pulse">
          ◈ BPM: 130 ◈ SYNC ACTIVE ◈
        </div>
      )}

      {/* Progress bar vs target */}
      {targetTime && !isCountdown && !hasCompleted && (
        <div className="max-w-md mx-auto mb-6">
          <div className="h-2 bg-muted rounded-none overflow-hidden border border-border">
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${progressPercent}%`,
                background: isOverTarget ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1 font-mono">
            <span>00:00</span>
            <span className={isOverTarget ? 'text-destructive' : ''}>{formatTime(targetTime)}</span>
          </div>
        </div>
      )}
      
      {/* Completion message */}
      {hasCompleted && (
        <div className={`text-xl font-mono font-black uppercase mb-6 animate-fade-in ${beatTarget ? 'text-accent' : 'text-destructive'}`}>
          {beatTarget === true && '⚡ ALGORITHM DEFEATED ⚡'}
          {beatTarget === false && '💀 MACHINE WINS 💀'}
          {beatTarget === null && '◈ SEQUENCE COMPLETE ◈'}
        </div>
      )}
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* Fullscreen Lock-in */}
        {!isRunning && !hasCompleted && (
          <Button
            onClick={async () => {
              await enterFullscreen();
              toggleTimer();
            }}
            className="btn-brutal py-6 px-8"
          >
            <Maximize className="w-5 h-5 mr-2" />
            LOCKED IN
          </Button>
        )}

        {/* Regular start (without fullscreen) */}
        <Button
          onClick={toggleTimer}
          className={`
            w-20 h-20 rounded-none p-0 border-2 border-primary
            ${isRunning ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'}
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

        {/* Scale Down panic button */}
        {isRunning && onScaleDown && (
          <Button
            onClick={handleScaleDown}
            variant="outline"
            className="h-16 px-4 rounded-none border-2 border-energy text-energy hover:bg-energy hover:text-energy-foreground font-mono uppercase"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            SOS -30%
          </Button>
        )}
        
        <Button
          onClick={reset}
          variant="outline"
          className="w-16 h-16 rounded-none p-0 border-2 border-muted-foreground hover:border-primary"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
        
        <Button
          onClick={() => setSoundEnabled(!soundEnabled)}
          variant="ghost"
          className="w-12 h-12 rounded-none p-0"
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
          <div className="h-2 bg-muted rounded-none overflow-hidden max-w-md mx-auto border border-border">
            <div 
              className="h-full transition-all duration-1000 ease-linear"
              style={{ 
                width: `${(time / initialTime) * 100}%`,
                background: time <= 10 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
