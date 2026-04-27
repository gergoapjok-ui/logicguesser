-- Guest accounts table
CREATE TABLE public.guest_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  display_name_lower text GENERATED ALWAYS AS (lower(display_name)) STORED UNIQUE,
  claim_code_hash text NOT NULL,
  xp integer NOT NULL DEFAULT 0,
  credits integer NOT NULL DEFAULT 0,
  current_streak integer NOT NULL DEFAULT 0,
  last_completed_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view guests by name"
  ON public.guest_accounts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create guests"
  ON public.guest_accounts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update guests"
  ON public.guest_accounts FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can delete guests"
  ON public.guest_accounts FOR DELETE
  USING (auth.role() = 'service_role');

-- Guest leaderboard entries
CREATE TABLE public.guest_leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES public.guest_accounts(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  puzzle_id uuid NOT NULL,
  time_taken integer NOT NULL,
  completed_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_leaderboard_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guest leaderboard viewable by all"
  ON public.guest_leaderboard_entries FOR SELECT
  USING (true);

CREATE POLICY "Service role inserts guest leaderboard"
  ON public.guest_leaderboard_entries FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Claim function: merges guest stats into the calling user's profile
CREATE OR REPLACE FUNCTION public.claim_guest_account(_name text, _code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  guest record;
  uid uuid := auth.uid();
  expected_hash text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Must be logged in to claim guest account';
  END IF;

  SELECT * INTO guest FROM public.guest_accounts
  WHERE display_name_lower = lower(_name) LIMIT 1;

  IF guest.id IS NULL THEN
    RAISE EXCEPTION 'No guest account found for that name';
  END IF;

  expected_hash := encode(digest(_code, 'sha256'), 'hex');
  IF guest.claim_code_hash <> expected_hash THEN
    RAISE EXCEPTION 'Invalid claim code';
  END IF;

  UPDATE public.profiles
  SET
    xp = GREATEST(xp, 0) + COALESCE(guest.xp, 0),
    credits = GREATEST(credits, 0) + COALESCE(guest.credits, 0),
    current_streak = GREATEST(current_streak, COALESCE(guest.current_streak, 0)),
    last_completed_date = GREATEST(last_completed_date, guest.last_completed_date),
    updated_at = now()
  WHERE user_id = uid;

  DELETE FROM public.guest_accounts WHERE id = guest.id;

  RETURN jsonb_build_object(
    'merged_xp', guest.xp,
    'merged_credits', guest.credits,
    'merged_streak', guest.current_streak
  );
END;
$$;

-- Make sure pgcrypto is available for digest()
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;