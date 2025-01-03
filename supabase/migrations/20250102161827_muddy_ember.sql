/*
  # Fix Product Table Policies

  1. Changes
    - Simplify RLS policies
    - Allow public read access
    - Allow admin users full access
    - Remove unnecessary policies
    - Add proper constraints

  2. Security
    - Enable RLS
    - Ensure proper role checking
    - Protect write operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Admin write access" ON products;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "Anyone can read products"
ON products
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage products"
ON products
FOR ALL
TO authenticated
USING (
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