-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Admin full access" ON products;
DROP POLICY IF EXISTS "Service role full access" ON products;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Anyone can read products"
ON products
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin can manage products"
ON products
FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
);

-- Allow service role full access
CREATE POLICY "Service role has full access"
ON products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Ensure indexes exist for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);