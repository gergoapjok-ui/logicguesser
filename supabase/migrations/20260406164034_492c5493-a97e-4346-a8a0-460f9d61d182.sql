
DROP VIEW IF EXISTS public.puzzles_public;
CREATE VIEW public.puzzles_public AS
  SELECT id, question, puzzle_date, difficulty, task_number, created_at FROM public.puzzles;
GRANT SELECT ON public.puzzles_public TO anon, authenticated;
