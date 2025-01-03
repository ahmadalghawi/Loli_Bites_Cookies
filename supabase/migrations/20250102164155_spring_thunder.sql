-- First drop ALL existing policies
DO $$ 
BEGIN
  -- Drop all policies on products table
  DROP POLICY IF EXISTS "products_read_policy" ON products;
  DROP POLICY IF EXISTS "products_write_policy" ON products;
END $$;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new public access policies
CREATE POLICY "public_read_policy"
ON products
FOR SELECT
USING (true);

CREATE POLICY "public_insert_policy"
ON products
FOR INSERT
WITH CHECK (true);

CREATE POLICY "public_update_policy"
ON products
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "public_delete_policy"
ON products
FOR DELETE
USING (true);

-- Ensure proper constraints remain
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