
-- 1. Restrict puzzles base table: deny direct SELECT, force use of puzzles_public view
DROP POLICY IF EXISTS "Puzzles are viewable by everyone" ON public.puzzles;
CREATE POLICY "No direct access to puzzles" ON public.puzzles FOR SELECT USING (false);

-- 2. Restrict profiles UPDATE to safe columns only using a security definer function
CREATE OR REPLACE FUNCTION public.update_profile_safe(
  _username text DEFAULT NULL,
  _bio text DEFAULT NULL,
  _avatar_url text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET
    username = COALESCE(_username, username),
    bio = COALESCE(_bio, bio),
    avatar_url = COALESCE(_avatar_url, avatar_url),
    updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;

-- 3. Replace the permissive UPDATE policy with one that blocks credits/xp changes
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- New restrictive policy: users can only update safe columns (credits/xp unchanged)
CREATE POLICY "Users can update own safe fields" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND credits = (SELECT p.credits FROM public.profiles p WHERE p.user_id = auth.uid())
    AND xp = (SELECT p.xp FROM public.profiles p WHERE p.user_id = auth.uid())
    AND current_streak = (SELECT p.current_streak FROM public.profiles p WHERE p.user_id = auth.uid())
    AND last_completed_date IS NOT DISTINCT FROM (SELECT p.last_completed_date FROM public.profiles p WHERE p.user_id = auth.uid())
  );
