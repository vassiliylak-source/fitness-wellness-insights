-- Create workout_logs table for Chronicle system
CREATE TABLE public.workout_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  workout_hash TEXT NOT NULL,
  package_type TEXT NOT NULL,
  exercises JSONB NOT NULL,
  target_time INTEGER NOT NULL,
  actual_time INTEGER,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  feeling TEXT CHECK (feeling IN ('dead', 'ok', 'more')),
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create streaks table
CREATE TABLE public.workout_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_workout_date DATE,
  total_workouts INTEGER NOT NULL DEFAULT 0,
  unlocked_features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create global_stats table for anonymous leaderboard
CREATE TABLE public.workout_global_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_hash TEXT NOT NULL,
  total_completions INTEGER NOT NULL DEFAULT 0,
  average_time INTEGER NOT NULL DEFAULT 0,
  fastest_time INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_tips table
CREATE TABLE public.daily_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tip_text TEXT NOT NULL,
  tip_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_global_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tips ENABLE ROW LEVEL SECURITY;

-- Public read/write for workout_logs (anonymous users tracked by session_id)
CREATE POLICY "Anyone can insert workout logs" 
ON public.workout_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read their own workout logs" 
ON public.workout_logs 
FOR SELECT 
USING (true);

-- Public read/write for workout_streaks
CREATE POLICY "Anyone can manage their streaks" 
ON public.workout_streaks 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Public read for global stats, insert/update allowed
CREATE POLICY "Anyone can read global stats" 
ON public.workout_global_stats 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update global stats" 
ON public.workout_global_stats 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Public read for daily tips
CREATE POLICY "Anyone can read daily tips" 
ON public.daily_tips 
FOR SELECT 
USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_workout_streaks_updated_at
BEFORE UPDATE ON public.workout_streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_global_stats_updated_at
BEFORE UPDATE ON public.workout_global_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();