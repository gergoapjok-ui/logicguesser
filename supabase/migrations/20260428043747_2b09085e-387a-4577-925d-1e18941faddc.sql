
ALTER TABLE public.tech_news_posts
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_alt TEXT,
  ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.tech_news_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.tech_news_posts(id) ON DELETE CASCADE,
  user_id UUID,
  client_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS tech_news_likes_user_unique
  ON public.tech_news_likes (post_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS tech_news_likes_fp_unique
  ON public.tech_news_likes (post_id, client_fingerprint) WHERE user_id IS NULL AND client_fingerprint IS NOT NULL;

ALTER TABLE public.tech_news_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON public.tech_news_likes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can like (auth or anon)"
  ON public.tech_news_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can unlike own"
  ON public.tech_news_likes FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.tech_news_likes_count_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tech_news_posts SET likes = likes + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tech_news_posts SET likes = GREATEST(likes - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS tech_news_likes_count ON public.tech_news_likes;
CREATE TRIGGER tech_news_likes_count
AFTER INSERT OR DELETE ON public.tech_news_likes
FOR EACH ROW EXECUTE FUNCTION public.tech_news_likes_count_trigger();
