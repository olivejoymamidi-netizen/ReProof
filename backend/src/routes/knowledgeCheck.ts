import { Router } from 'express';
import {
  handleStartKnowledgeCheck,
  handleGetAttempt,
  handleSaveAnswer,
  handleRecordIntegrity,
  handleSubmitKnowledgeCheck,
} from '../controllers/knowledgeCheckController';

const router = Router();

// Launch or resume an assessment attempt
router.post('/start', handleStartKnowledgeCheck);

// Retrieve existing attempt by ID
router.get('/attempt/:attemptId', handleGetAttempt);

// Save individual question answer in real-time
router.patch('/attempt/:attemptId/answer', handleSaveAnswer);

// Log lightweight integrity signal
router.post('/attempt/:attemptId/integrity', handleRecordIntegrity);

// Submit and compute server-side evaluation
router.post('/attempt/:attemptId/submit', handleSubmitKnowledgeCheck);

export default router;
