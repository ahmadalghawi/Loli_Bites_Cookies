/*
  # Fix Product Policies

  1. Changes
    - Drop all existing policies
    - Create new simplified policies
    - Add proper constraints
    - Ensure proper role checking

  2. Security
    - Enable RLS
    - Public read access
    - Admin-only write access
    - Role-based authorization
*/

-- First drop ALL existing policies
DO $$ 
BEGIN
  -- Drop all policies on products table
  DROP POLICY IF EXISTS "Anyone can read products" ON products;
  DROP POLICY IF EXISTS "Admins can manage products" ON products;
  DROP POLICY IF EXISTS "Public read access" ON products;
  DROP POLICY IF EXISTS "Admin write access" ON products;
  DROP POLICY IF EXISTS "Admin can manage products" ON products;
  DROP POLICY IF EXISTS "Service role has full access" ON products;
END $$;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "products_read_policy"
ON products
FOR SELECT
USING (true);

CREATE POLICY "products_write_policy"
ON products
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Ensure proper constraints
ALTER TABLE products
  DROP CONSTRAINT IF EXISTS price_positive,
  DROP CONSTRAINT IF EXISTS stock_positive,
  DROP CONSTRAINT IF EXISTS discount_range,
  DROP CONSTRAINT IF EXISTS status_values;

ALTER TABLE products
  ADD CONSTRAINT price_positive CHECK (price >= 0),
  ADD CONSTRAINT stock_positive CHECK ("stockLevel" >= 0),
  ADD CONSTRAINT discount_range CHECK ("discountPercentage" >= 0 AND "discountPercentage" <= 100),
  ADD CONSTRAINT status_values CHECK (status IN ('active', 'inactive'));