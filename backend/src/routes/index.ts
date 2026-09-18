import { Router, Request, Response } from 'express';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ReProof backend is running',
  });
});

export default router;
