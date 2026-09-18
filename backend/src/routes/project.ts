import { Router } from 'express';
import {
  handleStartProject,
  handleGetProjectAttempt,
  handleSaveProjectDraft,
  handleRecordProjectIntegrity,
  handleSubmitProject,
  handleGetProjectSpec,
} from '../controllers/projectController';

const router = Router();

// Launch or resume a project attempt
router.post('/start', handleStartProject);

// Retrieve project specification
router.get('/spec', handleGetProjectSpec);

// Retrieve existing project attempt by ID
router.get('/attempt/:attemptId', handleGetProjectAttempt);

// Save real-time draft / code buffer
router.patch('/attempt/:attemptId/draft', handleSaveProjectDraft);

// Log integrity telemetry event
router.post('/attempt/:attemptId/integrity', handleRecordProjectIntegrity);

// Submit deliverables and evaluate against rubric
router.post('/attempt/:attemptId/submit', handleSubmitProject);

export default router;
