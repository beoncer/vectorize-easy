import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Constants
const MAX_FILE_SIZE = 35 * 1024 * 1024; // 35MB
const MAX_PIXELS = 33554432; // 33,554,432 pixels
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get file from request
    const file = req.files?.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only PNG and JPG files are allowed.' 
      });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 35MB.' 
      });
    }

    // Get image dimensions
    const metadata = await sharp(file.data).metadata();
    const totalPixels = metadata.width! * metadata.height!;

    // Validate pixel count
    if (totalPixels > MAX_PIXELS) {
      // Resize image if needed
      const scale = Math.sqrt(MAX_PIXELS / totalPixels);
      const newWidth = Math.round(metadata.width! * scale);
      const newHeight = Math.round(metadata.height! * scale);

      const resizedImage = await sharp(file.data)
        .resize(newWidth, newHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();

      // Upload resized image
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, resizedImage, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading resized image:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      // Create image record in database
      const { data: imageData, error: dbError } = await supabase
        .from('images')
        .insert({
          user_id: userId,
          path: filePath,
          original_name: file.name,
          mime_type: file.mimetype,
          size: resizedImage.length,
          width: newWidth,
          height: newHeight,
          was_resized: true
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error creating image record:', dbError);
        return res.status(500).json({ error: 'Failed to save image metadata' });
      }

      return res.status(200).json({
        message: 'Image uploaded successfully (resized)',
        data: imageData
      });
    } else {
      // Upload original image without resizing
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file.data, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      // Create image record in database
      const { data: imageData, error: dbError } = await supabase
        .from('images')
        .insert({
          user_id: userId,
          path: filePath,
          original_name: file.name,
          mime_type: file.mimetype,
          size: file.size,
          width: metadata.width,
          height: metadata.height,
          was_resized: false
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error creating image record:', dbError);
        return res.status(500).json({ error: 'Failed to save image metadata' });
      }

      return res.status(200).json({
        message: 'Image uploaded successfully',
        data: imageData
      });
    }
  } catch (error) {
    console.error('Error processing image upload:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 