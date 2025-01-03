-- Drop all existing policies
DROP POLICY IF EXISTS "Public read access for products" ON products;
DROP POLICY IF EXISTS "Admin full access for products" ON products;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "Public read access for products"
ON products
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin full access for products"
ON products
FOR ALL
TO authenticated
USING (
  -- Check JWT claim for admin role
  auth.role() = 'authenticated' AND 
  auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
  -- Double check for write operations
  auth.role() = 'authenticated' AND 
  auth.jwt() ->> 'role' = 'admin'
);