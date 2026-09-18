import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  startKnowledgeCheck,
  getKnowledgeCheckAttempt,
  saveKnowledgeCheckAnswer,
  logIntegritySignal,
  submitKnowledgeCheck,
  type ClientQuestion,
} from '../api/knowledgeCheck';
import { findDomain, findSkill } from '../data/curriculumData';

export const KnowledgeCheck: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    localStorage.getItem('reproof_selected_level') ||
    '1';

  // Domain & Skill metadata lookup
  const domainMeta = findDomain(domainId);
  const skillMeta = findSkill(domainId, skillId);

  // Core assessment state
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [resumedNotice, setResumedNotice] = useState<boolean>(false);

  // Integrity telemetry counter
  const [integritySignalsCount, setIntegritySignalsCount] = useState<number>(0);
  const pasteCountRef = useRef<number>(0);

  // Storage key for local answer recovery
  const localAnswersKey = `reproof_answers_${domainId}_${skillId}_L${levelId}`;

  // 1. Initialize or resume assessment
  useEffect(() => {
    let isMounted = true;

    async function initAssessment() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        // Check if there is an existing attemptId in localStorage
        const storedAttemptId = localStorage.getItem(`reproof_attempt_${domainId}_${skillId}_L${levelId}`);
        if (storedAttemptId) {
          try {
            const existingAttempt = await getKnowledgeCheckAttempt(storedAttemptId);
            if (
              existingAttempt &&
              existingAttempt.status === 'IN_PROGRESS' &&
              existingAttempt.questions &&
              existingAttempt.questions.length > 0
            ) {
              if (!isMounted) return;
              setAttemptId(existingAttempt.attemptId);
              setQuestions(existingAttempt.questions);
              setAnswers(existingAttempt.savedAnswers || {});
              setIntegritySignalsCount(existingAttempt.integritySignalsCount || 0);
              setIsLoading(false);
              setResumedNotice(true);
              return;
            } else if (existingAttempt && existingAttempt.status === 'EVALUATED') {
              // Already completed, navigate to result
              navigate(
                `/knowledge-result?attemptId=${storedAttemptId}&domainId=${domainId}&skillId=${skillId}&levelId=${levelId}`,
                { replace: true }
              );
              return;
            }
          } catch (_err) {
            // Expired or not found, proceed to start
          }
        }

        // Start fresh assessment or recover from backend
        const response = await startKnowledgeCheck(domainId, skillId, levelId);
        if (!isMounted) return;

        setAttemptId(response.attemptId);
        setQuestions(response.questions);
        localStorage.setItem(
          `reproof_attempt_${domainId}_${skillId}_L${levelId}`,
          response.attemptId
        );

        // Merge backend saved answers with local cached answers if resumed
        let initialAnswers = response.savedAnswers || {};
        try {
          const cached = localStorage.getItem(localAnswersKey);
          if (cached) {
            initialAnswers = { ...initialAnswers, ...JSON.parse(cached) };
          }
        } catch (_) {}

        setAnswers(initialAnswers);
        setIntegritySignalsCount(response.integritySignalsCount || 0);
        if (response.isResumed) {
          setResumedNotice(true);
        }
        setIsLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Failed to launch Knowledge Check:', err);
        setErrorMessage(
          err.message || 'Failed to initialize assessment. Please verify backend connection and try again.'
        );
        setIsLoading(false);
      }
    }

    initAssessment();

    return () => {
      isMounted = false;
    };
  }, [domainId, skillId, levelId, localAnswersKey, navigate]);

  // 2. Setup lightweight integrity signal listeners
  useEffect(() => {
    if (!attemptId) return;

    // Tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logIntegritySignal(attemptId, 'visibility_change', {
          state: 'hidden',
          timestamp: new Date().toISOString(),
        }).catch(() => {});
        setIntegritySignalsCount((prev) => prev + 1);
      }
    };

    // Window focus loss
    const handleBlur = () => {
      logIntegritySignal(attemptId, 'window_blur', {
        timestamp: new Date().toISOString(),
      }).catch(() => {});
      setIntegritySignalsCount((prev) => prev + 1);
    };

    // Repeated paste detection
    const handlePaste = (e: ClipboardEvent) => {
      pasteCountRef.current += 1;
      if (pasteCountRef.current >= 3) {
        logIntegritySignal(attemptId, 'repeated_paste', {
          pasteCount: pasteCountRef.current,
          clipboardLength: e.clipboardData?.getData('text')?.length || 0,
          timestamp: new Date().toISOString(),
        }).catch(() => {});
        setIntegritySignalsCount((prev) => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('paste', handlePaste);
    };
  }, [attemptId]);

  // 3. Prevent accidental tab close during assessment
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (questions.length > 0 && !isSubmitting) {
        e.preventDefault();
        e.returnValue = 'You have an assessment in progress. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [questions.length, isSubmitting]);

  // Handle option selection
  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!questions[currentIndex] || !attemptId) return;
      const questionId = questions[currentIndex].id;

      // Update local state immediately for zero-latency UI feedback
      const updatedAnswers = {
        ...answers,
        [questionId]: optionId,
      };
      setAnswers(updatedAnswers);

      // Backup to localStorage
      try {
        localStorage.setItem(localAnswersKey, JSON.stringify(updatedAnswers));
      } catch (_) {}

      // Real-time backend persistence
      saveKnowledgeCheckAnswer(attemptId, questionId, optionId).catch((err) => {
        console.warn('[KnowledgeCheck] Non-critical answer sync notice:', err);
      });
    },
    [questions, currentIndex, attemptId, answers, localAnswersKey]
  );

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modifier keys are pressed or modal is open
      if (e.ctrlKey || e.altKey || e.metaKey || showConfirmModal) return;

      if (e.key === 'ArrowRight' || e.key === 'j') {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const optionMap: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
        handleSelectOption(optionMap[e.key]);
      } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
        handleSelectOption(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, showConfirmModal, handleSelectOption]);

  // Handle final submission
  const handleFinalSubmit = async () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const evaluationResult = await submitKnowledgeCheck(attemptId);
      // Clean up local draft answers
      localStorage.removeItem(localAnswersKey);

      navigate(
        `/knowledge-result?attemptId=${attemptId}&domainId=${domainId}&skillId=${skillId}&levelId=${levelId}`,
        { state: { evaluationResult } }
      );
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.message || 'Error submitting assessment. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-ivory-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-8 h-8 border-2 border-cobalt-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
              INITIALIZING ISOLATED ASSESSMENT ENVIRONMENT
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              Calibrating Knowledge Check
            </h2>
            <p className="text-xs text-graphite-600 font-mono">
              Domain: {domainMeta.name} // Level 0{levelId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-lg w-full p-8 border border-red-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-mono font-bold mx-auto">
            !
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-red-700 font-bold block">
              ASSESSMENT INITIALIZATION FAILED
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              Unable to Load Questions
            </h2>
            <p className="text-xs text-graphite-600 leading-relaxed">
              {errorMessage || 'No questions could be loaded for this configuration.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              to={`/domains?domainId=${domainId}&skillId=${skillId}`}
              className="px-4 py-2 border border-graphite-900 text-graphite-900 font-mono text-xs uppercase tracking-wider hover:bg-graphite-900 hover:text-white transition-colors rounded-[2px]"
            >
              &larr; Return to Curriculum
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cobalt-700 text-white font-mono text-xs uppercase tracking-wider hover:bg-cobalt-900 transition-colors rounded-[2px]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col justify-between bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Top Protocol Header */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Breadcrumb Info */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest">
              <span className="w-2 h-2 bg-cobalt-700"></span>
              <span className="text-cobalt-700 font-bold">
                {domainMeta.name} // {skillMeta.name}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-700 font-semibold">
                LEVEL 0{levelId}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-500">
                ROUND 01: KNOWLEDGE CHECK
              </span>
            </div>

            {/* Back link */}
            <Link
              to={`/domains?domainId=${domainId}&skillId=${skillId}`}
              className="font-mono text-xs text-graphite-600 hover:text-cobalt-700 uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>&larr; Exit to Matrix</span>
            </Link>
          </div>

          {resumedNotice && (
            <div className="mt-3 py-1.5 px-3 bg-cobalt-50 border border-cobalt-200 text-cobalt-900 font-mono text-[10px] uppercase tracking-wider flex items-center justify-between">
              <span>Resumed existing attempt in progress. Saved answers loaded.</span>
              <button
                onClick={() => setResumedNotice(false)}
                className="text-cobalt-600 hover:text-cobalt-900 ml-4 font-bold"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Assessment Container */}
      <main className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 py-8 flex-1 flex flex-col justify-start space-y-8">
        {/* Assessment Progress & Question Map Strip */}
        <div className="border border-ivory-300 bg-white p-5 rounded-[2px] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-cobalt-700 uppercase tracking-wider">
                QUESTION {String(currentIndex + 1).padStart(2, '0')} // {String(totalQuestions).padStart(2, '0')}
              </span>
              <span className="text-xs text-graphite-400 font-mono">•</span>
              <span className="font-mono text-[11px] text-graphite-600">
                {answeredCount} of {totalQuestions} answered ({Math.round((answeredCount / totalQuestions) * 100)}%)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase text-graphite-500">
                Integrity Monitor: Active
              </span>
              {integritySignalsCount > 0 && (
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 font-semibold">
                  {integritySignalsCount} {integritySignalsCount === 1 ? 'Signal' : 'Signals'}
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cobalt-700 h-full transition-all duration-200 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Grid / Dot Navigator */}
          <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentIndex;

              let dotClass = 'bg-white border-ivory-300 text-graphite-600 hover:border-graphite-500';
              if (isCurrent) {
                dotClass = 'bg-cobalt-700 border-cobalt-700 text-white font-bold shadow-sm';
              } else if (isAnswered) {
                dotClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-[2px] border flex items-center justify-center transition-all cursor-pointer ${dotClass}`}
                  title={`Go to Question ${idx + 1} (${isAnswered ? 'Answered' : 'Unanswered'})`}
                  aria-label={`Question ${idx + 1}`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question Card */}
        <section
          aria-label={`Question ${currentIndex + 1}`}
          className="border border-ivory-300 bg-white p-6 sm:p-10 rounded-[2px] shadow-sm space-y-8 flex-1 flex flex-col justify-between"
        >
          <div className="space-y-6">
            {/* Category and Difficulty Eyebrow */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ivory-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 bg-ivory-200 text-graphite-700 border border-ivory-300 font-semibold tracking-wider">
                  {currentQ.category}
                </span>
                <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 bg-cobalt-50 text-cobalt-800 border border-cobalt-200 font-semibold tracking-wider">
                  {currentQ.questionType.toUpperCase()}
                </span>
              </div>

              <span className="font-mono text-[10px] uppercase text-graphite-500">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl font-bold text-graphite-900 leading-relaxed">
              {currentQ.questionText}
            </h2>

            {/* Code Snippet if present */}
            {currentQ.codeSnippet && (
              <div className="border border-ivory-300 bg-[#1e1e24] text-[#f8f8f2] p-5 rounded-[2px] font-mono text-xs overflow-x-auto leading-relaxed">
                <pre className="whitespace-pre-wrap">{currentQ.codeSnippet}</pre>
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-3 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-graphite-500 font-bold block">
                SELECT THE VERIFIED ANSWER:
              </span>

              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((opt) => {
                  const isSelected = currentAnswer === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`group p-4 sm:p-5 border rounded-[2px] cursor-pointer transition-all duration-150 flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#F2F5FA] border-cobalt-700 ring-1 ring-cobalt-700 shadow-sm'
                          : 'bg-white border-ivory-300 hover:border-graphite-400 hover:bg-ivory-50'
                      }`}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-4">
                        {/* Option Letter Badge */}
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-cobalt-700 text-white border-cobalt-700'
                              : 'bg-ivory-100 text-graphite-600 border-ivory-300 group-hover:border-cobalt-700 group-hover:text-cobalt-700'
                          }`}
                        >
                          {opt.id}
                        </div>

                        {/* Option Text */}
                        <span
                          className={`text-sm sm:text-base leading-relaxed ${
                            isSelected
                              ? 'text-cobalt-900 font-semibold'
                              : 'text-graphite-800'
                          }`}
                        >
                          {opt.text}
                        </span>
                      </div>

                      {/* Radio Indicator */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-cobalt-700 bg-cobalt-700'
                            : 'border-graphite-300 group-hover:border-cobalt-700'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div className="pt-6 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`px-5 py-3 border border-ivory-300 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-2 ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-ivory-100 text-graphite-400'
                  : 'hover:bg-ivory-100 text-graphite-700 cursor-pointer'
              }`}
            >
              <span>&larr;</span>
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3">
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-6 py-3 bg-graphite-900 hover:bg-cobalt-700 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-[2px] flex items-center gap-2"
                >
                  <span>Next</span>
                  <span>&rarr;</span>
                </button>
              ) : null}

              {/* Submit Assessment Button */}
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-[2px] flex items-center gap-2 font-bold shadow-sm"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Assessment'}</span>
                <span>✓</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-ivory-300 max-w-lg w-full p-8 rounded-[2px] shadow-xl space-y-6 animate-in fade-in zoom-in duration-150">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                CONFIRM FINAL SUBMISSION
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-graphite-900">
                Finalize Knowledge Check?
              </h3>
              <p className="text-xs sm:text-sm text-graphite-600 leading-relaxed">
                Once submitted, answers cannot be modified and your performance will be evaluated server-side.
              </p>
            </div>

            {/* Answer Progress Stats */}
            <div className="p-4 bg-ivory-100 border border-ivory-300 rounded-[2px] space-y-2 font-mono text-xs">
              <div className="flex justify-between text-graphite-700">
                <span>Total Questions:</span>
                <span className="font-bold">{totalQuestions}</span>
              </div>
              <div className="flex justify-between text-graphite-700">
                <span>Answered:</span>
                <span className="font-bold text-emerald-800">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-graphite-700">
                <span>Unanswered:</span>
                <span className={totalQuestions - answeredCount > 0 ? 'font-bold text-amber-700' : 'font-bold text-graphite-500'}>
                  {totalQuestions - answeredCount}
                </span>
              </div>

              {totalQuestions - answeredCount > 0 && (
                <div className="pt-2 text-[11px] text-amber-800 font-semibold border-t border-ivory-200">
                  ⚠ You have {totalQuestions - answeredCount} unanswered {totalQuestions - answeredCount === 1 ? 'question' : 'questions'}. Unanswered questions will receive 0 points.
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 border border-ivory-300 text-graphite-700 hover:bg-ivory-100 font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] transition-colors"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
