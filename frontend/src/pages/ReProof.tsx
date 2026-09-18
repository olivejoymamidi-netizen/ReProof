import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockReProofResult } from '../data/mockData';

export const ReProof: React.FC = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [verified, setVerified] = useState(false);

  const [adaptedCode, setAdaptedCode] = useState(`// Adapted Solution: Zero-Allocation Pre-Allocated Ring Buffer
package service

type FixedDecimalEngine struct {
  // Pre-allocated scratchpad buffer eliminates heap allocations on hot path
  buffer [1024]byte
}

func (e *FixedDecimalEngine) CalculateEdgeTotal(cents int64, rateBps int64) int64 {
  // Direct byte-aligned integer arithmetic avoiding float64 runtime
  discount := (cents * rateBps) / 10000
  return cents - discount
}`);

  const handleRunVerification = () => {
    setIsVerifying(true);
    setSimulationLogs(['[00.00s] Initializing embedded serverless edge container (16MB cap)...']);

    setTimeout(() => {
      setSimulationLogs((prev) => [
        ...prev,
        '[00.45s] Injecting 180ms artificial network latency to central DB...',
        '[00.90s] Testing zero-heap allocation hot path across 50,000 requests/sec... (PASS)',
      ]);
    }, 600);

    setTimeout(() => {
      setSimulationLogs((prev) => [
        ...prev,
        '[01.40s] Memory footprint checked: 4.8MB / 16MB ceiling (PASS)',
        '[01.80s] Calculating transfer adaptability index: 96 / 100',
        '[02.10s] Cryptographic proof hash anchored: sha256:0x3a8f1b92c4e7d01a',
      ]);
      setIsVerifying(false);
      setVerified(true);
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Top Eyebrow */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-3 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-graphite-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cobalt-700"></span>
            <span className="uppercase font-bold text-cobalt-700">
              STAGE 04 // ADAPTIVE RE-PROOF
            </span>
            <span>/</span>
            <span>TRANSFER MASTERY VERIFICATION</span>
          </div>
          <span className="font-mono text-[10px] uppercase text-graphite-400">
            ATTEMPT 02 // CONDITIONAL SHIFT
          </span>
        </div>
      </section>

      {/* Monumental Headline */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-10 sm:py-12">
          <div className="max-w-4xl space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold">
              DEFINITIVE RE-PROOF ENGINE
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-graphite-900 leading-none">
              RE-PROVE UNDER PRESSURE.
            </h1>
            <p className="text-sm sm:text-base text-graphite-600 leading-relaxed">
              Validate your adapted architecture under the 16MB memory hard-ceiling and 180ms latency constraints to earn verifiable credential accreditation.
            </p>
          </div>
        </div>
      </section>

      {/* Workstation 2-Column Split */}
      <section className="max-w-[1600px] mx-auto w-full px-6 sm:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Adapted Solution Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border border-ivory-300 bg-white rounded-[2px] overflow-hidden">
              <div className="bg-ivory-100 px-4 py-2 border-b border-ivory-300 flex items-center justify-between font-mono text-xs text-graphite-700">
                <span>adapted_edge_calc.go</span>
                <span className="font-bold text-cobalt-700 text-[10px]">
                  ADAPTED ARTIFACT (ATTEMPT 2)
                </span>
              </div>

              <textarea
                value={adaptedCode}
                onChange={(e) => setAdaptedCode(e.target.value)}
                rows={15}
                spellCheck={false}
                className="w-full p-4 font-mono text-xs text-graphite-900 bg-white focus:outline-none resize-none leading-relaxed selection:bg-cobalt-700 selection:text-white"
              />

              <div className="p-3 bg-ivory-200 border-t border-ivory-300 flex items-center justify-between">
                <span className="font-mono text-[11px] text-graphite-600">
                  Ready to test against 50,000 req/sec edge simulation.
                </span>
                <button
                  onClick={handleRunVerification}
                  disabled={isVerifying}
                  className="px-6 py-3 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-[2px]"
                >
                  {isVerifying ? 'Running Simulation...' : 'Execute Re-Proof Verification'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Telemetry & Verification Outcome (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-ivory-300 bg-white p-6 rounded-[2px] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <span className="font-mono text-xs font-bold text-graphite-900 uppercase">
                  SIMULATION TELEMETRY LOGS
                </span>
                <span className="font-mono text-[10px] uppercase font-bold text-cobalt-700">
                  {verified ? 'VERIFIED RESILIENT' : 'SANDBOX READY'}
                </span>
              </div>

              <div className="bg-graphite-900 text-ivory-200 p-4 font-mono text-xs rounded-[2px] space-y-1 min-h-[180px] overflow-y-auto">
                {simulationLogs.length === 0 ? (
                  <div className="text-graphite-500 py-8 text-center">
                    Awaiting verification trigger. Press "Execute Re-Proof Verification".
                  </div>
                ) : (
                  simulationLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={log.includes('PASS') ? 'text-emerald-400 font-semibold' : ''}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>

              {verified && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-[2px] space-y-3 font-mono text-xs text-emerald-900">
                  <div className="flex items-center justify-between font-bold">
                    <span>SCORE IMPROVEMENT:</span>
                    <span className="text-emerald-800 text-base">
                      70% &rarr; 98% (+28)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>TRANSFER ADAPTABILITY INDEX:</span>
                    <span className="font-bold">{mockReProofResult.adaptabilityIndex}/100</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 break-all">
                    PROOF HASH: {mockReProofResult.proofHash}
                  </div>
                  <button
                    onClick={() => navigate('/result')}
                    className="w-full py-3 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-[2px] mt-2 block text-center"
                  >
                    View Official Accredited Credential &rarr;
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <Link
                to="/changed-condition"
                className="text-graphite-500 hover:text-graphite-900 uppercase"
              >
                &larr; Review Mutation Constraints
              </Link>
              {verified && (
                <Link
                  to="/result"
                  className="text-cobalt-700 font-bold uppercase hover:underline"
                >
                  Credential Dossier &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
