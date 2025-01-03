-- Remove ingredients and nutritionFacts columns
DO $$ 
BEGIN
  -- Remove ingredients column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'ingredients'
  ) THEN
    ALTER TABLE products DROP COLUMN ingredients;
  END IF;

  -- Remove nutritionFacts column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'nutritionFacts'
  ) THEN
    ALTER TABLE products DROP COLUMN "nutritionFacts";
  END IF;

  -- Ensure all required columns exist with proper types
  ALTER TABLE products
    ALTER COLUMN price SET DEFAULT 0,
    ALTER COLUMN "stockLevel" SET DEFAULT 0,
    ALTER COLUMN "discountPercentage" SET DEFAULT 0,
    ALTER COLUMN "isOnSale" SET DEFAULT false;

  -- Add or update constraints
  ALTER TABLE products
    DROP CONSTRAINT IF EXISTS price_positive,
    DROP CONSTRAINT IF EXISTS stock_positive,
    DROP CONSTRAINT IF EXISTS discount_range,
    ADD CONSTRAINT price_positive CHECK (price >= 0),
    ADD CONSTRAINT stock_positive CHECK ("stockLevel" >= 0),
    ADD CONSTRAINT discount_range CHECK ("discountPercentage" >= 0 AND "discountPercentage" <= 100);
END $$;