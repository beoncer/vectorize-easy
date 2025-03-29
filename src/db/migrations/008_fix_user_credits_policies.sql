-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can insert their own credits" ON user_credits;

-- Recreate policies with correct user_id comparison
CREATE POLICY "Users can view their own credits"
ON user_credits FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own credits"
ON user_credits FOR UPDATE
USING (user_id = auth.uid()::text)
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own credits"
ON user_credits FOR INSERT
WITH CHECK (user_id = auth.uid()::text); 