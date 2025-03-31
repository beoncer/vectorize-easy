import express, { Request, Response } from 'express';
import multer from 'multer';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { supabase } from './lib/supabase';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { ImageUploadResponse } from './types';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { cleanupFailedUploads } from './utils/cleanup';
import { checkAndDeductCredits, addCredits } from './utils/credits';
import Stripe from 'stripe';
import logger, { 
  logError, 
  logInfo, 
  logHttp, 
  startPerformanceMonitoring,
  getHealthStatus,
  trackError 
} from './utils/logger';
import { createClient } from '@supabase/supabase-js';
import { Redis } from 'ioredis';
import { 
  UserProfile, 
  UserCredits, 
  VectorizeResponse, 
  VectorizeRequest,
  StripeWebhookEvent,
  StripeCustomer,
  StripeSubscription,
  StripeProduct,
  Config
} from './types';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'CLERK_SECRET_KEY',
  'STRIPE_SECRET_KEY',
  'FRONTEND_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Rate limiting
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 uploads per windowMs
  message: 'Too many uploads from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Constants
const MAX_FILE_SIZE = 35 * 1024 * 1024; // 35MB
const MAX_PIXELS = 33554432; // 33,554,432 pixels
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true'
});

// Middleware for performance monitoring
app.use((req: Request, res: Response, next) => {
  const endMonitoring = startPerformanceMonitoring();
  res.on('finish', () => {
    endMonitoring();
    logHttp(`${req.method} ${req.url}`, {
      statusCode: res.statusCode,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });
  next();
});

// Supabase Auth Middleware
const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    req.auth = {
      userId: user.id,
      email: user.email!
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Protected routes
app.use('/api/vectorize', authMiddleware);
app.use('/api/credits', authMiddleware);
app.use('/api/subscription', authMiddleware);

// Image upload endpoint
app.post('/api/upload', 
  authMiddleware,
  uploadLimiter,
  upload.single('file'),
  async (req: Request, res: Response<ImageUploadResponse | { error: string }>) => {
    let uploadedFilePath: string | null = null;
    
    try {
      if (!req.file) {
        logWarning('Upload attempt without file');
        return res.status(400).json({ error: 'No file provided' });
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          error: 'Invalid file type. Only PNG and JPG files are allowed.' 
        });
      }

      // Validate file size
      if (req.file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ 
          error: 'File too large. Maximum size is 35MB.' 
        });
      }

      // Get image dimensions
      const metadata = await sharp(req.file.buffer).metadata();
      const totalPixels = metadata.width! * metadata.height!;

      // Validate pixel count
      if (totalPixels > MAX_PIXELS) {
        // Resize image if needed
        const scale = Math.sqrt(MAX_PIXELS / totalPixels);
        const newWidth = Math.round(metadata.width! * scale);
        const newHeight = Math.round(metadata.height! * scale);

        const resizedImage = await sharp(req.file.buffer)
          .resize(newWidth, newHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toBuffer();

        // Upload resized image
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${req.auth.userId}/${fileName}`;
        uploadedFilePath = filePath;

        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from('images')
          .upload(filePath, resizedImage, {
            contentType: req.file.mimetype,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading resized image:', uploadError);
          return res.status(500).json({ error: 'Failed to upload image' });
        }

        // Create image record in database
        const { data: imageData, error: dbError } = await supabaseClient
          .from('images')
          .insert({
            user_id: req.auth.userId,
            path: filePath,
            original_name: req.file.originalname,
            mime_type: req.file.mimetype,
            size: resizedImage.length,
            width: newWidth,
            height: newHeight,
            was_resized: true
          })
          .select()
          .single();

        if (dbError) {
          console.error('Error creating image record:', dbError);
          return res.status(500).json({ error: 'Failed to save image metadata' });
        }

        logInfo('Image uploaded successfully', {
          userId: req.auth.userId,
          fileSize: req.file.size,
          mimeType: req.file.mimetype
        });

        return res.status(200).json({
          message: 'Image uploaded successfully (resized)',
          data: imageData
        });
      } else {
        // Upload original image without resizing
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${req.auth.userId}/${fileName}`;
        uploadedFilePath = filePath;

        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from('images')
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          return res.status(500).json({ error: 'Failed to upload image' });
        }

        // Create image record in database
        const { data: imageData, error: dbError } = await supabase
          .from('images')
          .insert({
            user_id: req.auth.userId,
            path: filePath,
            original_name: req.file.originalname,
            mime_type: req.file.mimetype,
            size: req.file.size,
            width: metadata.width,
            height: metadata.height,
            was_resized: false
          })
          .select()
          .single();

        if (dbError) {
          console.error('Error creating image record:', dbError);
          return res.status(500).json({ error: 'Failed to save image metadata' });
        }

        logInfo('Image uploaded successfully', {
          userId: req.auth.userId,
          fileSize: req.file.size,
          mimeType: req.file.mimetype
        });

        return res.status(200).json({
          message: 'Image uploaded successfully',
          data: imageData
        });
      }
    } catch (error) {
      trackError(error as Error, {
        userId: req.auth.userId,
        endpoint: '/api/upload'
      });
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      if (uploadedFilePath) {
        await cleanupFailedUploads(uploadedFilePath);
      }
    }
  }
);

