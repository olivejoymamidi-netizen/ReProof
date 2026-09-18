import { supabase } from '../config/supabase';
import {
  KnowledgeQuestion,
  getQuestionsForConfig,
  getAllQuestions,
} from './knowledgeQuestionBank';

export interface IntegrityEvent {
  type: 'visibility_change' | 'window_blur' | 'repeated_paste' | 'window_focus' | string;
  timestamp: string;
  details?: any;
}

export interface ClientQuestion {
  id: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  questionText: string;
  codeSnippet?: string;
  questionType: string;
  options: Array<{ id: string; text: string }>;
  difficulty: string;
  category: string;
}

export interface QuestionReviewItem {
  id: string;
  questionText: string;
  codeSnippet?: string;
  options: Array<{ id: string; text: string }>;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  category: string;
  difficulty: string;
}

export interface KnowledgeEvaluationResult {
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
  integrityEvents: IntegrityEvent[];
  questionsReview: QuestionReviewItem[];
  startedAt: string;
  completedAt: string;
  attemptNumber: number;
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';
  questions: KnowledgeQuestion[];
  answers: Record<string, string>; // questionId -> selectedOption ('A'|'B'|'C'|'D')
  integritySignals: IntegrityEvent[];
  startedAt: string;
  submittedAt?: string;
  completedAt?: string;
  evaluationResult?: KnowledgeEvaluationResult;
  attemptNumber: number;
}

// In-memory active attempts store for fast resilience and caching
const attemptsStore = new Map<string, AssessmentAttempt>();

/**
 * Remove sensitive answer and explanation fields before sending to client
 */
export function sanitizeQuestionForClient(q: KnowledgeQuestion): ClientQuestion {
  return {
    id: q.id,
    domainId: q.domainId,
    skillId: q.skillId,
    levelNumber: q.levelNumber,
    questionText: q.questionText,
    codeSnippet: q.codeSnippet,
    questionType: q.questionType,
    options: q.options,
    difficulty: q.difficulty,
    category: q.category,
  };
}

/**
 * Start or resume an assessment attempt.
 * If an attempt is currently IN_PROGRESS for this user and configuration, returns it
 * to ensure page refresh does not silently overwrite or create new assessments.
 */
export async function startAssessment(params: {
  userId: string;
  domainId: string;
  skillId: string;
  levelId: string | number;
}): Promise<{
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
}> {
  const { userId, domainId, skillId, levelId } = params;
  const levelNumber = Number(levelId) || 1;

  // 1. Check if there is an active IN_PROGRESS attempt in store
  for (const [id, attempt] of attemptsStore.entries()) {
    if (
      attempt.userId === userId &&
      attempt.domainId.toLowerCase() === domainId.toLowerCase() &&
      attempt.skillId.toLowerCase() === skillId.toLowerCase() &&
      attempt.levelNumber === levelNumber &&
      attempt.status === 'IN_PROGRESS'
    ) {
      return {
        attemptId: id,
        domainId: attempt.domainId,
        skillId: attempt.skillId,
        levelNumber: attempt.levelNumber,
        status: 'IN_PROGRESS',
        totalQuestions: attempt.questions.length,
        questions: attempt.questions.map(sanitizeQuestionForClient),
        savedAnswers: attempt.answers,
        integritySignalsCount: attempt.integritySignals.length,
        startedAt: attempt.startedAt,
        isResumed: true,
      };
    }
  }

  // 2. Count prior attempts for this user and configuration
  let attemptNumber = 1;
  for (const attempt of attemptsStore.values()) {
    if (
      attempt.userId === userId &&
      attempt.domainId.toLowerCase() === domainId.toLowerCase() &&
      attempt.skillId.toLowerCase() === skillId.toLowerCase() &&
      attempt.levelNumber === levelNumber
    ) {
      attemptNumber = Math.max(attemptNumber, attempt.attemptNumber + 1);
    }
  }

  // 3. Retrieve tailored questions for domain + skill + level
  const questions = getQuestionsForConfig(domainId, skillId, levelNumber);
  const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const newAttempt: AssessmentAttempt = {
    id: attemptId,
    userId,
    domainId,
    skillId,
    levelNumber,
    status: 'IN_PROGRESS',
    questions,
    answers: {},
    integritySignals: [],
    startedAt: new Date().toISOString(),
    attemptNumber,
  };

  attemptsStore.set(attemptId, newAttempt);

  // 4. Optionally register initial attempt in Supabase if connection exists
  try {
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (dbUser) {
      // Find matching skill_level_id
      const { data: skillLevels } = await supabase
        .from('skill_levels')
        .select('id, level_number, skills!inner(name, course_id, courses!inner(name))')
        .eq('level_number', levelNumber);

      const matchedLevel = skillLevels?.[0];
      if (matchedLevel) {
        // Look up task or create placeholder task
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id')
          .eq('skill_level_id', matchedLevel.id)
          .limit(1);

        const taskId = tasks?.[0]?.id;
        if (taskId) {
          await supabase.from('attempts').insert({
            user_id: dbUser.id,
            task_id: taskId,
            attempt_number: attemptNumber,
            status: 'in_progress',
            started_at: newAttempt.startedAt,
          });
        }
      }
    }
  } catch (err) {
    // Non-blocking background persistence error
    console.warn('[KnowledgeCheckService] Non-critical DB init warning:', err);
  }

  return {
    attemptId,
    domainId,
    skillId,
    levelNumber,
    status: 'IN_PROGRESS',
    totalQuestions: questions.length,
    questions: questions.map(sanitizeQuestionForClient),
    savedAnswers: {},
    integritySignalsCount: 0,
    startedAt: newAttempt.startedAt,
    isResumed: false,
  };
}

