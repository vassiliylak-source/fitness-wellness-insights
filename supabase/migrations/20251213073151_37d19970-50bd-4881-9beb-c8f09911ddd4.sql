-- Restrict write operations on daily_tips to prevent unauthorized modifications
-- Note: There's no admin role system, so we prevent all write operations via RLS
-- Admins can use service role key or direct DB access to manage tips

-- Create explicit DENY policies for write operations (RLS is already enabled)
CREATE POLICY "Block all inserts on daily_tips"
ON public.daily_tips
FOR INSERT
TO authenticated, anon
WITH CHECK (false);

CREATE POLICY "Block all updates on daily_tips"
ON public.daily_tips
FOR UPDATE
TO authenticated, anon
USING (false);

CREATE POLICY "Block all deletes on daily_tips"
ON public.daily_tips
FOR DELETE
TO authenticated, anon
USING (false);