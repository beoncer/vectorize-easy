import { createClient } from '@supabase/supabase-js';
import type { UserCredits, CreditLog, Image } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions with type safety
export const db = {
  // User Credits
  async getUserCredits(userId: string): Promise<UserCredits | null> {
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserCredits(userId: string, creditBalance: number): Promise<UserCredits> {
    const { data, error } = await supabase
      .from('user_credits')
      .update({ credit_balance: creditBalance })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Credit Logs
  async createCreditLog(log: Omit<CreditLog, 'id' | 'created_at'>): Promise<CreditLog> {
    const { data, error } = await supabase
      .from('credit_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserCreditLogs(userId: string): Promise<CreditLog[]> {
    const { data, error } = await supabase
      .from('credit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Images
  async createImage(image: Omit<Image, 'id' | 'created_at' | 'updated_at'>): Promise<Image> {
    const { data, error } = await supabase
      .from('images')
      .insert(image)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserImages(userId: string): Promise<Image[]> {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateImage(id: string, updates: Partial<Image>): Promise<Image> {
    const { data, error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteImage(id: string): Promise<void> {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 