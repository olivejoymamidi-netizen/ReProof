import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getAssessmentBrief } from '../data/curriculumData';

export const ApproachResult: React.FC = () => {
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

  const brief = getAssessmentBrief(domainId, skillId, levelId);

  const strategy = localStorage.getItem(`reproof_approach_strat_${skillId}_${levelId}`) || 'Modular pipeline architecture with strict interface decomposition.';
  const dataStructures = localStorage.getItem(`reproof_approach_ds_${skillId}_${levelId}`) || 'Vectorized buffers with contiguous memory representation.';
  const edgeCases = localStorage.getItem(`reproof_approach_edge_${skillId}_${levelId}`) || 'Zero variance guards and null indicator sanitization.';
  const complexity = localStorage.getItem(`reproof_approach_comp_${skillId}_${levelId}`) || 'Time: O(N), Space: O(1)';

  const handleProceedToCoding = () => {
    navigate(`/assessment?domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(skillId)}&levelId=${encodeURIComponent(levelId)}`);
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Header */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-graphite-500">
              <span className="w-2 h-2 bg-emerald-700"></span>
              <span className="text-emerald-700 font-bold">
                APPROACH RECORDED & VERIFIED
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-700 font-semibold">
                {brief.domainName} // {brief.skillName}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-500">
                LEVEL 0{brief.levelNumber}
              </span>
            </div>

            <Link
              to={`/approach?domainId=${domainId}&skillId=${skillId}&levelId=${levelId}`}
              className="font-mono text-xs text-graphite-600 hover:text-graphite-900 uppercase tracking-wider"
            >
              Edit Approach Formulation
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-graphite-900 uppercase">
                Approach Dossier Accepted
              </h1>
              <p className="text-sm sm:text-base text-graphite-600">
                Your architectural strategy and boundary constraints have been logged into the assessment evidence buffer. You may now advance to the implementation sandbox.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleProceedToCoding}
                className="px-8 py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-bold shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Coding / Practical Sandbox</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Review Summary */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recorded Approach Review */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-6 shadow-sm">
              <div className="border-b border-ivory-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                    REGISTERED COGNITIVE AUDIT
                  </span>
                  <h3 className="text-lg font-bold text-graphite-900">
                    Candidate Architecture Specification
                  </h3>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase font-semibold">
                  AUDIT READY
                </span>
              </div>

              {/* 1. Strategy */}
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-graphite-500 font-bold block">
                  1. Architectural Strategy:
                </span>
                <div className="p-3 bg-ivory-50 border border-ivory-200 font-mono text-xs text-graphite-900 rounded-[2px] whitespace-pre-wrap">
                  {strategy}
                </div>
              </div>

              {/* 2. Data Structures */}
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-graphite-500 font-bold block">
                  2. Data Structures & Algorithm:
                </span>
                <div className="p-3 bg-ivory-50 border border-ivory-200 font-mono text-xs text-graphite-900 rounded-[2px] whitespace-pre-wrap">
                  {dataStructures}
                </div>
              </div>

              {/* 3. Edge Cases */}
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-graphite-500 font-bold block">
                  3. Boundary Handling & Safeguards:
                </span>
                <div className="p-3 bg-ivory-50 border border-ivory-200 font-mono text-xs text-graphite-900 rounded-[2px] whitespace-pre-wrap">
                  {edgeCases}
                </div>
              </div>

              {/* 4. Complexity */}
              <div className="space-y-1.5">
                <span className="font-mono text-xs uppercase tracking-wider text-graphite-500 font-bold block">
                  4. Projected Complexity Target:
                </span>
                <div className="p-3 bg-ivory-50 border border-ivory-200 font-mono text-xs text-graphite-900 font-bold rounded-[2px]">
                  {complexity}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Invariant Checks & Next Steps */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-4 shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                CORRELATION NOTICE
              </span>
              <h4 className="text-base font-bold text-graphite-900">
                Cross-Round Evaluation Pipeline
              </h4>
              <p className="text-xs text-graphite-600 leading-relaxed">
                During the <strong>Final Technical Interview</strong>, our audit engine will evaluate the consistency between your documented approach here and the concrete implementation code you submit next.
              </p>

              <div className="p-3 bg-ivory-100 border border-ivory-300 rounded-[2px] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-graphite-700">
                  ASSESSMENT SEQUENCE:
                </div>
                <div className="text-xs space-y-1 text-graphite-600 font-mono">
                  <div className="text-emerald-700">✓ Knowledge Check (Completed)</div>
                  <div className="text-emerald-700">✓ Approach Formulation (Completed)</div>
                  <div className="font-bold text-cobalt-700">→ Coding / Practical Sandbox (Next)</div>
                  <div className="text-graphite-400">· Benchmark Project (Upcoming)</div>
                  <div className="text-graphite-400">· Final Technical Interview (Upcoming)</div>
                </div>
              </div>

              <button
                onClick={handleProceedToCoding}
                className="w-full py-3.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-bold flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Launch Coding Sandbox</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
