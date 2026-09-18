import { Request, Response } from 'express';
import {
  startInterviewAttempt,
  getInterviewAttempt,
  saveInterviewAnswer,
  recordInterviewIntegritySignal,
  submitInterview,
} from '../services/interviewService';
import { findOrCreateUserByClerkId } from '../services/userService';

async function resolveUserId(req: Request): Promise<string> {
  if (req.clerkUserId) {
    try {
      const user = await findOrCreateUserByClerkId(req.clerkUserId);
      if (user?.id) {
        return user.id;
      }
    } catch (err) {
      console.warn('[InterviewController] Error resolving Clerk user:', err);
    }
  }
  return '00000000-0000-0000-0000-000000000001';
}

/**
 * POST /api/interview/start
 * Initiate or resume a Technical Interview session referencing cross-round evidence
 */
export async function handleStartInterview(req: Request, res: Response): Promise<void> {
  try {
    const { domainId, skillId, levelNumber, levelId, priorEvidence } = req.body;
    const level = Number(levelNumber || levelId || 1);

    if (!domainId || !skillId) {
      res.status(400).json({
        success: false,
        message: 'domainId and skillId are required',
      });
      return;
    }

    const userId = await resolveUserId(req);
    const attempt = await startInterviewAttempt({
      userId,
      domainId,
      skillId,
      levelId: level,
      priorEvidence,
    });

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error: any) {
    console.error('[InterviewController] startInterview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error starting Technical Interview',
    });
  }
}

/**
 * GET /api/interview/attempt/:attemptId
 * Retrieve Technical Interview attempt and active question prompts
 */
export async function handleGetInterviewAttempt(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const attempt = await getInterviewAttempt(attemptId);

    if (!attempt) {
      res.status(404).json({
        success: false,
        message: 'Interview attempt not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error: any) {
    console.error('[InterviewController] getInterviewAttempt error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error retrieving interview attempt',
    });
  }
}

/**
 * PATCH /api/interview/attempt/:attemptId/answer
 * Save answer to a specific interview question in progress
 */
export async function handleSaveInterviewAnswer(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const { questionId, answerText } = req.body;

    if (!questionId || typeof answerText !== 'string') {
      res.status(400).json({
        success: false,
        message: 'questionId and answerText are required',
      });
      return;
    }

    const updated = saveInterviewAnswer({
      attemptId,
      questionId,
      response: answerText,
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('[InterviewController] saveInterviewAnswer error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error saving interview answer',
    });
  }
}

/**
 * POST /api/interview/attempt/:attemptId/integrity
 * Log paste or focus telemetry during interview
 */
export async function handleRecordInterviewIntegrity(req: Request, res: Response): Promise<void> {
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

    const updated = recordInterviewIntegritySignal({
      attemptId,
      type,
      details,
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('[InterviewController] recordInterviewIntegrity error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error recording interview integrity signal',
    });
  }
}

/**
 * POST /api/interview/attempt/:attemptId/submit
 * Submit and evaluate candidate interview responses against rubric & cross-round consistency
 */
export async function handleSubmitInterview(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const { answers } = req.body;

    const result = await submitInterview({
      attemptId,
      answers,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[InterviewController] submitInterview error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error evaluating interview responses',
    });
  }
}
