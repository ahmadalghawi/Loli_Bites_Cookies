/*
  # Fix Products Table RLS Policies
  
  1. Changes
    - Drop existing policies
    - Create comprehensive RLS policies for products table
    - Enable RLS on products table
  
  2. Security Details
    - Public read access for all products
    - Admin users can perform all operations (CRUD)
    - Service role can perform all operations
*/

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Admin users can manage products" ON products;
DROP POLICY IF EXISTS "Service role can manage products" ON products;

-- Create new policies
CREATE POLICY "Anyone can read products"
ON products
FOR SELECT
USING (true);

CREATE POLICY "Admin users can manage products"
ON products
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.role() = 'service_role'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.role() = 'service_role'
);

-- Add policy for service role
CREATE POLICY "Service role can manage products"
ON products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);