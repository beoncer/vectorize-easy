-- Create credits table
CREATE TABLE credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create credit_transactions table
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'usage')),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for credits table
CREATE INDEX idx_credits_user_id ON credits(user_id);
CREATE INDEX idx_credits_created_at ON credits(created_at);

-- Create indexes for credit_transactions table
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at);

-- Enable RLS on credits table
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credits table
CREATE POLICY "Users can view their own credits"
ON credits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
ON credits FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on credit_transactions table
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credit_transactions table
CREATE POLICY "Users can view their own credit transactions"
ON credit_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit transactions"
ON credit_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updating updated_at on credits table
CREATE TRIGGER update_credits_updated_at
    BEFORE UPDATE ON credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 