import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockReProofResult, mockUser } from '../data/mockData';

export const Result: React.FC = () => {
  const navigate = useNavigate();

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(mockReProofResult.proofHash);
    alert('Cryptographic proof hash copied to clipboard.');
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Top Eyebrow */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-3 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-graphite-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-700"></span>
            <span className="uppercase font-bold text-emerald-800">
              ACCREDITED RECORD // FINAL VERIFICATION
            </span>
            <span>/</span>
            <span>PUBLIC AUDIT LEDGER</span>
          </div>
          <span className="font-mono text-[10px] uppercase text-graphite-500">
            CERTIFICATE ID: {mockReProofResult.proofCertificateId}
          </span>
        </div>
      </section>

      {/* Monumental Headline */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-10 sm:py-14">
          <div className="max-w-4xl space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-800 font-bold">
              VERIFICATION PROTOCOL COMPLETED
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-graphite-900 leading-none">
              PROOF OF MASTERY.
            </h1>
            <p className="text-base sm:text-lg text-graphite-600 leading-relaxed font-normal">
              Candidate demonstrated empirical adaptability under perturbed execution constraints. Credential permanently recorded in the institutional ledger.
            </p>
          </div>
        </div>
      </section>

      {/* Credential Dossier Section */}
      <section className="max-w-[1600px] mx-auto w-full px-6 sm:px-12 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Certificate Dossier Plate */}
          <div className="border border-ivory-300 bg-white p-8 sm:p-12 rounded-[2px] space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-ivory-300">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold">
                  INSTITUTIONAL ACCREDITATION DOSSIER
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-graphite-900">
                  Certificate of Adaptive Transfer
                </h2>
                <span className="font-mono text-xs text-graphite-500 block">
                  Domain: Software Development // Track 01 Debugging
                </span>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-[10px] text-graphite-400 uppercase">ACCREDITED CANDIDATE</span>
                <div className="text-base font-bold text-graphite-900">{mockUser.name}</div>
                <div className="text-xs text-cobalt-700 font-semibold">{mockUser.accreditationStatus}</div>
              </div>
            </div>

            {/* Metric Matrices (Baseline vs Re-Proven) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
              <div className="p-4 bg-ivory-100 border border-ivory-300">
                <span className="text-[10px] uppercase text-graphite-500 block">BASELINE SCORE</span>
                <span className="text-2xl font-bold text-graphite-600 block my-1">70%</span>
                <span className="text-[10px] text-graphite-400">Attempt 01</span>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-300">
                <span className="text-[10px] uppercase text-emerald-800 font-bold block">
                  RE-PROVEN SCORE
                </span>
                <span className="text-2xl font-black text-emerald-800 block my-1">
                  {mockReProofResult.finalScore}%
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">+28% Net Growth</span>
              </div>

              <div className="p-4 bg-ivory-100 border border-ivory-300">
                <span className="text-[10px] uppercase text-graphite-500 block">
                  ADAPTABILITY INDEX
                </span>
                <span className="text-2xl font-bold text-cobalt-700 block my-1">
                  {mockReProofResult.adaptabilityIndex} / 100
                </span>
                <span className="text-[10px] text-graphite-500">Tier 1 Transfer</span>
              </div>
            </div>

            {/* Demonstrated Competencies */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-graphite-500 font-bold block">
                AUDITED COMPETENCY CRITERIA:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-ivory-100 border border-ivory-300 flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Deterministic Failure Isolation (Go Test Suite)</span>
                </div>
                <div className="p-3 bg-ivory-100 border border-ivory-300 flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Fixed Decimal Point Precision Arithmetic</span>
                </div>
                <div className="p-3 bg-ivory-100 border border-ivory-300 flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Pre-allocated Circular Ring Buffer under Edge Saturation</span>
                </div>
                <div className="p-3 bg-ivory-100 border border-ivory-300 flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>16MB Memory Hard-Ceiling Conformance</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Hash Verification Box */}
            <div className="p-4 bg-ivory-100 border border-ivory-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider text-graphite-500">
                  CRYPTOGRAPHIC PROOF VERIFICATION HASH
                </span>
                <div className="text-cobalt-700 font-semibold break-all text-[11px]">
                  {mockReProofResult.proofHash}
                </div>
              </div>
              <button
                onClick={handleCopyHash}
                className="px-3 py-1.5 bg-white border border-ivory-300 hover:border-graphite-900 text-graphite-900 text-[10px] uppercase tracking-wider cursor-pointer shrink-0 rounded-[2px]"
              >
                Copy Hash
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/domains"
              className="px-6 py-3 border border-graphite-900 text-graphite-900 hover:bg-graphite-900 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-[2px]"
            >
              Select Next Domain Track &rarr;
            </Link>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-[2px]"
            >
              Return to Institutional Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
