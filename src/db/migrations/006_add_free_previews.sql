-- Add free_previews column to user_credits table
ALTER TABLE user_credits 
ADD COLUMN IF NOT EXISTS free_previews INTEGER NOT NULL DEFAULT 1;

-- Update existing records to have 1 free preview
UPDATE user_credits 
SET free_previews = 1 
WHERE free_previews IS NULL; 