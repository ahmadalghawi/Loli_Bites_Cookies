/*
  # Add product management policies
  
  1. Changes
    - Add policies for admin users to manage products
    - Allow admins to insert, update, and delete products
    - Maintain existing public read access
  
  2. Security
    - Only admin users can modify products
    - Public read access is maintained
    - Policies are role-based using auth.jwt() -> role
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Admin users can manage products" ON products;

-- Create read policy for public access
CREATE POLICY "Anyone can read products"
ON products
FOR SELECT
USING (true);

-- Create admin management policy
CREATE POLICY "Admin users can manage products"
ON products
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');