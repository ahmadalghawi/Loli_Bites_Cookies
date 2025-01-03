/*
  # Fix image URL column name
  
  1. Changes
    - Rename image_url to imageUrl to match frontend naming
    - Ensure column exists with proper constraints
  
  2. Details
    - Maintains consistent naming between frontend and backend
    - Preserves existing data during rename
*/

DO $$ 
BEGIN
  -- Rename image_url to imageUrl if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE products 
    RENAME COLUMN image_url TO "imageUrl";
  END IF;

  -- Add imageUrl if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'imageUrl'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN "imageUrl" TEXT;
  END IF;

  -- Add NOT NULL constraint if not present
  ALTER TABLE products 
    ALTER COLUMN "imageUrl" SET NOT NULL;
END $$;