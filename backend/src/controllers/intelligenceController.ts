import { Request, Response } from 'express';
import {
  analyzeMultiRoundEvidence,
  getSkillProofById,
  getLatestSkillProof,
} from '../services/intelligenceService';
import { findOrCreateUserByClerkId } from '../services/userService';

async function resolveUser(req: Request): Promise<{ id: string; name: string }> {
  if (req.clerkUserId) {
    try {
      const user = await findOrCreateUserByClerkId(req.clerkUserId);
      if (user?.id) {
        return { id: user.id, name: user.name || 'Candidate' };
      }
    } catch (err) {
      console.warn('[IntelligenceController] Error resolving Clerk user:', err);
    }
  }
  return { id: '00000000-0000-0000-0000-000000000001', name: 'Candidate' };
}

/**
 * POST /api/intelligence/analyze
 * Synthesizes multi-round evidence, computes deterministic competency matrix, and generates Skill Proof.
 */
export async function handleAnalyzeEvidence(req: Request, res: Response): Promise<void> {
  try {
    const { domainId, domainName, skillId, skillName, levelNumber, levelId, evidencePayload } = req.body;
    const level = Number(levelNumber || levelId || 1);

    if (!domainId || !skillId) {
      res.status(400).json({
        success: false,
        message: 'domainId and skillId are required for ReProof Intelligence analysis',
      });
      return;
    }

    const user = await resolveUser(req);
    const proof = await analyzeMultiRoundEvidence({
      userId: user.id,
      userName: user.name,
      domainId,
      domainName,
      skillId,
      skillName,
      levelNumber: level,
      evidencePayload,
    });

    res.status(200).json({
      success: true,
      data: proof,
    });
  } catch (error: any) {
    console.error('[IntelligenceController] handleAnalyzeEvidence error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error processing ReProof Intelligence analysis',
    });
  }
}

/**
 * GET /api/intelligence/proof/:proofId
 * Retrieve an accredited Skill Proof credential by unique ID.
 */
export async function handleGetSkillProof(req: Request, res: Response): Promise<void> {
  try {
    const proofId = String(req.params.proofId);
    const proof = await getSkillProofById(proofId);

    if (!proof) {
      res.status(404).json({
        success: false,
        message: 'Skill Proof credential not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: proof,
    });
  } catch (error: any) {
    console.error('[IntelligenceController] handleGetSkillProof error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error retrieving Skill Proof',
    });
  }
}

/**
 * GET /api/intelligence/latest
 * Retrieve the latest evaluated Skill Proof for the candidate.
 */
export async function handleGetLatestIntelligence(req: Request, res: Response): Promise<void> {
  try {
    const skillId = String(req.query.skillId || '');
    const levelNumber = Number(req.query.levelNumber || req.query.levelId || 1);

    if (!skillId) {
      res.status(400).json({
        success: false,
        message: 'skillId query parameter is required',
      });
      return;
    }

    const user = await resolveUser(req);
    const proof = await getLatestSkillProof(user.id, skillId, levelNumber);

    if (!proof) {
      res.status(404).json({
        success: false,
        message: 'No intelligence dossier found for this skill and level',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: proof,
    });
  } catch (error: any) {
    console.error('[IntelligenceController] handleGetLatestIntelligence error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error retrieving latest intelligence',
    });
  }
}
