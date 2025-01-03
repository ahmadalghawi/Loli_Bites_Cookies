-- Drop existing bucket if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'product-images'
    ) THEN
        DELETE FROM storage.buckets WHERE id = 'product-images';
    END IF;
END $$;

-- Create storage bucket with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can update product images" ON storage.objects;

-- Create comprehensive policies
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images'
    AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

CREATE POLICY "Public read access to product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

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

CREATE POLICY "Admin users can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND (
        auth.jwt() ->> 'role' = 'admin'
        OR auth.role() = 'service_role'
    )
)
WITH CHECK (
    bucket_id = 'product-images'
    AND (
        auth.jwt() ->> 'role' = 'admin'
        OR auth.role() = 'service_role'
    )
);