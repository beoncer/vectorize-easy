export type UserCredits = {
  user_id: string;
  credit_balance: number;
  created_at: string;
  updated_at: string;
};

export type CreditLog = {
  id: string;
  user_id: string;
  action_type: 'preview' | 'vectorize';
  credits_used: number;
  created_at: string;
};

export type Image = {
  id: string;
  user_id: string;
  path: string;
  original_name: string;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}; 