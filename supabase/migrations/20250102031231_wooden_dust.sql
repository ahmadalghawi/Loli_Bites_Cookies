/*
  # Set up Storage Bucket for Product Images

  1. Changes
    - Creates a public storage bucket for product images
    - Sets up RLS policies for image uploads and access
  
  2. Security
    - Enables public read access to product images
    - Restricts upload permissions to authenticated users
    - Restricts delete permissions to admin users
*/

-- Create storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() IN ('authenticated', 'service_role')
);

-- Allow public access to product images
CREATE POLICY "Public read access to product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow admin users to delete images
CREATE POLICY "Admin users can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.role() = 'service_role'
  )
);