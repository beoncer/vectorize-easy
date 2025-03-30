-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to initialize credits for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (user_id, company_name, billing_address, vat_id, country)
  VALUES (NEW.id, NULL, NULL, NULL, NULL);

  -- Initialize credits with 1 free preview
  INSERT INTO public.user_credits (user_id, credit_balance, free_previews)
  VALUES (NEW.id, 0, 1);

  -- Create user settings
  INSERT INTO public.user_settings (user_id, default_vectorization_options)
  VALUES (NEW.id, '{}'::jsonb);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_timestamp_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_user_credits
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_user_settings
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle credit transactions
CREATE OR REPLACE FUNCTION public.handle_credit_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the transaction
  INSERT INTO public.credit_logs (
    user_id, 
    action_type, 
    credits_used,
    file_name,
    download_url,
    expiration_time
  )
  VALUES (
    NEW.user_id, 
    NEW.type, 
    NEW.credits_amount,
    NEW.file_name,
    NEW.download_url,
    NEW.expiration_time
  );

  -- Update user credits
  IF NEW.type = 'purchase' THEN
    UPDATE public.user_credits
    SET credit_balance = credit_balance + NEW.credits_amount
    WHERE user_id = NEW.user_id;
  ELSIF NEW.type IN ('preview', 'vectorize') THEN
    UPDATE public.user_credits
    SET credit_balance = credit_balance - NEW.credits_amount
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for credit transactions
CREATE TRIGGER on_credit_transaction
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_credit_transaction();

-- Function to handle free previews
CREATE OR REPLACE FUNCTION public.handle_free_preview()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has free previews left
  IF EXISTS (
    SELECT 1 FROM public.user_credits
    WHERE user_id = NEW.user_id AND free_previews > 0
  ) THEN
    -- Decrement free previews
    UPDATE public.user_credits
    SET free_previews = free_previews - 1,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    -- Mark transaction as free
    NEW.is_free = true;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for preview transactions
CREATE TRIGGER on_preview_transaction
  BEFORE INSERT ON public.transactions
  FOR EACH ROW
  WHEN (NEW.type = 'preview')
  EXECUTE FUNCTION public.handle_free_preview();

-- Function to handle image cleanup
CREATE OR REPLACE FUNCTION public.handle_image_cleanup()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete the image from storage
  -- Note: This is a placeholder. Actual storage deletion should be handled by the application
  -- as it requires access to the storage API
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for image deletion
CREATE TRIGGER on_image_deleted
  AFTER DELETE ON public.images
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_image_cleanup();

-- Function to validate VAT number format
CREATE OR REPLACE FUNCTION public.validate_vat_number(vat_id text)
RETURNS boolean AS $$
BEGIN
  -- Basic EU VAT number validation
  -- Format: 2 letter country code followed by 8-12 digits
  RETURN vat_id ~ '^[A-Z]{2}[0-9]{8,12}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate VAT amount
CREATE OR REPLACE FUNCTION public.calculate_vat_amount(
  amount decimal,
  country text,
  vat_id text
)
RETURNS decimal AS $$
DECLARE
  vat_rate decimal;
BEGIN
  -- Get VAT rate based on country
  -- Note: This is a simplified version. In production, you'd want to use a proper VAT rate database
  CASE country
    WHEN 'GB' THEN vat_rate := 0.20;
    WHEN 'DE' THEN vat_rate := 0.19;
    WHEN 'FR' THEN vat_rate := 0.20;
    ELSE vat_rate := 0.20; -- Default rate
  END CASE;

  -- If VAT ID is provided and valid, no VAT is charged (reverse charge)
  IF vat_id IS NOT NULL AND public.validate_vat_number(vat_id) THEN
    RETURN 0;
  END IF;

  RETURN amount * vat_rate;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to handle analytics logging
CREATE OR REPLACE FUNCTION public.handle_analytics_logging()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the action to analytics
  INSERT INTO public.analytics (user_id, action_type, metadata)
  VALUES (NEW.user_id, NEW.type, jsonb_build_object(
    'credits_amount', NEW.credits_amount,
    'is_free', NEW.is_free,
    'stripe_payment_id', NEW.stripe_payment_id
  ));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for analytics logging
CREATE TRIGGER on_transaction_analytics
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_analytics_logging(); 