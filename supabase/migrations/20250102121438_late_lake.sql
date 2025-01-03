/*
  # Fix product table column names
  
  1. Changes
    - Rename discount_percentage to match frontend naming
    - Add missing columns if they don't exist
  
  2. Details
    - Ensures consistent naming between frontend and backend
    - Maintains data integrity during column rename
*/

DO $$ 
BEGIN
  -- Rename discount_percentage to discountPercentage if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'discount_percentage'
  ) THEN
    ALTER TABLE products 
    RENAME COLUMN discount_percentage TO "discountPercentage";
  END IF;

  -- Add discountPercentage if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'discountPercentage'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN "discountPercentage" INTEGER DEFAULT 0 
    CHECK ("discountPercentage" >= 0 AND "discountPercentage" <= 100);
  END IF;

  -- Ensure other column names match frontend
  ALTER TABLE products 
    RENAME COLUMN stock_level TO "stockLevel";

  -- Add constraints
  ALTER TABLE products 
    ALTER COLUMN "discountPercentage" SET DEFAULT 0,
    ALTER COLUMN "stockLevel" SET DEFAULT 0;
END $$;