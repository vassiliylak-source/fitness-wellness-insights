-- Add user_id column to workout_logs
ALTER TABLE public.workout_logs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to workout_streaks
ALTER TABLE public.workout_streaks ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing overly permissive policies on workout_logs
DROP POLICY IF EXISTS "Anyone can insert workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Anyone can read their own workout logs" ON public.workout_logs;

-- Create secure policies for workout_logs
CREATE POLICY "Users can insert their own workout logs" 
ON public.workout_logs 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own workout logs" 
ON public.workout_logs 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs" 
ON public.workout_logs 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Drop existing overly permissive policies on workout_streaks
DROP POLICY IF EXISTS "Anyone can manage their streaks" ON public.workout_streaks;

-- Create secure policies for workout_streaks
CREATE POLICY "Users can insert their own streaks" 
ON public.workout_streaks 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own streaks" 
ON public.workout_streaks 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.workout_streaks 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own streaks" 
ON public.workout_streaks 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);