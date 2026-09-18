/**
 * Centralized ReProof Authoritative Scoring Service
 * Single source of truth for round score validation, weight normalization,
 * competency status determination, and safe audit logging.
 */

export interface RoundEvidenceInput {
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
  score?: number; // 0 - 100
  details?: any;
}

export interface MultiRoundEvidenceSet {
  knowledge: RoundEvidenceInput;
  approach: RoundEvidenceInput;
  coding: RoundEvidenceInput;
  project: RoundEvidenceInput;
  interview: RoundEvidenceInput;
}

export interface RoundScoringSummary {
  roundName: 'Knowledge' | 'Approach' | 'Coding' | 'Project' | 'Interview';
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
  rawScore: number | null;
  assignedWeight: number; // 0 if NOT_AVAILABLE
  standardWeight: number; // 15, 20, 25, 25, 15
  weightedScore: number;
}

export interface CentralizedScoringResult {
  overallScore: number; // 0 - 100
  rounds: Record<'knowledge' | 'approach' | 'coding' | 'project' | 'interview', RoundScoringSummary>;
  totalAvailableWeight: number;
  availableRoundCount: number;
  formulaDescription: string;
  hasSufficientEvidence: boolean;
}

// Standard predefined weights as specified by ReProof specification
export const STANDARD_WEIGHTS = {
  knowledge: 15,
  approach: 20,
  coding: 25,
  project: 25,
  interview: 15,
} as const;

/**
 * Calculate the centralized, authoritative final score across all rounds.
 * Strictly implements weight normalization over AVAILABLE rounds only.
 * Rounds marked NOT_AVAILABLE are completely excluded from scoring.
 */
export function calculateAuthoritativeScore(evidence: MultiRoundEvidenceSet): CentralizedScoringResult {
  const roundKeys: Array<'knowledge' | 'approach' | 'coding' | 'project' | 'interview'> = [
    'knowledge',
    'approach',
    'coding',
    'project',
    'interview',
  ];

  const roundNameMap: Record<'knowledge' | 'approach' | 'coding' | 'project' | 'interview', 'Knowledge' | 'Approach' | 'Coding' | 'Project' | 'Interview'> = {
    knowledge: 'Knowledge',
    approach: 'Approach',
    coding: 'Coding',
    project: 'Project',
    interview: 'Interview',
  };

  let totalAvailableWeight = 0;
  let weightedSum = 0;
  let availableRoundCount = 0;

  const roundsSummary: Record<string, RoundScoringSummary> = {};

  for (const key of roundKeys) {
    const roundInput = evidence[key];
    const stdWeight = STANDARD_WEIGHTS[key];
    const isAvailable = roundInput && roundInput.status === 'AVAILABLE' && typeof roundInput.score === 'number' && !isNaN(roundInput.score);

    if (isAvailable) {
      const clampedScore = Math.min(100, Math.max(0, Math.round(roundInput.score!)));
      totalAvailableWeight += stdWeight;
      weightedSum += clampedScore * stdWeight;
      availableRoundCount++;

      roundsSummary[key] = {
        roundName: roundNameMap[key],
        status: 'AVAILABLE',
        rawScore: clampedScore,
        assignedWeight: stdWeight,
        standardWeight: stdWeight,
        weightedScore: clampedScore * stdWeight,
      };
    } else {
      roundsSummary[key] = {
        roundName: roundNameMap[key],
        status: 'NOT_AVAILABLE',
        rawScore: null,
        assignedWeight: 0,
        standardWeight: stdWeight,
        weightedScore: 0,
      };
    }
  }

  let overallScore = 0;
  let formulaDescription = 'No available evidence rounds submitted. Final score cannot be determined.';

  if (totalAvailableWeight > 0) {
    overallScore = Math.round(weightedSum / totalAvailableWeight);
    const availableTerms = roundKeys
      .filter((k) => roundsSummary[k].status === 'AVAILABLE')
      .map((k) => `(${roundsSummary[k].rawScore} × ${roundsSummary[k].assignedWeight}%)`)
      .join(' + ');
    formulaDescription = `(${availableTerms}) / ${totalAvailableWeight}% = ${overallScore}/100`;
  }

  return {
    overallScore,
    rounds: roundsSummary as any,
    totalAvailableWeight,
    availableRoundCount,
    formulaDescription,
    hasSufficientEvidence: availableRoundCount > 0,
  };
}

