-- Delete orphaned records with NULL user_id (these are inaccessible via RLS anyway)
DELETE FROM workout_logs WHERE user_id IS NULL;
DELETE FROM workout_streaks WHERE user_id IS NULL;

-- Add NOT NULL constraints to prevent future NULL values
ALTER TABLE workout_logs ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE workout_streaks ALTER COLUMN user_id SET NOT NULL;