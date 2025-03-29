-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can insert their own credits" ON user_credits;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own profile"
ON user_profiles FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
USING (user_id = auth.uid()::text)
WITH CHECK (user_id = auth.uid()::text);

-- Fix user_credits policies
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

-- Grant necessary permissions
GRANT ALL ON user_credits TO authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON credit_logs TO authenticated;
GRANT ALL ON transactions TO authenticated;
GRANT ALL ON analytics TO authenticated;
GRANT ALL ON customer_details TO authenticated;
GRANT ALL ON images TO authenticated;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into user_profiles
    INSERT INTO user_profiles (user_id, email)
    VALUES (NEW.id, NEW.email);

    -- Insert into user_credits with free preview
    INSERT INTO user_credits (user_id, credit_balance, free_previews)
    VALUES (NEW.id, 0, 1);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Fix transactions table timestamp column
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Update existing records to use created_at as timestamp
UPDATE transactions 
SET timestamp = created_at 
WHERE timestamp IS NULL; 