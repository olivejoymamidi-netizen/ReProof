import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import {
  startAssessment,
  getAttempt,
  saveAnswer,
  recordIntegritySignal,
  submitAssessment,
} from '../services/knowledgeCheckService';
import { findOrCreateUserByClerkId } from '../services/userService';

/**
 * Helper to resolve a valid user ID from Clerk session or demo fallback
 */
async function resolveUserId(req: Request): Promise<string> {
  let clerkId = req.clerkUserId;
  if (!clerkId) {
    try {
      const auth = getAuth(req);
      if (auth && auth.userId) {
        clerkId = auth.userId;
      }
    } catch (_err) {
      // ignore
    }
  }

  if (clerkId) {
    try {
      const user = await findOrCreateUserByClerkId(clerkId);
      if (user?.id) {
        return user.id;
      }
    } catch (err) {
      console.warn('[KnowledgeCheckController] Error resolving Clerk user:', err);
    }
  }
  return '00000000-0000-0000-0000-000000000001'; // Fallback demo candidate UUID
}

/**
 * POST /api/knowledge-check/start
 * Launches or resumes a calibrated Knowledge Check attempt.
 */
export async function handleStartKnowledgeCheck(req: Request, res: Response): Promise<void> {
  try {
    const { domainId, skillId, levelId } = req.body;

    if (!domainId || !skillId) {
      res.status(400).json({
        success: false,
        message: 'domainId and skillId are required',
      });
      return;
    }

    const userId = await resolveUserId(req);
    const result = await startAssessment({
      userId,
      domainId,
      skillId,
      levelId: levelId || 1,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[KnowledgeCheckController] start error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error launching Knowledge Check',
    });
  }
}

/**
 * GET /api/knowledge-check/attempt/:attemptId
 * Retrieves an existing attempt with questions (answers masked) or evaluation.
 */
export async function handleGetAttempt(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const attempt = await getAttempt(attemptId);

    if (!attempt) {
      res.status(404).json({
        success: false,
        message: 'Assessment attempt not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error: any) {
    console.error('[KnowledgeCheckController] getAttempt error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error retrieving attempt',
    });
  }
}

/**
 * PATCH /api/knowledge-check/attempt/:attemptId/answer
 * Saves a single question answer in real-time.
 */
export async function handleSaveAnswer(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const { questionId, selectedOption, integrityEvent } = req.body;

    if (!questionId || !selectedOption) {
      res.status(400).json({
        success: false,
        message: 'questionId and selectedOption are required',
      });
      return;
    }

    const result = saveAnswer({
      attemptId,
      questionId,
      selectedOption,
      integrityEvent,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[KnowledgeCheckController] saveAnswer error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error saving answer',
    });
  }
}

/**
 * POST /api/knowledge-check/attempt/:attemptId/integrity
 * Logs an integrity telemetry event (tab blur, focus, paste).
 */
export async function handleRecordIntegrity(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const { type, details } = req.body;

    if (!type) {
      res.status(400).json({
        success: false,
        message: 'Integrity signal type is required',
      });
      return;
    }

    const result = recordIntegritySignal({
      attemptId,
      type,
      details,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[KnowledgeCheckController] recordIntegrity error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error recording integrity signal',
    });
  }
}

/**
 * POST /api/knowledge-check/attempt/:attemptId/submit
 * Submits the assessment and calculates official server-side score and feedback.
 */
export async function handleSubmitKnowledgeCheck(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const result = await submitAssessment(attemptId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[KnowledgeCheckController] submit error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error submitting assessment',
    });
  }
}
