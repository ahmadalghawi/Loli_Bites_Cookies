/*
  # Fix Product Schema and Add Categories

  1. Schema Updates
    - Fix column constraints
    - Add categories
    - Update indexes
  2. Security
    - Update RLS policies
*/

-- First ensure all required columns exist
DO $$ 
BEGIN
  -- Add category column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'category'
  ) THEN
    ALTER TABLE products ADD COLUMN category TEXT;
  END IF;
END $$;

-- Update columns with proper constraints
DO $$ 
BEGIN
  -- Set NOT NULL constraints
  ALTER TABLE products ALTER COLUMN name SET NOT NULL;
  ALTER TABLE products ALTER COLUMN price SET NOT NULL;
  ALTER TABLE products ALTER COLUMN "imageUrl" SET NOT NULL;
  ALTER TABLE products ALTER COLUMN status SET NOT NULL;
  ALTER TABLE products ALTER COLUMN "isOnSale" SET NOT NULL;
  ALTER TABLE products ALTER COLUMN "stockLevel" SET NOT NULL;
  
  -- Set default values
  ALTER TABLE products ALTER COLUMN status SET DEFAULT 'active';
  ALTER TABLE products ALTER COLUMN "isOnSale" SET DEFAULT false;
  ALTER TABLE products ALTER COLUMN "stockLevel" SET DEFAULT 0;
  ALTER TABLE products ALTER COLUMN "discountPercentage" SET DEFAULT 0;
END $$;

-- Add proper constraints
ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_price_check,
  DROP CONSTRAINT IF EXISTS products_stock_check,
  DROP CONSTRAINT IF EXISTS products_discount_check,
  DROP CONSTRAINT IF EXISTS products_status_check,
  ADD CONSTRAINT products_price_check CHECK (price >= 0),
  ADD CONSTRAINT products_stock_check CHECK ("stockLevel" >= 0),
  ADD CONSTRAINT products_discount_check CHECK ("discountPercentage" >= 0 AND "discountPercentage" <= 100),
  ADD CONSTRAINT products_status_check CHECK (status IN ('active', 'inactive'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_on_sale ON products("isOnSale");
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Update RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

-- Create new policies
CREATE POLICY "Anyone can read active products"
ON products
FOR SELECT
USING (status = 'active');

CREATE POLICY "Admin can manage products"
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