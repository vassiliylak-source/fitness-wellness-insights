import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/constants/wod';

interface TimerProps {
  initialTime?: number; // in seconds, if countdown
  isCountdown?: boolean;
  onComplete?: () => void;
}

const Timer = ({ initialTime = 0, isCountdown = false, onComplete }: TimerProps) => {
  const [time, setTime] = useState(isCountdown ? initialTime : 0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);

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
            // Beep in last 3 seconds
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
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="text-center py-8">
      {/* Timer display */}
      <div 
        className={`
          timer-display mb-8 transition-all duration-300
          ${isRunning ? 'fire-text animate-glow-pulse' : 'text-foreground'}
          ${hasCompleted ? 'text-accent animate-shake' : ''}
        `}
      >
        {formatTime(time)}
      </div>
      
      {hasCompleted && (
        <div className="text-2xl font-black text-accent uppercase mb-6 animate-fade-in">
          🔥 TIME'S UP! 🔥
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
          disabled={hasCompleted && isCountdown}
        >
          {isRunning ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </Button>
        
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
