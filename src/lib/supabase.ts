
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure to add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for image storage
export const uploadImage = async (file: File, userId: string): Promise<{ path: string; id: string } | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const uniqueId = Math.random().toString(36).substring(2, 12);
    const fileName = `${uniqueId}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    return { path: data.path, id: uniqueId };
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const getImageUrl = async (path: string): Promise<string | null> => {
  try {
    const { data } = await supabase.storage
      .from('images')
      .getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
};

// Credit management functions
export const getUserCredits = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credit_balance')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user credits:', error);
      return 0;
    }

    return data?.credit_balance || 0;
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return 0;
  }
};

export const deductCredits = async (userId: string, amount: number, actionType: 'preview' | 'vectorize'): Promise<boolean> => {
  try {
    // First, check if user has enough credits
    const currentCredits = await getUserCredits(userId);
    
    if (currentCredits < amount) {
      return false;
    }

    // Begin a transaction to update credits and log action
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credit_balance: currentCredits - amount })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error deducting credits:', updateError);
      return false;
    }

    // Log the credit usage
    const { error: logError } = await supabase
      .from('credit_logs')
      .insert({
        user_id: userId,
        action_type: actionType,
        credits_used: amount,
        timestamp: new Date().toISOString()
      });

    if (logError) {
      console.error('Error logging credit usage:', logError);
      // We still return true as the credit was deducted
    }

    return true;
  } catch (error) {
    console.error('Error deducting credits:', error);
    return false;
  }
};

export const addCredits = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const currentCredits = await getUserCredits(userId);
    
    const { error } = await supabase
      .from('user_credits')
      .update({ credit_balance: currentCredits + amount })
      .eq('user_id', userId);

    if (error) {
      console.error('Error adding credits:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding credits:', error);
    return false;
  }
};
