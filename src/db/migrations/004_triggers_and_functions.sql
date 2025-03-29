-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_images_updated_at
    BEFORE UPDATE ON images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle image deletion
CREATE OR REPLACE FUNCTION handle_image_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete the image from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'images'
    AND name = OLD.path;
    
    RETURN OLD;
END;
$$ language 'plpgsql';

-- Create trigger for image deletion
CREATE TRIGGER handle_image_deletion_trigger
    BEFORE DELETE ON images
    FOR EACH ROW
    EXECUTE FUNCTION handle_image_deletion();

-- Create function to handle image updates
CREATE OR REPLACE FUNCTION handle_image_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Update storage metadata if path changed
    IF OLD.path != NEW.path THEN
        UPDATE storage.objects
        SET name = NEW.path,
            updated_at = CURRENT_TIMESTAMP
        WHERE bucket_id = 'images'
        AND name = OLD.path;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for image updates
CREATE TRIGGER handle_image_update_trigger
    BEFORE UPDATE ON images
    FOR EACH ROW
    EXECUTE FUNCTION handle_image_update(); 