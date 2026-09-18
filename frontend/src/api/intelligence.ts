import { api } from './client';

export interface CompetencyRoundStatus {
  round: 'Knowledge' | 'Approach' | 'Coding' | 'Project' | 'Interview';
  status: 'Demonstrated' | 'Developing' | 'Insufficient Evidence';
  score: number;
  evidenceSnippet?: string;
}

export interface CompetencyMatrixRow {
  competencyId: string;
  competencyName: string;
  description: string;
  category: string;
  expectedLevelDescription: string;
  overallStatus: 'Demonstrated' | 'Developing' | 'Insufficient Evidence';
  roundStatuses: Record<'Knowledge' | 'Approach' | 'Coding' | 'Project' | 'Interview', CompetencyRoundStatus>;
  demonstratedWeight: number;
}

export interface DemonstratedStrength {
  competencyName: string;
  category: string;
  evidenceSource: string;
  evidenceCitation: string;
  explanation: string;
}

export interface SkillGapItem {
  competencyName: string;
  expectedCompetency: string;
  observedBehavior: string;
  gapDefinition: string;
  severity: 'low' | 'medium' | 'high';
  evidenceReferences: string[];
  suggestedImprovement: string;
}

export interface PersonalizedRecommendation {
  id: string;
  skillGap: string;
  whyItMatters: string;
  whatToLearn: string;
  suggestedActivity: string;
  suggestedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  verificationTarget: string;
  reassessmentModule: string;
}

export interface SkillProofCredential {
  proofId: string;
  userId: string;
  userName: string;
  domainId: string;
  domainName: string;
  skillId: string;
  skillName: string;
  assessedLevel: number;
  currentCompetencyStage: 'FOUNDATION' | 'DEVELOPING' | 'APPLIED' | 'ADVANCED';
  overallScore: number;
  demonstratedCompetencies: string[];
  developingCompetencies: string[];
  unverifiedCompetencies: string[];
  skillGaps: SkillGapItem[];
  strengths: DemonstratedStrength[];
  recommendations: PersonalizedRecommendation[];
  competencyMatrix: CompetencyMatrixRow[];
  evidenceDossier: {
    knowledge: { score: number; questionsAnswered: number; status: string };
    approach: { strategyRecorded: boolean; complexityProjected: string; status: string };
    coding: { testsPassedPct: number; codeDeltaLines: number; status: string };
    project: { title: string; score: number; auditHash: string; status: string };
    interview: { score: number; consistencyStatus: string; status: string };
  };
  integrityProfile: {
    status: 'No Integrity Signals' | 'Warning' | 'Multiple Integrity Signals' | 'Review Required';
    totalSignals: number;
    observations: string[];
  };
  aiInterpretation: {
    engine: string;
    model: string;
    evidenceAnchored: boolean;
    analyticalRemarks: string[];
  };
  verificationStatus: 'Verified' | 'Developing' | 'Insufficient Evidence';
  auditHash: string;
  evaluationVersion: string;
  rubricVersion: string;
  scoringVersion: string;
  evaluatedAt: string;
}

/**
 * Request multi-round intelligence analysis synthesizing Knowledge, Approach, Coding, Project, and Interview.
 */
export async function analyzeMultiRoundEvidence(payload: {
  domainId: string;
  domainName?: string;
  skillId: string;
  skillName?: string;
  levelNumber: number | string;
  evidencePayload?: any;
}): Promise<SkillProofCredential> {
  const res = await api.post<{ success: boolean; data: SkillProofCredential }>(
    '/api/intelligence/analyze',
    {
      ...payload,
      levelNumber: Number(payload.levelNumber) || 1,
    }
  );
  return res.data;
}

/**
 * Retrieve a finalized Skill Proof credential by unique ID.
 */
export async function getSkillProof(proofId: string): Promise<SkillProofCredential> {
  const res = await api.get<{ success: boolean; data: SkillProofCredential }>(
    `/api/intelligence/proof/${encodeURIComponent(proofId)}`
  );
  return res.data;
}

/**
 * Retrieve the latest evaluated intelligence dossier.
 */
export async function getLatestIntelligence(
  skillId: string,
  levelNumber: number | string
): Promise<SkillProofCredential> {
  const res = await api.get<{ success: boolean; data: SkillProofCredential }>(
    `/api/intelligence/latest?skillId=${encodeURIComponent(skillId)}&levelNumber=${encodeURIComponent(levelNumber)}`
  );
  return res.data;
}

export interface ScoreAppeal {
  appealId: string;
  originalProofId: string;
  userId: string;
  skillId: string;
  levelNumber: number;
  reasonCategory: string;
  explanation: string;
  supportingEvidence?: string;
  status: 'RESOLVED' | 'UNDER_REVIEW';
  originalEvaluation: SkillProofCredential;
  secondEvaluation: SkillProofCredential;
  scoreDelta: number;
  explanationOfChange: string;
  createdAt: string;
  resolvedAt: string;
  evaluationVersionOriginal: string;
  evaluationVersionAppeal: string;
}

/**
 * Submit an evaluation score appeal.
 */
export async function submitScoreAppeal(payload: {
  originalProofId: string;
  reasonCategory: string;
  explanation: string;
  supportingEvidence?: string;
}): Promise<ScoreAppeal> {
  const res = await api.post<{ success: boolean; data: ScoreAppeal }>(
    '/api/intelligence/appeal',
    payload
  );
  return res.data;
}

/**
 * Retrieve a score appeal by appeal ID.
 */
export async function getAppealById(appealId: string): Promise<ScoreAppeal> {
  const res = await api.get<{ success: boolean; data: ScoreAppeal }>(
    `/api/intelligence/appeal/${encodeURIComponent(appealId)}`
  );
  return res.data;
}

/**
 * Check if a score appeal already exists for a Skill Proof ID.
 */
export async function getAppealByProofId(proofId: string): Promise<ScoreAppeal | null> {
  try {
    const res = await api.get<{ success: boolean; data: ScoreAppeal | null }>(
      `/api/intelligence/appeal/proof/${encodeURIComponent(proofId)}`
    );
    return res.data;
  } catch {
    return null;
  }
}

