-- Create storage bucket for workout proof photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('workout-proofs', 'workout-proofs', false);

-- RLS: Users can upload their own proof photos
CREATE POLICY "Users can upload their own proof photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'workout-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS: Users can view their own proof photos
CREATE POLICY "Users can view their own proof photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'workout-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS: Users can delete their own proof photos
CREATE POLICY "Users can delete their own proof photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'workout-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add proof_photo_url column to workout_logs
ALTER TABLE public.workout_logs 
ADD COLUMN proof_photo_url TEXT DEFAULT NULL;

-- Add verification_checks_passed column (tracks how many random checks were passed)
ALTER TABLE public.workout_logs
ADD COLUMN verification_checks_passed INTEGER DEFAULT 0;

-- Add verification_checks_total column
ALTER TABLE public.workout_logs
ADD COLUMN verification_checks_total INTEGER DEFAULT 0;