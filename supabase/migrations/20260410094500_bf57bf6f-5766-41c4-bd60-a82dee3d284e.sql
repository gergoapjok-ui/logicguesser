
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles: only service role can manage
CREATE POLICY "Service role manages roles"
ON public.user_roles FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Puzzle submissions table (reviewed by admin)
CREATE TABLE public.puzzle_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  category text NOT NULL DEFAULT 'logic',
  submitted_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewer_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
ALTER TABLE public.puzzle_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
ON public.puzzle_submissions FOR SELECT
TO authenticated
USING (auth.uid() = submitted_by);

CREATE POLICY "Users can create submissions"
ON public.puzzle_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Admins can view all submissions"
ON public.puzzle_submissions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions"
ON public.puzzle_submissions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Community puzzles table (auto-accepted)
CREATE TABLE public.community_puzzles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  category text NOT NULL DEFAULT 'logic',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  plays integer NOT NULL DEFAULT 0,
  likes integer NOT NULL DEFAULT 0
);
ALTER TABLE public.community_puzzles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community puzzles"
ON public.community_puzzles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create community puzzles"
ON public.community_puzzles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can delete community puzzles"
ON public.community_puzzles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
