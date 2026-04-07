
-- Lobbies table for multi-player battles
CREATE TABLE public.lobbies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Battle Lobby',
  max_players integer NOT NULL DEFAULT 10,
  game_mode text NOT NULL DEFAULT 'standard',
  rounds integer NOT NULL DEFAULT 5,
  max_time_seconds integer NOT NULL DEFAULT 300,
  point_system text NOT NULL DEFAULT 'speed',
  allow_penalties boolean NOT NULL DEFAULT true,
  penalty_seconds integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'waiting',
  lobby_puzzles jsonb DEFAULT '[]'::jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Lobby participants
CREATE TABLE public.lobby_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lobby_id uuid NOT NULL REFERENCES public.lobbies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  answers jsonb DEFAULT '[]'::jsonb,
  score jsonb DEFAULT '{"correct": 0, "penalties": 0, "total_time": 0}'::jsonb,
  finished boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(lobby_id, user_id)
);

-- Daily lobby/join tracking
CREATE TABLE public.lobby_daily_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  usage_date date NOT NULL DEFAULT CURRENT_DATE,
  lobbies_created integer NOT NULL DEFAULT 0,
  lobbies_joined integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, usage_date)
);

-- Add realtime_mode to battles table
ALTER TABLE public.battles ADD COLUMN IF NOT EXISTS realtime_mode boolean NOT NULL DEFAULT false;

-- Enable RLS
ALTER TABLE public.lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_daily_usage ENABLE ROW LEVEL SECURITY;

-- Lobbies policies
CREATE POLICY "Anyone can view open lobbies" ON public.lobbies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Pro users can create lobbies" ON public.lobbies FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creator can update lobby" ON public.lobbies FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

-- Lobby participants policies
CREATE POLICY "Anyone can view participants" ON public.lobby_participants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join lobbies" ON public.lobby_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own participation" ON public.lobby_participants FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Daily usage policies
CREATE POLICY "Users can view own usage" ON public.lobby_daily_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON public.lobby_daily_usage FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON public.lobby_daily_usage FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for lobbies
ALTER PUBLICATION supabase_realtime ADD TABLE public.lobbies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lobby_participants;
