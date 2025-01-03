/*
  # Fix Storage Policies

  1. Updates
    - Drop existing storage policies
    - Create new comprehensive storage policies for product images
    - Add proper RLS policies for authenticated users
  
  2. Security
    - Enable RLS on storage.objects
    - Add policies for authenticated users
    - Add policies for admin users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can update product images" ON storage.objects;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Anyone can read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'authenticated')
);

CREATE POLICY "Admin users can manage product images"
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