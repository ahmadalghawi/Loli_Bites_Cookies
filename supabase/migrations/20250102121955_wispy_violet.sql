/*
  # Fix isOnSale column
  
  1. Changes
    - Add isOnSale column with proper type and default
    - Ensure column exists with proper constraints
  
  2. Details
    - Maintains consistent naming between frontend and backend
    - Sets appropriate default value and constraints
*/

DO $$ 
BEGIN
  -- Add isOnSale if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'isOnSale'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN "isOnSale" BOOLEAN DEFAULT false;
  END IF;

  -- Rename is_on_sale to isOnSale if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'is_on_sale'
  ) THEN
    ALTER TABLE products 
    RENAME COLUMN is_on_sale TO "isOnSale";
  END IF;

  -- Ensure NOT NULL constraint
  ALTER TABLE products 
    ALTER COLUMN "isOnSale" SET NOT NULL,
    ALTER COLUMN "isOnSale" SET DEFAULT false;
END $$;