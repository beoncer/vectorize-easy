-- Drop existing function if it exists
DROP FUNCTION IF EXISTS initialize_user_data;

-- Create function to initialize user data
CREATE OR REPLACE FUNCTION initialize_user_data(user_id TEXT, email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert into user_profiles if it doesn't exist
    INSERT INTO user_profiles (user_id)
    VALUES (user_id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Insert into user_credits if it doesn't exist
    INSERT INTO user_credits (user_id, credit_balance, free_previews)
    VALUES (user_id, 0, 1)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION initialize_user_data TO authenticated; 