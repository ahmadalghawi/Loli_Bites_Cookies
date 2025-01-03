-- First ensure created_by column exists
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Anyone can add products" ON products;
DROP POLICY IF EXISTS "Users can update own products" ON products;
DROP POLICY IF EXISTS "Users can delete own products" ON products;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Anyone can read products"
ON products
FOR SELECT
TO public
USING (true);

-- Allow anyone to insert products
CREATE POLICY "Anyone can add products"
ON products
FOR INSERT
TO public
WITH CHECK (true);

-- Allow users to update their own products
CREATE POLICY "Users can update own products"
ON products
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by::uuid)
WITH CHECK (auth.uid() = created_by::uuid);

-- Allow users to delete their own products
CREATE POLICY "Users can delete own products"
ON products
FOR DELETE
TO authenticated
USING (auth.uid() = created_by::uuid);