/*
  # Add missing product columns

  1. Changes
    - Add discount_percentage column to products table
    - Add default values and constraints
*/

DO $$ 
BEGIN
  -- Add discount_percentage column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'discount_percentage'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
  END IF;
END $$;