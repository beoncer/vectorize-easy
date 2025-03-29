import request from 'supertest';
import { testServer, mockSupabase, mockStripe } from '../../__tests__/e2e.setup';
import nock from 'nock';

describe('Vectorization API (E2E)', () => {
  const testUserId = 'test-user-id';
  const testImageId = 'test-image-id';
  const testVectorizedUrl = 'https://vectorizer.ai/test.svg';

  beforeEach(() => {
    // Mock Clerk auth middleware
    jest.mock('@clerk/clerk-sdk-node', () => ({
      ClerkExpressRequireAuth: () => (req: any, res: any, next: any) => {
        req.auth = { userId: testUserId };
        next();
      }
    }));

    // Mock Supabase responses
    mockSupabase.from.mockResolvedValueOnce({
      data: { credits: 10 },
      error: null
    });

    mockSupabase.from.mockResolvedValueOnce({
      data: { id: testImageId },
      error: null
    });

    // Mock Vectorizer.ai API
    nock('https://api.vectorizer.ai')
      .post('/v1/vectorize')
      .reply(200, {
        success: true,
        vectorized_url: testVectorizedUrl
      });
  });

  it('should successfully vectorize an image', async () => {
    const response = await request(testServer)
      .post('/api/vectorize')
      .send({
        imageId: testImageId,
        options: {
          style: 'flat',
          colors: ['#FF0000', '#00FF00']
        }
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      vectorizedUrl: testVectorizedUrl
    });

    // Verify credit deduction
    expect(mockSupabase.from).toHaveBeenCalledWith('credits');
    expect(mockSupabase.from).toHaveBeenCalledWith('images');
  });

  it('should handle insufficient credits', async () => {
    mockSupabase.from.mockResolvedValueOnce({
      data: { credits: 0 },
      error: null
    });

    const response = await request(testServer)
      .post('/api/vectorize')
      .send({
        imageId: testImageId,
        options: {
          style: 'flat',
          colors: ['#FF0000', '#00FF00']
        }
      });

    expect(response.status).toBe(402);
    expect(response.body).toEqual({
      error: 'Insufficient credits'
    });
  });

  it('should handle Vectorizer.ai API errors', async () => {
    nock('https://api.vectorizer.ai')
      .post('/v1/vectorize')
      .reply(500, {
        success: false,
        error: 'API Error'
      });

    const response = await request(testServer)
      .post('/api/vectorize')
      .send({
        imageId: testImageId,
        options: {
          style: 'flat',
          colors: ['#FF0000', '#00FF00']
        }
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Failed to vectorize image'
    });
  });

  it('should handle database errors', async () => {
    mockSupabase.from.mockResolvedValueOnce({
      data: null,
      error: new Error('Database error')
    });

    const response = await request(testServer)
      .post('/api/vectorize')
      .send({
        imageId: testImageId,
        options: {
          style: 'flat',
          colors: ['#FF0000', '#00FF00']
        }
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Failed to process request'
    });
  });
}); 