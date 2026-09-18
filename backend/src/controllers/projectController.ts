import { Request, Response } from 'express';
import {
  startProjectAttempt,
  getProjectAttempt,
  saveProjectDraft,
  recordProjectIntegritySignal,
  submitProject,
} from '../services/projectService';
import { getProjectSpecification } from '../services/projectBank';
import { findOrCreateUserByClerkId } from '../services/userService';

async function resolveUserId(req: Request): Promise<string> {
  if (req.clerkUserId) {
    try {
      const user = await findOrCreateUserByClerkId(req.clerkUserId);
      if (user?.id) {
        return user.id;
      }
    } catch (err) {
      console.warn('[ProjectController] Error resolving Clerk user:', err);
    }
  }
  return '00000000-0000-0000-0000-000000000001';
}

/**
 * POST /api/project/start
 * Launch or resume a project attempt for domain/skill/level
 */
export async function handleStartProject(req: Request, res: Response): Promise<void> {
  try {
    const { domainId, skillId, levelNumber, levelId } = req.body;
    const level = Number(levelNumber || levelId || 1);

    if (!domainId || !skillId) {
      res.status(400).json({
        success: false,
        message: 'domainId and skillId are required',
      });
      return;
    }

    const userId = await resolveUserId(req);
    const attempt = await startProjectAttempt({
      userId,
      domainId,
      skillId,
      levelId: level,
    });

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error: any) {
    console.error('[ProjectController] startProject error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error starting project',
    });
  }
}

/**
 * GET /api/project/attempt/:attemptId
 * Retrieve current project attempt and draft submission
 */
export async function handleGetProjectAttempt(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const attempt = await getProjectAttempt(attemptId);

    if (!attempt) {
      res.status(404).json({
        success: false,
        message: 'Project attempt not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error: any) {
    console.error('[ProjectController] getProjectAttempt error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error retrieving project attempt',
    });
  }
}

/**
 * PATCH /api/project/attempt/:attemptId/draft
 * Save progress / code draft in real time
 */
export async function handleSaveProjectDraft(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const { draft } = req.body;

    if (!draft) {
      res.status(400).json({
        success: false,
        message: 'draft payload is required',
      });
      return;
    }

    const updated = saveProjectDraft({
      attemptId,
      payload: draft,
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('[ProjectController] saveProjectDraft error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error saving project draft',
    });
  }
}

/**
 * POST /api/project/attempt/:attemptId/integrity
 * Log paste / tab switch / devtools telemetry
 */
export async function handleRecordProjectIntegrity(req: Request, res: Response): Promise<void> {
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

    const updated = recordProjectIntegritySignal({
      attemptId,
      type,
      details,
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('[ProjectController] recordIntegrity error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error recording project integrity signal',
    });
  }
}

/**
 * POST /api/project/attempt/:attemptId/submit
 * Evaluate submitted project deliverables against rubric
 */
export async function handleSubmitProject(req: Request, res: Response): Promise<void> {
  try {
    const attemptId = String(req.params.attemptId);
    const { submission } = req.body;

    if (!submission || typeof submission.sourceCode !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Project submission with sourceCode is required',
      });
      return;
    }

    const result = await submitProject({
      attemptId,
      submission,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[ProjectController] submitProject error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error evaluating project submission',
    });
  }
}

/**
 * GET /api/project/spec
 * Direct query for project specification
 */
export async function handleGetProjectSpec(req: Request, res: Response): Promise<void> {
  try {
    const domainId = String(req.query.domainId || '');
    const skillId = String(req.query.skillId || '');
    const levelNumber = Number(req.query.levelNumber || req.query.levelId || 1);

    if (!domainId || !skillId) {
      res.status(400).json({
        success: false,
        message: 'domainId and skillId query parameters are required',
      });
      return;
    }

    const spec = getProjectSpecification(domainId, skillId, levelNumber);
    res.status(200).json({
      success: true,
      data: spec,
    });
  } catch (error: any) {
    console.error('[ProjectController] getProjectSpec error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving project specification',
    });
  }
}
