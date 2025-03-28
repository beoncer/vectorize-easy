-- Create view for customer transaction history
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

-- Create view for customer vectorization history
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

-- Create view for customer credit usage summary
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

-- Grant access to these views
GRANT SELECT ON customer_transaction_history TO authenticated;
GRANT SELECT ON customer_vectorization_history TO authenticated;
GRANT SELECT ON customer_credit_summary TO authenticated; 