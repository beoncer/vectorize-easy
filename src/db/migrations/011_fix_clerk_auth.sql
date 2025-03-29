-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can insert their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own credit logs" ON credit_logs;
DROP POLICY IF EXISTS "Users can insert their own credit logs" ON credit_logs;
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view their own analytics" ON analytics;
DROP POLICY IF EXISTS "Users can insert their own analytics" ON analytics;
DROP POLICY IF EXISTS "Users can view their own customer details" ON customer_details;
DROP POLICY IF EXISTS "Users can insert their own customer details" ON customer_details;
DROP POLICY IF EXISTS "Users can update their own customer details" ON customer_details;

-- Create a function to get the current user ID from the request
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN current_setting('request.jwt.claims', true)::json->>'sub';
END;
$$;

-- Recreate policies using the new function
CREATE POLICY "Users can view their own credits"
ON user_credits FOR SELECT
USING (user_id = get_current_user_id());

CREATE POLICY "Users can update their own credits"
ON user_credits FOR UPDATE
USING (user_id = get_current_user_id())
WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can insert their own credits"
ON user_credits FOR INSERT
WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT
USING (user_id = get_current_user_id());

CREATE POLICY "Users can insert their own profile"
ON user_profiles FOR INSERT
WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
USING (user_id = get_current_user_id())
WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can view their own credit logs"
ON credit_logs FOR SELECT
USING (user_id = get_current_user_id());

CREATE POLICY "Users can insert their own credit logs"
ON credit_logs FOR INSERT
WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can view their own transactions"
ON transactions FOR SELECT
USING (user_id = get_current_user_id());

CREATE POLICY "Users can insert their own transactions"
ON transactions FOR INSERT
WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can view their own analytics"
ON analytics FOR SELECT
USING (user_id = get_current_user_id());

CREATE POLICY "Users can insert their own analytics"
ON analytics FOR INSERT
WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can view their own customer details"
ON customer_details FOR SELECT
USING (user_id = get_current_user_id());

CREATE POLICY "Users can insert their own customer details"
ON customer_details FOR INSERT
WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can update their own customer details"
ON customer_details FOR UPDATE
USING (user_id = get_current_user_id())
WITH CHECK (user_id = get_current_user_id());

-- Grant necessary permissions
GRANT ALL ON user_credits TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON credit_logs TO authenticated;
GRANT ALL ON transactions TO authenticated;
GRANT ALL ON analytics TO authenticated;
GRANT ALL ON customer_details TO authenticated;
GRANT ALL ON images TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_id TO authenticated; 