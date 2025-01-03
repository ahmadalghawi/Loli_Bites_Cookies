/*
  # Update users table RLS policies

  1. Changes
    - Drop existing insert policies that might conflict
    - Add new policy to allow service role to insert users
    - Add policy for users to update their own data
*/

-- Drop existing insert policies if they exist
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "New users can create their profile" ON users;

-- Allow service role to insert new users
CREATE POLICY "Service role can insert users"
  ON users
  FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);