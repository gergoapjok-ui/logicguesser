
ALTER TABLE public.battles ADD COLUMN IF NOT EXISTS battle_puzzles jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.battles ADD COLUMN IF NOT EXISTS current_round integer DEFAULT 1;
ALTER TABLE public.battles ADD COLUMN IF NOT EXISTS creator_answers jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.battles ADD COLUMN IF NOT EXISTS opponent_answers jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.battles ADD COLUMN IF NOT EXISTS creator_time integer DEFAULT 0;
ALTER TABLE public.battles ADD COLUMN IF NOT EXISTS opponent_time integer DEFAULT 0;
