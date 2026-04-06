
-- 1. Add task_number to puzzles
ALTER TABLE public.puzzles ADD COLUMN task_number integer NOT NULL DEFAULT 1;
ALTER TABLE public.puzzles ADD CONSTRAINT puzzles_date_task_unique UNIQUE (puzzle_date, task_number);

-- Update puzzles_public view to include task_number
DROP VIEW IF EXISTS public.puzzles_public;
CREATE VIEW public.puzzles_public AS
  SELECT id, question, puzzle_date, difficulty, task_number, created_at FROM public.puzzles;
GRANT SELECT ON public.puzzles_public TO anon, authenticated;

-- 2. Challenge progress tracking
CREATE TABLE public.challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  puzzle_date date NOT NULL DEFAULT CURRENT_DATE,
  task_number integer NOT NULL,
  puzzle_id uuid NOT NULL REFERENCES public.puzzles(id),
  penalties integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, puzzle_date, task_number)
);
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.challenge_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 3. Update leaderboard: change unique constraint from puzzle to date
ALTER TABLE public.leaderboard DROP CONSTRAINT IF EXISTS leaderboard_user_puzzle_unique;
ALTER TABLE public.leaderboard ADD CONSTRAINT leaderboard_user_date_unique UNIQUE (user_id, completed_date);

-- 4. Friendships
CREATE TYPE public.friend_status AS ENUM ('pending', 'accepted', 'rejected', 'blocked');

CREATE TABLE public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  addressee_id uuid NOT NULL,
  status public.friend_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own friendships" ON public.friendships
  FOR SELECT TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can send friend requests" ON public.friendships
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id AND requester_id != addressee_id);
CREATE POLICY "Addressee can update friendship" ON public.friendships
  FOR UPDATE TO authenticated
  USING (auth.uid() = addressee_id)
  WITH CHECK (auth.uid() = addressee_id);

-- 5. Messages with realtime
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  message_type text NOT NULL DEFAULT 'text',
  battle_invite_id uuid,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receiver can mark read" ON public.messages
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;

-- 6. Battles
CREATE TABLE public.battles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL,
  opponent_id uuid,
  status text NOT NULL DEFAULT 'pending',
  game_mode text NOT NULL DEFAULT 'standard',
  max_time_seconds integer NOT NULL DEFAULT 300,
  rounds integer NOT NULL DEFAULT 5,
  point_system text NOT NULL DEFAULT 'speed',
  allow_penalties boolean NOT NULL DEFAULT true,
  penalty_seconds integer NOT NULL DEFAULT 5,
  custom_settings jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz,
  winner_id uuid,
  creator_score jsonb,
  opponent_score jsonb
);
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own battles" ON public.battles
  FOR SELECT TO authenticated
  USING (auth.uid() = creator_id OR auth.uid() = opponent_id);
CREATE POLICY "Users can create battles" ON public.battles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Participants can update battles" ON public.battles
  FOR UPDATE TO authenticated
  USING (auth.uid() = creator_id OR auth.uid() = opponent_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.battles;
