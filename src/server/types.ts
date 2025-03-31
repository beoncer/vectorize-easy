import { Request } from 'express';
import { User } from '@supabase/supabase-js';

// Extend Express Request type to include Supabase auth
declare global {
  namespace Express {
    interface Request {
      user?: User;
      auth?: {
        userId: string;
        email: string;
      };
    }
  }
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface VectorizeResponse {
  success: boolean;
  data?: {
    url: string;
    vector: number[];
  };
  error?: string;
}

export interface VectorizeRequest {
  imageUrl: string;
  userId: string;
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      customer: string;
      subscription: string;
      status: string;
      current_period_end: number;
    };
  };
}

export interface StripeCustomer {
  id: string;
  email: string;
  metadata: {
    userId: string;
  };
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        product: string;
      };
    }>;
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  prices: Array<{
    id: string;
    unit_amount: number;
    currency: string;
    interval: string;
  }>;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  tls: boolean;
}

export interface VectorizeConfig {
  apiKey: string;
  baseUrl: string;
}

export interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
  priceId: string;
}

export interface SupabaseConfig {
  url: string;
  serviceKey: string;
  anonKey: string;
}

export interface Config {
  redis: RedisConfig;
  vectorize: VectorizeConfig;
  stripe: StripeConfig;
  supabase: SupabaseConfig;
  port: number;
  environment: string;
}

// Image upload response type
export interface ImageUploadResponse {
  message: string;
  data: {
    id: string;
    user_id: string;
    path: string;
    original_name: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    was_resized: boolean;
    created_at: string;
    updated_at: string;
  };
} 