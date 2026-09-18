import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  startInterview,
  saveInterviewAnswer,
  logInterviewIntegrity,
  submitInterview,
} from '../api/interview';
import type {
  InterviewQuestion,
  InterviewAttemptResponse,
} from '../api/interview';
import { IntegrityMonitor } from '../components/common/IntegrityMonitor';

export const TechnicalInterview: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dynamic query params
  const domainId =
    searchParams.get('domainId') ||
    localStorage.getItem('reproof_selected_domain') ||
    'ai-ml';

  const skillId =
    searchParams.get('skillId') ||
    localStorage.getItem('reproof_selected_skill') ||
    'python-for-ml';

  const levelId =
    searchParams.get('levelId') ||
    searchParams.get('levelNumber') ||
    localStorage.getItem('reproof_selected_level') ||
    '1';

  const levelNumber = Number(levelId) || 1;
  const projectAttemptId = searchParams.get('projectAttemptId') || '';

  // State
  const [attempt, setAttempt] = useState<InterviewAttemptResponse | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UI / Telemetry State
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [integritySignalsCount, setIntegritySignalsCount] = useState(0);

  const isMountedRef = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Technical Interview session with prior round evidence citations
  useEffect(() => {
    isMountedRef.current = true;

    async function initInterview() {
      setIsLoading(true);
      setErrorMessage(null);

      // Extract prior weaknesses / project titles from localStorage if present
      const priorWeakness = localStorage.getItem(`reproof_weakness_${skillId}`) || undefined;
      const priorProjectTitle = localStorage.getItem(`reproof_project_title_${skillId}`) || (projectAttemptId ? `Project Submission (${projectAttemptId.slice(-8)})` : undefined);

      try {
        const response = await startInterview(domainId, skillId, levelNumber, {
          knowledgeWeakness: priorWeakness,
          projectTitle: priorProjectTitle,
        });

        if (!isMountedRef.current) return;

        setAttempt(response);
        setQuestions(response.questions || []);
        setAnswers(response.savedAnswers || {});
        setIntegritySignalsCount(response.integritySignalsCount || 0);
      } catch (err: any) {
        if (!isMountedRef.current) return;
        setErrorMessage(err.message || 'Error initializing Technical Interview session.');
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    }

    initInterview();

    return () => {
      isMountedRef.current = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [domainId, skillId, levelNumber]);

  // Monitor visibility / blur integrity events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && attempt?.attemptId) {
        logInterviewIntegrity(attempt.attemptId, 'TAB_BLUR', {
          timestamp: new Date().toISOString(),
          context: 'Candidate switched away from Interview answer area',
        }).catch(() => {});
        setIntegritySignalsCount((prev) => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attempt?.attemptId]);

  // Debounced real-time saving
  const triggerAnswerSave = useCallback(
    (qId: string, text: string) => {
      if (!attempt?.attemptId) return;

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSaving(true);
          await saveInterviewAnswer(attempt.attemptId, qId, text);
          const now = new Date();
          setLastSaved(
            now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          );
        } catch (e) {
          console.warn('[Interview] Error saving answer:', e);
        } finally {
          setIsSaving(false);
        }
      }, 1000);
    },
    [attempt?.attemptId]
  );

  const handleAnswerChange = (text: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setAnswers((prev) => ({ ...prev, [currentQ.id]: text }));
    triggerAnswerSave(currentQ.id, text);
  };

  const handlePasteAnswer = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted && pasted.length > 200 && attempt?.attemptId) {
      logInterviewIntegrity(attempt.attemptId, 'BULK_PASTE', {
        charCount: pasted.length,
        timestamp: new Date().toISOString(),
        questionIndex: currentIndex + 1,
      }).catch(() => {});
      setIntegritySignalsCount((prev) => prev + 1);
    }
  };

  // Final submission
  const handleFinalSubmit = async () => {
    if (!attempt?.attemptId) return;
    setIsSubmitting(true);
    setShowSubmitModal(false);

    try {
      const evaluationResult = await submitInterview(attempt.attemptId, answers);
      localStorage.setItem(`reproof_interview_attempt_${skillId}_${levelId}`, attempt.attemptId);
      localStorage.setItem(`reproof_interview_result_${skillId}_${levelId}`, JSON.stringify(evaluationResult));

      navigate(
        `/interview-result?attemptId=${encodeURIComponent(attempt.attemptId)}&domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(skillId)}&levelId=${encodeURIComponent(levelId)}`,
        { state: { result: evaluationResult } }
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Error evaluating interview responses.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-ivory-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-8 h-8 border-2 border-cobalt-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
              SYNTHESIZING TECHNICAL INTERVIEW
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              Generating Contextual Prompts
            </h2>
            <p className="text-xs text-graphite-600 font-mono">
              Cross-referencing Knowledge telemetry and Project deliverables...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !questions.length) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-rose-300 bg-white rounded-[2px] shadow-sm space-y-4 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-rose-700 font-bold block">
            INTERVIEW SESSION ERROR
          </span>
          <h2 className="text-lg font-bold text-graphite-900">
            {errorMessage || 'No interview questions could be synthesized.'}
          </h2>
          <div className="pt-2">
            <Link
              to={`/domains?domainId=${domainId}`}
              className="px-5 py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors inline-block"
            >
              Return to Curriculum Matrix &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ.id] || '';
  const totalQuestions = questions.length;
  const answeredCount = Object.values(answers).filter((a) => a.trim().length > 0).length;

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Editorial Header */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-graphite-500">
              <span className="w-2 h-2 bg-cobalt-700"></span>
              <span className="text-cobalt-700 font-bold">
                {domainId.toUpperCase()} // {skillId.toUpperCase()}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-700 font-semibold">
                LEVEL 0{levelNumber}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-900 font-bold">
                FINAL TECHNICAL INTERVIEW
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              {isSaving ? (
                <span className="text-cobalt-700 animate-pulse flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-cobalt-700 rounded-full"></span>
                  Saving response...
                </span>
              ) : lastSaved ? (
                <span className="text-graphite-500">Saved at {lastSaved}</span>
              ) : null}

              <IntegrityMonitor
                onIntegritySignal={(type, detail) => {
                  if (attempt?.attemptId) {
                    logInterviewIntegrity(attempt.attemptId, type, { detail, timestamp: new Date().toISOString() }).catch(() => {});
                    setIntegritySignalsCount((prev) => prev + 1);
                  }
                }}
              />
              {integritySignalsCount > 0 && (
                <span className="text-[10px] text-graphite-500 font-mono">({integritySignalsCount} logged)</span>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-graphite-900 uppercase">
                Defend Your Work & Reasoning
              </h1>
              <p className="text-xs sm:text-sm text-graphite-600">
                Explain your architectural decisions, trade-offs, and boundary considerations in natural technical prose. Our audit engine cross-checks responses against your submitted project code.
              </p>
            </div>

            {/* Question Progress Tracker */}
            <div className="bg-white border border-ivory-300 p-4 rounded-[2px] shadow-sm font-mono text-xs space-y-2 min-w-[240px]">
              <div className="flex justify-between text-[11px] text-graphite-500">
                <span>PROGRESS</span>
                <span className="font-bold text-graphite-900">
                  {answeredCount} of {totalQuestions} Answered
                </span>
              </div>
              <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cobalt-700 h-full transition-all duration-300"
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id]?.trim();
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-7 h-7 font-mono text-[11px] font-bold rounded-[2px] border transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-cobalt-700 text-white border-cobalt-700'
                          : isAnswered
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-ivory-100 text-graphite-600 border-ivory-300 hover:bg-ivory-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Question & Answer Workstation */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5 cols): Context Citation & Rubric Focus */}
          <div className="lg:col-span-5 space-y-6">
            {/* Question Meta Badge */}
            <div className="bg-white border border-ivory-300 p-5 rounded-[2px] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-cobalt-700 font-bold">
                  QUESTION 0{currentIndex + 1} OF 0{totalQuestions}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-cobalt-100 text-cobalt-900 border border-cobalt-200 uppercase font-bold rounded-[2px]">
                  {currentQ.focusArea}
                </span>
              </div>

              {/* Evidence Citation Box */}
              <div className="p-3.5 bg-cobalt-50/60 border-l-2 border-cobalt-700 rounded-r-[2px] space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-cobalt-900 font-bold block">
                  PRIOR EVIDENCE CITATION:
                </span>
                <p className="text-xs text-cobalt-950 font-sans leading-relaxed">
                  {currentQ.contextPrompt}
                </p>
              </div>

              {/* Rubric Evaluation Expectation */}
              <div className="space-y-1 text-xs text-graphite-600">
                <span className="font-mono text-[10px] uppercase tracking-wider text-graphite-500 font-bold block">
                  EVALUATION CRITERIA:
                </span>
                <p className="leading-relaxed font-sans">
                  {currentQ.rubricExpectation}
                </p>
              </div>
            </div>

            {/* Invariant Guidance Card */}
            <div className="bg-ivory-100 border border-ivory-300 p-5 rounded-[2px] space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-graphite-700 font-bold block">
                INTERVIEW GUIDELINES:
              </span>
              <ul className="space-y-1.5 text-xs text-graphite-600 font-sans">
                <li>• Provide clear, technical explanations citing concrete mechanisms.</li>
                <li>• State explicit trade-offs (e.g. why one approach over another).</li>
                <li>• Reference edge cases, failure boundaries, and scaling implications.</li>
                <li>• Do not copy/paste generic tutorials; defend your actual implementation.</li>
              </ul>
            </div>
          </div>

          {/* Right Column (7 cols): Question Prompt & Candidate Answer Terminal */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-6 shadow-sm min-h-[550px] flex flex-col justify-between">
              {/* Question Text */}
              <div className="space-y-3 border-b border-ivory-200 pb-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-graphite-400 font-bold block">
                  INTERVIEW PROMPT:
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-graphite-900 leading-snug">
                  {currentQ.questionText}
                </h2>
              </div>

              {/* Natural Prose Answer Area */}
              <div className="space-y-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-xs font-mono text-graphite-500">
                  <span>Candidate Technical Explanation</span>
                  <span>Word count: {currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0}</span>
                </div>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  onPaste={handlePasteAnswer}
                  rows={14}
                  placeholder="Explain your technical rationale, decisions, complexity, and boundary safeguards here..."
                  className="flex-1 w-full p-4 font-sans text-sm bg-ivory-50 border border-ivory-300 text-graphite-900 rounded-[2px] leading-relaxed focus:border-cobalt-700 focus:outline-none min-h-[280px] resize-y"
                  spellCheck={false}
                />
              </div>

              {/* Bottom Controls (Previous, Next, Submit) */}
              <div className="pt-4 border-t border-ivory-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-5 py-2.5 border border-ivory-300 hover:bg-ivory-100 text-graphite-700 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  &larr; Previous Question
                </button>

                <div className="flex items-center gap-3">
                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="px-6 py-2.5 bg-graphite-900 hover:bg-cobalt-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors rounded-[2px] cursor-pointer"
                    >
                      Next Question &rarr;
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    disabled={answeredCount === 0 || isSubmitting}
                    className="px-6 py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors rounded-[2px] cursor-pointer disabled:opacity-50"
                  >
                    Submit Interview →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-ivory-300 max-w-lg w-full p-6 rounded-[2px] space-y-5 shadow-2xl">
            <div className="border-b border-ivory-200 pb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                INTERVIEW COMPLETION
              </span>
              <h3 className="text-lg font-bold text-graphite-900 mt-1">
                Finalize Technical Interview Submission
              </h3>
            </div>

            <div className="text-xs text-graphite-600 space-y-2">
              <p>
                You have answered <strong>{answeredCount} of {totalQuestions}</strong> questions in this Technical Interview.
              </p>
              {answeredCount < totalQuestions && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-[2px] font-mono text-xs">
                  Notice: {totalQuestions - answeredCount} question(s) remain unanswered. Unanswered questions will receive zero marks on relevant rubric criteria.
                </div>
              )}
              <p className="text-graphite-500 italic">
                Submitting will trigger official rubric scoring across 5 dimensions and assess cross-round consistency against your project artifacts.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-ivory-300 hover:bg-ivory-100 text-graphite-700 font-mono text-xs uppercase tracking-wider rounded-[2px] cursor-pointer"
              >
                Return to Questions
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] cursor-pointer"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
