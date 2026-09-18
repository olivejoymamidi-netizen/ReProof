import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAssessment } from '../data/mockData';

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const [openCriterionId, setOpenCriterionId] = useState<string | null>('crit_1');
  const [codeSnippet, setCodeSnippet] = useState(`// order-calc/service.go - Calculation Service
package service

import (
  "github.com/shopspring/decimal"
)

// CalculateFinalTotal resolves tiered discounts and itemized surcharges
func CalculateFinalTotal(subtotalCents int64, tier DiscountTier) (int64, error) {
  // [FIX IMPLEMENTED]: Replaced float64 with fixed-point decimal
  subtotalDec := decimal.NewFromInt(subtotalCents)
  discountApplied := subtotalDec.Mul(tier.FixedRate).RoundBank(2)
  finalCents := subtotalDec.Sub(discountApplied).IntPart()

  return finalCents, nil
}`);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const toggleCriterion = (id: string) => {
    setOpenCriterionId((prev) => (prev === id ? null : id));
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setTestOutput(
        'PASS: 7/7 test cases passed (100%). Deterministic regression test confirmed.'
      );
    }, 700);
  };

  const handleSubmit = () => {
    navigate('/submission');
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Top Context & Monumental Header */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10 sm:py-12">
          {/* Eyebrow */}
          <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest">
            <span className="w-2 h-2 bg-cobalt-700"></span>
            <span className="text-cobalt-700 font-bold">
              {mockAssessment.domainName} // INITIAL ASSESSMENT
            </span>
            <span className="text-ivory-300">/</span>
            <span className="text-graphite-500">
              PROTOCOL REF: {mockAssessment.protocolRef}
            </span>
          </div>

          {/* Monumental Headline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-graphite-900 leading-none">
                SHOW US WHAT
                <br />
                YOU CAN DO.
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-1">
              <p className="text-sm sm:text-base text-graphite-600 font-normal leading-relaxed">
                Complete the practical task. Your work will be evaluated against observable, empirical competency criteria in an isolated runtime environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Architectural Briefing Grid */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ivory-300">
          {/* Left Column: Task Briefing & 5 Observable Criteria (Cols 1-7) */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-ivory-300 py-10 lg:pr-10 space-y-8">
            {/* Task Header Division */}
            <div className="pb-6 border-b border-ivory-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-cobalt-700 font-bold">
                  ASSIGNMENT BRIEF // STAGE 01
                </span>
                <span className="font-mono text-[9px] uppercase text-graphite-700 bg-ivory-200 px-2 py-0.5 border border-ivory-300">
                  {mockAssessment.severity}
                </span>
              </div>
              <h2 className="text-2xl font-black text-graphite-900 uppercase tracking-tight">
                {mockAssessment.title}
              </h2>
            </div>

            {/* Incident Synopsis */}
            <div className="space-y-2">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-graphite-500 font-bold">
                INCIDENT SYNOPSIS
              </h3>
              <p className="text-sm sm:text-base text-graphite-800 leading-relaxed bg-white p-4 border border-ivory-300 rounded-[2px]">
                {mockAssessment.synopsis}
              </p>
            </div>

            {/* Workspace Topology */}
            <div className="bg-ivory-200 border border-ivory-300 p-5 rounded-[2px] space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                <span className="text-cobalt-700 font-bold">
                  WORKSPACE TOPOLOGY & BOUNDED CONTEXT
                </span>
                <span className="text-graphite-500">CONTAINER: LINUX-X86_64-ISOLATED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {mockAssessment.topology.map((t) => (
                  <div key={t.code} className="bg-white p-3 border border-ivory-300">
                    <span className="font-mono text-[10px] text-cobalt-700 font-bold block">
                      {t.code}
                    </span>
                    <span className="font-bold text-xs text-graphite-900 block mt-0.5">
                      {t.name}
                    </span>
                    <span className="text-[11px] text-graphite-500 mt-1 block leading-snug">
                      {t.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Observable Criteria Accordion */}
            <div className="space-y-4 pt-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-black text-graphite-900 uppercase tracking-tight">
                  WHAT YOU MUST DEMONSTRATE
                </h3>
                <span className="font-mono text-[10px] text-graphite-500 uppercase">
                  5 CRITERIA REQUIRED
                </span>
              </div>
              <p className="text-xs text-graphite-500">
                Evaluators do not score based on subjective convention. You must generate auditable artifacts for each criteria below:
              </p>

              <div className="divide-y divide-ivory-300 border-t border-b border-ivory-300 bg-white">
                {mockAssessment.criteria.map((crit) => {
                  const isOpen = openCriterionId === crit.id;

                  return (
                    <div
                      key={crit.id}
                      onClick={() => toggleCriterion(crit.id)}
                      className="py-4 px-4 hover:bg-ivory-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs font-bold text-cobalt-700 pt-0.5">
                            {crit.num}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-tight text-graphite-900 hover:text-cobalt-700 transition-colors">
                              {crit.title}
                            </h4>
                            <p className="text-xs text-graphite-600 mt-1 leading-relaxed">
                              {crit.summary}
                            </p>

                            {isOpen && (
                              <div className="mt-3 pt-3 border-t border-ivory-200 text-xs font-mono text-cobalt-900 bg-cobalt-100/30 p-2.5">
                                {crit.verifiableTarget}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[9px] uppercase text-graphite-600 px-1.5 py-0.5 border border-ivory-300 bg-ivory-100">
                            {crit.badgeLabel}
                          </span>
                          <span className="font-mono text-xs text-graphite-400">
                            {isOpen ? '▴' : '▾'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Candidate Workstation & Code Editor (Cols 8-12) */}
          <div className="lg:col-span-5 py-10 lg:pl-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-graphite-900 font-bold">
                  <span className="w-2 h-2 bg-cobalt-700"></span>
                  <span>CANDIDATE WORKSTATION</span>
                </div>
                <span className="font-mono text-[10px] text-graphite-500 uppercase">
                  SANDBOX // ACTIVE
                </span>
              </div>

              {/* Code Editor Frame */}
              <div className="border border-ivory-300 bg-white rounded-[2px] overflow-hidden">
                <div className="bg-ivory-100 px-4 py-2 border-b border-ivory-300 flex items-center justify-between font-mono text-[11px] text-graphite-600">
                  <span>order-calc/service.go</span>
                  <span className="text-[10px] text-emerald-700 font-bold">● CONNECTED</span>
                </div>

                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className="w-full p-4 font-mono text-xs text-graphite-900 bg-white focus:outline-none resize-none leading-relaxed selection:bg-cobalt-700 selection:text-white"
                />

                {/* Test Runner Strip */}
                <div className="p-3 bg-ivory-200 border-t border-ivory-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-graphite-600">
                    {testOutput || 'Regression test suite ready for execution.'}
                  </span>

                  <button
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="px-4 py-2 bg-graphite-900 hover:bg-cobalt-700 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-[2px] shrink-0"
                  >
                    {isRunning ? 'Running...' : 'Run Regression Suite'}
                  </button>
                </div>
              </div>

              {/* Integrity Checklist Box */}
              <div className="border border-ivory-300 bg-ivory-100 p-4 space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-wider text-graphite-700 font-bold">
                  EVIDENCE BUFFER CHECKLIST:
                </div>
                <div className="space-y-1 text-xs text-graphite-600">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold font-mono">✓</span>
                    <span>Regression test written and isolating defect</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold font-mono">✓</span>
                    <span>Fixed decimal precision arithmetic applied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold font-mono">✓</span>
                    <span>1,000 randomized combinatorial input fixtures green</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Action */}
            <div className="pt-4 border-t border-ivory-300 space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-3 cursor-pointer rounded-[2px]"
              >
                <span>Submit Evidence Dossier</span>
                <span>&rarr;</span>
              </button>
              <p className="text-[11px] text-graphite-500 text-center font-mono">
                Proceeds to evidence capture and git diff dossier verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
