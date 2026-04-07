
-- puzzles_public MUST be security definer because puzzles table has USING(false)
-- This is the correct pattern: the view hides the answer column
DROP VIEW IF EXISTS puzzles_public;
CREATE VIEW puzzles_public WITH (security_invoker = false) AS
  SELECT id, question, puzzle_date, difficulty, task_number, created_at FROM puzzles;
GRANT SELECT ON puzzles_public TO anon, authenticated;
