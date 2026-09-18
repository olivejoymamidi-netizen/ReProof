import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';

import apiRoutes from './routes/index';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// 1. CORS middleware
app.use(cors(corsOptions));

// 2. Dedicated preflight handler: guarantees OPTIONS is immediately answered with 200 OK
// and never blocked or delayed by downstream auth middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    const allowOrigin =
      origin && allowedOrigins.includes(origin)
        ? origin
        : 'http://localhost:5173';

    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  next();
});

// 3. Body parser
app.use(express.json());

// 4. Clerk authentication middleware
app.use(clerkMiddleware());

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
