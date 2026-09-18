import { Request, Response } from 'express';
import {
  submitScoreAppeal,
  getAppealById,
  getAppealByProofId,
} from '../services/appealService';
import { findOrCreateUserByClerkId } from '../services/userService';

async function resolveUser(req: Request): Promise<{ id: string; name: string }> {
  if (req.clerkUserId) {
    try {
      const user = await findOrCreateUserByClerkId(req.clerkUserId);
      if (user?.id) {
        return { id: user.id, name: user.name || 'Candidate' };
      }
    } catch (err) {
      console.warn('[AppealController] Error resolving Clerk user:', err);
    }
  }
  return { id: '00000000-0000-0000-0000-000000000001', name: 'Candidate' };
}

/**
 * POST /api/intelligence/appeal
 * Submit an evaluation score appeal.
 */
export async function handleSubmitAppeal(req: Request, res: Response): Promise<void> {
  try {
    const { originalProofId, reasonCategory, explanation, supportingEvidence } = req.body;

    if (!originalProofId || !reasonCategory || !explanation) {
      res.status(400).json({
        success: false,
        message: 'originalProofId, reasonCategory, and explanation are required to submit an appeal.',
      });
      return;
    }

    const user = await resolveUser(req);
    const appeal = await submitScoreAppeal({
      originalProofId,
      userId: user.id,
      reasonCategory,
      explanation,
      supportingEvidence,
    });

    res.status(200).json({
      success: true,
      message: 'Score appeal processed and re-evaluated successfully.',
      data: appeal,
    });
  } catch (error: any) {
    console.error('[AppealController] handleSubmitAppeal error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit score appeal.',
    });
  }
}

/**
 * GET /api/intelligence/appeal/:appealId
 * Retrieve an appeal by appeal ID.
 */
export async function handleGetAppeal(req: Request, res: Response): Promise<void> {
  try {
    const appealId = req.params.appealId as string;
    const appeal = await getAppealById(appealId);

    if (!appeal) {
      res.status(404).json({
        success: false,
        message: `Score appeal '${appealId}' not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: appeal,
    });
  } catch (error: any) {
    console.error('[AppealController] handleGetAppeal error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve appeal record.',
    });
  }
}

/**
 * GET /api/intelligence/appeal/proof/:proofId
 * Retrieve an appeal by original Skill Proof ID.
 */
export async function handleGetAppealByProof(req: Request, res: Response): Promise<void> {
  try {
    const proofId = req.params.proofId as string;
    const appeal = await getAppealByProofId(proofId);

    res.status(200).json({
      success: true,
      data: appeal,
    });
  } catch (error: any) {
    console.error('[AppealController] handleGetAppealByProof error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check appeal status for credential.',
    });
  }
}
