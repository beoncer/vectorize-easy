-- Add auth-specific fields to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR,
ADD COLUMN IF NOT EXISTS last_sign_in TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create auth settings table
CREATE TABLE IF NOT EXISTS auth_settings (
    user_id UUID PRIMARY KEY REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_password_change TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on auth_settings
ALTER TABLE auth_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auth_settings
CREATE POLICY "Users can view own auth settings"
    ON auth_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own auth settings"
    ON auth_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO user_profiles (
        user_id,
        email,
        auth_provider,
        last_sign_in,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        NEW.provider,
        NEW.created_at,
        NEW.created_at,
        NEW.created_at
    );

    -- Create auth settings
    INSERT INTO auth_settings (
        user_id,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.created_at,
        NEW.created_at
    );

    -- Initialize credits
    INSERT INTO user_credits (
        user_id,
        credit_balance,
        free_previews,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        0,
        1,
        NEW.created_at,
        NEW.created_at
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new auth user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_auth_user_created();

-- Create function to update last sign in
CREATE OR REPLACE FUNCTION handle_auth_sign_in()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles
    SET last_sign_in = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for sign in
CREATE TRIGGER on_auth_sign_in
    AFTER INSERT ON auth.sessions
    FOR EACH ROW
    EXECUTE FUNCTION handle_auth_sign_in(); 