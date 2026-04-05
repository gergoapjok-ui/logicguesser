
-- Create public view for puzzles (hides answer column)
CREATE VIEW public.puzzles_public
WITH (security_invoker=on) AS
  SELECT id, question, puzzle_date, difficulty, created_at
  FROM public.puzzles;

-- Revoke direct SELECT on puzzles from anon and authenticated
REVOKE SELECT ON public.puzzles FROM anon, authenticated;

-- Grant SELECT on the view
GRANT SELECT ON public.puzzles_public TO anon, authenticated;

-- Create public view for profiles (hides credits and sensitive fields)
CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
  SELECT user_id, username, avatar_url, xp, current_streak
  FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Add leaderboard constraints
ALTER TABLE public.leaderboard ADD CONSTRAINT time_taken_positive CHECK (time_taken > 0);
ALTER TABLE public.leaderboard ADD CONSTRAINT unique_user_puzzle UNIQUE (user_id, puzzle_id);

-- Drop the direct INSERT policy on leaderboard (server-side only now)
DROP POLICY IF EXISTS "Users can insert their own leaderboard entry" ON public.leaderboard;
