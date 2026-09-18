import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getAssessmentBrief } from '../data/curriculumData';

export const Approach: React.FC = () => {
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

  const [strategy, setStrategy] = useState(
    localStorage.getItem(`reproof_approach_strat_${skillId}_${levelId}`) || ''
  );
  const [dataStructures, setDataStructures] = useState(
    localStorage.getItem(`reproof_approach_ds_${skillId}_${levelId}`) || ''
  );
  const [edgeCases, setEdgeCases] = useState(
    localStorage.getItem(`reproof_approach_edge_${skillId}_${levelId}`) || ''
  );
  const [complexity, setComplexity] = useState(
    localStorage.getItem(`reproof_approach_comp_${skillId}_${levelId}`) || 'Time: O(N), Space: O(1)'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    localStorage.setItem(`reproof_approach_strat_${skillId}_${levelId}`, strategy);
    localStorage.setItem(`reproof_approach_ds_${skillId}_${levelId}`, dataStructures);
    localStorage.setItem(`reproof_approach_edge_${skillId}_${levelId}`, edgeCases);
    localStorage.setItem(`reproof_approach_comp_${skillId}_${levelId}`, complexity);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(
        `/approach-result?domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(skillId)}&levelId=${encodeURIComponent(levelId)}`
      );
    }, 400);
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Header */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-graphite-500">
              <span className="w-2 h-2 bg-cobalt-700"></span>
              <span className="text-cobalt-700 font-bold">
                {brief.domainName} // {brief.skillName}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-700 font-semibold">
                LEVEL 0{brief.levelNumber} ({brief.difficulty})
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-500">
                ROUND 02 // APPROACH FORMULATION
              </span>
            </div>

            <Link
              to={`/knowledge-result?domainId=${domainId}&skillId=${skillId}&levelId=${levelId}`}
              className="font-mono text-xs text-graphite-600 hover:text-graphite-900 uppercase tracking-wider"
            >
              &larr; Return to Knowledge Result
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-graphite-900 uppercase">
                Articulate Your Approach
              </h1>
              <p className="text-sm sm:text-base text-graphite-600">
                Before writing implementation code, outline your architectural strategy, selected invariants, and complexity boundaries. ReProof evaluates deliberate engineering decisions.
              </p>
            </div>

            <div className="bg-ivory-100 border border-ivory-300 px-4 py-3 rounded-[2px] font-mono text-xs space-y-1">
              <div className="text-graphite-500 text-[10px] uppercase tracking-wider">Evaluation Mode</div>
              <div className="font-bold text-graphite-900">Pre-Code Cognitive Audit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Form */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10">
        <form onSubmit={handleSaveAndProceed} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Brief & Target Invariants */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-4 shadow-sm">
              <div className="border-b border-ivory-200 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                  BENCHMARK SPECIFICATION
                </span>
                <h3 className="text-lg font-bold text-graphite-900 mt-1">
                  {brief.title}
                </h3>
              </div>

              <p className="text-xs text-graphite-600 leading-relaxed">
                {brief.synopsis}
              </p>

              <div className="space-y-3 pt-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-graphite-500 font-bold block">
                  Core Criteria To Address:
                </span>
                {brief.criteria.map((c) => (
                  <div key={c.id} className="p-2.5 bg-ivory-50 border border-ivory-200 rounded-[2px] space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-graphite-900">
                      <span>{c.title}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 bg-ivory-200 uppercase text-graphite-600">
                        {c.badgeLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-graphite-600">{c.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Approach Formulation Inputs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-ivory-300 p-6 rounded-[2px] space-y-6 shadow-sm">
              {/* 1. Architectural Strategy */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-graphite-900">
                  1. High-Level Architectural Strategy & Decomposition *
                </label>
                <p className="text-xs text-graphite-500">
                  Describe how you plan to partition the solution. What design patterns, functions, or modules will you establish?
                </p>
                <textarea
                  rows={4}
                  required
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  placeholder="E.g., I will create a modular processing pipeline with isolated transformation stages. Invariants will be validated at entry boundaries..."
                  className="w-full p-3 font-mono text-xs bg-ivory-50 border border-ivory-300 focus:border-cobalt-700 focus:outline-none rounded-[2px] text-graphite-900"
                />
              </div>

              {/* 2. Data Structures & Algorithm Selection */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-graphite-900">
                  2. Data Structures & Algorithmic Rationale *
                </label>
                <p className="text-xs text-graphite-500">
                  Why are your chosen data structures optimal for the constraints of Level {brief.levelNumber}?
                </p>
                <textarea
                  rows={3}
                  required
                  value={dataStructures}
                  onChange={(e) => setDataStructures(e.target.value)}
                  placeholder="E.g., Vectorized contiguous arrays rather than linked elements to optimize cache locality and SIMD execution..."
                  className="w-full p-3 font-mono text-xs bg-ivory-50 border border-ivory-300 focus:border-cobalt-700 focus:outline-none rounded-[2px] text-graphite-900"
                />
              </div>

              {/* 3. Edge Cases & Boundary Handling */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-graphite-900">
                  3. Boundary Conditions & Failure Safeguards *
                </label>
                <p className="text-xs text-graphite-500">
                  What degenerate inputs, null scenarios, or memory exhaustion hazards must your solution safeguard against?
                </p>
                <textarea
                  rows={3}
                  required
                  value={edgeCases}
                  onChange={(e) => setEdgeCases(e.target.value)}
                  placeholder="E.g., Empty input streams, zero-variance denominators in normalization, invalid token headers, and memory exhaustion under concurrent loads..."
                  className="w-full p-3 font-mono text-xs bg-ivory-50 border border-ivory-300 focus:border-cobalt-700 focus:outline-none rounded-[2px] text-graphite-900"
                />
              </div>

              {/* 4. Complexity Projection */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-graphite-900">
                  4. Computational Complexity Projection *
                </label>
                <input
                  type="text"
                  required
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  placeholder="E.g., Time: O(N log N), Auxiliary Space: O(1)"
                  className="w-full p-3 font-mono text-xs bg-ivory-50 border border-ivory-300 focus:border-cobalt-700 focus:outline-none rounded-[2px] text-graphite-900"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-ivory-200 flex items-center justify-between">
                <span className="font-mono text-[11px] text-graphite-500">
                  Approach will be referenced during the Final Technical Interview.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px] font-bold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording Approach...' : 'Submit Approach Dossier →'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
