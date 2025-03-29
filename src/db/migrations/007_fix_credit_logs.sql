-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own credit logs" ON credit_logs;
DROP POLICY IF EXISTS "Users can insert their own credit logs" ON credit_logs;
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;

-- Drop foreign key constraints
ALTER TABLE credit_logs 
DROP CONSTRAINT IF EXISTS fk_credit_logs_user;

ALTER TABLE user_credits 
DROP CONSTRAINT IF EXISTS fk_user_credits_user;

-- Add timestamp column to credit_logs table
ALTER TABLE credit_logs 
ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Update existing records to use created_at as timestamp
UPDATE credit_logs 
SET timestamp = created_at 
WHERE timestamp IS NULL;

-- Modify user_id column to accept text (for Clerk user IDs)
ALTER TABLE credit_logs 
ALTER COLUMN user_id TYPE TEXT;

-- Modify user_credits table to accept text user_id
ALTER TABLE user_credits 
ALTER COLUMN user_id TYPE TEXT;

-- Recreate policies with text user_id
CREATE POLICY "Users can view their own credit logs"
ON credit_logs FOR SELECT
USING (user_id = current_user);

CREATE POLICY "Users can insert their own credit logs"
ON credit_logs FOR INSERT
WITH CHECK (user_id = current_user);

CREATE POLICY "Users can view their own credits"
ON user_credits FOR SELECT
USING (user_id = current_user);

CREATE POLICY "Users can update their own credits"
ON user_credits FOR UPDATE
USING (user_id = current_user); 