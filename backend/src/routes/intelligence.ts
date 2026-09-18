import { Router } from 'express';
import {
  handleAnalyzeEvidence,
  handleGetSkillProof,
  handleGetLatestIntelligence,
} from '../controllers/intelligenceController';
import {
  handleSubmitAppeal,
  handleGetAppeal,
  handleGetAppealByProof,
} from '../controllers/appealController';

const router = Router();

// Analyze multi-round evidence and generate Skill Proof
router.post('/analyze', handleAnalyzeEvidence);

// Retrieve latest intelligence dossier for a skill/level
router.get('/latest', handleGetLatestIntelligence);

// Retrieve a specific Skill Proof credential by ID
router.get('/proof/:proofId', handleGetSkillProof);

// Score Appeal endpoints
router.post('/appeal', handleSubmitAppeal);
router.get('/appeal/:appealId', handleGetAppeal);
router.get('/appeal/proof/:proofId', handleGetAppealByProof);

export default router;
