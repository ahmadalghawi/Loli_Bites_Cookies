/*
  # Update user role to admin
  
  This migration updates a specific user's role to 'admin'
*/

-- Update the user role to admin (replace the email with your admin user's email)
UPDATE users 
SET role = 'admin'
WHERE email = 'admin@example.com';  -- Replace with your admin email

-- Ensure the RLS policy allows the service role to update users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Add policy for service role to manage users
CREATE POLICY "Service role can manage users"
ON users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);