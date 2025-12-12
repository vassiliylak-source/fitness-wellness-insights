// Session management for anonymous user tracking and workout persistence
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GeneratedWOD, GeneratedExercise } from '@/constants/wod';
import { Json } from '@/integrations/supabase/types';

interface WorkoutLog {
  id: string;
  workout_hash: string;
  package_type: string;
  exercises: GeneratedExercise[];
  target_time: number;
  actual_time: number | null;
  difficulty_rating: number | null;
  feeling: 'dead' | 'ok' | 'more' | null;
  completed_at: string;
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_workout_date: string | null;
  total_workouts: number;
  unlocked_features: string[];
}

interface GlobalStats {
  total_completions: number;
  average_time: number;
  fastest_time: number | null;
}

// Generate unique session ID for anonymous user
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('chaos_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('chaos_session_id', sessionId);
  }
  return sessionId;
};

// Generate workout hash for comparing similar workouts
const generateWorkoutHash = (wod: GeneratedWOD): string => {
  const exerciseIds = wod.exercises.map(e => e.exercise.id).sort().join('_');
  return `${wod.package}_${exerciseIds}`;
};

export const useWorkoutSession = () => {
  const [sessionId] = useState(getSessionId);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch streak data on mount
  useEffect(() => {
    fetchStreakData();
    fetchWorkoutHistory();
  }, [sessionId]);

  const fetchStreakData = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_streaks')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching streak:', error);
        return;
      }

      if (data) {
        setStreakData({
          current_streak: data.current_streak,
          longest_streak: data.longest_streak,
          last_workout_date: data.last_workout_date,
          total_workouts: data.total_workouts,
          unlocked_features: Array.isArray(data.unlocked_features) 
            ? (data.unlocked_features as Json[]).map(f => String(f))
            : []
        });
      } else {
        // Create new streak record
        setStreakData({
          current_streak: 0,
          longest_streak: 0,
          last_workout_date: null,
          total_workouts: 0,
          unlocked_features: []
        });
      }
    } catch (err) {
      console.error('Error in fetchStreakData:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkoutHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('session_id', sessionId)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching history:', error);
        return;
      }

      if (data) {
        setWorkoutHistory(data.map(d => ({
          id: d.id,
          workout_hash: d.workout_hash,
          package_type: d.package_type,
          exercises: d.exercises as unknown as GeneratedExercise[],
          target_time: d.target_time,
          actual_time: d.actual_time,
          difficulty_rating: d.difficulty_rating,
          feeling: d.feeling as 'dead' | 'ok' | 'more' | null,
          completed_at: d.completed_at
        })));
      }
    } catch (err) {
      console.error('Error in fetchWorkoutHistory:', err);
    }
  };

  const recordWorkout = async (
    wod: GeneratedWOD,
    actualTime: number,
    difficultyRating?: number,
    feeling?: 'dead' | 'ok' | 'more'
  ) => {
    const workoutHash = generateWorkoutHash(wod);
    const today = new Date().toISOString().split('T')[0];

    try {
      // Insert workout log
      const { error: logError } = await supabase
        .from('workout_logs')
        .insert({
          session_id: sessionId,
          workout_hash: workoutHash,
          package_type: wod.package,
          exercises: wod.exercises as unknown as Json,
          target_time: wod.targetTime,
          actual_time: actualTime,
          difficulty_rating: difficultyRating || null,
          feeling: feeling || null
        });

      if (logError) {
        console.error('Error recording workout:', logError);
        return false;
      }

      // Update streak
      const isConsecutiveDay = streakData?.last_workout_date 
        ? isNextDay(streakData.last_workout_date, today)
        : true;
      
      const isSameDay = streakData?.last_workout_date === today;
      
      let newStreak = streakData?.current_streak || 0;
      if (!isSameDay) {
        newStreak = isConsecutiveDay ? newStreak + 1 : 1;
      }
      
      const newTotal = (streakData?.total_workouts || 0) + 1;
      const newLongest = Math.max(newStreak, streakData?.longest_streak || 0);
      
      // Check for unlockables
      const unlockedFeatures = [...(streakData?.unlocked_features || [])];
      if (newStreak >= 7 && !unlockedFeatures.includes('hell_mode_unlocked')) {
        unlockedFeatures.push('hell_mode_unlocked');
      }
      if (newTotal >= 10 && !unlockedFeatures.includes('protocol_omega')) {
        unlockedFeatures.push('protocol_omega');
      }
      if (newTotal >= 25 && !unlockedFeatures.includes('mythic_access')) {
        unlockedFeatures.push('mythic_access');
      }

      // Upsert streak data
      const { error: streakError } = await supabase
        .from('workout_streaks')
        .upsert({
          session_id: sessionId,
          current_streak: newStreak,
          longest_streak: newLongest,
          last_workout_date: today,
          total_workouts: newTotal,
          unlocked_features: unlockedFeatures as unknown as Json
        }, {
          onConflict: 'session_id'
        });

      if (streakError) {
        console.error('Error updating streak:', streakError);
      }

      // Update global stats
      await updateGlobalStats(workoutHash, actualTime);

      // Refresh local state
      await fetchStreakData();
      await fetchWorkoutHistory();

      return true;
    } catch (err) {
      console.error('Error in recordWorkout:', err);
      return false;
    }
  };

  const updateGlobalStats = async (workoutHash: string, actualTime: number) => {
    try {
      const { data: existing } = await supabase
        .from('workout_global_stats')
        .select('*')
        .eq('workout_hash', workoutHash)
        .maybeSingle();

      if (existing) {
        const newTotal = existing.total_completions + 1;
        const newAvg = Math.round(
          (existing.average_time * existing.total_completions + actualTime) / newTotal
        );
        const newFastest = existing.fastest_time 
          ? Math.min(existing.fastest_time, actualTime)
          : actualTime;

        await supabase
          .from('workout_global_stats')
          .update({
            total_completions: newTotal,
            average_time: newAvg,
            fastest_time: newFastest
          })
          .eq('workout_hash', workoutHash);
      } else {
        await supabase
          .from('workout_global_stats')
          .insert({
            workout_hash: workoutHash,
            total_completions: 1,
            average_time: actualTime,
            fastest_time: actualTime
          });
      }
    } catch (err) {
      console.error('Error updating global stats:', err);
    }
  };

  const getGlobalStats = async (wod: GeneratedWOD): Promise<GlobalStats | null> => {
    const workoutHash = generateWorkoutHash(wod);
    
    try {
      const { data, error } = await supabase
        .from('workout_global_stats')
        .select('*')
        .eq('workout_hash', workoutHash)
        .maybeSingle();

      if (error || !data) return null;

      return {
        total_completions: data.total_completions,
        average_time: data.average_time,
        fastest_time: data.fastest_time
      };
    } catch {
      return null;
    }
  };

  const getGhostTime = (wod: GeneratedWOD): number | null => {
    const workoutHash = generateWorkoutHash(wod);
    const previousAttempt = workoutHistory.find(w => w.workout_hash === workoutHash && w.actual_time);
    return previousAttempt?.actual_time || null;
  };

  return {
    sessionId,
    streakData,
    workoutHistory,
    isLoading,
    recordWorkout,
    getGlobalStats,
    getGhostTime,
    fetchWorkoutHistory
  };
};

// Helper: check if date2 is the day after date1
function isNextDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setDate(d1.getDate() + 1);
  return d1.toISOString().split('T')[0] === date2;
}
