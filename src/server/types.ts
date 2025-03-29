import { Request } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Extend Express Request type to include Clerk auth
declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string;
      };
    }
  }
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