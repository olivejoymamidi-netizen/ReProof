import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { getProjectAttempt } from '../api/project';
import type { ProjectEvaluationResult } from '../api/project';

export const ProjectResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const attemptId = searchParams.get('attemptId') || '';
  const domainId = searchParams.get('domainId') || 'ai-ml';
  const skillId = searchParams.get('skillId') || 'python-for-ml';
  const levelId = searchParams.get('levelId') || '1';

  const [result, setResult] = useState<ProjectEvaluationResult | null>(
    (location.state as any)?.result || null
  );
  const [isLoading, setIsLoading] = useState(!result && !!attemptId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewCodeModal, setViewCodeModal] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function fetchEvaluation() {
      if (result || !attemptId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const attempt = await getProjectAttempt(attemptId);
        if (!isMounted) return;

        const evalRes = attempt.evaluationResult || (attempt as any).evaluation;
        if (evalRes) {
          setResult(evalRes);
        }
        if (attempt.draftSubmission?.sourceCode) {
          setSubmittedCode(attempt.draftSubmission.sourceCode);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Error fetching project evaluation.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchEvaluation();
    return () => {
      isMounted = false;
    };
  }, [attemptId, result]);

  const handleContinueToInterview = () => {
    navigate(
      `/technical-interview?domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(skillId)}&levelId=${encodeURIComponent(levelId)}&projectAttemptId=${encodeURIComponent(attemptId)}`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-ivory-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-8 h-8 border-2 border-cobalt-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
              EVALUATING PROJECT DELIVERABLES
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              Scoring Against Rubric Criteria
            </h2>
            <p className="text-xs text-graphite-600 font-mono">
              Parsing invariants, constraints, and code quality benchmarks...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !result) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-rose-300 bg-white rounded-[2px] shadow-sm space-y-4 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-rose-700 font-bold block">
            EVALUATION NOT AVAILABLE
          </span>
          <h2 className="text-lg font-bold text-graphite-900">
            {errorMessage || 'Project evaluation record could not be found.'}
          </h2>
          <div className="pt-2">
            <Link
              to={`/project?domainId=${domainId}&skillId=${skillId}&levelId=${levelId}`}
              className="px-5 py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors inline-block"
            >
              Return to Project Workstation &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Integrity badge styling
  let integrityBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (result.integrityStatus === 'Warning') {
    integrityBadgeClass = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (result.integrityStatus === 'Multiple Integrity Signals' || result.integrityStatus === 'Review Required') {
    integrityBadgeClass = 'bg-orange-50 text-orange-800 border-orange-300';
  }

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Header */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-graphite-500">
              <span className="w-2 h-2 bg-emerald-700"></span>
              <span className="text-emerald-700 font-bold">
                PROJECT ROUND COMPLETE
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-700 font-semibold">
                {result.domainId.toUpperCase()} // {result.skillId.toUpperCase()}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-500">
                LEVEL 0{result.levelNumber}
              </span>
            </div>

            <span className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border rounded-[2px] ${integrityBadgeClass}`}>
              {result.integrityStatus} ({result.integritySignalCount} signals)
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-graphite-900 uppercase">
                Project Evaluation Audit
              </h1>
              <p className="text-sm sm:text-base text-graphite-600">
                Your implementation deliverables have been audited against the calibrated rubric. This outcome constitutes primary evidence for your Final Technical Interview.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleContinueToInterview}
                className="px-8 py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-bold shadow-sm flex items-center gap-3 cursor-pointer"
              >
                <span>Continue to Technical Interview</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (4 Cols): Overall Score & Telemetry Meta */}
          <div className="lg:col-span-4 space-y-6">
            {/* Scorecard */}
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-5 shadow-sm text-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                OVERALL PROJECT BENCHMARK
              </span>

              <div className="py-2">
                <div className="text-6xl font-black text-graphite-900 tracking-tight font-mono">
                  {result.overallScore}
                  <span className="text-2xl text-graphite-400 font-normal">/100</span>
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-graphite-500 mt-1">
                  Rubric Weighted Composite
                </div>
              </div>

              <div className="border-t border-ivory-200 pt-4 space-y-2 text-left font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-ivory-100">
                  <span className="text-graphite-500">ATTEMPT REF:</span>
                  <span className="text-graphite-900 font-bold truncate max-w-[180px]">{result.attemptId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-ivory-100">
                  <span className="text-graphite-500">EVALUATED AT:</span>
                  <span className="text-graphite-900">
                    {new Date(result.evaluatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-graphite-500">AUDIT HASH:</span>
                  <span className="text-graphite-700 text-[10px] truncate max-w-[160px]">{result.auditHash}</span>
                </div>
              </div>

              {submittedCode && (
                <button
                  type="button"
                  onClick={() => setViewCodeModal(true)}
                  className="w-full py-2 border border-ivory-300 hover:bg-ivory-100 font-mono text-xs uppercase tracking-wider text-graphite-700 transition-colors rounded-[2px] cursor-pointer"
                >
                  View Submitted Code Delta
                </button>
              )}
            </div>

            {/* Strengths & Improvements */}
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-4 shadow-sm">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 font-bold block mb-2">
                  DEMONSTRATED STRENGTHS
                </span>
                <ul className="space-y-1.5 text-xs text-graphite-700">
                  {result.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-ivory-200 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block mb-2">
                  AREAS FOR TECHNICAL GROWTH
                </span>
                <ul className="space-y-1.5 text-xs text-graphite-700">
                  {result.areasNeedingImprovement.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cobalt-700 font-bold">→</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column (8 Cols): Detailed Rubric Breakdown */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-6 shadow-sm">
              <div className="border-b border-ivory-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                    OBJECTIVE RUBRIC CRITERIA
                  </span>
                  <h3 className="text-lg font-bold text-graphite-900">
                    Dimension Evaluation & Feedback
                  </h3>
                </div>
                <span className="text-xs font-mono text-graphite-500">
                  {result.criteriaScores.length} Evaluated Dimensions
                </span>
              </div>

              <div className="space-y-5">
                {result.criteriaScores.map((criterion) => (
                  <div key={criterion.id} className="p-4 bg-ivory-50 border border-ivory-200 rounded-[2px] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-bold text-graphite-900 text-sm">
                        {criterion.name}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-graphite-500">
                          Weight: {criterion.weight}%
                        </span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white border border-ivory-300 text-cobalt-700">
                          {criterion.score} / 100
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-cobalt-700 h-full transition-all duration-500"
                        style={{ width: `${criterion.score}%` }}
                      />
                    </div>

                    <p className="text-xs text-graphite-600 leading-relaxed font-sans pt-1">
                      {criterion.feedback}
                    </p>
                  </div>
                ))}
              </div>

              {/* Next Step Banner */}
              <div className="p-4 bg-cobalt-50 border border-cobalt-200 rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-cobalt-950 uppercase font-mono tracking-wider">
                    Next: Final Technical Interview
                  </div>
                  <p className="text-xs text-cobalt-800">
                    You will now defend your architectural decisions and answer context-aware questions referencing this project.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleContinueToInterview}
                  className="px-6 py-3 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-bold shrink-0 cursor-pointer"
                >
                  Start Interview →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Viewer Modal */}
      {viewCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-ivory-300 max-w-3xl w-full p-6 rounded-[2px] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-graphite-900">
                Submitted Project Code Buffer
              </h3>
              <button
                onClick={() => setViewCodeModal(false)}
                className="text-graphite-400 hover:text-graphite-900 font-mono text-xs"
              >
                ✕ Close
              </button>
            </div>
            <pre className="p-4 bg-graphite-900 text-ivory-100 font-mono text-xs max-h-96 overflow-y-auto rounded-[2px] leading-relaxed">
              {submittedCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
