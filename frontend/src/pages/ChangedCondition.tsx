import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockChangedCondition, mockAssessment } from '../data/mockData';

export const ChangedCondition: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Top Eyebrow */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-3 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-graphite-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cobalt-700"></span>
            <span className="uppercase font-bold text-cobalt-700">
              STAGE 03 // ARCHITECTURAL MUTATION
            </span>
            <span>/</span>
            <span>UNSCRIPTED OPERATIONAL PERTURBATION</span>
          </div>
          <span className="font-mono text-[10px] uppercase text-graphite-400">
            MUTATION ID: {mockChangedCondition.id}
          </span>
        </div>
      </section>

      {/* Monumental Headline */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-10 sm:py-14">
          <div className="max-w-4xl space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-800 font-bold">
              CRITICAL SYSTEM PERTURBATION
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-graphite-900 leading-none">
              THE CONDITIONS MUTATE.
            </h1>
            <p className="text-base sm:text-lg text-graphite-600 leading-relaxed font-normal">
              In production, assumptions collapse. We inject severe operational constraints to evaluate whether your understanding transfers beyond canned test parameters.
            </p>
          </div>
        </div>
      </section>

      {/* Baseline vs Mutation Comparison */}
      <section className="max-w-[1600px] mx-auto w-full px-6 sm:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-10">
          {/* Baseline Condition */}
          <div className="p-8 border border-ivory-300 bg-white rounded-[2px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200 mb-4 font-mono text-[10px] text-graphite-500 uppercase">
                <span>01 // PREVIOUS BASELINE STATE</span>
                <span className="text-emerald-700 font-bold">PASS VERIFIED</span>
              </div>
              <h3 className="text-xl font-bold uppercase text-graphite-900 mb-2">
                {mockAssessment.title}
              </h3>
              <p className="text-xs text-graphite-600 leading-relaxed font-mono bg-ivory-100 p-3 border border-ivory-200">
                {mockChangedCondition.originalBaseline}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-ivory-200 font-mono text-[10px] text-graphite-500">
              Audit Status: Verified under standard local memory conditions
            </div>
          </div>

          {/* Mutated Condition */}
          <div className="p-8 border border-cobalt-700 bg-ivory-100 rounded-[2px] flex flex-col justify-between relative">
            <span className="absolute -top-[1px] -right-[1px] bg-cobalt-700 text-white font-mono text-[9px] uppercase px-2 py-0.5">
              MUTATION INJECTED
            </span>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-ivory-300 mb-4 font-mono text-[10px] text-cobalt-700 uppercase font-bold">
                <span>02 // PERTURBED OPERATIONAL STATE</span>
                <span>CRITICAL SHIFT</span>
              </div>
              <h3 className="text-xl font-bold uppercase text-cobalt-700 mb-2">
                Embedded Edge & Hard Memory Cap
              </h3>
              <p className="text-xs text-graphite-900 leading-relaxed font-mono bg-white p-3 border border-ivory-300">
                {mockChangedCondition.changedRule}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-ivory-300 font-mono text-[10px] text-rose-800 font-bold">
              Failure Implication: Heap-based decimal objects will trigger OOM kills
            </div>
          </div>
        </div>

        {/* Narrative & Strict Constraints */}
        <div className="p-8 border border-ivory-300 bg-white rounded-[2px] space-y-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block mb-1">
              OPERATIONAL SCENARIO NARRATIVE
            </span>
            <p className="text-xs sm:text-sm text-graphite-700 leading-relaxed font-sans bg-ivory-100 p-4 border border-ivory-200">
              {mockChangedCondition.scenarioNarrative}
            </p>
          </div>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-graphite-700 font-bold block mb-3">
              ACTIVE ENFORCED CONSTRAINTS:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              {mockChangedCondition.constraints.map((c, idx) => (
                <div key={idx} className="p-3 bg-ivory-100 border border-ivory-300 space-y-1">
                  <span className="text-cobalt-700 font-bold text-[10px]">
                    CONSTRAINT 0{idx + 1}
                  </span>
                  <p className="text-graphite-800 leading-snug">{c}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-ivory-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              to="/practice"
              className="font-mono text-xs text-graphite-600 hover:text-graphite-900 uppercase"
            >
              &larr; Back to Practice Drills
            </Link>

            <button
              onClick={() => navigate('/re-proof')}
              className="px-8 py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-3 cursor-pointer rounded-[2px]"
            >
              <span>Launch Re-Proof Verification Engine</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
