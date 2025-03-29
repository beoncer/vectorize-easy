-- Create index on user_id for faster lookups
CREATE INDEX idx_images_user_id ON images(user_id);

-- Create index on created_at for sorting and filtering
CREATE INDEX idx_images_created_at ON images(created_at);

-- Create index on mime_type for filtering
CREATE INDEX idx_images_mime_type ON images(mime_type);

-- Create index on was_resized for filtering
CREATE INDEX idx_images_was_resized ON images(was_resized);

-- Create composite index for common queries
CREATE INDEX idx_images_user_created ON images(user_id, created_at DESC); 