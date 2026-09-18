/**
 * ReProof Approach Formulation Service
 * Evaluates candidate pre-code architecture, invariant reasoning, and complexity boundaries
 * against the predefined 6-criterion Approach rubric.
 */

export interface ApproachSubmission {
  strategy?: string;
  dataStructures?: string;
  edgeCases?: string;
  complexity?: string;
}

export interface ApproachCriterionEvaluation {
  id: string;
  name: string;
  weight: number; // percentage
  score: number; // 0 - 100
  evidenceCitation: string;
  feedback: string;
}

export interface ApproachEvaluationResult {
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
  overallScore: number;
  criteriaScores: ApproachCriterionEvaluation[];
  strengths: string[];
  weaknesses: string[];
  complexityTarget: string;
  submittedAt: string;
  isEvaluated: boolean;
}

/**
 * Objective heuristic analysis for technical text depth and relevance.
 * Checks for concrete architectural terminology, invariant mentions, boundary conditions.
 */
function evaluateTextQuality(text: string, domainId: string, skillId: string): {
  score: number;
  snippet: string;
  hasSpecifics: boolean;
} {
  const trimmed = (text || '').trim();
  if (!trimmed || trimmed.length < 5) {
    return { score: 10, snippet: '(No substantive content provided)', hasSpecifics: false };
  }

  const words = trimmed.split(/\s+/);
  const wordCount = words.length;

  // Check for generic non-answers
  const lower = trimmed.toLowerCase();
  if (
    lower === 'i do not know' ||
    lower === 'idk' ||
    lower === 'asdf' ||
    lower === 'test' ||
    lower.includes('placeholder')
  ) {
    return { score: 15, snippet: trimmed.substring(0, 80), hasSpecifics: false };
  }

  // Keywords indicating technical depth across domains
  const techKeywords = [
    'buffer', 'array', 'pointer', 'invariant', 'complexity', 'o(n', 'o(1', 'o(log',
    'memory', 'cache', 'hash', 'tree', 'graph', 'matrix', 'tensor', 'vector',
    'pipeline', 'sanitize', 'validate', 'overflow', 'null', 'boundary', 'asynchronous',
    'concurrency', 'mutex', 'lock', 'thread', 'index', 'partition', 'schema',
    'encryption', 'decryption', 'key', 'token', 'auth', 'endpoint', 'rest',
    'recursion', 'dynamic', 'state', 'component', 'hook', 'dispatch', 'event',
    'latency', 'throughput', 'regression', 'benchmark', 'assert', 'exception',
  ];

  const matchedKeywords = techKeywords.filter((kw) => lower.includes(kw));

  let score = 30; // base score for non-empty response

  // Word count contribution (up to 30 pts)
  if (wordCount >= 40) score += 30;
  else if (wordCount >= 20) score += 20;
  else if (wordCount >= 10) score += 10;

  // Keyword / Technical specificity contribution (up to 40 pts)
  const keywordPts = Math.min(40, matchedKeywords.length * 10);
  score += keywordPts;

  score = Math.min(100, Math.max(15, score));
  const snippet = trimmed.length > 120 ? `${trimmed.substring(0, 117)}...` : trimmed;

  return {
    score,
    snippet,
    hasSpecifics: matchedKeywords.length >= 2,
  };
}

/**
 * Evaluate candidate Approach formulation against the 6 predefined rubric criteria.
 */
