-- Create user_vaults table for persisting vault data for authenticated users
CREATE TABLE public.user_vaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  deposit_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  at_risk_capital NUMERIC(10,2) NOT NULL DEFAULT 0,
  weakness_taxes NUMERIC(10,2) NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  cycle_start_date TIMESTAMPTZ,
  cycle_end_date TIMESTAMPTZ,
  last_completion_date DATE,
  sweat_points INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  generations_today INTEGER NOT NULL DEFAULT 0,
  last_gen_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_vaults ENABLE ROW LEVEL SECURITY;

-- Users can only view their own vault
CREATE POLICY "Users can view own vault"
ON public.user_vaults
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own vault
CREATE POLICY "Users can create own vault"
ON public.user_vaults
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own vault
CREATE POLICY "Users can update own vault"
ON public.user_vaults
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_vaults_updated_at
BEFORE UPDATE ON public.user_vaults
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();