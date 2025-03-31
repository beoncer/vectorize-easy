-- User Profiles Policies
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- User Credits Policies
CREATE POLICY "Users can view own credits"
    ON user_credits FOR SELECT
    USING (auth.uid() = user_id);

-- User Settings Policies
CREATE POLICY "Users can view own settings"
    ON user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
    ON user_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Credit Packages Policies
CREATE POLICY "Everyone can view credit packages"
    ON credit_packages FOR SELECT
    USING (true);

-- Transactions Policies
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own free transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id AND is_free = true);

CREATE POLICY "Users can view own paid transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id AND is_free = false);

-- Credit Logs Policies
CREATE POLICY "Users can view own credit logs"
    ON credit_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Images Policies
CREATE POLICY "Users can view own images"
    ON images FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
    ON images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images"
    ON images FOR UPDATE
    USING (auth.uid() = user_id);

-- Vectorized Images Policies
CREATE POLICY "Users can view own vectorized images"
    ON vectorized_images FOR SELECT
    USING (auth.uid() = user_id);

-- Analytics Policies
CREATE POLICY "Users can view own analytics"
    ON analytics FOR SELECT
    USING (auth.uid() = user_id);

-- Admin Policies (to be implemented when admin role is set up)
-- CREATE POLICY "Admins can view all data"
--     ON user_profiles FOR SELECT
--     USING (auth.jwt() ->> 'role' = 'admin'); 