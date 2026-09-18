import { api } from './client';

export interface InterviewQuestion {
  id: string;
  questionIndex: number;
  questionText: string;
  contextPrompt: string; // Cites prior evidence (Knowledge Check weakness, project decisions, code)
  focusArea: 'Understanding' | 'Reasoning' | 'Technical Decisions' | 'Trade-offs' | 'Debugging' | 'Edge Cases' | 'Optimization' | 'Consistency' | 'Real-world Application';
  rubricExpectation: string;
}

export interface InterviewRubricScore {
  criterion: string;
  score: number;
  weight: number;
  feedback: string;
}

export interface InterviewEvaluationResult {
  attemptId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  status: 'SUBMITTED' | 'EVALUATED';
  overallScore: number;
  rubricScores: InterviewRubricScore[];
  crossRoundConsistency: {
    status: 'High Alignment' | 'Moderate Alignment' | 'Variance Observed' | 'Inconclusive';
    observations: string[];
  };
  strengths: string[];
  areasNeedingImprovement: string[];
  integrityStatus: 'No Integrity Signals' | 'Warning' | 'Multiple Integrity Signals' | 'Review Required';
  integritySignalCount: number;
  transcriptReview: Array<{
    questionId: string;
    questionText: string;
    focusArea: string;
    contextCitation: string;
    candidateResponse: string;
    evaluatedScore: number;
    feedback: string;
  }>;
  auditHash: string;
  submittedAt: string;
  evaluatedAt: string;
}

export interface InterviewAttemptResponse {
  attemptId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';
  questions: InterviewQuestion[];
  savedAnswers: Record<string, string>;
  integritySignalsCount: number;
  startedAt: string;
  isResumed?: boolean;
  evaluationResult?: InterviewEvaluationResult;
}

/**
 * Start or resume a Technical Interview attempt referencing prior evidence
 */
export async function startInterview(
  domainId: string,
  skillId: string,
  levelNumber: number | string,
  priorEvidence?: {
    knowledgeWeakness?: string;
    knowledgeScore?: number;
    projectTitle?: string;
  }
): Promise<InterviewAttemptResponse> {
  const res = await api.post<{ success: boolean; data: InterviewAttemptResponse }>(
    '/api/interview/start',
    {
      domainId,
      skillId,
      levelNumber: Number(levelNumber) || 1,
      priorEvidence,
    }
  );
  return res.data;
}

/**
 * Get technical interview attempt state by ID
 */
export async function getInterviewAttempt(attemptId: string): Promise<InterviewAttemptResponse> {
  const res = await api.get<{ success: boolean; data: InterviewAttemptResponse }>(
    `/api/interview/attempt/${attemptId}`
  );
  return res.data;
}

/**
 * Save candidate response to a question in real time
 */
export async function saveInterviewAnswer(
  attemptId: string,
  questionId: string,
  answerText: string
): Promise<{ success: boolean; data: any }> {
  const res = await api.patch<{ success: boolean; data: any }>(
    `/api/interview/attempt/${attemptId}/answer`,
    {
      questionId,
      answerText,
    }
  );
  return res.data;
}

/**
 * Log interview integrity signal
 */
export async function logInterviewIntegrity(
  attemptId: string,
  type: string,
  details?: any
): Promise<{ success: boolean; data: any }> {
  const res = await api.post<{ success: boolean; data: any }>(
    `/api/interview/attempt/${attemptId}/integrity`,
    { type, details }
  );
  return res.data;
}

/**
 * Submit interview responses for server-side evaluation & consistency scoring
 */
export async function submitInterview(
  attemptId: string,
  answers?: Record<string, string>
): Promise<InterviewEvaluationResult> {
  const res = await api.post<{ success: boolean; data: InterviewEvaluationResult }>(
    `/api/interview/attempt/${attemptId}/submit`,
    { answers }
  );
  return res.data;
}
