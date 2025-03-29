-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view their own credit logs" ON credit_logs;
DROP POLICY IF EXISTS "Users can insert their own credit logs" ON credit_logs;
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can insert their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can view their own images" ON images;
DROP POLICY IF EXISTS "Users can insert their own images" ON images;
DROP POLICY IF EXISTS "Users can update their own images" ON images;
DROP POLICY IF EXISTS "Users can delete their own images" ON images;
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view their own analytics" ON analytics;
DROP POLICY IF EXISTS "Users can insert their own analytics" ON analytics;
DROP POLICY IF EXISTS "Users can view their own customer details" ON customer_details;
DROP POLICY IF EXISTS "Users can insert their own customer details" ON customer_details;
DROP POLICY IF EXISTS "Users can update their own customer details" ON customer_details;

-- Drop all existing tables
DROP TABLE IF EXISTS customer_transaction_history CASCADE;
DROP TABLE IF EXISTS customer_vectorization_history CASCADE;
DROP TABLE IF EXISTS customer_credit_summary CASCADE;
DROP TABLE IF EXISTS credit_logs CASCADE;
DROP TABLE IF EXISTS user_credits CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS customer_details CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS credits CASCADE;
DROP TABLE IF EXISTS credit_transactions CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS credit_action_type CASCADE;

-- Recreate types
CREATE TYPE credit_action_type AS ENUM ('preview', 'vectorize');

-- Create user_credits table
CREATE TABLE user_credits (
    user_id TEXT PRIMARY KEY,
    credit_balance INTEGER NOT NULL DEFAULT 0,
    free_previews INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create credit_logs table
CREATE TABLE credit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    action_type credit_action_type NOT NULL,
    credits_used INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create images table
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    path TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    was_resized BOOLEAN NOT NULL DEFAULT FALSE,
    expiry_timestamp TIMESTAMP WITH TIME ZONE,
    vector_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
    credits_deducted INTEGER DEFAULT 0,
    amount DECIMAL(10,2),
    vat_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    action_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create customer_details table
CREATE TABLE customer_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    business_name TEXT NOT NULL,
    vat_number TEXT,
    vat_rate DECIMAL(5,2),
    vat_country TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_credit_logs_user_id ON credit_logs(user_id);
CREATE INDEX idx_credit_logs_created_at ON credit_logs(created_at);
CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_created_at ON images(created_at);
CREATE INDEX idx_images_status ON images(status);
CREATE INDEX idx_images_expiry ON images(expiry_timestamp);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_customer_details_user_id ON customer_details(user_id);

-- Enable RLS on all tables
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_credits
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

-- Create RLS policies for credit_logs
CREATE POLICY "Users can view their own credit logs"
ON credit_logs FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own credit logs"
ON credit_logs FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

-- Create RLS policies for images
CREATE POLICY "Users can view their own images"
ON images FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own images"
ON images FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own images"
ON images FOR UPDATE
USING (user_id = auth.uid()::text)
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own images"
ON images FOR DELETE
USING (user_id = auth.uid()::text);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions"
ON transactions FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own transactions"
ON transactions FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

-- Create RLS policies for analytics
CREATE POLICY "Users can view their own analytics"
ON analytics FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own analytics"
ON analytics FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

-- Create RLS policies for customer_details
CREATE POLICY "Users can view their own customer details"
ON customer_details FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own customer details"
ON customer_details FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own customer details"
ON customer_details FOR UPDATE
USING (user_id = auth.uid()::text)
WITH CHECK (user_id = auth.uid()::text);

-- Create views
CREATE OR REPLACE VIEW customer_transaction_history AS
SELECT 
    cd.business_name,
    cd.email,
    t.transaction_type,
    t.credits_deducted,
    t.amount,
    t.vat_info,
    t.created_at as transaction_date
FROM customer_details cd
JOIN transactions t ON cd.user_id = t.user_id
ORDER BY t.created_at DESC;

CREATE OR REPLACE VIEW customer_vectorization_history AS
SELECT 
    cd.business_name,
    cd.email,
    i.original_name as image_name,
    i.path as image_path,
    i.vector_url,
    i.status as vectorization_status,
    cl.credits_used,
    cl.created_at as vectorization_date
FROM customer_details cd
JOIN images i ON cd.user_id = i.user_id
JOIN credit_logs cl ON cd.user_id = cl.user_id 
    AND cl.action_type = 'vectorize'
    AND cl.created_at >= i.created_at
ORDER BY cl.created_at DESC;

CREATE OR REPLACE VIEW customer_credit_summary AS
SELECT 
    cd.business_name,
    cd.email,
    uc.credit_balance as current_balance,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'purchase' THEN t.amount ELSE 0 END), 0) as total_purchased,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'preview' THEN t.credits_deducted ELSE 0 END), 0) as total_preview_credits,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'vectorize' THEN t.credits_deducted ELSE 0 END), 0) as total_vectorize_credits,
    COUNT(DISTINCT CASE WHEN t.transaction_type = 'vectorize' THEN t.id END) as total_vectorizations
FROM customer_details cd
LEFT JOIN user_credits uc ON cd.user_id = uc.user_id
LEFT JOIN transactions t ON cd.user_id = t.user_id
GROUP BY cd.business_name, cd.email, uc.credit_balance;

-- Grant access to views
GRANT SELECT ON customer_transaction_history TO authenticated;
GRANT SELECT ON customer_vectorization_history TO authenticated;
GRANT SELECT ON customer_credit_summary TO authenticated; 