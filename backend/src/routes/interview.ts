import { Router } from 'express';
import {
  handleStartInterview,
  handleGetInterviewAttempt,
  handleSaveInterviewAnswer,
  handleRecordInterviewIntegrity,
  handleSubmitInterview,
} from '../controllers/interviewController';

const router = Router();

// Launch or resume technical interview attempt
router.post('/start', handleStartInterview);

// Retrieve existing interview attempt by ID
router.get('/attempt/:attemptId', handleGetInterviewAttempt);

// Save individual answer in real-time
router.patch('/attempt/:attemptId/answer', handleSaveInterviewAnswer);

// Log integrity telemetry event
router.post('/attempt/:attemptId/integrity', handleRecordInterviewIntegrity);

// Submit interview responses and compute rubric evaluation
router.post('/attempt/:attemptId/submit', handleSubmitInterview);

export default router;