// Preview endpoint
app.post('/api/preview',
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    try {
      const { imageId } = req.body;

      if (!imageId) {
        return res.status(400).json({ error: 'Image ID is required' });
      }

      // Check and deduct credits
      const hasCredits = await checkAndDeductCredits(req.auth.userId, 1, 'Preview generation');
      if (!hasCredits) {
        return res.status(402).json({ error: 'Insufficient credits' });
      }

      // Get image from database
      const { data: image, error: dbError } = await supabase
        .from('images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (dbError || !image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Get image URL from storage
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(image.path);

      return res.status(200).json({
        message: 'Preview generated successfully',
        data: {
          url: publicUrl,
          width: image.width,
          height: image.height
        }
      });
    } catch (error) {
      console.error('Error generating preview:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Vectorize endpoint
app.post('/api/vectorize',
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    try {
      const { imageId, options } = req.body;

      if (!imageId) {
        return res.status(400).json({ error: 'Image ID is required' });
      }

      // Check and deduct credits
      const hasCredits = await checkAndDeductCredits(req.auth.userId, 5, 'Vectorization');
      if (!hasCredits) {
        return res.status(402).json({ error: 'Insufficient credits' });
      }

      // Get image from database
      const { data: image, error: dbError } = await supabase
        .from('images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (dbError || !image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Get image URL from storage
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(image.path);

      // Call vectorizer.ai API
      const vectorizerResponse = await fetch('https://api.vectorizer.ai/v1/vectorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VECTORIZER_API_KEY}`
        },
        body: JSON.stringify({
          image_url: publicUrl,
          ...options
        })
      });

      if (!vectorizerResponse.ok) {
        throw new Error('Vectorizer API error');
      }

      const vectorizerData = await vectorizerResponse.json();

      // Store vectorized image in storage
      const vectorizedFileName = `${image.id}_vectorized.svg`;
      const vectorizedPath = `${req.auth.userId}/${vectorizedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(vectorizedPath, vectorizerData.svg_content, {
          contentType: 'image/svg+xml',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error('Failed to upload vectorized image');
      }

      // Create vectorized image record
      const { data: vectorizedImage, error: vectorizedError } = await supabase
        .from('images')
        .insert({
          user_id: req.auth.userId,
          path: vectorizedPath,
          original_name: `${image.original_name}_vectorized.svg`,
          mime_type: 'image/svg+xml',
          size: vectorizerData.svg_content.length,
          width: image.width,
          height: image.height,
          was_resized: false,
          parent_id: image.id
        })
        .select()
        .single();

      if (vectorizedError) {
        throw new Error('Failed to save vectorized image record');
      }

      return res.status(200).json({
        message: 'Image vectorized successfully',
        data: vectorizedImage
      });
    } catch (error) {
      console.error('Error vectorizing image:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Credit purchase endpoint
app.post('/api/stripe',
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    try {
      const { amount, currency = 'usd' } = req.body;

      if (!amount || amount < 1) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: `${amount} Credits`,
                description: `Purchase ${amount} credits for image vectorization`
              },
              unit_amount: 100, // $1 per credit
            },
            quantity: amount,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing`,
        metadata: {
          userId: req.auth.userId,
          credits: amount.toString()
        }
      });

      return res.status(200).json({
        message: 'Checkout session created',
        data: { sessionId: session.id }
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Payment confirmation endpoint
app.post('/api/confirmation',
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      // Verify the session
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: 'Payment not completed' });
      }

      // Add credits to user's account
      const credits = parseInt(session.metadata?.credits || '0');
      const success = await addCredits(
        session.metadata?.userId || '',
        credits,
        'Credit purchase'
      );

      if (!success) {
        return res.status(500).json({ error: 'Failed to add credits' });
      }

      return res.status(200).json({
        message: 'Credits added successfully',
        data: { credits }
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Stripe webhook endpoint
app.post('/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).json({ error: 'No signature' });
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const credits = parseInt(session.metadata?.credits || '0');

          if (userId && credits > 0) {
            await addCredits(userId, credits, 'Credit purchase (webhook)');
          }
          break;
        }
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          // Handle successful payment
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          // Handle failed payment
          break;
        }
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(400).json({ error: 'Webhook error' });
    }
  }
);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const healthStatus = getHealthStatus();
  logInfo('Health check requested', healthStatus);
  res.status(200).json(healthStatus);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  trackError(err, {
    path: req.path,
    method: req.method,
    userId: req.auth?.userId
  });
  res.status(500).json({ error: 'Internal server error' });
});

export default app; 