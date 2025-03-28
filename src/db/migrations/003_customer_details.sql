-- Create customer_details table
CREATE TABLE IF NOT EXISTS customer_details (
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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_customer_details_user_id ON customer_details(user_id);

-- Enable RLS
ALTER TABLE customer_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own customer details" ON customer_details;
DROP POLICY IF EXISTS "Users can insert their own customer details" ON customer_details;
DROP POLICY IF EXISTS "Users can update their own customer details" ON customer_details;

-- Create RLS policies
CREATE POLICY "Users can view their own customer details"
    ON customer_details FOR SELECT
    USING (user_id = current_user);

CREATE POLICY "Users can insert their own customer details"
    ON customer_details FOR INSERT
    WITH CHECK (user_id = current_user);

CREATE POLICY "Users can update their own customer details"
    ON customer_details FOR UPDATE
    USING (user_id = current_user);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_details_updated_at
    BEFORE UPDATE ON customer_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 