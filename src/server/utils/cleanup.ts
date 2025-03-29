import { supabase } from '../../lib/supabase';

export async function cleanupFailedUploads(filePath: string): Promise<void> {
  try {
    // Check if the file exists in the database
    const { data: imageData, error: dbError } = await supabase
      .from('images')
      .select('id')
      .eq('path', filePath)
      .single();

    // If the file doesn't exist in the database, delete it from storage
    if (!imageData && !dbError) {
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (storageError) {
        console.error('Error cleaning up failed upload:', storageError);
      }
    }
  } catch (error) {
    console.error('Error in cleanup process:', error);
  }
} 