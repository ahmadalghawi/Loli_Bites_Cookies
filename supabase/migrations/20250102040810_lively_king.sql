-- Rename discountPercentage to discount_percentage if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'discountpercentage'
  ) THEN
    ALTER TABLE products 
    RENAME COLUMN discountpercentage TO discount_percentage;
  END IF;

  -- Add discount_percentage column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'discount_percentage'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
  END IF;
END $$;