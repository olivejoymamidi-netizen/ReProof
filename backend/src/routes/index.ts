import { Router, Request, Response } from 'express';
import authRoutes from './auth';
import curriculumRoutes from './curriculum';
import knowledgeCheckRoutes from './knowledgeCheck';
import projectRoutes from './project';
import interviewRoutes from './interview';
import intelligenceRoutes from './intelligence';

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

// Curriculum hierarchy routes (/api/curriculum)
router.use('/curriculum', curriculumRoutes);

// Knowledge Check routes (/api/knowledge-check)
router.use('/knowledge-check', knowledgeCheckRoutes);

// Project Round routes (/api/project)
router.use('/project', projectRoutes);

// Technical Interview routes (/api/interview)
router.use('/interview', interviewRoutes);

// ReProof Intelligence Layer routes (/api/intelligence)
router.use('/intelligence', intelligenceRoutes);

export default router;

