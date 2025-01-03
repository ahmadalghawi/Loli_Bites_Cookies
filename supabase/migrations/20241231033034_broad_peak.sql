/*
  # Add INSERT policy for users table

  1. Changes
    - Add policy to allow inserting new user records during signup
    - Policy ensures users can only insert their own data by matching auth.uid()
*/

-- Allow users to insert their own data
CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow new signups to create their profile
CREATE POLICY "New users can create their profile"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);