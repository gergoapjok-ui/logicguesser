
-- 1. Fix profiles UPDATE policy to lock is_pro and daily_retries_used
DROP POLICY "Users can update own safe fields" ON profiles;
CREATE POLICY "Users can update own safe fields" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND credits = (SELECT p.credits FROM profiles p WHERE p.user_id = auth.uid())
    AND xp = (SELECT p.xp FROM profiles p WHERE p.user_id = auth.uid())
    AND current_streak = (SELECT p.current_streak FROM profiles p WHERE p.user_id = auth.uid())
    AND NOT (last_completed_date IS DISTINCT FROM (SELECT p.last_completed_date FROM profiles p WHERE p.user_id = auth.uid()))
    AND is_pro = (SELECT p.is_pro FROM profiles p WHERE p.user_id = auth.uid())
    AND daily_retries_used = (SELECT p.daily_retries_used FROM profiles p WHERE p.user_id = auth.uid())
  );

-- 2. Fix notifications INSERT policy - only allow inserting notifications for yourself (edge functions use service role to bypass)
DROP POLICY "System can insert notifications" ON notifications;
CREATE POLICY "Service role can insert notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Fix security definer views - recreate with SECURITY INVOKER
DROP VIEW IF EXISTS puzzles_public;
CREATE VIEW puzzles_public WITH (security_invoker = true) AS
  SELECT id, question, puzzle_date, difficulty, task_number, created_at FROM puzzles;

DROP VIEW IF EXISTS profiles_public;
CREATE VIEW profiles_public WITH (security_invoker = true) AS
  SELECT user_id, username, avatar_url, xp, current_streak, is_pro FROM profiles;

-- Grant access on the new views
GRANT SELECT ON puzzles_public TO anon, authenticated;
GRANT SELECT ON profiles_public TO anon, authenticated;
