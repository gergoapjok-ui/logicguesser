
DROP VIEW IF EXISTS public.puzzles_public;
CREATE VIEW public.puzzles_public WITH (security_invoker = true) AS
  SELECT id, question, puzzle_date, difficulty, task_number, created_at FROM public.puzzles;
GRANT SELECT ON public.puzzles_public TO anon, authenticated;

DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public WITH (security_invoker = true) AS
  SELECT user_id, username, avatar_url, xp, current_streak FROM public.profiles;
GRANT SELECT ON public.profiles_public TO anon, authenticated;
