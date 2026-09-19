import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, getAuth } from '@clerk/express';

import apiRoutes from './routes/index';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/env';
import './types/auth';

dotenv.config();

// Ensure Clerk environment variables are set in process.env
if (!process.env.CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = config.clerkPublishableKey;
}
if (!process.env.CLERK_SECRET_KEY) {
  process.env.CLERK_SECRET_KEY = config.clerkSecretKey;
}

const app = express();

// Allowed origins validator supporting Vercel production, preview deployments, and local dev
const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // Server-to-server, curl, or non-browser requests
  if (
    origin === 'https://re-proof.vercel.app' ||
    origin === 'https://reproof.vercel.app' ||
    origin === 'http://localhost:5173' ||
    origin === 'http://127.0.0.1:5173' ||
    origin === 'http://localhost:5174' ||
    origin === 'http://127.0.0.1:5174' ||
    origin === 'http://localhost:3000' ||
    origin === 'http://localhost:5000' ||
    origin.endsWith('.vercel.app')
  ) {
    return true;
  }
  return false;
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// 1. CORS middleware
app.use(cors(corsOptions));

// 2. Dedicated preflight handler: guarantees OPTIONS is immediately answered with 200 OK
// and echoes the exact allowed origin with credentials header
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    const allowOrigin = origin && isOriginAllowed(origin) ? origin : 'https://re-proof.vercel.app';

    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  next();
});

// 3. Body parser
app.use(express.json());

// 4. Clerk authentication middleware with robust fallback keys
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY || config.clerkPublishableKey,
    secretKey: process.env.CLERK_SECRET_KEY || config.clerkSecretKey,
  })
);

// 5. Populate req.clerkUserId when a valid Clerk session token is presented
app.use((req: Request, _res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);
    if (auth && auth.userId) {
      req.clerkUserId = auth.userId;
    }
  } catch (_e) {
    // Non-fatal if token is not present or invalid
  }
  next();
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ReProof API',
    version: '1.0.0',
  });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export default app;
