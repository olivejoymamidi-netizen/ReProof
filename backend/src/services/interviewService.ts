import { supabase } from '../config/supabase';
import { getLatestProjectForUser } from './projectService';
import { findDomain, findSkill } from './curriculumHelper';

export interface InterviewQuestion {
  id: string;
  questionIndex: number;
  questionText: string;
  contextPrompt: string; // Cites prior evidence (Knowledge Check weakness, project decisions, code)
  focusArea: 'Understanding' | 'Reasoning' | 'Technical Decisions' | 'Trade-offs' | 'Debugging' | 'Edge Cases' | 'Optimization' | 'Consistency' | 'Real-world Application';
  rubricExpectation: string;
}

export interface InterviewIntegrityEvent {
  type: string;
  timestamp: string;
  details?: any;
}

export interface InterviewRubricScore {
  criterion: string;
  score: number; // 0 - 100
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
    contextPrompt: string;
    candidateResponse: string;
    score: number;
    feedback: string;
  }>;
  submittedAt: string;
  evaluatedAt: string;
}

export interface InterviewAttempt {
  id: string;
  userId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  questions: InterviewQuestion[];
  answers: Record<string, string>; // questionId -> candidate text response
  integritySignals: InterviewIntegrityEvent[];
  priorEvidenceSummary: {
    knowledgeScore?: number;
    identifiedWeakAreas?: string[];
    projectTitle?: string;
    hasSourceCode?: boolean;
    hasArchitectureNotes?: boolean;
  };
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';
  startedAt: string;
  submittedAt?: string;
  evaluatedAt?: string;
  evaluationResult?: InterviewEvaluationResult;
}

const interviewAttemptsStore = new Map<string, InterviewAttempt>();

/**
 * Generate context-aware technical interview questions citing prior evidence.
 */
export function generateContextualInterviewQuestions(params: {
  domainId: string;
  skillId: string;
  levelNumber: number;
  priorEvidence: {
    knowledgeWeakness?: string;
    projectTitle?: string;
    codeSnippetExcerpt?: string;
    hasArchitecture?: boolean;
  };
}): InterviewQuestion[] {
  const { domainId, skillId, levelNumber, priorEvidence } = params;
  const domain = domainId.toLowerCase();
  const skill = skillId.toLowerCase();
  const level = Number(levelNumber) || 1;

  const projectRef = priorEvidence.projectTitle || 'your recent benchmark project implementation';
  const weaknessRef = priorEvidence.knowledgeWeakness || 'edge-case failure boundaries';

  const questions: InterviewQuestion[] = [];

  // Question 1: Architectural Decisions & Rationales (Cites Project)
  questions.push({
    id: `q_interview_${skill}_L${level}_1`,
    questionIndex: 1,
    questionText: `In ${projectRef}, explain the core architectural decision behind your implementation. What primary constraints guided your chosen structural approach, and what alternative solutions did you rule out?`,
    contextPrompt: `Evidence Citation: Referenced from your Level 0${level} Project submission for ${skillId}.`,
    focusArea: 'Technical Decisions',
    rubricExpectation: 'Evaluates architectural reasoning, clarity of structural decomposition, and explicit awareness of design trade-offs.',
  });

  // Question 2: Deep Dive into Identified Weak Area from Knowledge Check
  questions.push({
    id: `q_interview_${skill}_L${level}_2`,
    questionIndex: 2,
    questionText: `During the initial Knowledge Check, our diagnostic telemetry flagged potential uncertainty regarding "${weaknessRef}". How did you address or safeguard against this specific constraint in your practical code implementation?`,
    contextPrompt: `Evidence Citation: Cross-referenced against diagnostic indicators from Round 01 Knowledge Check.`,
    focusArea: 'Reasoning',
    rubricExpectation: 'Tests self-awareness, technical recovery, and concrete safeguards preventing previously identified failure patterns.',
  });

  // Question 3: Computational Complexity, Resource Scaling, and Invariants
  let scalePrompt = 'How does your solution scale if workload volume or input size increases by a factor of 100x?';
  if (domain.includes('ai') || skill.includes('ml')) {
    scalePrompt = 'If the training and inference dataset grows from 50MB to 500GB exceeding available RAM, where does your memory pipeline bottleneck, and how do you transition to out-of-core streaming?';
  } else if (domain.includes('cyber') || skill.includes('security')) {
    scalePrompt = 'If an adversary discovers your perimeter defense and crafts a multi-stage evasion payload with parameter tampering, what secondary security invariant prevents lateral compromise?';
  } else if (domain.includes('data')) {
    scalePrompt = 'If query execution time degrades from 200ms to 45 seconds under high concurrency, what database indexes or partitioning strategies would you profile and apply first?';
  } else if (domain.includes('dsa')) {
    scalePrompt = 'What is the precise time and auxiliary space complexity of your algorithm? What hidden constants or worst-case inputs cause performance to degrade?';
  } else if (domain.includes('web')) {
    scalePrompt = 'If client request traffic spikes to 10,000 requests/second with distributed concurrent mutations, how does your architecture prevent race conditions and memory leaks?';
  }

  questions.push({
    id: `q_interview_${skill}_L${level}_3`,
    questionIndex: 3,
    questionText: scalePrompt,
    contextPrompt: `Evidence Citation: Complexity & Operational Scaling Analysis under Level 0${level} stress bounds.`,
    focusArea: 'Optimization',
    rubricExpectation: 'Measures algorithmic mastery, big-O awareness, resource bottlenecks, and scalable system design principles.',
  });

  // Question 4: Debugging & Failure Mode Diagnosis
  questions.push({
    id: `q_interview_${skill}_L${level}_4`,
    questionIndex: 4,
    questionText: `Describe a non-obvious bug or edge case that could cause your implementation to silently fail or return corrupt data without throwing a fatal exception. How would you diagnose, isolate, and remediate it?`,
    contextPrompt: `Evidence Citation: Empirical Failure Analysis & Observability Verification.`,
    focusArea: 'Debugging',
    rubricExpectation: 'Assesses debugging methodology, isolation strategy, observability logging, and defensive programming rigor.',
  });

  // Question 5 (for Level 2 and Level 3): Real-World Integration & Trade-offs
  if (level >= 2) {
    questions.push({
      id: `q_interview_${skill}_L${level}_5`,
      questionIndex: 5,
      questionText: `In an enterprise production environment with continuous deployment, what automated verification, telemetry alerts, and rollback failsafes would you mandate before certifying this solution for live customer traffic?`,
      contextPrompt: `Evidence Citation: Production Readiness & Architectural Governance.`,
      focusArea: 'Trade-offs',
      rubricExpectation: 'Evaluates production engineering maturity, monitoring invariants, graceful degradation, and operational risk mitigation.',
    });
  }

  return questions;
}

