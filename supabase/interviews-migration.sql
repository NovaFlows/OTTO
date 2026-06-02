-- Table interviews
CREATE TABLE IF NOT EXISTS interviews (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          text NOT NULL,
  source         text NOT NULL DEFAULT 'youtube' CHECK (source IN ('youtube','tiktok','instagram','autre')),
  video_url      text NOT NULL,
  thumbnail_url  text,
  description    text,
  published_at   date NOT NULL DEFAULT CURRENT_DATE,
  published      boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Interviews publiques lisibles" ON interviews
  FOR SELECT USING (published = true);

CREATE POLICY "Admin full access interviews" ON interviews
  FOR ALL USING (auth.role() = 'service_role');

-- Bucket "interviews" pour les miniatures
-- À créer manuellement dans Supabase Dashboard > Storage > New bucket
-- Nom : interviews  |  Public : oui
-- Puis ajouter cette policy :
-- Allow public read: (bucket_id = 'interviews')
-- Allow authenticated upload: (bucket_id = 'interviews' AND auth.role() = 'service_role')
