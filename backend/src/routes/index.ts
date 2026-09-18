import { Router, Request, Response } from 'express';
import authRoutes from './auth';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ReProof backend is running',
  });
});

// Authentication routes (/api/auth)
router.use('/auth', authRoutes);

export default router;