/**
 * Determine deterministic competency status based on actual empirical evidence.
 */
export function evaluateCompetencyStatus(params: {
  averageCompScore: number;
  availableRoundsCount: number;
  requiredRoundsCount: number;
}): 'Demonstrated' | 'Developing' | 'Insufficient Evidence' {
  const { averageCompScore, availableRoundsCount } = params;

  if (availableRoundsCount === 0) {
    return 'Insufficient Evidence';
  }

  if (averageCompScore >= 70) {
    return 'Demonstrated';
  } else if (averageCompScore >= 40) {
    return 'Developing';
  } else {
    return 'Insufficient Evidence';
  }
}

/**
 * Determine the official competency stage deterministically.
 */
export function calculateCompetencyStage(
  score: number,
  demonstratedCount: number,
  totalCompetencies: number
): 'FOUNDATION' | 'DEVELOPING' | 'APPLIED' | 'ADVANCED' {
  const demonstratedRatio = demonstratedCount / (totalCompetencies || 1);

  if (score >= 85 && demonstratedRatio >= 0.75) {
    return 'ADVANCED';
  } else if (score >= 70 && demonstratedRatio >= 0.5) {
    return 'APPLIED';
  } else if (score >= 45 || demonstratedRatio >= 0.25) {
    return 'DEVELOPING';
  }
  return 'FOUNDATION';
}

/**
 * Distinguish assessed level from demonstrated competency.
 */
export function calculateDemonstratedLevel(
  assessedLevel: number,
  overallScore: number,
  demonstratedCount: number,
  totalCompetencies: number
): {
  assessedLevel: number;
  demonstratedLevelTitle: string;
  demonstratedLevelNumber: number;
  summary: string;
} {
  const ratio = demonstratedCount / (totalCompetencies || 1);

  if (overallScore >= 80 && ratio >= 0.75) {
    return {
      assessedLevel,
      demonstratedLevelTitle: `Level 0${assessedLevel} Verified Competency`,
      demonstratedLevelNumber: assessedLevel,
      summary: `Confirmed complete mastery of Level 0${assessedLevel} benchmarks across empirical criteria.`,
    };
  } else if (overallScore >= 60 && ratio >= 0.4) {
    const priorLevel = Math.max(1, assessedLevel - 1);
    return {
      assessedLevel,
      demonstratedLevelTitle: assessedLevel > 1 ? `Level 0${priorLevel} Competency (Advancing to Level 0${assessedLevel})` : `Level 01 Developing`,
      demonstratedLevelNumber: assessedLevel > 1 ? priorLevel : 1,
      summary: `Solid foundational capabilities demonstrated; actively developing Level 0${assessedLevel} specialized competencies.`,
    };
  } else {
    return {
      assessedLevel,
      demonstratedLevelTitle: 'Foundational / Developing Baseline',
      demonstratedLevelNumber: 0,
      summary: `Current evidence demonstrates emerging baseline aptitude; targeted skill progression recommended before Level 0${assessedLevel} accreditation.`,
    };
  }
}

/**
 * Safe structured logging for evaluation events.
 * Strictly prevents logging of keys, secrets, or sensitive tokens.
 */
export function logSafeEvaluationAudit(params: {
  assessmentId: string;
  skillId: string;
  levelNumber: number;
  availableRounds: Record<string, string>;
  roundScores: Record<string, number | null>;
  geminiRequestStatus: string;
  geminiResponseStatus: string;
  finalScore: number;
  evaluationVersion: string;
}): void {
  console.log('[ReProof Evaluation Audit Ledger]', JSON.stringify({
    timestamp: new Date().toISOString(),
    assessmentId: params.assessmentId,
    skill: params.skillId,
    level: params.levelNumber,
    availableRounds: params.availableRounds,
    roundScores: params.roundScores,
    geminiStatus: {
      request: params.geminiRequestStatus,
      response: params.geminiResponseStatus,
    },
    finalScore: params.finalScore,
    version: params.evaluationVersion,
  }));
}
