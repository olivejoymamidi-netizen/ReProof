import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockSkillGap } from '../data/mockData';

export const SkillGap: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Top Document Eyebrow Bar */}
      <section className="w-full bg-[#FAF9F6] border-b border-ivory-300">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 font-mono text-[10px] sm:text-[11px] text-graphite-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2 h-2 bg-cobalt-700 inline-block"></span>
            <span className="tracking-tight uppercase">
              SOFTWARE DEVELOPMENT // DEBUGGING // INITIAL ASSESSMENT
            </span>
            <span className="text-ivory-300">/</span>
            <span className="font-semibold text-graphite-900">
              PROTOCOL REF: {mockSkillGap.protocolRef}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>ARCHIVED RECORD: {mockSkillGap.auditRecord}</span>
            <span className="text-ivory-300">|</span>
            <span className="text-cobalt-700 font-bold uppercase">
              VERIFIED BY OBSERVABLE RUBRIC {mockSkillGap.rubricVersion}
            </span>
          </div>
        </div>
      </section>

      {/* Monumental Heading Block */}
      <section className="w-full bg-[#FAF9F6] border-b border-ivory-300">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-10 sm:py-14">
          <div className="max-w-6xl flex flex-col space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-cobalt-700 font-bold">
                COMPETENCY EVALUATION & SKILL-GAP REPORT
              </span>
              <span className="text-graphite-400 font-mono text-xs">
                — CONFIRMED ASSESSMENT DOSSIER
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-graphite-900 tracking-tight leading-none uppercase">
              YOUR SKILL, IN EVIDENCE.
            </h1>

            <p className="text-sm sm:text-base text-graphite-600 max-w-3xl leading-relaxed">
              Your result is built strictly from observable evidence mapped to a defined competency rubric. Scores reflect reproducible behavioral artifacts, not generic algorithmic estimates.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Stage ReProof Progression Tracker */}
      <section className="w-full bg-ivory-200 border-b border-ivory-300">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-ivory-300">
            {/* Stage 01: Completed */}
            <div className="p-6 flex flex-col justify-between bg-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-graphite-500 tracking-wider">
                  STAGE 01
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-ivory-200 text-graphite-800 font-mono text-[9px] uppercase font-bold">
                  <span>✓</span>
                  <span>COMPLETED</span>
                </span>
              </div>
              <div>
                <div className="font-bold text-sm text-graphite-900 uppercase">
                  Initial Assessment
                </div>
                <p className="text-xs text-graphite-500 mt-1">
                  Live debugging task submitted, ingested, and benchmarked against standard criteria.
                </p>
              </div>
              <div className="pt-3 border-t border-ivory-200 flex items-center justify-between font-mono text-[10px] text-graphite-500">
                <span>AUDITED: 14:02 UTC</span>
                <span className="font-bold text-graphite-900">RESULT READY</span>
              </div>
            </div>

            {/* Stage 02: Active Practice */}
            <div className="p-6 flex flex-col justify-between bg-white relative space-y-4 ring-2 ring-cobalt-700 ring-inset">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cobalt-700 font-bold tracking-wider">
                  STAGE 02 // CURRENT
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cobalt-700 text-white font-mono text-[9px] uppercase font-bold">
                  <span className="w-1.5 h-1.5 bg-white inline-block"></span>
                  <span>ACTIVE DISPATCH</span>
                </span>
              </div>
              <div>
                <div className="font-bold text-sm text-cobalt-700 uppercase">
                  Targeted Practice
                </div>
                <p className="text-xs text-graphite-600 mt-1">
                  2 remediations queued to bridge concrete evidence deficiencies before re-test.
                </p>
              </div>
              <div className="pt-3 border-t border-cobalt-700/20 flex items-center justify-between font-mono text-[10px] text-cobalt-700">
                <span>REMEDIATION QUEUE: 2</span>
                <button
                  onClick={() => navigate('/practice')}
                  className="font-bold hover:underline cursor-pointer"
                >
                  ACTION REQUIRED &rarr;
                </button>
              </div>
            </div>

            {/* Stage 03: Changed Condition (Locked) */}
            <div className="p-6 flex flex-col justify-between bg-ivory-100 space-y-4 opacity-70">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-graphite-400">STAGE 03</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-ivory-300 font-mono text-[9px] uppercase text-graphite-500">
                  <span>🔒</span>
                  <span>LOCKED</span>
                </span>
              </div>
              <div>
                <div className="font-bold text-sm text-graphite-800 uppercase">
                  Changed Condition
                </div>
                <p className="text-xs text-graphite-500 mt-1">
                  Identical competency evaluated against unfamiliar architectural constraints and latency limits.
                </p>
              </div>
              <div className="pt-3 border-t border-ivory-300 flex items-center justify-between font-mono text-[10px] text-graphite-400">
                <span>PREREQUISITE</span>
                <span>2 MODULES PENDING</span>
              </div>
            </div>

            {/* Stage 04: Re-Proof (Locked) */}
            <div className="p-6 flex flex-col justify-between bg-ivory-100 space-y-4 opacity-70">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-graphite-400">STAGE 04</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-ivory-300 font-mono text-[9px] uppercase text-graphite-500">
                  <span>🔒</span>
                  <span>RECORD</span>
                </span>
              </div>
              <div>
                <div className="font-bold text-sm text-graphite-800 uppercase">
                  Re-Proof
                </div>
                <p className="text-xs text-graphite-500 mt-1">
                  Final cryptographic ledger verification issued to permanent accredited repository.
                </p>
              </div>
              <div className="pt-3 border-t border-ivory-300 flex items-center justify-between font-mono text-[10px] text-graphite-400">
                <span>FINAL CREDENTIAL</span>
                <span>LEVEL CERTIFICATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Ribbon */}
      <section className="w-full bg-ivory-100 border-b border-ivory-300">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase text-graphite-900">METHODOLOGY PIPELINE:</span>
            <span className="text-graphite-500">NON-PERCENTILE AUDITABLE TRACE</span>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-graphite-800">
            <span className="px-2 py-1 bg-white border border-ivory-300 font-semibold">
              01 EVALUATED EVIDENCE
            </span>
            <span>➔</span>
            <span className="px-2 py-1 bg-white border border-ivory-300 font-semibold">
              02 OBSERVABLE RUBRIC
            </span>
            <span>➔</span>
            <span className="px-2 py-1 bg-white border border-ivory-300 font-semibold">
              03 DEFINED LEVEL (1–4)
            </span>
            <span>➔</span>
            <span className="px-2 py-1 bg-white border border-rose-400 text-rose-800 font-semibold">
              04 ISOLATED GAP
            </span>
            <span>➔</span>
            <span className="px-2 py-1 bg-cobalt-700 text-white font-semibold">
              05 TARGETED PRACTICE
            </span>
          </div>
        </div>
      </section>

      {/* 5 Competency Criteria Breakdown Table */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h3 className="text-base font-bold text-graphite-900 uppercase tracking-tight">
              Rubric Assessment Breakdown
            </h3>
            <span className="font-mono text-[10px] text-graphite-500 uppercase">
              5 Criteria Evaluated
            </span>
          </div>

          <div className="border border-ivory-300 bg-white divide-y divide-ivory-200 rounded-[2px]">
            {mockSkillGap.competencies.map((comp) => {
              const isGap = comp.status === 'Gap Isolated';

              return (
                <div key={comp.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-cobalt-700">
                        {comp.num}
                      </span>
                      <h4 className="text-sm font-bold uppercase tracking-tight text-graphite-900">
                        {comp.criterionTitle}
                      </h4>
                      <span
                        className={`font-mono text-[9px] uppercase px-2 py-0.5 border font-semibold ${
                          isGap
                            ? 'border-rose-400 text-rose-800 bg-rose-50'
                            : 'border-emerald-400 text-emerald-800 bg-emerald-50'
                        }`}
                      >
                        {comp.status}
                      </span>
                    </div>

                    <p className="text-xs text-graphite-600 pt-1 leading-relaxed">
                      {comp.rubricFinding}
                    </p>

                    <div className="font-mono text-[10px] text-graphite-400 pt-1">
                      Evidence Source: <span className="text-graphite-700">{comp.evidenceArtifact}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-left md:text-right font-mono">
                    <div className="text-xs font-bold text-graphite-900">
                      {comp.levelLabel}
                    </div>
                    <span className="text-[10px] text-graphite-500 block mt-0.5">
                      Score Tier: {comp.demonstratedLevel} / 4
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Remediation Queue Card */}
        <div className="mt-10 p-6 bg-white border border-ivory-300 rounded-[2px] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold">
              QUEUED REMEDIATION ACTIONS (STAGE 02)
            </span>
            <span className="font-mono text-[10px] text-graphite-500 uppercase">
              2 MODULES READY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockSkillGap.remediationQueue.map((rem) => (
              <div key={rem.id} className="p-4 bg-ivory-100 border border-ivory-300 flex flex-col justify-between space-y-3">
                <div>
                  <h5 className="font-bold text-xs text-graphite-900 uppercase">
                    {rem.title}
                  </h5>
                  <p className="text-xs text-graphite-600 mt-1 leading-relaxed">
                    {rem.gapDescription}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-ivory-200">
                  <span className="font-mono text-[10px] text-graphite-500">
                    Est. Duration: {rem.estimatedMinutes}m
                  </span>
                  <button
                    onClick={() => navigate('/practice')}
                    className="font-mono text-[10px] uppercase font-bold text-cobalt-700 hover:underline cursor-pointer"
                  >
                    {rem.actionLabel} &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Link
              to="/submission"
              className="font-mono text-xs text-graphite-600 hover:text-graphite-900 uppercase"
            >
              &larr; View Submitted Evidence
            </Link>

            <button
              onClick={() => navigate('/practice')}
              className="px-6 py-3 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer rounded-[2px]"
            >
              <span>Launch Remediation Drills</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
