import { useState, useEffect } from 'react';
import { Trophy, Users, CheckCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface WeeklyChallengeProps {
  onAccept?: () => void;
  isAccepted?: boolean;
  currentProgress?: number;
  onLogProgress?: (amount: number) => void;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
  splitSuggestion: string;
  participants: number;
  icon: string;
}

// Weekly challenges rotate based on week number
const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: 'push100',
    name: '100 PUSH-UP DAY',
    description: 'Complete 100 push-ups throughout the day',
    target: 100,
    unit: 'push-ups',
    splitSuggestion: 'Split into 10 sets of 10',
    participants: 2439,
    icon: '💪'
  },
  {
    id: 'squat200',
    name: '200 SQUAT SIEGE',
    description: 'Crush 200 squats before midnight',
    target: 200,
    unit: 'squats',
    splitSuggestion: 'Split into 20 sets of 10',
    participants: 1876,
    icon: '🦵'
  },
  {
    id: 'burpee50',
    name: 'BURPEE BLITZ',
    description: '50 burpees scattered throughout the day',
    target: 50,
    unit: 'burpees',
    splitSuggestion: 'Split into 5 sets of 10',
    participants: 987,
    icon: '🔥'
  },
  {
    id: 'plank10',
    name: 'PLANK MARATHON',
    description: 'Accumulate 10 minutes of plank holds',
    target: 600,
    unit: 'seconds',
    splitSuggestion: 'Split into 10 sets of 1 minute',
    participants: 1543,
    icon: '🧱'
  },
  {
    id: 'lunge150',
    name: 'LUNGE GAUNTLET',
    description: '150 lunges (75 each leg) by end of day',
    target: 150,
    unit: 'lunges',
    splitSuggestion: 'Split into 15 sets of 10',
    participants: 1234,
    icon: '🏃'
  }
];

const getWeeklyChallenge = (): Challenge => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];
};

const WeeklyChallenge = ({ 
  onAccept, 
  isAccepted = false, 
  currentProgress = 0,
  onLogProgress 
}: WeeklyChallengeProps) => {
  const [challenge] = useState<Challenge>(getWeeklyChallenge);
  const [localProgress, setLocalProgress] = useState(currentProgress);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [accepted, setAccepted] = useState(isAccepted);

  // Simulate growing participants (random increase)
  const [participants, setParticipants] = useState(challenge.participants);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setParticipants(prev => prev + Math.floor(Math.random() * 3));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min((localProgress / challenge.target) * 100, 100);
  const isCompleted = localProgress >= challenge.target;

  const handleAccept = () => {
    setAccepted(true);
    onAccept?.();
  };

  const handleLogProgress = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && value > 0) {
      const newProgress = localProgress + value;
      setLocalProgress(newProgress);
      onLogProgress?.(value);
      setInputValue('');
      setShowInput(false);
    }
  };

  const formatUnit = (value: number) => {
    if (challenge.unit === 'seconds') {
      const mins = Math.floor(value / 60);
      const secs = value % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return value.toString();
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-primary/10 border border-primary/30 p-6">
      {/* Animated corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20">
        <div className="absolute inset-0 bg-primary/20 rotate-45 translate-x-10 -translate-y-10" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{challenge.icon}</span>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-primary font-mono flex items-center gap-2">
                <Trophy className="w-3 h-3" />
                CHALLENGE OF THE WEEK
              </div>
              <h3 className="text-lg md:text-xl font-mono font-bold text-foreground uppercase">
                {challenge.name}
              </h3>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-500 font-mono text-xs uppercase">
              <CheckCircle className="w-4 h-4" />
              COMPLETED
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground font-mono text-sm mb-2">
          {challenge.description}
        </p>
        <p className="text-primary/70 font-mono text-xs mb-4">
          💡 {challenge.splitSuggestion}
        </p>

        {/* Social Proof */}
        <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs mb-4">
          <Users className="w-4 h-4" />
          <span>
            <span className="text-primary font-bold">{participants.toLocaleString()}</span> warriors have accepted this challenge
          </span>
        </div>

        {/* Progress (if accepted) */}
        {accepted && (
          <div className="mb-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-muted-foreground uppercase">Progress</span>
              <span className="text-foreground">
                <span className="text-primary font-bold">{formatUnit(localProgress)}</span>
                <span className="text-muted-foreground"> / {formatUnit(challenge.target)} {challenge.unit !== 'seconds' && challenge.unit}</span>
              </span>
            </div>
            <Progress 
              value={progressPercent} 
              className="h-2 bg-muted"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {!accepted ? (
            <Button
              onClick={handleAccept}
              className="flex-1 font-mono uppercase text-xs bg-primary hover:bg-primary/90"
            >
              <Target className="w-4 h-4 mr-2" />
              Accept Challenge
            </Button>
          ) : (
            <>
              {!showInput ? (
                <Button
                  onClick={() => setShowInput(true)}
                  variant="outline"
                  className="flex-1 font-mono uppercase text-xs border-primary/30 hover:bg-primary/10"
                  disabled={isCompleted}
                >
                  + Log Progress
                </Button>
              ) : (
                <div className="flex-1 flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={challenge.unit === 'seconds' ? 'seconds' : 'reps'}
                    className="flex-1 bg-background border border-primary/30 px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                  <Button
                    onClick={handleLogProgress}
                    size="sm"
                    className="font-mono text-xs"
                  >
                    ADD
                  </Button>
                  <Button
                    onClick={() => setShowInput(false)}
                    size="sm"
                    variant="ghost"
                    className="font-mono text-xs"
                  >
                    ✕
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyChallenge;
