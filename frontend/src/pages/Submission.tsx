import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { mockSubmission, mockUser } from '../data/mockData';

export const Submission: React.FC = () => {
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

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Archival Canvas Frame */}
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-10 sm:py-12">
        {/* Top Editorial Header & Dossier Context */}
        <div className="w-full pb-8 border-b border-ivory-300 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-graphite-500 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase">
              <span>SOFTWARE DEVELOPMENT</span>
              <span className="text-ivory-300">/</span>
              <span>INITIAL ASSESSMENT</span>
              <span className="text-ivory-300">/</span>
              <span className="text-cobalt-700 font-bold">EVIDENCE DOSSIER</span>
              <span className="px-2 py-0.5 bg-ivory-200 text-graphite-700 border border-ivory-300">
                PROTOCOL REF: {mockSubmission.protocolRef}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-graphite-900 tracking-tight uppercase leading-none">
              SHOW YOUR WORK.
            </h1>

            <p className="text-sm sm:text-base text-graphite-600 max-w-2xl leading-relaxed">
              Submit the evidence behind your solution. ReProof evaluates demonstrated competency, not just the final answer.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-1 font-mono text-[11px] text-graphite-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cobalt-700"></span>
              <span className="uppercase tracking-tight text-graphite-900 font-bold">
                TASK IDENT: {mockSubmission.taskIdent}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase text-graphite-500">
              EVIDENCE BUFFER: LOCKED & VERIFIED
            </span>
          </div>
        </div>

        {/* Main Two-Column Workstation (8 cols / 4 cols) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-ivory-300">
          {/* Left Column: 3 Evidence Submission Sections (8 cols) */}
          <div className="lg:col-span-8 lg:border-r border-ivory-300 divide-y divide-ivory-300 lg:pr-10">
            {/* SECTION 01: SOLUTION */}
            <div className="py-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold">
                    01 // SOLUTION
                  </span>
                  <h2 className="text-xl font-bold text-graphite-900 mt-1">
                    Code delta & project implementation
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-graphite-600 px-2 py-1 bg-ivory-200 border border-ivory-300 uppercase">
                  COMMIT: {mockSubmission.commitHash}
                </span>
              </div>

              <p className="font-mono text-xs text-graphite-500 mb-4">
                Branch: <span className="text-graphite-900 font-semibold">{mockSubmission.branch}</span> · {mockSubmission.files.length} files modified, 1 commit
              </p>

              {/* Code Artifact Inspection Viewport */}
              <div className="bg-white border border-ivory-300 p-4 rounded-[2px]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-ivory-200 font-mono text-xs">
                  <span className="text-graphite-900 font-medium truncate">
                    fix(calc): resolve floating/decimal precision drift on tiered multi-voucher discounts
                  </span>
                  <span className="text-graphite-500 shrink-0 ml-4 font-mono text-[11px]">
                    {mockSubmission.totalLinesChanged} lines modified
                  </span>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  {mockSubmission.files.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between py-1 px-2 hover:bg-ivory-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-graphite-400">📄</span>
                        <span className="text-graphite-900 font-medium">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-3 font-semibold text-[11px]">
                        <span className="text-cobalt-700">+{file.added}</span>
                        <span className="text-rose-700">-{file.deleted}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Diff Details Panel */}
                <div className="mt-4 pt-4 border-t border-ivory-200 bg-ivory-100 p-3 border border-ivory-300">
                  <div className="font-mono text-[11px] text-graphite-500 mb-2 flex justify-between">
                    <span>DIFF EXCERPT: {mockSubmission.diffExcerpt.file}</span>
                    <span>{mockSubmission.diffExcerpt.range}</span>
                  </div>
                  <pre className="font-mono text-xs overflow-x-auto leading-relaxed text-graphite-900">
                    {mockSubmission.diffExcerpt.lines.map((line, idx) => (
                      <div
                        key={idx}
                        className={
                          line.type === 'del'
                            ? 'text-rose-700 bg-rose-50/50 px-1'
                            : line.type === 'add'
                            ? 'text-cobalt-700 bg-cobalt-100/50 px-1 font-semibold'
                            : 'text-graphite-700'
                        }
                      >
                        {line.text}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            </div>

            {/* SECTION 02: TEST RESULTS */}
            <div className="py-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold">
                    02 // TEST RESULTS
                  </span>
                  <h2 className="text-xl font-bold text-graphite-900 mt-1">
                    Test execution, reproduction & boundary outcomes
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-emerald-800 font-bold px-2 py-1 bg-emerald-50 border border-emerald-300 uppercase">
                  PASS // 100%
                </span>
              </div>

              <p className="font-mono text-xs text-graphite-500 mb-4">
                Test summary: <span className="text-graphite-900 font-bold">7 passed, 0 failed, 2 regression suites</span>
              </p>

              <div className="border border-ivory-300 divide-y divide-ivory-200 bg-white">
                {mockSubmission.testResults.items.map((test, idx) => (
                  <div
                    key={idx}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-ivory-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-700 font-mono font-bold mt-0.5">✓</span>
                      <div>
                        <span className="font-mono text-xs text-graphite-900 font-bold block">
                          {test.name}
                        </span>
                        <span className="text-xs text-graphite-500 mt-0.5 block">
                          {test.description}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-graphite-400 shrink-0">
                      {test.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 03: VERIFICATION TRANSCRIPT */}
            <div className="py-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold">
                    03 // VERIFICATION TRANSCRIPT
                  </span>
                  <h2 className="text-xl font-bold text-graphite-900 mt-1">
                    Environment telemetry & audit traces
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-graphite-600 px-2 py-1 bg-ivory-200 border border-ivory-300 uppercase">
                  SANDBOX LOGS
                </span>
              </div>

              <div className="bg-graphite-900 text-ivory-200 p-4 font-mono text-xs rounded-[2px] space-y-1">
                <div>[14:02:11 UTC] Sandbox container provisioned: linux-x86_64</div>
                <div>[14:02:12 UTC] Ingesting git commit 4f91b2c (branch: patch/order-calc-rounding)</div>
                <div>[14:02:14 UTC] Executing test suite: go test ./... -v -count=1</div>
                <div className="text-emerald-400">
                  [14:02:18 UTC] === RUN TestReproduceDiscountOvercharge --- PASS (0.014s)
                </div>
                <div className="text-emerald-400">
                  [14:02:18 UTC] === RUN TestMultiTierVolumeBoundaries --- PASS (0.022s)
                </div>
                <div className="text-emerald-400">
                  [14:02:18 UTC] === RUN TestZeroCouponEdgeCases --- PASS (0.009s)
                </div>
                <div className="text-cobalt-400">[14:02:19 UTC] Audit hash generated: sha256:4f91b2c00a98</div>
              </div>
            </div>
          </div>

          {/* Right Column: Submission Summary & Audit Action (4 cols) */}
          <div className="lg:col-span-4 py-8 lg:pl-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="border border-ivory-300 bg-white p-5 space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block pb-2 border-b border-ivory-200">
                  EVIDENCE AUDIT DOSSIER
                </span>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-graphite-500">CANDIDATE:</span>
                    <span className="text-graphite-900 font-bold">{mockUser.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-graphite-500">PROTOCOL:</span>
                    <span className="text-graphite-900">{mockSubmission.protocolRef}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-graphite-500">COMMIT:</span>
                    <span className="text-graphite-900">{mockSubmission.commitHash}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-graphite-500">TEST COVERAGE:</span>
                    <span className="text-emerald-700 font-bold">100% PASS</span>
                  </div>
                </div>
              </div>

              <div className="bg-ivory-200 p-4 border border-ivory-300 space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-graphite-700 font-bold block">
                  EVALUATION DISPATCH:
                </span>
                <p className="text-xs text-graphite-600 leading-relaxed">
                  Submitting your evidence will map your code artifacts directly to the 5 observable competency rubric levels.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-ivory-300">
              <button
                onClick={() =>
                  navigate(
                    `/project?domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(skillId)}&levelId=${encodeURIComponent(levelId)}`
                  )
                }
                className="w-full py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-3 cursor-pointer rounded-[2px]"
              >
                <span>Continue to Project Round</span>
                <span>&rarr;</span>
              </button>

              <Link
                to="/assessment"
                className="w-full py-2.5 border border-ivory-300 text-graphite-700 hover:bg-ivory-100 font-mono text-xs uppercase tracking-wider flex items-center justify-center transition-colors rounded-[2px]"
              >
                &larr; Return to Workspace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
