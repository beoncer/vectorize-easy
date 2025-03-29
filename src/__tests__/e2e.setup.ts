import { mock } from 'jest-mock-extended';
import { supabase } from '../lib/supabase';
import { stripe } from '../lib/stripe';
import { logger } from '../server/utils/logger';
import app from '../server';
import { supabase as serverSupabase } from '../server/lib/supabase';

// Mock external dependencies
jest.mock('../lib/supabase');
jest.mock('../lib/stripe');
jest.mock('../server/utils/logger');

// Create mock instances
export const mockSupabase = mock(supabase);
export const mockStripe = mock(stripe);
export const mockLogger = mock(logger);

// Create test server
export const testServer = app;

// Use server-side Supabase for e2e tests
export const testSupabase = process.env.NODE_ENV === 'test' ? serverSupabase : supabase;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-key';
process.env.STRIPE_SECRET_KEY = 'test-stripe-key';
process.env.VECTORIZER_API_KEY = 'test-vectorizer-key';
process.env.CLERK_SECRET_KEY = 'test-clerk-key';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test-clerk-publishable-key';
process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL = '/sign-in';
process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL = '/sign-up';
process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = '/dashboard';
process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = '/dashboard'; 