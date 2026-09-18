import { api } from './client';

export interface ClientQuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface ClientQuestion {
  id: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  questionText: string;
  codeSnippet?: string;
  questionType: string;
  options: ClientQuestionOption[];
  difficulty: string;
  category: string;
}

export interface StartAssessmentResponse {
  attemptId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  status: 'IN_PROGRESS';
  totalQuestions: number;
  questions: ClientQuestion[];
  savedAnswers: Record<string, string>;
  integritySignalsCount: number;
  startedAt: string;
  isResumed: boolean;
}

export interface QuestionReviewItem {
  id: string;
  questionText: string;
  codeSnippet?: string;
  options: ClientQuestionOption[];
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  category: string;
  difficulty: string;
}

export interface EvaluationResultData {
  attemptId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  status: 'SUBMITTED' | 'EVALUATED';
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  strengths: string[];
  areasNeedingImprovement: string[];
  integrityStatus: 'No Integrity Signals' | 'Integrity Warning' | 'Multiple Integrity Signals' | 'Review Required';
  integritySignalCount: number;
  integrityEvents: Array<{ type: string; timestamp: string; details?: any }>;
  questionsReview: QuestionReviewItem[];
  startedAt: string;
  completedAt: string;
  attemptNumber: number;
}

export interface AttemptResponse {
  attemptId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';
  totalQuestions?: number;
  questions?: ClientQuestion[];
  savedAnswers?: Record<string, string>;
  evaluation?: EvaluationResultData;
  integritySignalsCount: number;
  startedAt: string;
  completedAt?: string;
}

/**
 * Start or resume a Knowledge Check assessment
 */
export async function startKnowledgeCheck(
  domainId: string,
  skillId: string,
  levelId: string | number
): Promise<StartAssessmentResponse> {
  const res = await api.post<{ success: boolean; data: StartAssessmentResponse }>(
    '/api/knowledge-check/start',
    {
      domainId,
      skillId,
      levelId,
    }
  );
  return res.data;
}

/**
 * Retrieve attempt state by ID
 */
export async function getKnowledgeCheckAttempt(attemptId: string): Promise<AttemptResponse> {
  const res = await api.get<{ success: boolean; data: AttemptResponse }>(
    `/api/knowledge-check/attempt/${attemptId}`
  );
  return res.data;
}

/**
 * Save an answer in real-time
 */
export async function saveKnowledgeCheckAnswer(
  attemptId: string,
  questionId: string,
  selectedOption: string,
  integrityEvent?: { type: string; timestamp: string; details?: any }
): Promise<{ success: boolean; savedAnswers: Record<string, string> }> {
  const res = await api.patch<{
    success: boolean;
    data: { success: boolean; savedAnswers: Record<string, string> };
  }>(`/api/knowledge-check/attempt/${attemptId}/answer`, {
    questionId,
    selectedOption,
    integrityEvent,
  });
  return res.data;
}

/**
 * Record a client integrity signal
 */
export async function logIntegritySignal(
  attemptId: string,
  type: string,
  details?: any
): Promise<{ success: boolean; totalSignals: number }> {
  const res = await api.post<{
    success: boolean;
    data: { success: boolean; totalSignals: number };
  }>(`/api/knowledge-check/attempt/${attemptId}/integrity`, {
    type,
    details,
  });
  return res.data;
}

/**
 * Submit assessment for server-side evaluation
 */
export async function submitKnowledgeCheck(
  attemptId: string
): Promise<EvaluationResultData> {
  const res = await api.post<{ success: boolean; data: EvaluationResultData }>(
    `/api/knowledge-check/attempt/${attemptId}/submit`
  );
  return res.data;
}
