/*
  # Fix Products Table Schema and RLS

  1. Changes
    - Ensure all column names match frontend expectations
    - Add missing columns
    - Set proper constraints and defaults
    - Update RLS policies

  2. Schema Updates
    - Rename snake_case columns to camelCase
    - Add missing columns: ingredients, nutritionFacts
    - Set proper constraints and defaults
*/

-- Fix column names and add missing columns
DO $$ 
BEGIN
  -- Add ingredients column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'ingredients'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN ingredients JSONB DEFAULT '[]';
  END IF;

  -- Ensure all required columns exist with proper types
  ALTER TABLE products
    ALTER COLUMN price SET DEFAULT 0,
    ALTER COLUMN "stockLevel" SET DEFAULT 0,
    ALTER COLUMN "discountPercentage" SET DEFAULT 0,
    ALTER COLUMN "isOnSale" SET DEFAULT false,
    ALTER COLUMN ingredients SET DEFAULT '[]',
    ALTER COLUMN "nutritionFacts" SET DEFAULT '{}';

  -- Add constraints
  ALTER TABLE products
    ADD CONSTRAINT price_positive CHECK (price >= 0),
    ADD CONSTRAINT stock_positive CHECK ("stockLevel" >= 0),
    ADD CONSTRAINT discount_range CHECK ("discountPercentage" >= 0 AND "discountPercentage" <= 100);
END $$;

-- Update RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Admin users can manage products" ON products;
DROP POLICY IF EXISTS "Service role can manage products" ON products;

-- Create comprehensive policies
CREATE POLICY "Public read access"
ON products
FOR SELECT
USING (true);

CREATE POLICY "Admin full access"
ON products
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.role() = 'service_role'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR
  auth.role() = 'service_role'
);

CREATE POLICY "Service role full access"
ON products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);