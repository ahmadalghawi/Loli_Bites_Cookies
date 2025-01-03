/*
  # Fix Product Management Policies

  1. Changes
    - Simplify RLS policies for products table
    - Add proper role checking for admin operations
    - Remove unnecessary policies
    
  2. Security
    - Public read access for all products
    - Admin-only write access (create, update, delete)
    - Role checking through users table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Admin write access" ON products;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "Public read access"
ON products
FOR SELECT
TO public
USING (true);

-- Admin policy with proper role checking
CREATE POLICY "Admin write access"
ON products
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);