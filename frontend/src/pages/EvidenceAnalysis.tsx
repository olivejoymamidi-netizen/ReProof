import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  analyzeMultiRoundEvidence,
  getLatestIntelligence,
} from '../api/intelligence';
import type {
  SkillProofCredential,
  CompetencyMatrixRow,
} from '../api/intelligence';

export const EvidenceAnalysis: React.FC = () => {
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
    searchParams.get('levelNumber') ||
    localStorage.getItem('reproof_selected_level') ||
    '1';

  const levelNumber = Number(levelId) || 1;
  const interviewAttemptId = searchParams.get('interviewAttemptId') || '';

  // State
  const [proof, setProof] = useState<SkillProofCredential | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCompetency, setSelectedCompetency] = useState<CompetencyMatrixRow | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'strengths' | 'gaps' | 'recommendations' | 'evidence'>('matrix');

  useEffect(() => {
    let isMounted = true;

    async function loadAnalysis() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        // First try requesting an updated multi-round analysis
        const result = await analyzeMultiRoundEvidence({
          domainId,
          skillId,
          levelNumber,
          evidencePayload: {
            interviewAttemptId,
          },
        });

        if (!isMounted) return;
        setProof(result);
        if (result.competencyMatrix?.length) {
          setSelectedCompetency(result.competencyMatrix[0]);
        }
      } catch (err: any) {
        // Fallback: try loading latest existing intelligence
        try {
          const fallback = await getLatestIntelligence(skillId, levelNumber);
          if (!isMounted) return;
          setProof(fallback);
          if (fallback.competencyMatrix?.length) {
            setSelectedCompetency(fallback.competencyMatrix[0]);
          }
        } catch {
          if (!isMounted) return;
          setErrorMessage(err.message || 'Error processing ReProof Intelligence analysis.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAnalysis();

    return () => {
      isMounted = false;
    };
  }, [domainId, skillId, levelNumber, interviewAttemptId]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-ivory-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-8 h-8 border-2 border-cobalt-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
              SYNTHESIZING REPROOF INTELLIGENCE
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              Mapping Multi-Round Evidence
            </h2>
            <p className="text-xs text-graphite-600 font-mono">
              Aggregating Knowledge, Approach, Coding, Project, and Technical Interview...
            </p>
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
            INTELLIGENCE AUDIT UNAVAILABLE
          </span>
          <h2 className="text-lg font-bold text-graphite-900">
            {errorMessage || 'Unable to aggregate multi-round evidence.'}
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

  // Stage Badge Colors
  let stageBadgeClass = 'bg-cobalt-100 text-cobalt-950 border-cobalt-300';
  if (proof.currentCompetencyStage === 'ADVANCED') {
    stageBadgeClass = 'bg-emerald-100 text-emerald-950 border-emerald-300';
  } else if (proof.currentCompetencyStage === 'APPLIED') {
    stageBadgeClass = 'bg-sky-100 text-sky-950 border-sky-300';
  } else if (proof.currentCompetencyStage === 'DEVELOPING') {
    stageBadgeClass = 'bg-amber-100 text-amber-950 border-amber-300';
  } else if (proof.currentCompetencyStage === 'FOUNDATION') {
    stageBadgeClass = 'bg-gray-100 text-gray-800 border-gray-300';
  }

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Top Editorial Eyebrow & Header */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-graphite-500">
              <span className="w-2 h-2 bg-cobalt-700"></span>
              <span className="text-cobalt-700 font-bold">
                {proof.domainName} // {proof.skillName}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-700 font-semibold">
                ASSESSED LEVEL 0{proof.assessedLevel}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-500">
                REPROOF INTELLIGENCE DOSSIER
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border rounded-[2px] ${stageBadgeClass}`}>
                CURRENT STAGE: {proof.currentCompetencyStage}
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-[2px]">
                {proof.verificationStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-4xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-graphite-900 uppercase">
                Observable Competency Analysis
              </h1>
              <p className="text-xs sm:text-sm text-graphite-600 leading-relaxed">
                Evidence gathered across <strong>Knowledge</strong>, <strong>Approach</strong>, <strong>Coding</strong>, <strong>Project</strong>, and <strong>Technical Interview</strong> mapped deterministically to observable rubric criteria.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={`/skill-proof?proofId=${proof.proofId}&domainId=${domainId}&skillId=${skillId}&levelId=${levelId}`}
                className="px-8 py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-bold shadow-sm flex items-center gap-3"
              >
                <span>View Verified Skill Proof</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Metric Overview Strip */}
      <section className="w-full bg-white border-b border-ivory-300">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 border-r border-ivory-200">
              <span className="text-[10px] uppercase text-graphite-500 block">DETERMINISTIC COMPOSITE</span>
              <div className="text-2xl font-black text-graphite-900 mt-0.5">
                {proof.overallScore} <span className="text-xs text-graphite-400 font-normal">/100</span>
              </div>
              <span className="text-[10px] text-cobalt-700">Weighted Multi-Round</span>
            </div>

            <div className="p-3 border-r border-ivory-200">
              <span className="text-[10px] uppercase text-graphite-500 block">DEMONSTRATED CRITERIA</span>
              <div className="text-2xl font-black text-emerald-800 mt-0.5">
                {proof.demonstratedCompetencies.length} <span className="text-xs text-graphite-400 font-normal">/ {proof.competencyMatrix.length}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Confirmed Mastery</span>
            </div>

            <div className="p-3 border-r border-ivory-200">
              <span className="text-[10px] uppercase text-graphite-500 block">IDENTIFIED SKILL GAPS</span>
              <div className="text-2xl font-black text-amber-800 mt-0.5">
                {proof.skillGaps.length}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold">Targeted Remediation</span>
            </div>

            <div className="p-3">
              <span className="text-[10px] uppercase text-graphite-500 block">INTEGRITY PROFILE</span>
              <div className="text-base font-bold text-graphite-900 mt-1 truncate">
                {proof.integrityProfile.status}
              </div>
              <span className="text-[10px] text-graphite-500">{proof.integrityProfile.totalSignals} signals observed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tab Bar */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 pt-6">
        <div className="flex border-b border-ivory-300 font-mono text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-5 py-3 uppercase tracking-wider font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'matrix'
                ? 'border-b-2 border-cobalt-700 text-cobalt-900 bg-white'
                : 'text-graphite-500 hover:text-graphite-900'
            }`}
          >
            1. Competency Matrix ({proof.competencyMatrix.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('strengths')}
            className={`px-5 py-3 uppercase tracking-wider font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'strengths'
                ? 'border-b-2 border-cobalt-700 text-cobalt-900 bg-white'
                : 'text-graphite-500 hover:text-graphite-900'
            }`}
          >
            2. Demonstrated Strengths ({proof.strengths.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gaps')}
            className={`px-5 py-3 uppercase tracking-wider font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'gaps'
                ? 'border-b-2 border-cobalt-700 text-cobalt-900 bg-white'
                : 'text-graphite-500 hover:text-graphite-900'
            }`}
          >
            3. Skill Gap Analysis ({proof.skillGaps.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('recommendations')}
            className={`px-5 py-3 uppercase tracking-wider font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'recommendations'
                ? 'border-b-2 border-cobalt-700 text-cobalt-900 bg-white'
                : 'text-graphite-500 hover:text-graphite-900'
            }`}
          >
            4. Personalized Recommendations ({proof.recommendations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`px-5 py-3 uppercase tracking-wider font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'evidence'
                ? 'border-b-2 border-cobalt-700 text-cobalt-900 bg-white'
                : 'text-graphite-500 hover:text-graphite-900'
            }`}
          >
            5. Evidence Dossier & AI Traceability
          </button>
        </div>
      </section>

      {/* Main Interactive Content */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8">
        {/* TAB 1: COMPETENCY MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                    COMPETENCY MATRIX // 5-ROUND EVIDENCE TRACE
                  </span>
                  <h3 className="text-lg font-bold text-graphite-900">
                    Observable Evidence Across Evaluation Rounds
                  </h3>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-emerald-700 rounded-[1px] inline-block"></span>
                    <span>Demonstrated (≥70)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-[1px] inline-block"></span>
                    <span>Developing (50–69)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-gray-300 rounded-[1px] inline-block"></span>
                    <span>Insufficient (&lt;50)</span>
                  </span>
                </div>
              </div>

              {/* Responsive Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-ivory-100 font-mono text-[10px] uppercase text-graphite-600 border-b border-ivory-300">
                      <th className="p-3">Competency Criterion</th>
                      <th className="p-3 text-center">Knowledge</th>
                      <th className="p-3 text-center">Approach</th>
                      <th className="p-3 text-center">Coding</th>
                      <th className="p-3 text-center">Project</th>
                      <th className="p-3 text-center">Interview</th>
                      <th className="p-3 text-center">Overall Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-200 font-mono">
                    {proof.competencyMatrix.map((row) => {
                      const isSelected = selectedCompetency?.competencyId === row.competencyId;
                      return (
                        <tr
                          key={row.competencyId}
                          onClick={() => setSelectedCompetency(row)}
                          className={`hover:bg-ivory-50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-cobalt-50/50' : ''
                          }`}
                        >
                          <td className="p-3">
                            <div className="font-bold text-graphite-900 font-sans">{row.competencyName}</div>
                            <div className="text-[11px] text-graphite-500 font-sans truncate max-w-sm">
                              {row.expectedLevelDescription}
                            </div>
                          </td>

                          {(['Knowledge', 'Approach', 'Coding', 'Project', 'Interview'] as const).map((rnd) => {
                            const rStat = row.roundStatuses[rnd];
                            let cellBg = 'bg-gray-100 text-gray-500';
                            if (rStat.status === 'Demonstrated') cellBg = 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold';
                            else if (rStat.status === 'Developing') cellBg = 'bg-amber-50 text-amber-900 border border-amber-300';
                            return (
                              <td key={rnd} className="p-3 text-center">
                                <span className={`inline-block px-2 py-1 text-[10px] rounded-[2px] ${cellBg}`}>
                                  {rStat.status === 'Demonstrated' ? '✓ ' : ''}
                                  {rStat.status}
                                </span>
                              </td>
                            );
                          })}

                          <td className="p-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 text-[10px] uppercase font-bold rounded-[2px] ${
                                row.overallStatus === 'Demonstrated'
                                  ? 'bg-emerald-700 text-white'
                                  : row.overallStatus === 'Developing'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-gray-200 text-graphite-700'
                              }`}
                            >
                              {row.overallStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Selected Competency Detail Card */}
              {selectedCompetency && (
                <div className="mt-6 p-4 bg-ivory-50 border border-ivory-300 rounded-[2px] space-y-3">
                  <div className="flex items-center justify-between border-b border-ivory-200 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold">
                      EVIDENTIARY AUDIT // {selectedCompetency.competencyName}
                    </span>
                    <span className="font-mono text-[10px] text-graphite-500">
                      Category: {selectedCompetency.category.toUpperCase()} • Weight: {selectedCompetency.demonstratedWeight}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <span className="font-mono text-[10px] text-graphite-500 uppercase font-bold block mb-1">
                        LEVEL 0{proof.assessedLevel} BENCHMARK EXPECTATION:
                      </span>
                      <p className="text-graphite-700 leading-relaxed bg-white p-3 border border-ivory-200 rounded-[2px]">
                        {selectedCompetency.expectedLevelDescription}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-graphite-500 uppercase font-bold block mb-1">
                        CONFIRMED ROUND EVIDENCE SNIPPETS:
                      </span>
                      <div className="space-y-1.5 bg-white p-3 border border-ivory-200 rounded-[2px] font-mono text-[11px]">
                        {(['Knowledge', 'Approach', 'Coding', 'Project', 'Interview'] as const).map((rnd) => {
                          const snippet = selectedCompetency.roundStatuses[rnd].evidenceSnippet;
                          return (
                            <div key={rnd} className="flex items-start gap-2">
                              <span className="text-cobalt-700 font-bold shrink-0">{rnd}:</span>
                              <span className="text-graphite-700">{snippet || 'Not evaluated in this round'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DEMONSTRATED STRENGTHS */}
        {activeTab === 'strengths' && (
          <div className="space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] shadow-sm space-y-6">
              <div className="border-b border-ivory-200 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 font-bold block">
                  DEMONSTRATED STRENGTHS // EMPIRICAL EVIDENCE
                </span>
                <h3 className="text-lg font-bold text-graphite-900">
                  Confirmed Technical Competencies
                </h3>
                <p className="text-xs text-graphite-600 mt-1">
                  Each strength is tied directly to verified artifacts, test assertions, and verbal defenses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proof.strengths.map((str, idx) => (
                  <div key={idx} className="p-5 bg-ivory-50 border border-ivory-200 rounded-[2px] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-ivory-200 pb-2">
                      <h4 className="font-bold text-graphite-900 text-sm">{str.competencyName}</h4>
                      <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase font-bold">
                        VERIFIED
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-mono text-[10px] uppercase text-graphite-500 font-bold block">
                        EVIDENCE CITATION:
                      </span>
                      <p className="font-mono text-[11px] text-cobalt-900 bg-white p-2 border border-ivory-200 rounded-[2px]">
                        {str.evidenceCitation}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-graphite-700">
                      <span className="font-mono text-[10px] uppercase text-graphite-500 font-bold block">
                        OBSERVABLE EXPLANATION:
                      </span>
                      <p className="leading-relaxed">{str.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKILL GAP ANALYSIS */}
        {activeTab === 'gaps' && (
          <div className="space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] shadow-sm space-y-6">
              <div className="border-b border-ivory-200 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-bold block">
                  REPROOF CORE // SKILL GAP AUDIT
                </span>
                <h3 className="text-lg font-bold text-graphite-900">
                  Expected vs. Observed Competency Divergence
                </h3>
                <p className="text-xs text-graphite-600 mt-1">
                  Concrete deviations identified by comparing benchmark criteria against observed behavior.
                </p>
              </div>

              <div className="space-y-6">
                {proof.skillGaps.map((gap, idx) => (
                  <div key={idx} className="p-5 bg-amber-50/40 border border-amber-300/70 rounded-[2px] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-amber-800 font-bold block">
                          GAP 0{idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-graphite-900">{gap.competencyName}</h4>
                      </div>
                      <span className="font-mono text-[10px] px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 uppercase font-bold rounded-[2px]">
                        SEVERITY: {gap.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-white border border-amber-200 rounded-[2px] space-y-1">
                        <span className="font-mono text-[10px] uppercase text-graphite-500 font-bold block">
                          EXPECTED COMPETENCY (LEVEL 0{proof.assessedLevel}):
                        </span>
                        <p className="text-graphite-800 font-sans leading-relaxed">{gap.expectedCompetency}</p>
                      </div>

                      <div className="p-3 bg-white border border-amber-200 rounded-[2px] space-y-1">
                        <span className="font-mono text-[10px] uppercase text-graphite-500 font-bold block">
                          OBSERVED BEHAVIOR & EVIDENCE:
                        </span>
                        <p className="text-graphite-800 font-sans leading-relaxed">{gap.observedBehavior}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-amber-300/80 rounded-[2px] flex items-center justify-between gap-4">
                      <div className="space-y-0.5 text-xs">
                        <span className="font-mono text-[10px] uppercase text-cobalt-700 font-bold block">
                          TARGETED IMPROVEMENT DIRECTIVE:
                        </span>
                        <p className="text-graphite-900 font-sans">{gap.suggestedImprovement}</p>
                      </div>
                      <Link
                        to="/practice"
                        className="px-4 py-2 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-[11px] uppercase tracking-wider rounded-[2px] font-bold shrink-0 transition-colors"
                      >
                        Practice Invariant →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PERSONALIZED RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] shadow-sm space-y-6">
              <div className="border-b border-ivory-200 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                  ACTIONABLE PRESCRIPTIONS
                </span>
                <h3 className="text-lg font-bold text-graphite-900">
                  Targeted Drills Leading to Reassessment
                </h3>
                <p className="text-xs text-graphite-600 mt-1">
                  Non-generic remediation activities built to bridge your specific identified gaps.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proof.recommendations.map((rec) => (
                  <div key={rec.id} className="p-5 bg-ivory-50 border border-ivory-200 rounded-[2px] space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-ivory-200 pb-2">
                        <span className="font-mono text-xs font-bold text-cobalt-900">
                          {rec.skillGap}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-ivory-200 text-graphite-700 uppercase">
                          {rec.suggestedDifficulty}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <span className="font-mono text-[10px] uppercase text-graphite-500 font-bold block">
                          WHY IT MATTERS:
                        </span>
                        <p className="text-graphite-700 leading-relaxed">{rec.whyItMatters}</p>
                      </div>

                      <div className="space-y-1 text-xs">
                        <span className="font-mono text-[10px] uppercase text-graphite-500 font-bold block">
                          SUGGESTED ACTIVITY:
                        </span>
                        <p className="text-graphite-900 font-semibold bg-white p-2.5 border border-ivory-200 rounded-[2px]">
                          {rec.suggestedActivity}
                        </p>
                      </div>

                      <div className="space-y-1 text-xs">
                        <span className="font-mono text-[10px] uppercase text-emerald-800 font-bold block">
                          VERIFICATION TARGET:
                        </span>
                        <p className="text-graphite-700 font-mono text-[11px]">{rec.verificationTarget}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-ivory-200">
                      <Link
                        to={rec.reassessmentModule}
                        className="w-full py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-[2px] font-bold"
                      >
                        <span>Launch Targeted Practice</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EVIDENCE DOSSIER & AI TRACEABILITY */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] shadow-sm space-y-6">
              <div className="border-b border-ivory-200 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                  EVIDENCE TRACEABILITY & AI GOVERNANCE
                </span>
                <h3 className="text-lg font-bold text-graphite-900">
                  Empirical Evidence vs. Gemini Analytical Interpretation
                </h3>
              </div>

              {/* Distinction Plate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Raw Empirical Evidence */}
                <div className="p-5 bg-ivory-50 border border-ivory-200 rounded-[2px] space-y-3">
                  <div className="flex items-center justify-between border-b border-ivory-200 pb-2">
                    <span className="font-mono text-[10px] uppercase text-graphite-700 font-bold">
                      EMPIRICAL SYSTEM EVIDENCE (UNALTERABLE)
                    </span>
                    <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
                  </div>
                  <div className="space-y-2 font-mono text-xs text-graphite-700">
                    <div className="p-2 bg-white border border-ivory-200 rounded-[2px] flex justify-between">
                      <span>1. Knowledge Check Score:</span>
                      <span className="font-bold">{proof.evidenceDossier.knowledge.score}%</span>
                    </div>
                    <div className="p-2 bg-white border border-ivory-200 rounded-[2px] flex justify-between">
                      <span>2. Approach Complexity Target:</span>
                      <span className="font-bold">{proof.evidenceDossier.approach.complexityProjected}</span>
                    </div>
                    <div className="p-2 bg-white border border-ivory-200 rounded-[2px] flex justify-between">
                      <span>3. Coding Sandbox Test Pass:</span>
                      <span className="font-bold">{proof.evidenceDossier.coding.testsPassedPct}%</span>
                    </div>
                    <div className="p-2 bg-white border border-ivory-200 rounded-[2px] flex justify-between">
                      <span>4. Benchmark Project Score:</span>
                      <span className="font-bold">{proof.evidenceDossier.project.score}/100</span>
                    </div>
                    <div className="p-2 bg-white border border-ivory-200 rounded-[2px] flex justify-between">
                      <span>5. Technical Interview Score:</span>
                      <span className="font-bold">{proof.evidenceDossier.interview.score}/100</span>
                    </div>
                  </div>
                </div>

                {/* Right: AI Evidence Assistant */}
                <div className="p-5 bg-cobalt-50/50 border border-cobalt-200 rounded-[2px] space-y-3">
                  <div className="flex items-center justify-between border-b border-cobalt-200 pb-2">
                    <span className="font-mono text-[10px] uppercase text-cobalt-900 font-bold">
                      GEMINI EVIDENCE ANALYSIS ASSISTANT
                    </span>
                    <span className="text-[10px] font-mono text-cobalt-700 font-bold">
                      {proof.aiInterpretation.model}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-cobalt-950 font-sans leading-relaxed">
                    {proof.aiInterpretation.analyticalRemarks.map((remark, idx) => (
                      <div key={idx} className="p-2.5 bg-white border border-cobalt-200 rounded-[2px]">
                        • {remark}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-graphite-500 font-mono italic">
                    AI assists by identifying pattern correlations. The official score and competency stage are computed deterministically by backend rules.
                  </p>
                </div>
              </div>

              {/* Versioning and Cryptographic Hash Footprint */}
              <div className="p-4 bg-ivory-100 border border-ivory-300 rounded-[2px] font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-graphite-500 text-[10px] uppercase block">CRYPTOGRAPHIC AUDIT LEDGER FOOTPRINT</span>
                  <span className="text-graphite-900 font-bold text-[11px]">{proof.auditHash}</span>
                </div>
                <div className="text-right text-[10px] text-graphite-500">
                  <div>EVALUATION VERSION: {proof.evaluationVersion}</div>
                  <div>RUBRIC VERSION: {proof.rubricVersion}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
