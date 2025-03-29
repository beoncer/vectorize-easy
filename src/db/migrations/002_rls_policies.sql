-- Enable RLS on images table
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting images (users can only see their own images)
CREATE POLICY "Users can view their own images"
ON images FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for inserting images (users can only insert their own images)
CREATE POLICY "Users can insert their own images"
ON images FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for updating images (users can only update their own images)
CREATE POLICY "Users can update their own images"
ON images FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for deleting images (users can only delete their own images)
CREATE POLICY "Users can delete their own images"
ON images FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket policies
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
); 