/**
 * Get an attempt by ID.
 * If in progress, strips answers and explanations.
 * If evaluated, returns full evaluation result.
 */
export async function getAttempt(attemptId: string) {
  const attempt = attemptsStore.get(attemptId);
  if (!attempt) {
    return null;
  }

  if (attempt.status === 'EVALUATED' || attempt.status === 'SUBMITTED') {
    return {
      attemptId: attempt.id,
      domainId: attempt.domainId,
      skillId: attempt.skillId,
      levelNumber: attempt.levelNumber,
      status: attempt.status,
      evaluation: attempt.evaluationResult,
      savedAnswers: attempt.answers,
      integritySignalsCount: attempt.integritySignals.length,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
    };
  }

  return {
    attemptId: attempt.id,
    domainId: attempt.domainId,
    skillId: attempt.skillId,
    levelNumber: attempt.levelNumber,
    status: attempt.status,
    totalQuestions: attempt.questions.length,
    questions: attempt.questions.map(sanitizeQuestionForClient),
    savedAnswers: attempt.answers,
    integritySignalsCount: attempt.integritySignals.length,
    startedAt: attempt.startedAt,
  };
}

/**
 * Real-time answer saving to prevent answer loss during navigation.
 */
export function saveAnswer(params: {
  attemptId: string;
  questionId: string;
  selectedOption: string;
  integrityEvent?: IntegrityEvent;
}): { success: boolean; savedAnswers: Record<string, string> } {
  const { attemptId, questionId, selectedOption, integrityEvent } = params;
  const attempt = attemptsStore.get(attemptId);
  if (!attempt) {
    throw new Error('Attempt not found');
  }

  if (attempt.status === 'SUBMITTED' || attempt.status === 'EVALUATED') {
    throw new Error('Cannot modify answers for an already submitted assessment');
  }

  attempt.answers[questionId] = selectedOption.toUpperCase();

  if (integrityEvent) {
    attempt.integritySignals.push(integrityEvent);
  }

  return {
    success: true,
    savedAnswers: attempt.answers,
  };
}

/**
 * Record an integrity signal (tab change, blur, repeated paste, etc.).
 */
export function recordIntegritySignal(params: {
  attemptId: string;
  type: string;
  details?: any;
}): { success: boolean; totalSignals: number } {
  const { attemptId, type, details } = params;
  const attempt = attemptsStore.get(attemptId);
  if (!attempt) {
    throw new Error('Attempt not found');
  }

  const event: IntegrityEvent = {
    type,
    timestamp: new Date().toISOString(),
    details,
  };

  attempt.integritySignals.push(event);

  return {
    success: true,
    totalSignals: attempt.integritySignals.length,
  };
}

/**
 * Finalize and submit assessment with server-side scoring.
 * Prevents multiple submissions of the same attempt.
 */
