-- First drop all existing policies
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;
DROP POLICY IF EXISTS "Service role has full access" ON products;
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Admin full access" ON products;
DROP POLICY IF EXISTS "Service role full access" ON products;
DROP POLICY IF EXISTS "Admin users can manage products" ON products;
DROP POLICY IF EXISTS "Service role can manage products" ON products;
DROP POLICY IF EXISTS "Public read access for products" ON products;
DROP POLICY IF EXISTS "Admin management for products" ON products;

-- Drop existing constraints
ALTER TABLE products
  DROP CONSTRAINT IF EXISTS price_positive,
  DROP CONSTRAINT IF EXISTS stock_positive,
  DROP CONSTRAINT IF EXISTS discount_range;

-- Update table schema
ALTER TABLE products
  ALTER COLUMN price SET DEFAULT 0,
  ALTER COLUMN "stockLevel" SET DEFAULT 0,
  ALTER COLUMN "discountPercentage" SET DEFAULT 0,
  ALTER COLUMN "isOnSale" SET DEFAULT false,
  ALTER COLUMN status SET DEFAULT 'active';

-- Add constraints
ALTER TABLE products
  ADD CONSTRAINT price_positive CHECK (price >= 0),
  ADD CONSTRAINT stock_positive CHECK ("stockLevel" >= 0),
  ADD CONSTRAINT discount_range CHECK ("discountPercentage" >= 0 AND "discountPercentage" <= 100),
  ADD CONSTRAINT status_values CHECK (status IN ('active', 'inactive'));

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "Public read access for products"
ON products
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin full access for products"
ON products
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);