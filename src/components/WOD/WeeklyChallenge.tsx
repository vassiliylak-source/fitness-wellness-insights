import { useState, useEffect, useCallback } from 'react';
import { Trophy, Users, CheckCircle, Target, Crown, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { audioEngine } from '@/lib/audioEngine';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Challenge {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
  splitSuggestion: string;
  icon: string;
}

interface LeaderboardEntry {
  display_name: string;
  progress: number;
  completed: boolean;
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
    icon: '💪'
  },
  {
    id: 'squat200',
    name: '200 SQUAT SIEGE',
    description: 'Crush 200 squats before midnight',
    target: 200,
    unit: 'squats',
    splitSuggestion: 'Split into 20 sets of 10',
    icon: '🦵'
  },
  {
    id: 'burpee50',
    name: 'BURPEE BLITZ',
    description: '50 burpees scattered throughout the day',
    target: 50,
    unit: 'burpees',
    splitSuggestion: 'Split into 5 sets of 10',
    icon: '🔥'
  },
  {
    id: 'plank10',
    name: 'PLANK MARATHON',
    description: 'Accumulate 10 minutes of plank holds',
    target: 600,
    unit: 'seconds',
    splitSuggestion: 'Split into 10 sets of 1 minute',
    icon: '🧱'
  },
  {
    id: 'lunge150',
    name: 'LUNGE GAUNTLET',
    description: '150 lunges (75 each leg) by end of day',
    target: 150,
    unit: 'lunges',
    splitSuggestion: 'Split into 15 sets of 10',
    icon: '🏃'
  }
];

const getWeekInfo = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return { weekNumber, year: now.getFullYear() };
};

const getWeeklyChallenge = (): Challenge => {
  const { weekNumber } = getWeekInfo();
  return WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];
};

const WeeklyChallenge = () => {
  const { user } = useAuth();
  const [challenge] = useState<Challenge>(getWeeklyChallenge);
  const [localProgress, setLocalProgress] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);

  const { weekNumber, year } = getWeekInfo();

  // Fetch leaderboard and user progress
  const fetchData = useCallback(async () => {
    // Fetch leaderboard
    const { data: leaderboardData } = await supabase
      .from('weekly_challenge_participations')
      .select('display_name, progress, completed_at')
      .eq('challenge_id', challenge.id)
      .eq('week_number', weekNumber)
      .eq('year', year)
      .order('progress', { ascending: false })
      .limit(10);

    if (leaderboardData) {
      setLeaderboard(leaderboardData.map(entry => ({
        display_name: entry.display_name || 'Anonymous Warrior',
        progress: entry.progress,
        completed: entry.completed_at !== null
      })));
    }

    // Count total participants
    const { count } = await supabase
      .from('weekly_challenge_participations')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challenge.id)
      .eq('week_number', weekNumber)
      .eq('year', year);

    setParticipantCount(count || 0);

    // Fetch user's own participation
    if (user) {
      const { data: userParticipation } = await supabase
        .from('weekly_challenge_participations')
        .select('progress')
        .eq('user_id', user.id)
        .eq('challenge_id', challenge.id)
        .eq('week_number', weekNumber)
        .eq('year', year)
        .maybeSingle();

      if (userParticipation) {
        setAccepted(true);
        setLocalProgress(userParticipation.progress);

        // Find user rank
        const { count: rankCount } = await supabase
          .from('weekly_challenge_participations')
          .select('*', { count: 'exact', head: true })
          .eq('challenge_id', challenge.id)
          .eq('week_number', weekNumber)
          .eq('year', year)
          .gt('progress', userParticipation.progress);

        setUserRank((rankCount || 0) + 1);
      }
    }
  }, [challenge.id, weekNumber, year, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const progressPercent = Math.min((localProgress / challenge.target) * 100, 100);
  const isCompleted = localProgress >= challenge.target;

  const handleAccept = async () => {
    if (!user) return;

    const displayName = user.email?.split('@')[0] || 'Warrior';
    
    const { error } = await supabase
      .from('weekly_challenge_participations')
      .insert({
        user_id: user.id,
        session_id: user.id,
        challenge_id: challenge.id,
        week_number: weekNumber,
        year: year,
        progress: 0,
        target: challenge.target,
        display_name: displayName
      });

    if (!error) {
      setAccepted(true);
      audioEngine.play('accept');
      fetchData();
    }
  };

  const handleLogProgress = async () => {
    if (!user) return;
    
    const value = parseInt(inputValue);
    if (!isNaN(value) && value > 0) {
      const newProgress = localProgress + value;
      const nowCompleted = newProgress >= challenge.target;
      
      const { error } = await supabase
        .from('weekly_challenge_participations')
        .update({ 
          progress: newProgress,
          completed_at: nowCompleted ? new Date().toISOString() : null
        })
        .eq('user_id', user.id)
        .eq('challenge_id', challenge.id)
        .eq('week_number', weekNumber)
        .eq('year', year);

      if (!error) {
        setLocalProgress(newProgress);
        
        if (nowCompleted) {
          audioEngine.play('complete');
        } else {
          audioEngine.play('progress');
        }
        
        setInputValue('');
        setShowInput(false);
        fetchData();
      }
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="w-4 text-center font-mono text-xs text-muted-foreground">{rank}</span>;
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

        {/* Social Proof & User Rank */}
        <div className="flex items-center justify-between text-muted-foreground font-mono text-xs mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              <span className="text-primary font-bold">{participantCount.toLocaleString()}</span> warriors
            </span>
          </div>
          {userRank && (
            <div className="flex items-center gap-2 text-primary">
              <span>Your rank: #{userRank}</span>
            </div>
          )}
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

        {/* Leaderboard Toggle */}
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="w-full text-left text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-4 flex items-center gap-2"
        >
          <Crown className="w-3 h-3" />
          {showLeaderboard ? '▼ HIDE LEADERBOARD' : '▶ VIEW TOP 10'}
        </button>

        {/* Leaderboard */}
        {showLeaderboard && (
          <div className="mb-4 bg-background/50 border border-border/50 p-3 space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
              TOP PERFORMERS
            </div>
            {leaderboard.length === 0 ? (
              <p className="text-xs font-mono text-muted-foreground text-center py-4">
                No participants yet. Be the first!
              </p>
            ) : (
              leaderboard.map((entry, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between py-1.5 px-2 ${
                    index === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(index + 1)}
                    <span className="font-mono text-xs text-foreground">
                      {entry.display_name}
                    </span>
                    {entry.completed && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                  <span className="font-mono text-xs text-primary font-bold">
                    {formatUnit(entry.progress)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {!accepted ? (
            <Button
              onClick={handleAccept}
              className="flex-1 font-mono uppercase text-xs bg-primary hover:bg-primary/90"
              disabled={!user}
            >
              <Target className="w-4 h-4 mr-2" />
              {user ? 'Accept Challenge' : 'Sign in to Accept'}
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
