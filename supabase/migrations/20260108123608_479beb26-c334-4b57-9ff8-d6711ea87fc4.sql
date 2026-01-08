-- Add delete policy for user_vaults
CREATE POLICY "Users can delete own vault"
ON public.user_vaults
FOR DELETE
USING (auth.uid() = user_id);