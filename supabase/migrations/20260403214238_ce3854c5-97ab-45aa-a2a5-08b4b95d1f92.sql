
-- Create puzzles table
CREATE TABLE public.puzzles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  puzzle_date DATE NOT NULL UNIQUE,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Puzzles are viewable by everyone"
  ON public.puzzles FOR SELECT USING (true);

-- Create leaderboard table
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  puzzle_id UUID NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
  time_taken INTEGER NOT NULL,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, puzzle_id)
);

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard entries are viewable by everyone"
  ON public.leaderboard FOR SELECT USING (true);

CREATE POLICY "Users can insert their own leaderboard entry"
  ON public.leaderboard FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed some daily puzzles
INSERT INTO public.puzzles (question, answer, puzzle_date, difficulty) VALUES
  ('If you have 3 boxes, and each box contains 2 smaller boxes, and each smaller box contains 4 marbles, how many marbles do you have in total?', '24', CURRENT_DATE, 'medium'),
  ('A farmer has 17 sheep. All but 9 die. How many sheep are left?', '9', CURRENT_DATE + INTERVAL '1 day', 'easy'),
  ('What is the next number in the sequence: 2, 6, 18, 54, ...?', '162', CURRENT_DATE + INTERVAL '2 days', 'medium'),
  ('If it takes 5 machines 5 minutes to make 5 widgets, how many minutes would it take 100 machines to make 100 widgets?', '5', CURRENT_DATE + INTERVAL '3 days', 'hard'),
  ('A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost in cents?', '5', CURRENT_DATE + INTERVAL '4 days', 'hard'),
  ('How many times can you subtract 5 from 25?', '1', CURRENT_DATE + INTERVAL '5 days', 'easy'),
  ('If two''s company and three''s a crowd, what are four and five?', '9', CURRENT_DATE + INTERVAL '6 days', 'medium');
