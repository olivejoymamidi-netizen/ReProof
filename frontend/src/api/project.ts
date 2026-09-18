import { api } from './client';

export interface ProjectRubricCriterion {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export interface ProjectSpecification {
  id: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  title: string;
  problemStatement: string;
  objective: string;
  requirements: string[];
  constraints: string[];
  expectedFunctionality: string[];
  expectedDeliverables: string[];
  evaluationCriteria?: ProjectRubricCriterion[];
  rubricCriteria?: ProjectRubricCriterion[];
  starterCode: string;
  starterFileName?: string;
  durationMinutes?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ProjectSubmissionPayload {
  sourceCode: string;
  repoUrl?: string;
  architectureNotes?: string;
  executionLogs?: string;
}

export interface ProjectCriterionEvaluation {
  id: string;
  name: string;
  weight: number;
  score: number;
  feedback: string;
}

export interface ProjectEvaluationResult {
  attemptId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  status: 'SUBMITTED' | 'EVALUATED';
  overallScore: number;
  criteriaScores: ProjectCriterionEvaluation[];
  strengths: string[];
  areasNeedingImprovement: string[];
  integrityStatus: 'No Integrity Signals' | 'Warning' | 'Multiple Integrity Signals' | 'Review Required';
  integritySignalCount: number;
  auditHash: string;
  submittedAt: string;
  evaluatedAt: string;
  attemptNumber: number;
}

export interface ProjectAttemptResponse {
  attemptId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';
  projectSpec: ProjectSpecification;
  draftSubmission: ProjectSubmissionPayload;
  integritySignalsCount: number;
  startedAt: string;
  isResumed?: boolean;
  evaluationResult?: ProjectEvaluationResult;
}

/**
 * Start or resume a Project attempt
 */
export async function startProject(
  domainId: string,
  skillId: string,
  levelNumber: number | string
): Promise<ProjectAttemptResponse> {
  const res = await api.post<{ success: boolean; data: ProjectAttemptResponse }>(
    '/api/project/start',
    {
      domainId,
      skillId,
      levelNumber: Number(levelNumber) || 1,
    }
  );
  return res.data;
}

/**
 * Get project attempt state by ID
 */
export async function getProjectAttempt(attemptId: string): Promise<ProjectAttemptResponse> {
  const res = await api.get<{ success: boolean; data: ProjectAttemptResponse }>(
    `/api/project/attempt/${attemptId}`
  );
  return res.data;
}

/**
 * Save project code draft / notes in real time
 */
export async function saveProjectDraft(
  attemptId: string,
  draft: Partial<ProjectSubmissionPayload>
): Promise<{ success: boolean; data: any }> {
  const res = await api.patch<{ success: boolean; data: any }>(
    `/api/project/attempt/${attemptId}/draft`,
    { draft }
  );
  return res.data;
}

/**
 * Log project integrity signal
 */
export async function logProjectIntegrity(
  attemptId: string,
  type: string,
  details?: any
): Promise<{ success: boolean; data: any }> {
  const res = await api.post<{ success: boolean; data: any }>(
    `/api/project/attempt/${attemptId}/integrity`,
    { type, details }
  );
  return res.data;
}

/**
 * Submit project deliverables for evaluation
 */
export async function submitProject(
  attemptId: string,
  submission: ProjectSubmissionPayload
): Promise<ProjectEvaluationResult> {
  const res = await api.post<{ success: boolean; data: ProjectEvaluationResult }>(
    `/api/project/attempt/${attemptId}/submit`,
    { submission }
  );
  return res.data;
}

/**
 * Directly fetch project specification
 */
export async function getProjectSpec(
  domainId: string,
  skillId: string,
  levelNumber: number | string
): Promise<ProjectSpecification> {
  const res = await api.get<{ success: boolean; data: ProjectSpecification }>(
    `/api/project/spec?domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(skillId)}&levelNumber=${encodeURIComponent(levelNumber)}`
  );
  return res.data;
}
