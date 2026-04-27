-- Daily AI-generated tech news posts (one per date)
CREATE TABLE public.tech_news_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_date DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tech_news_posts ENABLE ROW LEVEL SECURITY;

-- Anyone (including guests) can read tech news
CREATE POLICY "Tech news viewable by everyone"
ON public.tech_news_posts
FOR SELECT
USING (true);

-- Only service role can write (edge function uses service role)
CREATE POLICY "Service role can insert tech news"
ON public.tech_news_posts
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE INDEX idx_tech_news_post_date ON public.tech_news_posts(post_date DESC);