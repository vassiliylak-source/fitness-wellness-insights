-- Remove the overly permissive ALL policy
DROP POLICY IF EXISTS "Anyone can update global stats" ON public.workout_global_stats;

-- Keep only the SELECT policy for public reading (it already exists)
-- The SELECT policy "Anyone can read global stats" with USING (true) is fine for public leaderboards