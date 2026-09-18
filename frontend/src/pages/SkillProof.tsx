import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  getSkillProof,
  getLatestIntelligence,
  submitScoreAppeal,
  getAppealByProofId,
} from '../api/intelligence';
import type { SkillProofCredential, ScoreAppeal } from '../api/intelligence';

export const SkillProof: React.FC = () => {
  const [searchParams] = useSearchParams();

  const proofId = searchParams.get('proofId') || '';
  const skillId =
    searchParams.get('skillId') ||
    localStorage.getItem('reproof_selected_skill') ||
    'python-for-ml';

  const levelId =
    searchParams.get('levelId') ||
    searchParams.get('levelNumber') ||
    localStorage.getItem('reproof_selected_level') ||
    '1';

  const [proof, setProof] = useState<SkillProofCredential | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Score Appeal State
  const [appealData, setAppealData] = useState<ScoreAppeal | null>(null);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [appealReason, setAppealReason] = useState('RUBRIC_INTERPRETATION');
  const [appealExplanation, setAppealExplanation] = useState('');
  const [appealSupporting, setAppealSupporting] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [appealError, setAppealError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProof() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        let loadedProof: SkillProofCredential | null = null;
        if (proofId) {
          loadedProof = await getSkillProof(proofId);
        } else {
          loadedProof = await getLatestIntelligence(skillId, levelId);
        }

        if (!isMounted) return;
        setProof(loadedProof);

        // Check if an appeal already exists for this proof
        if (loadedProof?.proofId) {
          try {
            const existingAppeal = await getAppealByProofId(loadedProof.proofId);
            if (isMounted && existingAppeal) {
              setAppealData(existingAppeal);
            }
          } catch {
            // No prior appeal on record
          }
        }
      } catch (err: any) {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Unable to retrieve verified Skill Proof credential.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProof();

    return () => {
      isMounted = false;
    };
  }, [proofId, skillId, levelId]);

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof?.proofId) return;

    if (appealExplanation.trim().length < 20) {
      setAppealError('Please provide a substantive explanation (at least 20 characters) detailing why your evidence warrants re-examination.');
      return;
    }

    setIsSubmittingAppeal(true);
    setAppealError(null);

    try {
      const appealResult = await submitScoreAppeal({
        originalProofId: proof.proofId,
        reasonCategory: appealReason,
        explanation: appealExplanation,
        supportingEvidence: appealSupporting,
      });

      setAppealData(appealResult);
      setIsAppealModalOpen(false);
    } catch (err: any) {
      setAppealError(err.message || 'Failed to submit score appeal.');
    } finally {
      setIsSubmittingAppeal(false);
    }
  };

  const handleCopyAuditHash = () => {
    if (!proof?.auditHash) return;
    navigator.clipboard?.writeText(proof.auditHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-ivory-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-8 h-8 border-2 border-cobalt-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
              RETRIEVING SKILL PROOF CREDENTIAL
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              Verifying Audit Ledger
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !proof) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-rose-300 bg-white rounded-[2px] shadow-sm space-y-4 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-rose-700 font-bold block">
            PROOF NOT FOUND
          </span>
          <h2 className="text-lg font-bold text-graphite-900">
            {errorMessage || 'Skill Proof record does not exist.'}
          </h2>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors inline-block"
            >
              Return to Dashboard &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let statusBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (proof.verificationStatus === 'Developing') {
    statusBadgeColor = 'bg-amber-50 text-amber-900 border-amber-300';
  } else if (proof.verificationStatus === 'Insufficient Evidence') {
    statusBadgeColor = 'bg-gray-100 text-gray-800 border-gray-300';
  }

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-20">
      {/* Top Ledger Strip */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6] print:hidden">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs text-graphite-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
            <span className="font-bold text-graphite-900 uppercase">
              REPROOF INSTITUTIONAL SKILL PROOF
            </span>
            <span className="text-ivory-300">/</span>
            <span>PUBLIC AUDIT RECORD</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="hover:text-graphite-900 transition-colors uppercase tracking-wider text-[11px] cursor-pointer"
            >
              ⎙ Print Document
            </button>
            <span className="text-ivory-300">|</span>
            <button
              onClick={handleCopyAuditHash}
              className="text-cobalt-700 hover:text-cobalt-900 transition-colors uppercase tracking-wider text-[11px] font-bold cursor-pointer"
            >
              {copied ? '✓ Copied Hash' : 'Copy Hash'}
            </button>
          </div>
        </div>
      </section>

      {/* Main Official Document Sheet */}
      <main className="max-w-[1200px] mx-auto w-full px-6 sm:px-12 py-10">
        <div className="bg-white border-2 border-graphite-900 p-8 sm:p-14 shadow-lg rounded-[2px] space-y-10">
          {/* Header Block */}
          <div className="border-b-2 border-graphite-900 pb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-cobalt-700 font-bold block">
                REPROOF // EMPIRICAL COMPETENCY VERIFICATION
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-graphite-900 tracking-tight uppercase leading-none">
                Skill Proof Credential
              </h1>
              <p className="text-xs sm:text-sm text-graphite-600 font-mono">
                An observable competency dossier answering: <em>"What can this learner actually demonstrate?"</em>
              </p>
            </div>

            <div className="text-left md:text-right font-mono space-y-1">
              <span className="text-[10px] text-graphite-400 uppercase block">ASSESSMENT ID</span>
              <div className="text-xs font-bold text-graphite-900 truncate max-w-[240px]">{proof.proofId}</div>
              <div className="pt-2">
                <span className={`inline-block px-3 py-1 font-bold text-xs uppercase border rounded-[2px] ${statusBadgeColor}`}>
                  STATUS: {proof.verificationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Core Profile Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 font-mono border-b border-ivory-300 pb-8 text-xs">
            <div>
              <span className="text-[10px] uppercase text-graphite-400 block font-bold">LEARNER</span>
              <span className="text-sm font-bold text-graphite-900 block mt-0.5">{proof.userName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-graphite-400 block font-bold">DOMAIN</span>
              <span className="text-sm font-bold text-graphite-900 block mt-0.5">{proof.domainName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-graphite-400 block font-bold">SKILL</span>
              <span className="text-sm font-bold text-cobalt-700 block mt-0.5">{proof.skillName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-graphite-400 block font-bold">ASSESSED LEVEL</span>
              <span className="text-sm font-bold text-graphite-900 block mt-0.5">Level 0{proof.assessedLevel}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-graphite-400 block font-bold">COMPETENCY STAGE</span>
              <span className="text-sm font-black text-graphite-900 block mt-0.5 uppercase tracking-wide">
                {proof.currentCompetencyStage}
              </span>
            </div>
          </div>

          {/* Section 1: Demonstrated Competencies */}
          <div className="space-y-4 border-b border-ivory-300 pb-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-800 font-black">
                DEMONSTRATED COMPETENCIES ({proof.demonstratedCompetencies.length})
              </span>
              <span className="font-mono text-[10px] text-graphite-500 uppercase">Confirmed with empirical artifacts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {proof.demonstratedCompetencies.map((comp, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/50 border border-emerald-300/80 rounded-[2px] flex items-start gap-2.5">
                  <span className="text-emerald-700 font-bold font-mono">✓</span>
                  <span className="text-xs font-bold text-emerald-950">{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Developing Competencies */}
          {proof.developingCompetencies.length > 0 && (
            <div className="space-y-4 border-b border-ivory-300 pb-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-amber-800 font-black">
                  DEVELOPING COMPETENCIES ({proof.developingCompetencies.length})
                </span>
                <span className="font-mono text-[10px] text-graphite-500 uppercase">Partial command observed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {proof.developingCompetencies.map((comp, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/50 border border-amber-300/80 rounded-[2px] flex items-start gap-2.5">
                    <span className="text-amber-700 font-bold font-mono">→</span>
                    <span className="text-xs font-bold text-amber-950">{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Identified Skill Gaps */}
          <div className="space-y-4 border-b border-ivory-300 pb-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-graphite-900 font-black">
                IDENTIFIED SKILL GAPS ({proof.skillGaps.length})
              </span>
              <span className="font-mono text-[10px] text-graphite-500 uppercase">Expected vs. Observed Divergence</span>
            </div>

            <div className="space-y-3">
              {proof.skillGaps.map((gap, idx) => (
                <div key={idx} className="p-4 bg-ivory-50 border border-ivory-300 rounded-[2px] space-y-2 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-graphite-900">{gap.competencyName}</span>
                    <span className="text-amber-800 uppercase text-[10px] font-bold">{gap.severity} severity</span>
                  </div>
                  <div className="text-graphite-700 leading-relaxed font-sans">{gap.gapDefinition}</div>
                  <div className="text-[11px] font-mono text-cobalt-700 pt-1">
                    Direct Remediation: {gap.suggestedImprovement}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: 5-Round Evidence Dossier Breakdown */}
          <div className="space-y-4 border-b border-ivory-300 pb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-graphite-900 font-black block">
              5-ROUND EVIDENCE DOSSIER SUMMARY
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-[2px] space-y-1">
                <span className="text-[10px] text-graphite-400 block font-bold">1. KNOWLEDGE</span>
                <div className="text-base font-bold text-graphite-900">{proof.evidenceDossier.knowledge.score}%</div>
                <div className="text-[10px] text-emerald-700">✓ Diagnostic Probes</div>
              </div>

              <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-[2px] space-y-1">
                <span className="text-[10px] text-graphite-400 block font-bold">2. APPROACH</span>
                <div className="text-base font-bold text-graphite-900">{proof.evidenceDossier.approach.status}</div>
                <div className="text-[10px] text-emerald-700 truncate">{proof.evidenceDossier.approach.complexityProjected}</div>
              </div>

              <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-[2px] space-y-1">
                <span className="text-[10px] text-graphite-400 block font-bold">3. CODING</span>
                <div className="text-base font-bold text-graphite-900">{proof.evidenceDossier.coding.testsPassedPct}%</div>
                <div className="text-[10px] text-emerald-700">✓ Regression Pass</div>
              </div>

              <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-[2px] space-y-1">
                <span className="text-[10px] text-graphite-400 block font-bold">4. PROJECT</span>
                <div className="text-base font-bold text-graphite-900">{proof.evidenceDossier.project.score}/100</div>
                <div className="text-[10px] text-emerald-700">✓ Rubric Audited</div>
              </div>

              <div className="p-3 bg-ivory-50 border border-ivory-300 rounded-[2px] space-y-1">
                <span className="text-[10px] text-graphite-400 block font-bold">5. INTERVIEW</span>
                <div className="text-base font-bold text-graphite-900">{proof.evidenceDossier.interview.score}/100</div>
                <div className="text-[10px] text-emerald-700 truncate">{proof.evidenceDossier.interview.consistencyStatus}</div>
              </div>
            </div>
          </div>

          {/* Section 5: Recommendations & Verification Target */}
          <div className="space-y-4 border-b border-ivory-300 pb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-cobalt-700 font-black block">
              RECOMMENDATIONS & VERIFICATION TARGETS
            </span>

            <div className="space-y-3">
              {proof.recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-ivory-50 border border-ivory-200 rounded-[2px] text-xs space-y-1.5 font-sans">
                  <div className="flex justify-between font-mono text-xs font-bold text-graphite-900">
                    <span>{rec.skillGap}</span>
                    <span className="text-cobalt-700 font-normal uppercase text-[10px]">{rec.suggestedDifficulty}</span>
                  </div>
                  <p className="text-graphite-700">{rec.suggestedActivity}</p>
                  <div className="font-mono text-[11px] text-emerald-800 pt-1">
                    Target: {rec.verificationTarget}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Score Appeal Resolution & Second Opinion */}
          {appealData && (
            <div className="space-y-4 border-b border-ivory-300 pb-8 bg-cobalt-50/40 p-6 border border-cobalt-200 rounded-[2px]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-cobalt-700"></span>
                  <span className="font-mono text-xs uppercase tracking-widest text-cobalt-900 font-bold">
                    SCORE APPEAL // SECOND-OPINION RESOLUTION
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300 font-bold">
                    STATUS: {appealData.status}
                  </span>
                  <span className="font-mono text-[10px] uppercase bg-cobalt-100 text-cobalt-800 px-2 py-0.5 border border-cobalt-300 font-bold">
                    VERSION: {appealData.evaluationVersionAppeal}
                  </span>
                </div>
              </div>

              {/* Side-by-side Score Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-white p-4 border border-ivory-300 rounded-[2px] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-graphite-400 block font-bold">INITIAL SCORE</span>
                  <div className="text-2xl font-black text-graphite-700">{appealData.originalEvaluation.overallScore}/100</div>
                  <div className="font-mono text-[10px] text-graphite-500">Version: {appealData.evaluationVersionOriginal}</div>
                </div>

                <div className="bg-white p-4 border border-cobalt-300 rounded-[2px] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-cobalt-700 block font-bold">RE-EVALUATION SCORE</span>
                  <div className="text-2xl font-black text-cobalt-900">{appealData.secondEvaluation.overallScore}/100</div>
                  <div className="font-mono text-[10px] text-cobalt-700">Version: {appealData.evaluationVersionAppeal}</div>
                </div>

                <div className="bg-white p-4 border border-ivory-300 rounded-[2px] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-graphite-400 block font-bold">NET ADJUSTMENT</span>
                  <div className={`text-2xl font-black ${appealData.scoreDelta > 0 ? 'text-emerald-700' : 'text-graphite-700'}`}>
                    {appealData.scoreDelta > 0 ? `+${appealData.scoreDelta} PTS` : 'CONFIRMED'}
                  </div>
                  <div className="font-mono text-[10px] text-graphite-500">Stage: {appealData.secondEvaluation.currentCompetencyStage}</div>
                </div>
              </div>

              {/* Resolution Explanation */}
              <div className="bg-white p-4 border border-ivory-300 rounded-[2px] space-y-2">
                <span className="font-mono text-[10px] uppercase text-cobalt-700 block font-bold">
                  COMMITTEE RE-EVALUATION RATIONALE
                </span>
                <p className="text-xs text-graphite-700 leading-relaxed">
                  {appealData.explanationOfChange}
                </p>
                <div className="font-mono text-[10px] text-graphite-500 pt-1 border-t border-ivory-200 flex justify-between">
                  <span>GROUNDED APPEAL BASIS: {appealData.reasonCategory.replace(/_/g, ' ')}</span>
                  <span>RESOLVED AT: {new Date(appealData.resolvedAt).toUTCString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Cryptographic Ledger Footer */}
          <div className="pt-2 font-mono text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-graphite-500 text-[10px]">
              <div>AUTHENTICATED VIA REPROOF INTELLIGENCE DETERMINISTIC ENGINE</div>
              <div>EVALUATED AT: {new Date(proof.evaluatedAt).toUTCString()}</div>
            </div>

            <div className="p-3 bg-ivory-100 border border-ivory-300 rounded-[2px] break-all text-[11px] text-graphite-700">
              <span className="text-graphite-400 font-bold block text-[9px] uppercase">SHA-256 PROOF HASH</span>
              {proof.auditHash}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <Link
                to={`/evidence-analysis?domainId=${proof.domainId}&skillId=${proof.skillId}&levelId=${proof.assessedLevel}`}
                className="px-5 py-3 border border-graphite-900 text-graphite-900 hover:bg-graphite-900 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px]"
              >
                &larr; Back to Evidence
              </Link>

              <button
                type="button"
                onClick={() => setIsAppealModalOpen(true)}
                className="px-5 py-3 border border-cobalt-700 text-cobalt-700 hover:bg-cobalt-50 font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-semibold"
              >
                {appealData ? 'View / Re-Appeal' : 'Appeal Evaluation'}
              </button>
            </div>

            <Link
              to="/practice"
              className="px-8 py-3.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-bold"
            >
              Proceed to Practice Drills &rarr;
            </Link>
          </div>

          {/* Score Appeal Modal */}
          {isAppealModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-900/60 backdrop-blur-sm p-4 print:hidden">
              <div className="bg-white max-w-lg w-full border border-graphite-900 p-6 sm:p-8 space-y-6 shadow-2xl rounded-[2px]">
                <div className="space-y-1 border-b border-ivory-300 pb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                    FORMAL EVALUATION RECONSIDERATION
                  </span>
                  <h3 className="text-xl font-black uppercase text-graphite-900">
                    Appeal Competency Evaluation
                  </h3>
                  <p className="text-xs text-graphite-600">
                    ReProof preserves the original evaluation ledger and conducts a secondary audit using the identical level rubric against your submitted code and interview artifacts.
                  </p>
                </div>

                <form onSubmit={handleSubmitAppeal} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-graphite-700 font-bold mb-1">
                      Appeal Grounds / Category
                    </label>
                    <select
                      value={appealReason}
                      onChange={(e) => setAppealReason(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 bg-ivory-50 border border-ivory-300 rounded-[2px] focus:outline-none focus:border-cobalt-700"
                    >
                      <option value="RUBRIC_INTERPRETATION">Rubric Interpretation & Complexity Bounds</option>
                      <option value="ALTERNATIVE_VALID_APPROACH">Valid Alternative Architectural Approach</option>
                      <option value="EDGE_CASE_HANDLING">Edge Case Handling Satisfied Invariants</option>
                      <option value="ENVIRONMENT_GLITCH">Sandbox / Diagnostic Misclassification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-graphite-700 font-bold mb-1">
                      Technical Justification (Detailed Defense)
                    </label>
                    <textarea
                      rows={4}
                      value={appealExplanation}
                      onChange={(e) => setAppealExplanation(e.target.value)}
                      placeholder="Explain specifically which test cases, code invariant assertions, or verbal interview responses warrant re-evaluation..."
                      className="w-full text-xs p-3 bg-ivory-50 border border-ivory-300 rounded-[2px] focus:outline-none focus:border-cobalt-700 font-sans"
                      required
                    />
                    <span className="text-[10px] text-graphite-400 font-mono">Minimum 20 characters explaining technical merits.</span>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-graphite-700 font-bold mb-1">
                      Supporting References / Benchmark Line Numbers (Optional)
                    </label>
                    <input
                      type="text"
                      value={appealSupporting}
                      onChange={(e) => setAppealSupporting(e.target.value)}
                      placeholder="e.g. Solution lines 24-42 pass O(N) constraint; RFC 7519 standard"
                      className="w-full text-xs p-2.5 bg-ivory-50 border border-ivory-300 rounded-[2px] focus:outline-none focus:border-cobalt-700 font-sans"
                    />
                  </div>

                  {appealError && (
                    <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-[2px]">
                      {appealError}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-ivory-300">
                    <button
                      type="button"
                      onClick={() => setIsAppealModalOpen(false)}
                      className="px-4 py-2 border border-ivory-300 text-graphite-700 font-mono text-xs uppercase hover:bg-ivory-100 rounded-[2px]"
                      disabled={isSubmittingAppeal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingAppeal}
                      className="px-6 py-2 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-[2px] disabled:opacity-50"
                    >
                      {isSubmittingAppeal ? 'Auditing Submissions...' : 'Submit Appeal &rarr;'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
