CREATE OR REPLACE VIEW public.profiles_public AS
SELECT
  user_id,
  username,
  avatar_url,
  xp,
  current_streak,
  is_pro,
  bio
FROM public.profiles;