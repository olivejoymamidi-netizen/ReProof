import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getMe } from '../controllers/authController';

const router = Router();

// GET /api/auth/me — Protected test endpoint
router.get('/me', requireAuth, getMe);

export default router;
