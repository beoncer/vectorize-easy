import { Request, Response } from 'express';
import { mockSupabase, mockLogger } from '../../__tests__/setup';
import { uploadImage } from '../../server/api/upload';

describe('Image Upload API', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockFile: Express.Multer.File;

  beforeEach(() => {
    mockFile = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024 * 1024, // 1MB
      destination: '/tmp',
      filename: 'test.jpg',
      path: '/tmp/test.jpg',
      buffer: Buffer.from('test image data'),
    } as Express.Multer.File;

    mockReq = {
      file: mockFile,
      auth: {
        userId: 'test-user-id'
      }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should successfully upload a valid image', async () => {
    // Mock Supabase storage upload
    mockSupabase.storage.from.mockResolvedValueOnce({
      data: { path: 'test-path.jpg' },
      error: null
    });

    // Mock Supabase database insert
    mockSupabase.from.mockResolvedValueOnce({
      data: { id: 1 },
      error: null
    });

    await uploadImage(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Image uploaded successfully'
      })
    );
  });

  it('should reject invalid file types', async () => {
    mockFile.mimetype = 'text/plain';

    await uploadImage(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Invalid file type. Only JPEG and PNG files are allowed.'
      })
    );
  });

  it('should reject files larger than 35MB', async () => {
    mockFile.size = 36 * 1024 * 1024; // 36MB

    await uploadImage(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'File size exceeds 35MB limit.'
      })
    );
  });

  it('should handle Supabase storage errors', async () => {
    mockSupabase.storage.from.mockResolvedValueOnce({
      data: null,
      error: new Error('Storage error')
    });

    await uploadImage(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Failed to upload image'
      })
    );
  });

  it('should handle database errors', async () => {
    mockSupabase.storage.from.mockResolvedValueOnce({
      data: { path: 'test-path.jpg' },
      error: null
    });

    mockSupabase.from.mockResolvedValueOnce({
      data: null,
      error: new Error('Database error')
    });

    await uploadImage(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Failed to save image metadata'
      })
    );
  });
}); 