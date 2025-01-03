-- Drop all existing policies
DROP POLICY IF EXISTS "Public read access for products" ON products;
DROP POLICY IF EXISTS "Admin full access for products" ON products;

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
    -- Check both authentication and admin role
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
)
WITH CHECK (
    -- Double check for write operations
    auth.role() = 'authenticated' AND 
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);