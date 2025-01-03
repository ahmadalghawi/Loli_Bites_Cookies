-- Update products table schema
DO $$ 
BEGIN
  -- Rename columns to match frontend naming
  ALTER TABLE products 
    RENAME COLUMN image_url TO "imageUrl";

  -- Ensure all required columns exist with proper types
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'stockLevel'
  ) THEN
    ALTER TABLE products ADD COLUMN "stockLevel" INTEGER DEFAULT 0;
  END IF;

  -- Add proper constraints
  ALTER TABLE products 
    ALTER COLUMN price SET DEFAULT 0,
    ALTER COLUMN "stockLevel" SET DEFAULT 0,
    ALTER COLUMN discount_percentage SET DEFAULT 0,
    ADD CONSTRAINT price_positive CHECK (price >= 0),
    ADD CONSTRAINT stock_level_positive CHECK ("stockLevel" >= 0),
    ADD CONSTRAINT discount_percentage_range CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
END $$;