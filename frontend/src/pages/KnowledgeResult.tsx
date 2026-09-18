import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getKnowledgeCheckAttempt, type EvaluationResultData } from '../api/knowledgeCheck';
import { findDomain, findSkill } from '../data/curriculumData';

export const KnowledgeResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const attemptId = searchParams.get('attemptId');

  const domainMeta = findDomain(domainId);
  const skillMeta = findSkill(domainId, skillId);

  // Result state
  const [result, setResult] = useState<EvaluationResultData | null>(
    (location.state as any)?.evaluationResult || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(!result && !!attemptId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openReviewId, setOpenReviewId] = useState<string | null>(null);

  // Fetch attempt evaluation if not passed in location state
  useEffect(() => {
    if (result || !attemptId) return;

    let isMounted = true;
    async function fetchEvaluation() {
      setIsLoading(true);
      try {
        const attempt = await getKnowledgeCheckAttempt(attemptId!);
        if (!isMounted) return;

        if (attempt.evaluation) {
          setResult(attempt.evaluation);
        } else {
          setErrorMessage('Evaluation data is pending or not available for this attempt.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Error fetching evaluation result');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchEvaluation();
    return () => {
      isMounted = false;
    };
  }, [attemptId, result]);

  // Handle continuing to the next round (Approach Round)
  const handleContinueToApproach = () => {
    // Passes existing domainId, skillId, levelId as requested in Completion Flow
    navigate(
      `/approach?domainId=${domainId}&skillId=${skillId}&levelId=${levelId}`
    );
  };

  const toggleReviewItem = (id: string) => {
    setOpenReviewId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-ivory-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-8 h-8 border-2 border-cobalt-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
              EVALUATING KNOWLEDGE CHECK DOSSIER
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              Generating Objective Scores
            </h2>
            <p className="text-xs text-graphite-600 font-mono">
              Aggregating benchmark criteria and diagnostic telemetry...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !result) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-ivory-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-mono font-bold mx-auto">
            !
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-800 font-bold block">
              ASSESSMENT DOSSIER NOT FOUND
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              No Evaluation Available
            </h2>
            <p className="text-xs text-graphite-600">
              {errorMessage || 'Unable to locate a finalized Knowledge Check result.'}
            </p>
          </div>
          <Link
            to={`/knowledge-check?domainId=${domainId}&skillId=${skillId}&levelId=${levelId}`}
            className="inline-block px-5 py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors"
          >
            Launch Knowledge Check &rarr;
          </Link>
        </div>
      </div>
    );
  }

  // Determine integrity badge styling
  let integrityBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (result.integrityStatus === 'Integrity Warning') {
    integrityBadgeClass = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (result.integrityStatus === 'Multiple Integrity Signals') {
    integrityBadgeClass = 'bg-orange-50 text-orange-800 border-orange-300';
  } else if (result.integrityStatus === 'Review Required') {
    integrityBadgeClass = 'bg-red-50 text-red-800 border-red-300';
  }

  const passedThreshold = result.percentage >= 70;

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col justify-between bg-[#FAF9F6] text-graphite-900 pb-20">
      {/* Top Eyebrow Header */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-4 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] text-graphite-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cobalt-700"></span>
            <span className="uppercase font-bold text-cobalt-800">
              {domainMeta.name} // {skillMeta.name}
            </span>
            <span>/</span>
            <span>ROUND 01: KNOWLEDGE CHECK VERIFICATION</span>
          </div>
          <span className="uppercase">
            PROTOCOL REF: DOM-{domainId.slice(0, 3).toUpperCase()}-L0{levelId}
          </span>
        </div>
      </section>

      {/* Monumental Headline */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-10 sm:py-14">
          <div className="max-w-4xl space-y-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold">
              <span>ROUND 01 EVALUATION COMPLETED</span>
              <span>•</span>
              <span>ATTEMPT #{result.attemptNumber}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-graphite-900 leading-none">
              KNOWLEDGE CHECK RESULT.
            </h1>

            <p className="text-base sm:text-lg text-graphite-600 leading-relaxed font-normal">
              Candidate demonstrated technical understanding for{' '}
              <strong className="text-graphite-900 font-semibold">{skillMeta.name}</strong> at{' '}
              <strong className="text-graphite-900 font-semibold">Level 0{levelId}</strong>. Objective score and
              evidence logged for multi-round competency verification.
            </p>
          </div>
        </div>
      </section>

      {/* Main Result Body */}
      <main className="max-w-[1600px] mx-auto w-full px-6 sm:px-12 py-10 space-y-10">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Core Metric Cards Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {/* Score Card */}
            <div className="p-6 bg-white border border-ivory-300 rounded-[2px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-graphite-500 block">
                OVERALL SCORE
              </span>
              <div className="my-2">
                <span className="text-4xl font-black text-cobalt-700">
                  {result.percentage}%
                </span>
                <span className="text-xs text-graphite-500 ml-2">
                  ({result.correctAnswers}/{result.totalQuestions} pts)
                </span>
              </div>
              <span className="text-[10px] text-graphite-600">
                {passedThreshold ? '✓ Benchmark Met' : '⚠ Below Benchmark (70%)'}
              </span>
            </div>

            {/* Questions Attempted */}
            <div className="p-6 bg-white border border-ivory-300 rounded-[2px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-graphite-500 block">
                QUESTIONS ATTEMPTED
              </span>
              <div className="my-2">
                <span className="text-4xl font-black text-graphite-900">
                  {result.attemptedQuestions}
                </span>
                <span className="text-xs text-graphite-500 ml-1">/ {result.totalQuestions}</span>
              </div>
              <span className="text-[10px] text-graphite-600">
                {result.totalQuestions - result.attemptedQuestions === 0
                  ? '100% Response Rate'
                  : `${result.totalQuestions - result.attemptedQuestions} Skipped`}
              </span>
            </div>

            {/* Accuracy Breakdown */}
            <div className="p-6 bg-white border border-ivory-300 rounded-[2px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-graphite-500 block">
                CORRECT / INCORRECT
              </span>
              <div className="my-2 flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-700">
                  {result.correctAnswers}
                </span>
                <span className="text-graphite-400">/</span>
                <span className="text-3xl font-black text-red-600">
                  {result.totalQuestions - result.correctAnswers}
                </span>
              </div>
              <span className="text-[10px] text-graphite-600">
                Empirical Evaluation Score
              </span>
            </div>

            {/* Integrity Signal Telemetry */}
            <div className="p-6 bg-white border border-ivory-300 rounded-[2px] shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-graphite-500 block">
                INTEGRITY TELEMETRY
              </span>
              <div className="my-2">
                <span
                  className={`inline-block font-mono text-[11px] uppercase px-2.5 py-1 border font-bold tracking-wider ${integrityBadgeClass}`}
                >
                  {result.integrityStatus}
                </span>
              </div>
              <span className="text-[10px] text-graphite-500">
                {result.integritySignalCount} audit {result.integritySignalCount === 1 ? 'event' : 'events'} logged
              </span>
            </div>
          </div>

          {/* Diagnostic Strengths & Areas Needing Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths Card */}
            <div className="p-6 sm:p-8 bg-white border border-ivory-300 rounded-[2px] shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-ivory-200">
                <span className="w-2 h-2 bg-emerald-600 rounded-full" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800">
                  OBSERVED TECHNICAL STRENGTHS
                </h3>
              </div>

              {result.strengths.length > 0 ? (
                <ul className="space-y-2.5 text-xs text-graphite-700 font-mono">
                  {result.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-graphite-500 font-mono">
                  Focus on fundamentals in the upcoming practice exercises.
                </p>
              )}
            </div>

            {/* Areas Needing Improvement Card */}
            <div className="p-6 sm:p-8 bg-white border border-ivory-300 rounded-[2px] shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-ivory-200">
                <span className="w-2 h-2 bg-amber-600 rounded-full" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-800">
                  AREAS NEEDING IMPROVEMENT
                </h3>
              </div>

              {result.areasNeedingImprovement.length > 0 ? (
                <ul className="space-y-2.5 text-xs text-graphite-700 font-mono">
                  {result.areasNeedingImprovement.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-graphite-500 font-mono">
                  Exceptional performance across all tested category rubrics.
                </p>
              )}
            </div>
          </div>

          {/* Detailed Question Review Accordion */}
          <div className="border border-ivory-300 bg-white p-6 sm:p-8 rounded-[2px] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-ivory-300">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                  TRANSPARENT AUDIT TRAIL
                </span>
                <h3 className="text-xl font-black uppercase text-graphite-900 tracking-tight">
                  Question-by-Question Diagnostic Review
                </h3>
              </div>
              <span className="font-mono text-xs text-graphite-500">
                Click a question to inspect verifiable explanations
              </span>
            </div>

            <div className="divide-y divide-ivory-200 border-t border-b border-ivory-200">
              {result.questionsReview.map((item, idx) => {
                const isOpen = openReviewId === item.id;
                const isCorrect = item.isCorrect;

                return (
                  <div key={item.id} className="py-4 space-y-3">
                    <div
                      onClick={() => toggleReviewItem(item.id)}
                      className="flex items-start justify-between gap-4 cursor-pointer hover:bg-ivory-50 p-2 -m-2 rounded transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isCorrect ? '✓' : '✗'}
                        </span>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 font-mono text-[10px] text-graphite-500">
                            <span className="font-bold text-cobalt-700">Q{String(idx + 1).padStart(2, '0')}</span>
                            <span>•</span>
                            <span className="uppercase">{item.category}</span>
                          </div>
                          <p className="text-sm font-semibold text-graphite-900 leading-snug">
                            {item.questionText}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                        <span
                          className={`px-2 py-0.5 border text-[10px] font-bold uppercase ${
                            isCorrect
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-red-50 text-red-800 border-red-300'
                          }`}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                        <span className="text-graphite-400">{isOpen ? '▴' : '▾'}</span>
                      </div>
                    </div>

                    {/* Expanded Review Drawer */}
                    {isOpen && (
                      <div className="pl-9 pr-2 pt-2 pb-4 space-y-4 font-mono text-xs bg-ivory-50/70 p-4 border border-ivory-200 rounded-[2px]">
                        {item.codeSnippet && (
                          <div className="p-3 bg-[#1e1e24] text-[#f8f8f2] rounded text-[11px] overflow-x-auto">
                            <pre>{item.codeSnippet}</pre>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 bg-white border border-ivory-300 rounded">
                            <span className="text-[10px] uppercase text-graphite-500 block">YOUR SUBMITTED ANSWER</span>
                            <div className="mt-1 font-bold text-graphite-900">
                              Option {item.userAnswer || 'None (Skipped)'}
                            </div>
                          </div>

                          <div className="p-3 bg-white border border-ivory-300 rounded">
                            <span className="text-[10px] uppercase text-cobalt-700 font-bold block">
                              CORRECT BENCHMARK ANSWER
                            </span>
                            <div className="mt-1 font-bold text-cobalt-900">
                              Option {item.correctAnswer}
                            </div>
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="p-3 bg-white border border-ivory-300 rounded space-y-1">
                          <span className="text-[10px] uppercase text-cobalt-700 font-bold block">
                            EXPLANATION & DIAGNOSTIC RATIONALE
                          </span>
                          <p className="text-xs text-graphite-700 font-sans leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row — Completion Flow */}
          <div className="pt-6 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to={`/domains?domainId=${domainId}&skillId=${skillId}`}
              className="px-6 py-3.5 border border-graphite-900 text-graphite-900 hover:bg-graphite-900 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px]"
            >
              &larr; Choose Another Skill
            </Link>

            {/* Requirement 11: Continue to Approach Round */}
            <button
              type="button"
              onClick={handleContinueToApproach}
              className="w-full sm:w-auto px-8 py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-[2px] font-bold shadow-sm flex items-center justify-center gap-3"
            >
              <span>Continue to Approach Round</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
