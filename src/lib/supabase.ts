
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure to add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get a Supabase client with user's clerk userId as header
export const getSupabaseClient = (userId: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'x-user-id': userId
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};

// Credit management functions
export const deductCredits = async (userId: string, amount: number, actionType: 'preview' | 'vectorize'): Promise<boolean> => {
  try {
    // Get client with user ID
    const client = getSupabaseClient(userId);
    
    if (actionType === 'preview' && amount === 0) {
      // Using free preview
      const { data, error } = await client
        .from('user_credits')
        .update({ free_previews: 0 })  // Use up the free preview
        .eq('user_id', userId)
        .select('free_previews')
        .single();
        
      if (error) {
        console.error('Error using free preview:', error);
        return false;
      }
      
      // Log the preview action
      await client.from('credit_logs').insert({
        user_id: userId,
        action_type: 'preview',
        credits_used: 0,
        timestamp: new Date().toISOString()
      });
      
      return true;
    } else {
      // Regular credit usage
      const { data, error } = await client
        .from('user_credits')
        .select('credit_balance')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error checking credit balance:', error);
        return false;
      }
      
      const creditBalance = data?.credit_balance || 0;
      
      if (creditBalance < amount) {
        return false;
      }
      
      // Update credit balance
      const { error: updateError } = await client
        .from('user_credits')
        .update({ credit_balance: creditBalance - amount })
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating credit balance:', updateError);
        return false;
      }
      
      // Log the action
      await client.from('credit_logs').insert({
        user_id: userId,
        action_type: actionType,
        credits_used: amount,
        timestamp: new Date().toISOString()
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error deducting credits:', error);
    return false;
  }
};
