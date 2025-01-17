-- Update existing bucket configuration instead of recreating
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 52428800, -- 50MB in bytes
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id = 'product-images';

-- Insert bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 
  'product-images',
  'product-images',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'product-images'
);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin management access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own images" ON storage.objects;

-- Create new policies
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');