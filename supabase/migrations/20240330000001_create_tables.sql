-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Group 1: Core User Tables

-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    company_name VARCHAR,
    billing_address VARCHAR,
    vat_id VARCHAR,
    country VARCHAR,
    email VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_credits table
CREATE TABLE user_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    credit_balance DECIMAL(10,2) DEFAULT 0,
    free_previews INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    default_vectorization_options JSONB DEFAULT '{}',
    notification_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group 2: Credit and Package Tables

-- Create credit_packages table
CREATE TABLE credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    credits_amount DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stripe_price_id VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_credits(user_id) ON DELETE CASCADE,
    type VARCHAR NOT NULL CHECK (type IN ('preview', 'vectorize', 'purchase')),
    credits_amount DECIMAL(10,2) NOT NULL,
    pack_name VARCHAR,
    credits_added INTEGER,
    previews_added INTEGER,
    amount_paid DECIMAL(10,2),
    currency VARCHAR DEFAULT 'USD',
    stripe_payment_id VARCHAR,
    status VARCHAR NOT NULL CHECK (status IN ('completed', 'failed')),
    vat_amount DECIMAL(10,2),
    vat_rate DECIMAL(5,2),
    vat_country VARCHAR,
    company_name VARCHAR,
    billing_address VARCHAR,
    vat_id VARCHAR,
    file_name VARCHAR,
    download_url VARCHAR,
    expiration_time TIMESTAMP WITH TIME ZONE,
    invoice_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_logs table
CREATE TABLE credit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_credits(user_id) ON DELETE CASCADE,
    action_type VARCHAR NOT NULL CHECK (action_type IN ('preview', 'vectorize', 'purchase')),
    credits_used DECIMAL(10,2) NOT NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    file_name VARCHAR,
    download_url VARCHAR,
    expiration_time TIMESTAMP WITH TIME ZONE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group 3: Image Tables

-- Create images table
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    path VARCHAR NOT NULL,
    original_name VARCHAR NOT NULL,
    mime_type VARCHAR NOT NULL,
    size INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    was_resized BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vectorized_images table
CREATE TABLE vectorized_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    format VARCHAR NOT NULL CHECK (format IN ('svg', 'pdf', 'eps', 'dxf', 'png')),
    path VARCHAR NOT NULL,
    size INTEGER NOT NULL,
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group 4: Analytics

-- Create analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    action_type VARCHAR NOT NULL CHECK (action_type IN ('upload', 'preview', 'vectorize', 'download')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_credit_logs_user_id ON credit_logs(user_id);
CREATE INDEX idx_credit_logs_created_at ON credit_logs(created_at);
CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_created_at ON images(created_at);
CREATE INDEX idx_vectorized_images_image_id ON vectorized_images(image_id);
CREATE INDEX idx_vectorized_images_user_id ON vectorized_images(user_id);
CREATE INDEX idx_vectorized_images_created_at ON vectorized_images(created_at);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_action_type ON analytics(action_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vectorized_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY; 