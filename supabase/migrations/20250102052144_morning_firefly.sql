/*
  # Fix Storage Policies for Product Images

  1. Changes
    - Drop existing policies
    - Create new storage bucket with proper configuration
    - Add comprehensive RLS policies
  
  2. Security
    - Enable RLS
    - Add specific policies for admin users
    - Allow public read access
*/

-- Recreate storage bucket with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can manage product images" ON storage.objects;

-- Create new policies
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload access for product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admin management access for product images"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'product-images'
  AND auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.jwt() ->> 'role' = 'admin'
);