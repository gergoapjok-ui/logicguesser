
-- Add missing columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_retries_used integer NOT NULL DEFAULT 0;

-- Recreate profiles_public view with is_pro
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public WITH (security_invoker=on) AS
  SELECT user_id, username, avatar_url, xp, current_streak, is_pro
  FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;
