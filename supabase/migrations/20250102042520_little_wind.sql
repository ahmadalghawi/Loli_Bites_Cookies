-- Fix column names and types
DO $$ 
BEGIN
  -- Rename columns to use snake_case in database
  ALTER TABLE products 
    RENAME COLUMN "imageUrl" TO image_url;

  ALTER TABLE products 
    RENAME COLUMN "stockLevel" TO stock_level;

  -- Ensure proper column types and constraints
  ALTER TABLE products
    ALTER COLUMN price TYPE decimal(10,2),
    ALTER COLUMN price SET DEFAULT 0,
    ALTER COLUMN stock_level SET DEFAULT 0,
    ALTER COLUMN discount_percentage SET DEFAULT 0;

  -- Add constraints if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'price_positive'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'stock_level_positive'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT stock_level_positive CHECK (stock_level >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'discount_percentage_range'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT discount_percentage_range 
      CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
  END IF;
END $$;