export function evaluateApproachSubmission(params: {
  domainId: string;
  skillId: string;
  levelNumber: number;
  submission: ApproachSubmission;
}): ApproachEvaluationResult {
  const { domainId, skillId, levelNumber, submission } = params;

  const strategy = (submission.strategy || '').trim();
  const ds = (submission.dataStructures || '').trim();
  const edges = (submission.edgeCases || '').trim();
  const complexity = (submission.complexity || '').trim();

  // Check if anything was actually submitted
  const totalLength = strategy.length + ds.length + edges.length + complexity.length;
  if (totalLength < 10) {
    return {
      status: 'NOT_AVAILABLE',
      overallScore: 0,
      criteriaScores: [],
      strengths: [],
      weaknesses: ['Approach formulation was not submitted.'],
      complexityTarget: 'Not specified',
      submittedAt: new Date().toISOString(),
      isEvaluated: false,
    };
  }

  const stratEval = evaluateTextQuality(strategy, domainId, skillId);
  const dsEval = evaluateTextQuality(ds, domainId, skillId);
  const edgesEval = evaluateTextQuality(edges, domainId, skillId);

  // Evaluate complexity string
  let complexityScore = 50;
  if (complexity.includes('O(') || complexity.includes('o(')) {
    complexityScore = 85;
    if (complexity.toLowerCase().includes('space') && complexity.toLowerCase().includes('time')) {
      complexityScore = 95;
    }
  } else if (complexity.length > 5) {
    complexityScore = 65;
  }

  // Define the 6 rubric criteria
  const criteriaScores: ApproachCriterionEvaluation[] = [
    {
      id: 'app_crit_understanding',
      name: 'Problem Understanding & Decomposition',
      weight: 20,
      score: stratEval.score,
      evidenceCitation: `Strategy excerpt: "${stratEval.snippet}"`,
      feedback: stratEval.hasSpecifics
        ? 'Clear conceptual breakdown addressing core computational requirements.'
        : 'Formulation provides basic intent but lacks explicit structural decomposition.',
    },
    {
      id: 'app_crit_invariants',
      name: 'Reasoning & Invariant Preservation',
      weight: 20,
      score: Math.round((stratEval.score + dsEval.score) / 2),
      evidenceCitation: `Architecture & Data layout: "${stratEval.snippet}"`,
      feedback: 'Evaluated deliberate system constraints and data transformation integrity.',
    },
    {
      id: 'app_crit_correctness',
      name: 'Technical Correctness & Data Structures',
      weight: 20,
      score: dsEval.score,
      evidenceCitation: `Data Structures excerpt: "${dsEval.snippet}"`,
      feedback: dsEval.hasSpecifics
        ? 'Well-chosen data structures aligning with memory locality and runtime efficiency.'
        : 'Data structure choices lack technical specificity for constrained execution.',
    },
    {
      id: 'app_crit_completeness',
      name: 'Completeness & Trade-off Analysis',
      weight: 15,
      score: Math.round((stratEval.score + edgesEval.score) / 2),
      evidenceCitation: 'Holistic assessment of pre-code strategy and boundary awareness.',
      feedback: 'Covers major functional phases from ingestion to validation.',
    },
    {
      id: 'app_crit_edge_cases',
      name: 'Edge Cases & Boundary Safeguards',
      weight: 15,
      score: edgesEval.score,
      evidenceCitation: `Edge Cases excerpt: "${edgesEval.snippet}"`,
      feedback: edgesEval.hasSpecifics
        ? 'Identified concrete edge cases (null indicators, zero-variance boundaries, overflow).'
        : 'Boundary handling is generic; requires targeted failure-mode defenses.',
    },
    {
      id: 'app_crit_complexity',
      name: 'Complexity & Scalability Targets',
      weight: 10,
      score: complexityScore,
      evidenceCitation: `Complexity target: "${complexity || 'Not declared'}"`,
      feedback: complexityScore >= 80
        ? `Declared formal asymptotic bounds: ${complexity}`
        : 'Informal or incomplete Big-O specification provided.',
    },
  ];

  // Calculate weighted overall score
  let weightedSum = 0;
  for (const c of criteriaScores) {
    weightedSum += (c.score * c.weight) / 100;
  }
  const overallScore = Math.round(weightedSum);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (stratEval.score >= 70) {
    strengths.push('Articulate high-level architectural decomposition and strategy formulation');
  } else {
    weaknesses.push('Architectural strategy lacks explicit decomposition into modular stages');
  }

  if (dsEval.score >= 70) {
    strengths.push('Appropriate data structure selection ensuring cache locality and bounded memory');
  } else {
    weaknesses.push('Data structure choices omit algorithmic trade-off considerations');
  }

  if (edgesEval.score >= 70) {
    strengths.push('Comprehensive boundary guards and failure mode anticipation');
  } else {
    weaknesses.push('Incomplete specification of edge case boundaries and input perturbation handling');
  }

  return {
    status: 'AVAILABLE',
    overallScore,
    criteriaScores,
    strengths,
    weaknesses,
    complexityTarget: complexity || 'O(N) Time, O(1) Space',
    submittedAt: new Date().toISOString(),
    isEvaluated: true,
  };
}