export async function submitAssessment(attemptId: string): Promise<KnowledgeEvaluationResult> {
  const attempt = attemptsStore.get(attemptId);
  if (!attempt) {
    throw new Error('Attempt not found');
  }

  // Prevent multiple submissions
  if (attempt.status === 'SUBMITTED' || attempt.status === 'EVALUATED') {
    if (attempt.evaluationResult) {
      return attempt.evaluationResult;
    }
    throw new Error('This assessment attempt has already been submitted');
  }

  attempt.status = 'SUBMITTED';
  const completedAt = new Date().toISOString();
  attempt.submittedAt = completedAt;
  attempt.completedAt = completedAt;

  // Evaluate answers against server-side question bank
  let correctCount = 0;
  const categoryStats: Record<string, { total: number; correct: number }> = {};
  const questionsReview: QuestionReviewItem[] = [];

  for (const q of attempt.questions) {
    const userAnswer = attempt.answers[q.id] || null;
    const isCorrect = userAnswer !== null && userAnswer.toUpperCase() === q.correctAnswer.toUpperCase();

    if (isCorrect) {
      correctCount++;
    }

    // Accumulate category stats
    const cat = q.category || 'General Knowledge';
    if (!categoryStats[cat]) {
      categoryStats[cat] = { total: 0, correct: 0 };
    }
    categoryStats[cat].total += 1;
    if (isCorrect) {
      categoryStats[cat].correct += 1;
    }

    questionsReview.push({
      id: q.id,
      questionText: q.questionText,
      codeSnippet: q.codeSnippet,
      options: q.options,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      category: q.category,
      difficulty: q.difficulty,
    });
  }

  const totalQuestions = attempt.questions.length;
  const attemptedQuestions = Object.keys(attempt.answers).length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const score = correctCount;

  // Determine strengths and areas for improvement
  const strengths: string[] = [];
  const areasNeedingImprovement: string[] = [];

  for (const [cat, stats] of Object.entries(categoryStats)) {
    const catRatio = stats.correct / stats.total;
    if (catRatio >= 0.75) {
      strengths.push(cat);
    } else {
      areasNeedingImprovement.push(cat);
    }
  }

  if (strengths.length === 0 && correctCount > 0) {
    strengths.push('Core Competency Fundamentals');
  }
  if (areasNeedingImprovement.length === 0 && correctCount < totalQuestions) {
    areasNeedingImprovement.push('Advanced Edge Cases & Complexity');
  }

  // Evaluate integrity signals status
  const signalCount = attempt.integritySignals.length;
  let integrityStatus: KnowledgeEvaluationResult['integrityStatus'] = 'No Integrity Signals';
  if (signalCount > 5) {
    integrityStatus = 'Review Required';
  } else if (signalCount >= 3) {
    integrityStatus = 'Multiple Integrity Signals';
  } else if (signalCount >= 1) {
    integrityStatus = 'Integrity Warning';
  }

  const evaluationResult: KnowledgeEvaluationResult = {
    attemptId: attempt.id,
    domainId: attempt.domainId,
    skillId: attempt.skillId,
    levelNumber: attempt.levelNumber,
    status: 'EVALUATED',
    totalQuestions,
    attemptedQuestions,
    correctAnswers: correctCount,
    score,
    percentage,
    strengths,
    areasNeedingImprovement,
    integrityStatus,
    integritySignalCount: signalCount,
    integrityEvents: attempt.integritySignals,
    questionsReview,
    startedAt: attempt.startedAt,
    completedAt,
    attemptNumber: attempt.attemptNumber,
  };

  attempt.status = 'EVALUATED';
  attempt.evaluationResult = evaluationResult;

  // Persist official evaluation evidence to Supabase
  try {
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', attempt.userId)
      .maybeSingle();

    if (dbUser) {
      // Record in submissions and evaluations
      const { data: attemptRows } = await supabase
        .from('attempts')
        .select('id')
        .eq('user_id', dbUser.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const dbAttemptId = attemptRows?.[0]?.id;
      if (dbAttemptId) {
        await supabase
          .from('attempts')
          .update({
            status: 'completed',
            submitted_at: completedAt,
            completed_at: completedAt,
          })
          .eq('id', dbAttemptId);

        const { data: evalInsert } = await supabase
          .from('evaluations')
          .insert({
            attempt_id: dbAttemptId,
            overall_score: percentage,
            summary: `Knowledge Check completed: ${correctCount}/${totalQuestions} correct (${percentage}%). Integrity: ${integrityStatus}.`,
            evaluation_status: 'completed',
            evaluated_at: completedAt,
          })
          .select('id')
          .single();

        if (evalInsert?.id) {
          // Add evaluation criteria
          await supabase.from('evaluation_criteria').insert([
            {
              evaluation_id: evalInsert.id,
              criterion_name: 'Knowledge Check Technical Mastery',
              level: `Level 0${attempt.levelNumber}`,
              score: percentage,
              explanation: `Scored ${correctCount} of ${totalQuestions} questions correctly in domain ${attempt.domainId}.`,
            },
          ]);

          // Add evidence
          await supabase.from('evidence').insert({
            evaluation_id: evalInsert.id,
            criterion_id: (
              await supabase
                .from('evaluation_criteria')
                .select('id')
                .eq('evaluation_id', evalInsert.id)
                .limit(1)
            ).data?.[0]?.id,
            evidence_type: 'knowledge_assessment_result',
            observed_evidence: JSON.stringify({
              score,
              percentage,
              totalQuestions,
              attemptedQuestions,
              strengths,
              areasNeedingImprovement,
              integrityStatus,
              integritySignalsCount: signalCount,
            }),
            expected_evidence: 'Minimum threshold: 70%',
            source: 'ReProof Knowledge Check Engine',
          });
        }
      }
    }
  } catch (dbErr) {
    console.warn('[KnowledgeCheckService] Non-critical DB persistence notice:', dbErr);
  }

  return evaluationResult;
}
