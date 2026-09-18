import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { getInterviewAttempt } from '../api/interview';
import type { InterviewEvaluationResult } from '../api/interview';

export const InterviewResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const attemptId = searchParams.get('attemptId') || '';
  const domainId = searchParams.get('domainId') || 'ai-ml';

  const [result, setResult] = useState<InterviewEvaluationResult | null>(
    (location.state as any)?.result || null
  );
  const [isLoading, setIsLoading] = useState(!result && !!attemptId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openTranscriptId, setOpenTranscriptId] = useState<string | null>(null);
  const [showNextRoundModal, setShowNextRoundModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchEvaluation() {
      if (result || !attemptId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const attempt = await getInterviewAttempt(attemptId);
        if (!isMounted) return;

        const evalRes = attempt.evaluationResult || (attempt as any).evaluation;
        if (evalRes) {
          setResult(evalRes);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Error fetching interview evaluation result.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchEvaluation();
    return () => {
      isMounted = false;
    };
  }, [attemptId, result]);

  const toggleTranscriptItem = (id: string) => {
    setOpenTranscriptId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-ivory-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-8 h-8 border-2 border-cobalt-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
              EVALUATING TECHNICAL INTERVIEW
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              Assessing Technical Reasoning
            </h2>
            <p className="text-xs text-graphite-600 font-mono">
              Scoring explanations and verifying cross-round consistency...
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
            EVALUATION NOT FOUND
          </span>
          <h2 className="text-lg font-bold text-graphite-900">
            {errorMessage || 'Interview evaluation result could not be retrieved.'}
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

  // Consistency Badge
  let consistencyBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (result.crossRoundConsistency.status === 'Moderate Alignment') {
    consistencyBadgeClass = 'bg-sky-50 text-sky-800 border-sky-300';
  } else if (result.crossRoundConsistency.status === 'Variance Observed') {
    consistencyBadgeClass = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (result.crossRoundConsistency.status === 'Inconclusive') {
    consistencyBadgeClass = 'bg-gray-100 text-gray-700 border-gray-300';
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
                FINAL INTERVIEW COMPLETE
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

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border rounded-[2px] font-semibold ${consistencyBadgeClass}`}>
                Consistency: {result.crossRoundConsistency.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-graphite-900 uppercase">
                Technical Interview Audit
              </h1>
              <p className="text-sm sm:text-base text-graphite-600">
                Your verbal explanations have been mapped to rubric criteria and audited for consistency with your submitted project implementation and knowledge diagnostics.
              </p>
            </div>

            {/* Requirement 14 & Round 4: Continue to Evidence Analysis */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/evidence-analysis?domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(result.skillId)}&levelId=${encodeURIComponent(result.levelNumber)}&interviewAttemptId=${encodeURIComponent(attemptId)}`
                  )
                }
                className="px-8 py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-bold shadow-sm flex items-center gap-3 cursor-pointer"
              >
                <span>Continue to Evidence Analysis</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (4 cols): Composite Score & Cross-Round Consistency */}
          <div className="lg:col-span-4 space-y-6">
            {/* Overall Score */}
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-5 shadow-sm text-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                INTERVIEW BENCHMARK SCORE
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
            </div>

            {/* Cross-Round Consistency Card */}
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-4 shadow-sm">
              <div className="border-b border-ivory-200 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                  CROSS-ROUND CONSISTENCY AUDIT
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-graphite-900">
                    Verbal & Artifact Alignment
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 border rounded-[2px] font-bold ${consistencyBadgeClass}`}>
                    {result.crossRoundConsistency.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-graphite-700">
                {result.crossRoundConsistency.observations.map((obs, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-ivory-50 border border-ivory-200 rounded-[2px]">
                    <span className="text-cobalt-700 font-bold shrink-0 font-mono">0{idx + 1}.</span>
                    <span className="leading-relaxed">{obs}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-graphite-500 italic pt-1">
                Note: Inconsistency is treated as interpretive evidence for the final dossier rather than an automatic presumption of dishonesty.
              </p>
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

          {/* Right Column (8 cols): Rubric Dimensions & Transcript Review */}
          <div className="lg:col-span-8 space-y-6">
            {/* 5-Dimension Rubric Scoring */}
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-6 shadow-sm">
              <div className="border-b border-ivory-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                    RUBRIC DIMENSION BREAKDOWN
                  </span>
                  <h3 className="text-lg font-bold text-graphite-900">
                    Official 5-Criteria Evaluation
                  </h3>
                </div>
                <span className="text-xs font-mono text-graphite-500">
                  {result.rubricScores.length} Evaluated Dimensions
                </span>
              </div>

              <div className="space-y-4">
                {result.rubricScores.map((scoreItem, idx) => (
                  <div key={idx} className="p-4 bg-ivory-50 border border-ivory-200 rounded-[2px] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-graphite-900 text-sm">
                        {scoreItem.criterion}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-graphite-500">
                          Weight: {scoreItem.weight}%
                        </span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white border border-ivory-300 text-cobalt-700">
                          {scoreItem.score} / 100
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-cobalt-700 h-full transition-all duration-500"
                        style={{ width: `${scoreItem.score}%` }}
                      />
                    </div>

                    <p className="text-xs text-graphite-600 leading-relaxed font-sans pt-1">
                      {scoreItem.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transcript Review Drawer */}
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-5 shadow-sm">
              <div className="border-b border-ivory-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                    AUDIT TRANSCRIPT REVIEW
                  </span>
                  <h3 className="text-lg font-bold text-graphite-900">
                    Question Prompts & Candidate Explanations
                  </h3>
                </div>
                <span className="text-xs font-mono text-graphite-500">
                  {result.transcriptReview?.length || 0} Questions Audited
                </span>
              </div>

              <div className="space-y-4">
                {result.transcriptReview?.map((item, idx) => {
                  const isOpen = openTranscriptId === item.questionId;
                  return (
                    <div
                      key={item.questionId}
                      className="border border-ivory-200 bg-white rounded-[2px] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTranscriptItem(item.questionId)}
                        className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-ivory-50 transition-colors cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-cobalt-700">
                              Q0{idx + 1} // {item.focusArea}
                            </span>
                            <span className="font-mono text-[10px] text-graphite-400">
                              • Score: {item.evaluatedScore}/100
                            </span>
                          </div>
                          <p className="text-xs text-graphite-900 font-semibold line-clamp-2">
                            {item.questionText}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-graphite-500 shrink-0">
                          {isOpen ? '▲' : '▼'}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-ivory-50/70 border-t border-ivory-200 space-y-4">
                          <div className="p-3 bg-white border border-ivory-200 rounded-[2px] space-y-1">
                            <span className="font-mono text-[10px] uppercase text-cobalt-700 font-bold block">
                              EVIDENCE CONTEXT CITED:
                            </span>
                            <p className="text-xs text-graphite-700 font-sans leading-relaxed">
                              {item.contextCitation}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="font-mono text-[10px] uppercase text-graphite-500 font-bold block">
                              CANDIDATE RESPONSE PROSE:
                            </span>
                            <div className="p-3 bg-white border border-ivory-200 rounded-[2px] font-sans text-xs text-graphite-900 leading-relaxed whitespace-pre-wrap">
                              {item.candidateResponse || '(No response provided)'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="font-mono text-[10px] uppercase text-emerald-800 font-bold block">
                              EVALUATION REMARKS:
                            </span>
                            <p className="text-xs text-graphite-700 font-sans leading-relaxed">
                              {item.feedback}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Next Round Action Banner */}
            <div className="p-5 bg-cobalt-700 text-white rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-200 font-bold block">
                  ALL ASSESSMENT ROUNDS COMPLETE
                </span>
                <h4 className="text-base font-bold">
                  Knowledge → Approach → Coding → Project → Interview
                </h4>
                <p className="text-xs text-cobalt-100">
                  Ready to synthesize cross-round evidence into the comprehensive Skill Dossier.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/evidence-analysis?domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(result.skillId)}&levelId=${encodeURIComponent(result.levelNumber)}&interviewAttemptId=${encodeURIComponent(attemptId)}`
                  )
                }
                className="px-8 py-3.5 bg-white text-cobalt-900 hover:bg-ivory-100 font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-bold shrink-0 cursor-pointer shadow"
              >
                Continue to Evidence Analysis →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Next Round Modal (Notice for Round 4) */}
      {showNextRoundModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-ivory-300 max-w-lg w-full p-6 rounded-[2px] space-y-5 shadow-2xl">
            <div className="border-b border-ivory-200 pb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                ROUND 03 COMPLETE // REPROOF PIPELINE
              </span>
              <h3 className="text-lg font-bold text-graphite-900 mt-1">
                Evidence Analysis Round Queued
              </h3>
            </div>

            <div className="text-xs text-graphite-600 space-y-3 leading-relaxed">
              <p>
                Congratulations! You have successfully completed the <strong>Project Round</strong> and <strong>Final Technical Interview</strong> for <strong>{result.skillId}</strong>.
              </p>
              <div className="p-3 bg-ivory-100 border border-ivory-300 rounded-[2px] space-y-1.5 font-mono text-[11px]">
                <div className="text-emerald-700 font-bold">✓ Project Round Score: Recorded</div>
                <div className="text-emerald-700 font-bold">✓ Interview Round Score: {result.overallScore}/100</div>
                <div className="text-emerald-700 font-bold">✓ Cross-Round Consistency: {result.crossRoundConsistency.status}</div>
                <div className="text-cobalt-700">→ Evidence Analysis & Skill Gap Audit: Round 04 Phase</div>
              </div>
              <p className="text-graphite-500">
                The <em>Evidence Analysis, Skill Gap, Skill Proof, and Score Appeal</em> modules will be synthesized in the subsequent verification round as specified in your protocol roadmap.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNextRoundModal(false)}
                className="px-4 py-2 border border-ivory-300 hover:bg-ivory-100 text-graphite-700 font-mono text-xs uppercase tracking-wider rounded-[2px] cursor-pointer"
              >
                Close Window
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-2 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] inline-block"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