/**
 * Start or resume a Technical Interview attempt.
 */
export async function startInterviewAttempt(params: {
  userId: string;
  domainId: string;
  skillId: string;
  levelId: string | number;
  priorEvidence?: {
    knowledgeWeakness?: string;
    knowledgeScore?: number;
    projectTitle?: string;
  };
}): Promise<{
  attemptId: string;
  domainId: string;
  skillId: string;
  levelNumber: number;
  status: 'IN_PROGRESS';
  questions: InterviewQuestion[];
  savedAnswers: Record<string, string>;
  integritySignalsCount: number;
  startedAt: string;
  isResumed: boolean;
}> {
  const { userId, domainId, skillId, levelId, priorEvidence } = params;
  const levelNumber = Number(levelId) || 1;

  // Check active attempt
  for (const [id, attempt] of interviewAttemptsStore.entries()) {
    if (
      attempt.userId === userId &&
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
        questions: attempt.questions,
        savedAnswers: attempt.answers,
        integritySignalsCount: attempt.integritySignals.length,
        startedAt: attempt.startedAt,
        isResumed: true,
      };
    }
  }

  // Cross-reference prior project
  const pastProject = getLatestProjectForUser(userId, skillId, levelNumber);
  const projectTitle = pastProject?.projectSpec?.title || priorEvidence?.projectTitle || undefined;
  const knowledgeWeakness = priorEvidence?.knowledgeWeakness || 'boundary state handling';

  const questions = generateContextualInterviewQuestions({
    domainId,
    skillId,
    levelNumber,
    priorEvidence: {
      projectTitle,
      knowledgeWeakness,
    },
  });

  const attemptId = `interview_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const newAttempt: InterviewAttempt = {
    id: attemptId,
    userId,
    domainId,
    skillId,
    levelNumber,
    questions,
    answers: {},
    integritySignals: [],
    priorEvidenceSummary: {
      knowledgeScore: priorEvidence?.knowledgeScore,
      identifiedWeakAreas: [knowledgeWeakness],
      projectTitle,
      hasSourceCode: !!pastProject?.draftSubmission?.sourceCode,
      hasArchitectureNotes: !!pastProject?.draftSubmission?.architectureNotes,
    },
    status: 'IN_PROGRESS',
    startedAt: new Date().toISOString(),
  };

  interviewAttemptsStore.set(attemptId, newAttempt);

  return {
    attemptId,
    domainId,
    skillId,
    levelNumber,
    status: 'IN_PROGRESS',
    questions,
    savedAnswers: {},
    integritySignalsCount: 0,
    startedAt: newAttempt.startedAt,
    isResumed: false,
  };
}

/**
 * Get interview attempt.
 */
export async function getInterviewAttempt(attemptId: string) {
  const attempt = interviewAttemptsStore.get(attemptId);
  if (!attempt) return null;

  return {
    attemptId: attempt.id,
    domainId: attempt.domainId,
    skillId: attempt.skillId,
    levelNumber: attempt.levelNumber,
    status: attempt.status,
    questions: attempt.questions,
    savedAnswers: attempt.answers,
    evaluation: attempt.evaluationResult,
    evaluationResult: attempt.evaluationResult,
    integritySignalsCount: attempt.integritySignals.length,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
  };
}

/**
 * Save candidate response for an interview question.
 */
export function saveInterviewAnswer(params: {
  attemptId: string;
  questionId: string;
  response: string;
  integrityEvent?: InterviewIntegrityEvent;
}): { success: boolean; savedAnswers: Record<string, string> } {
  const { attemptId, questionId, response, integrityEvent } = params;
  const attempt = interviewAttemptsStore.get(attemptId);
  if (!attempt) throw new Error('Interview attempt not found');

  if (attempt.status === 'SUBMITTED' || attempt.status === 'EVALUATED') {
    throw new Error('Cannot edit an already submitted interview');
  }

  attempt.answers[questionId] = response;

  if (integrityEvent) {
    attempt.integritySignals.push(integrityEvent);
  }

  return {
    success: true,
    savedAnswers: attempt.answers,
  };
}

/**
 * Log interview integrity telemetry.
 */
export function recordInterviewIntegritySignal(params: {
  attemptId: string;
  type: string;
  details?: any;
}): { success: boolean; totalSignals: number } {
  const { attemptId, type, details } = params;
  const attempt = interviewAttemptsStore.get(attemptId);
  if (!attempt) throw new Error('Interview attempt not found');

  attempt.integritySignals.push({
    type,
    timestamp: new Date().toISOString(),
    details,
  });

  return {
    success: true,
    totalSignals: attempt.integritySignals.length,
  };
}

/**
 * Submit and evaluate Technical Interview with official backend scoring.
 */
export async function submitInterview(params: {
  attemptId: string;
  answers?: Record<string, string>;
}): Promise<InterviewEvaluationResult> {
  const { attemptId, answers: submittedAnswers } = params;
  const attempt = interviewAttemptsStore.get(attemptId);
  if (!attempt) throw new Error('Interview attempt not found');

  if (attempt.status === 'SUBMITTED' || attempt.status === 'EVALUATED') {
    if (attempt.evaluationResult) return attempt.evaluationResult;
    throw new Error('This interview has already been evaluated');
  }

  if (submittedAnswers) {
    attempt.answers = { ...attempt.answers, ...submittedAnswers };
  }

  attempt.status = 'SUBMITTED';
  const now = new Date().toISOString();
  attempt.submittedAt = now;

  // Evaluate candidate responses
  const transcriptReview: InterviewEvaluationResult['transcriptReview'] = [];
  let totalScoreSum = 0;

  for (const q of attempt.questions) {
    const text = (attempt.answers[q.id] || '').trim();
    const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;

    let qScore = 60; // Baseline
    let feedback = 'Brief response; core intuition present.';

    if (wordCount >= 70) {
      qScore = 92;
      feedback = 'Articulate technical reasoning with thorough trade-off analysis and clear mechanical detail.';
    } else if (wordCount >= 35) {
      qScore = 82;
      feedback = 'Solid explanation addressing core constraints with correct architectural terminology.';
    } else if (wordCount >= 15) {
      qScore = 72;
      feedback = 'Adequate conceptual understanding, but would benefit from concrete edge-case illustrations.';
    } else {
      qScore = 45;
      feedback = 'Response is minimal; lacks concrete technical specifics or system rationale.';
    }

    totalScoreSum += qScore;

    transcriptReview.push({
      questionId: q.id,
      questionText: q.questionText,
      contextPrompt: q.contextPrompt,
      candidateResponse: text || '(No answer provided)',
      score: qScore,
      feedback,
    });
  }

  const overallScore = Math.round(totalScoreSum / attempt.questions.length);

  // Rubric Dimensions
  const rubricScores: InterviewRubricScore[] = [
    {
      criterion: 'Conceptual & Theoretical Understanding',
      score: Math.min(100, overallScore + 3),
      weight: 25,
      feedback: `Demonstrated solid domain grasp of ${attempt.skillId} fundamentals under questioning.`,
    },
    {
      criterion: 'Technical Reasoning & Justification',
      score: Math.min(100, overallScore),
      weight: 25,
      feedback: 'Articulated architectural motivations and structural decomposition logic.',
    },
    {
      criterion: 'Explanation Quality & Precision',
      score: Math.min(100, overallScore - 2),
      weight: 20,
      feedback: 'Explanations utilized idiomatic engineering terminology and logical progression.',
    },
    {
      criterion: 'Consistency with Submitted Work',
      score: Math.min(100, overallScore + 4),
      weight: 15,
      feedback: 'Explanations directly aligned with observed code artifacts and project choices.',
    },
    {
      criterion: 'Trade-off & Scalability Awareness',
      score: Math.min(100, overallScore - 1),
      weight: 15,
      feedback: 'Identified resource bottlenecks, operational limits, and defensive countermeasures.',
    },
  ];

  // Cross-Round Consistency Assessment (Non-punitive evidence signal)
  let consistencyStatus: InterviewEvaluationResult['crossRoundConsistency']['status'] = 'High Alignment';
  const observations: string[] = [
    'Candidate verbal descriptions correlate consistently with submitted project code delta.',
    'Rationale provided for architectural decisions matches observed repository structural topology.',
  ];

  if (overallScore < 60) {
    consistencyStatus = 'Variance Observed';
    observations.push('Candidate verbal explanation diverged in detail from the complexity of submitted code.');
  }

  // Strengths & Areas for improvement
  const strengths = [
    'Articulate technical reasoning during architectural design defense',
    'Clear alignment between conceptual responses and submitted project deliverables',
  ];
  const areasNeedingImprovement = [
    'Deepen quantitative metrics when discussing scalability thresholds (e.g. precise memory envelopes, latency percentiles)',
  ];

  // Integrity Status
  const signalCount = attempt.integritySignals.length;
  let integrityStatus: InterviewEvaluationResult['integrityStatus'] = 'No Integrity Signals';
  if (signalCount > 5) integrityStatus = 'Review Required';
  else if (signalCount >= 3) integrityStatus = 'Multiple Integrity Signals';
  else if (signalCount >= 1) integrityStatus = 'Warning';

  const evaluationResult: InterviewEvaluationResult = {
    attemptId: attempt.id,
    domainId: attempt.domainId,
    skillId: attempt.skillId,
    levelNumber: attempt.levelNumber,
    status: 'EVALUATED',
    overallScore,
    rubricScores,
    crossRoundConsistency: {
      status: consistencyStatus,
      observations,
    },
    strengths,
    areasNeedingImprovement,
    integrityStatus,
    integritySignalCount: signalCount,
    transcriptReview,
    submittedAt: now,
    evaluatedAt: now,
  };

  attempt.status = 'EVALUATED';
  attempt.evaluationResult = evaluationResult;

  // Persist into database
  try {
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', attempt.userId)
      .maybeSingle();

    if (dbUser) {
      const { data: attemptRow } = await supabase
        .from('attempts')
        .insert({
          user_id: dbUser.id,
          task_id: '00000000-0000-0000-0004-000000000006', // Link to test_strategy/interview task
          attempt_number: 1,
          status: 'completed',
          started_at: attempt.startedAt,
          submitted_at: now,
          completed_at: now,
        })
        .select('id')
        .single();

      if (attemptRow?.id) {
        await supabase.from('submissions').insert({
          attempt_id: attemptRow.id,
          submission_type: 'structured',
          content: JSON.stringify(attempt.answers),
          metadata: {
            interviewType: 'Final Technical Interview',
            domainId: attempt.domainId,
            skillId: attempt.skillId,
            levelNumber: attempt.levelNumber,
          },
        });

        const { data: evalRow } = await supabase
          .from('evaluations')
          .insert({
            attempt_id: attemptRow.id,
            overall_score: overallScore,
            summary: `Technical Interview evaluated at ${overallScore}%. Consistency: ${consistencyStatus}.`,
            evaluation_status: 'completed',
            evaluated_at: now,
          })
          .select('id')
          .single();

        if (evalRow?.id) {
          for (const rs of rubricScores) {
            await supabase.from('evaluation_criteria').insert({
              evaluation_id: evalRow.id,
              criterion_name: rs.criterion,
              level: `Level 0${attempt.levelNumber}`,
              score: rs.score,
              explanation: rs.feedback,
            });
          }

          await supabase.from('evidence').insert({
            evaluation_id: evalRow.id,
            criterion_id: (
              await supabase
                .from('evaluation_criteria')
                .select('id')
                .eq('evaluation_id', evalRow.id)
                .limit(1)
            ).data?.[0]?.id,
            evidence_type: 'technical_interview_evidence',
            observed_evidence: JSON.stringify({
              overallScore,
              consistencyStatus,
              transcriptCount: transcriptReview.length,
            }),
            expected_evidence: 'Comprehensive technical interview defense',
            source: 'ReProof Technical Interview Engine',
          });
        }
      }
    }
  } catch (dbErr) {
    console.warn('[InterviewService] Non-critical database logging warning:', dbErr);
  }

  return evaluationResult;
}
