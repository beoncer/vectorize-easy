import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Create a function to get a Supabase client with user context
export const getSupabaseClient = (userId: string) => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
          'X-User-ID': userId
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      db: {
        schema: 'public'
      }
    });
  }
  return supabaseInstance;
};

// Default client for non-authenticated requests
export const supabase = getSupabaseClient('anonymous');

// Helper functions for image storage
export const uploadImage = async (file: File, userId: string): Promise<{ path: string; id: string } | null> => {
  try {
    const client = getSupabaseClient(userId);
    const fileExt = file.name.split('.').pop();
    const uniqueId = Math.random().toString(36).substring(2, 12);
    const fileName = `${uniqueId}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await client.storage
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
    const client = getSupabaseClient(userId);
    const { data, error } = await client
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
    const client = getSupabaseClient(userId);
    // First, check if user has enough credits or free previews
    const { data: userCredits, error: fetchError } = await client
      .from('user_credits')
      .select('credit_balance, free_previews')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user credits:', fetchError);
      return false;
    }

    const currentCredits = userCredits?.credit_balance || 0;
    const freePreviews = userCredits?.free_previews || 0;

    // For preview action, check free previews first
    if (actionType === 'preview' && freePreviews > 0) {
      // Use free preview
      const { error: updateError } = await client
        .from('user_credits')
        .update({ 
          free_previews: freePreviews - 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating free previews:', updateError);
        return false;
      }

      // Log the free preview usage
      const { error: logError } = await client
        .from('credit_logs')
        .insert({
          user_id: userId,
          action_type: actionType,
          credits_used: 0,
          timestamp: new Date().toISOString()
        });

      if (logError) {
        console.error('Error logging free preview usage:', logError);
      }

      return true;
    }
    
    // For vectorize or if no free previews available, use regular credits
    if (currentCredits < amount) {
      return false;
    }

    // Begin a transaction to update credits and log action
    const { error: updateError } = await client
      .from('user_credits')
      .update({ 
        credit_balance: currentCredits - amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error deducting credits:', updateError);
      return false;
    }

    // Log the credit usage
    const { error: logError } = await client
      .from('credit_logs')
      .insert({
        user_id: userId,
        action_type: actionType,
        credits_used: amount,
        timestamp: new Date().toISOString()
      });

    if (logError) {
      console.error('Error logging credit usage:', logError);
    }

    return true;
  } catch (error) {
    console.error('Error deducting credits:', error);
    return false;
  }
};

export const addCredits = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const client = getSupabaseClient(userId);
    const currentCredits = await getUserCredits(userId);
    
    const { error } = await client
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
