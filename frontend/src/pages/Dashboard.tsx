import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAssessmentBrief } from '../data/curriculumData';
import { useCurrentUser } from '../context/useCurrentUser';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isSignedIn } = useCurrentUser();

  // Active curriculum selection from localStorage or defaults
  const domainId = localStorage.getItem('reproof_selected_domain') || 'ai-ml';
  const skillId = localStorage.getItem('reproof_selected_skill') || 'python-for-ml';
  const levelId = localStorage.getItem('reproof_selected_level') || '1';

  const brief = getAssessmentBrief(domainId, skillId, levelId);

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Top Manifesto Header */}
      <section className="w-full px-6 sm:px-12 py-10 sm:py-14 border-b border-ivory-300">
        <div className="max-w-6xl mx-auto flex flex-col items-start">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-cobalt-700"></span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-graphite-500">
              Institutional Verification Ledger
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-graphite-900 uppercase tracking-tight max-w-4xl text-left leading-[0.95]">
            PROVE WHAT YOU CAN DO.
          </h1>

          <p className="text-base sm:text-lg text-graphite-600 max-w-2xl mt-4 leading-relaxed font-normal">
            Your competency profile is built from demonstrated evidence, not certificates alone. Every benchmark evaluates real execution under unscripted failure states.
          </p>

          <div className="mt-6 pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/domains"
              className="inline-flex items-center gap-2 px-6 py-3 bg-graphite-900 hover:bg-cobalt-700 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px]"
            >
              <span>SELECT DOMAIN & SKILL</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Current Active Assessment Dossier */}
      <section className="w-full px-6 sm:px-12 py-10 border-b border-ivory-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Metadata & Context */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-graphite-500 font-mono text-[10px] sm:text-[11px] tracking-wider mb-2 uppercase">
                <span>{brief.domainName}</span>
                <span>/</span>
                <span className="text-graphite-900 font-bold">{brief.skillName}</span>
                <span>/</span>
                <span className="text-cobalt-700 font-bold">LEVEL 0{brief.levelNumber}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-graphite-900 tracking-tight uppercase">
                {brief.title}
              </h2>

              <div className="inline-flex items-center gap-2 mt-2 font-mono text-[11px] text-cobalt-700">
                <span className="w-1.5 h-1.5 bg-cobalt-700 inline-block"></span>
                <span className="font-bold uppercase tracking-wider">
                  BENCHMARK READY // {brief.difficulty.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-graphite-600 mt-4 max-w-2xl leading-relaxed">
                {brief.synopsis}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-ivory-300">
              <button
                onClick={() =>
                  navigate(
                    `/assessment?domainId=${domainId}&skillId=${skillId}&levelId=${levelId}`
                  )
                }
                className="inline-flex items-center justify-center gap-3 bg-cobalt-700 text-white hover:bg-cobalt-900 px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-[2px]"
              >
                <span>Start Assessment</span>
                <span>&rarr;</span>
              </button>

              <Link
                to="/domains"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-ivory-300 hover:border-graphite-700 bg-white font-mono text-xs uppercase tracking-widest text-graphite-700 transition-colors rounded-[2px]"
              >
                <span>Change Domain / Skill</span>
                <span>&rarr;</span>
              </Link>

              <span className="font-mono text-[11px] text-graphite-500">
                Estimated Duration: {brief.estimatedDuration} · Isolation Mode: {brief.isolationMode}
              </span>
            </div>
          </div>

          {/* Right Snapshot Detail Column */}
          <div className="lg:col-span-4 lg:border-l border-ivory-300 lg:pl-8 flex flex-col gap-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-graphite-500 block mb-1">
                Evaluation Scope
              </span>
              <p className="text-xs text-graphite-900 leading-relaxed">
                Uninstrumented Go routine deadlocks, socket lifecycle leaks, and silent network partitioned retries.
              </p>
            </div>

            <div className="pt-4 border-t border-ivory-300">
              <span className="font-mono text-[10px] uppercase tracking-widest text-graphite-500 block mb-1">
                Integrity Criteria
              </span>
              <p className="text-xs text-graphite-900 leading-relaxed">
                Zero synthetic linting. Pass conditions depend entirely on deterministic regression assertions passing.
              </p>
            </div>

            <div className="pt-4 border-t border-ivory-300">
              <span className="font-mono text-[10px] uppercase tracking-widest text-graphite-500 block mb-1">
                Assigned Candidate Node
              </span>
              <p className="font-mono text-xs text-cobalt-700 font-medium">
                US-EAST-SANDBOX-09 // {isSignedIn && currentUser.handle ? currentUser.handle : 'ACTIVE-SESSION'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The ReProof Methodology Pipeline */}
      <section className="w-full px-6 sm:px-12 py-10 border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 gap-2">
            <h3 className="text-base sm:text-lg font-bold text-graphite-900 uppercase tracking-tight">
              The Verification Protocol
            </h3>
            <span className="font-mono text-[11px] text-graphite-500 uppercase">
              Sequential Mastery Cycle
            </span>
          </div>

          {/* 4 Stages Grid with Hairline Framing */}
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-ivory-300 border-t border-b border-ivory-300">
            {/* Stage 1 (Active) */}
            <div className="py-6 md:px-5 flex flex-col justify-between bg-white/70">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-cobalt-700">01</span>
                  <span className="font-mono text-[9px] px-2 py-0.5 bg-cobalt-700 text-white uppercase tracking-widest font-semibold">
                    ACTIVE
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-cobalt-700">
                  Initial Assessment
                </h4>
                <p className="text-xs text-graphite-500 mt-2 leading-relaxed">
                  Demonstrate baseline execution under raw ambiguity without pre-briefed scaffolding.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-cobalt-700/20">
                <Link
                  to="/assessment"
                  className="font-mono text-[10px] font-semibold text-cobalt-700 hover:underline uppercase block tracking-wider"
                >
                  STATUS: INITIATING &rarr;
                </Link>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="py-6 md:px-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-graphite-400">02</span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 border border-ivory-300 text-graphite-500 uppercase tracking-widest">
                    STEP 2
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-graphite-800">
                  Practice
                </h4>
                <p className="text-xs text-graphite-500 mt-2 leading-relaxed">
                  Targeted remediation on isolated diagnostic fractures surfaced during baseline run.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-ivory-300">
                <Link
                  to="/practice"
                  className="font-mono text-[10px] text-graphite-500 hover:text-graphite-900 uppercase block tracking-wider"
                >
                  VIEW QUEUE &rarr;
                </Link>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="py-6 md:px-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-graphite-400">03</span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 border border-ivory-300 text-graphite-500 uppercase tracking-widest">
                    STEP 3
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-graphite-800">
                  Changed Condition
                </h4>
                <p className="text-xs text-graphite-500 mt-2 leading-relaxed">
                  Identical core competency tested inside a systematically perturbed operating environment.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-ivory-300">
                <Link
                  to="/changed-condition"
                  className="font-mono text-[10px] text-graphite-500 hover:text-graphite-900 uppercase block tracking-wider"
                >
                  PREVIEW SHIFT &rarr;
                </Link>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="py-6 md:px-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-graphite-400">04</span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 border border-ivory-300 text-graphite-500 uppercase tracking-widest">
                    RECORD
                  </span>
                </div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-graphite-800">
                  Re-Proof
                </h4>
                <p className="text-xs text-graphite-500 mt-2 leading-relaxed">
                  Definitive verification of transfer mastery recorded permanently to public portfolio record.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-ivory-300">
                <Link
                  to="/result"
                  className="font-mono text-[10px] text-cobalt-700 font-semibold hover:underline uppercase block tracking-wider"
                >
                  LEDGER RECORD &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Evidence Ledger Table */}
      <section className="w-full px-6 sm:px-12 py-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h3 className="text-base font-bold text-graphite-900 uppercase tracking-tight">
              Verified Evidence Ledger
            </h3>
            <span className="font-mono text-[10px] text-graphite-500 uppercase">
              Candidate Dossier // Audit Records
            </span>
          </div>

          <div className="border border-ivory-300 bg-white overflow-x-auto rounded-[2px]">
            <table className="w-full text-left text-xs divide-y divide-ivory-300">
              <thead className="bg-ivory-100 font-mono text-[10px] uppercase tracking-wider text-graphite-500">
                <tr>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Protocol ID</th>
                  <th className="py-3 px-4">Observable Level</th>
                  <th className="py-3 px-4">Transfer Status</th>
                  <th className="py-3 px-4 text-right">Audit Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 font-mono text-[11px] text-graphite-700">
                <tr className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3 px-4 font-sans font-bold text-graphite-900">
                    Software Development
                  </td>
                  <td className="py-3 px-4 text-cobalt-700 font-semibold">DEV-0884-RCA</td>
                  <td className="py-3 px-4">Level 4 // Rigorous</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">VERIFIED RESILIENT</td>
                  <td className="py-3 px-4 text-right text-graphite-500">18 Sep 2026</td>
                </tr>
                <tr className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3 px-4 font-sans font-bold text-graphite-900">
                    Database & SQL
                  </td>
                  <td className="py-3 px-4 text-graphite-600">SQL-0391-OPT</td>
                  <td className="py-3 px-4">Level 3 // Functional</td>
                  <td className="py-3 px-4 text-graphite-600">ACCREDITED</td>
                  <td className="py-3 px-4 text-right text-graphite-500">14 Sep 2026</td>
                </tr>
                <tr className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3 px-4 font-sans font-bold text-graphite-900">
                    Web Development
                  </td>
                  <td className="py-3 px-4 text-graphite-600">WEB-0120-INP</td>
                  <td className="py-3 px-4">Level 4 // Rigorous</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">VERIFIED RESILIENT</td>
                  <td className="py-3 px-4 text-right text-graphite-500">02 Sep 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
