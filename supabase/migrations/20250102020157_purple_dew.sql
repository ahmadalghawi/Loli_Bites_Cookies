/*
  # Add product management columns

  1. New Columns
    - category (text) - Product category
    - stock_level (integer) - Current stock quantity
    - status (text) - Product status (active/inactive)
    - image_bucket_id (text) - Reference to uploaded image in storage

  2. Indexes
    - Added indexes for category and status for better query performance
*/

DO $$ 
BEGIN
  -- Add category column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'category'
  ) THEN
    ALTER TABLE products ADD COLUMN category TEXT;
  END IF;

  -- Add stock_level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'stock_level'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_level INTEGER DEFAULT 0;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'status'
  ) THEN
    ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
  END IF;

  -- Add image_bucket_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'image_bucket_id'
  ) THEN
    ALTER TABLE products ADD COLUMN image_bucket_id TEXT;
  END IF;

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
END $$;