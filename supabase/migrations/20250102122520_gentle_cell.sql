/*
  # Fix nutritionFacts column
  
  1. Changes
    - Rename nutrition_facts to nutritionFacts
    - Ensure proper JSONB type and constraints
  
  2. Details
    - Maintains consistent naming between frontend and backend
    - Preserves existing data during rename
*/

DO $$ 
BEGIN
  -- Rename nutrition_facts to nutritionFacts if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'nutrition_facts'
  ) THEN
    ALTER TABLE products 
    RENAME COLUMN nutrition_facts TO "nutritionFacts";
  END IF;

  -- Add nutritionFacts if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'nutritionFacts'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN "nutritionFacts" JSONB;
  END IF;

  -- Ensure NOT NULL constraint with default empty object
  ALTER TABLE products 
    ALTER COLUMN "nutritionFacts" SET NOT NULL,
    ALTER COLUMN "nutritionFacts" SET DEFAULT '{}';
END $$;