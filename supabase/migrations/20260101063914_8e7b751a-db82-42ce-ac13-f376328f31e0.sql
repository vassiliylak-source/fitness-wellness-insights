-- Create weekly challenge participations table
CREATE TABLE public.weekly_challenge_participations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    session_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    target INTEGER NOT NULL,
    display_name TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, challenge_id, week_number, year)
);

-- Enable RLS
ALTER TABLE public.weekly_challenge_participations ENABLE ROW LEVEL SECURITY;

-- Users can read all participations (for leaderboard)
CREATE POLICY "Anyone can read challenge participations for leaderboard"
ON public.weekly_challenge_participations
FOR SELECT
USING (true);

-- Users can insert their own participations
CREATE POLICY "Users can insert their own participations"
ON public.weekly_challenge_participations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own participations
CREATE POLICY "Users can update their own participations"
ON public.weekly_challenge_participations
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_weekly_challenge_participations_updated_at
BEFORE UPDATE ON public.weekly_challenge_participations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();