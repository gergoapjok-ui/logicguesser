
-- Recreate the view with security_invoker = false so it bypasses puzzles RLS
DROP VIEW IF EXISTS public.puzzles_public;
CREATE VIEW public.puzzles_public
WITH (security_invoker = false)
AS
SELECT id, question, puzzle_date, difficulty, task_number, created_at
FROM public.puzzles;

-- Grant access
GRANT SELECT ON public.puzzles_public TO anon, authenticated;
