import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { SignIn, useAuth } from '@clerk/clerk-react';
import { CLERK_PUBLISHABLE_KEY } from '../config/clerk';

export const Login: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // If already signed in, seamlessly route to dashboard
  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full min-h-[calc(100vh-125px)] flex flex-col justify-between">
      {/* Main Editorial Content Area: Split Architectural Grid */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-130px)]">
        {/* Left Column: Editorial Display Statement & Framework Manifesto (Cols 1-7) */}
        <section className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-ivory-300 relative bg-[#FAF9F6]">
          {/* Top Editorial Indicator & Category */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-graphite-400">
              <span>SYS.REF / 2025.EVAL</span>
              <span className="text-ivory-300">•</span>
              <span className="text-cobalt-700 font-medium">Standardized Competency Ledger</span>
            </div>

            {/* Monumental Typography Headline */}
            <div className="pt-2 lg:pt-6">
              <h1 className="text-[3rem] sm:text-[4.25rem] lg:text-[5.25rem] xl:text-[6rem] leading-[0.92] font-black tracking-[-0.045em] text-graphite-900 uppercase">
                Prove <br />
                <span className="text-graphite-400 font-normal">What You</span>
                <br />
                Can Do<span className="text-cobalt-700">.</span>
              </h1>
            </div>

            {/* Editorial Lead Copy */}
            <p className="pt-4 text-base sm:text-lg lg:text-xl text-graphite-700 max-w-xl font-normal leading-relaxed">
              A rigorous demonstration environment designed to validate practical capability through structured evidence, verifiable problem execution, and transfer verification.
            </p>
          </div>

          {/* Lower Grid: 4 Core Methodology Pillars */}
          <div className="pt-12 lg:pt-16 mt-auto">
            <div className="border-t border-ivory-300 pt-6">
              <div className="font-mono text-[10px] tracking-widest uppercase text-graphite-400 mb-4 flex items-center justify-between">
                <span>Competency Architecture Flow</span>
                <span>ISO / VERIFIABLE STANDARDS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {/* Phase 01 */}
                <div className="space-y-1.5">
                  <span className="font-mono text-xs font-bold text-cobalt-700">01</span>
                  <h4 className="text-xs font-bold uppercase tracking-tight text-graphite-900">
                    Evidence
                  </h4>
                  <p className="text-[12px] text-graphite-500 leading-snug">
                    Artifact-based proof of work.
                  </p>
                </div>

                {/* Phase 02 */}
                <div className="space-y-1.5">
                  <span className="font-mono text-xs font-bold text-cobalt-700">02</span>
                  <h4 className="text-xs font-bold uppercase tracking-tight text-graphite-900">
                    Evaluation
                  </h4>
                  <p className="text-[12px] text-graphite-500 leading-snug">
                    Calibrated rubric scoring.
                  </p>
                </div>

                {/* Phase 03 */}
                <div className="space-y-1.5">
                  <span className="font-mono text-xs font-bold text-cobalt-700">03</span>
                  <h4 className="text-xs font-bold uppercase tracking-tight text-graphite-900">
                    Practice
                  </h4>
                  <p className="text-[12px] text-graphite-500 leading-snug">
                    Targeted remediation loops.
                  </p>
                </div>

                {/* Phase 04 */}
                <div className="space-y-1.5">
                  <span className="font-mono text-xs font-bold text-cobalt-700">04</span>
                  <h4 className="text-xs font-bold uppercase tracking-tight text-graphite-900">
                    Transfer
                  </h4>
                  <p className="text-[12px] text-graphite-500 leading-snug">
                    Cross-domain validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Candidate Gateway Authentication Zone (Cols 8-12) */}
        <section className="lg:col-span-5 p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-[#FAF9F6]">
          <div className="w-full max-w-[440px] mx-auto space-y-6">
            {/* Meta Header */}
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cobalt-700"></span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-graphite-800">
                  Candidate Gateway
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase text-graphite-400">
                CLERK SECURE AUTH
              </span>
            </div>

            {/* Archival Auth Shell Container */}
            <div
              id="clerk-auth-root"
              className="border border-ivory-300 bg-white p-5 sm:p-7 relative shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              {/* Corner Tag */}
              <div className="absolute -top-[1px] -right-[1px] border-l border-b border-ivory-300 bg-ivory-100 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-graphite-500 z-10">
                AUTH // LIVE
              </div>

              {CLERK_PUBLISHABLE_KEY ? (
                <SignIn
                  routing="hash"
                  fallbackRedirectUrl="/dashboard"
                  forceRedirectUrl="/dashboard"
                  signUpFallbackRedirectUrl="/dashboard"
                  signUpForceRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: 'w-full flex justify-center',
                      cardBox: 'w-full shadow-none border-0 p-0 bg-transparent',
                      card: 'w-full shadow-none border-0 p-0 bg-transparent',
                      headerTitle: 'text-xl font-bold tracking-tight text-graphite-900',
                      headerSubtitle: 'text-xs text-graphite-500 mt-1',
                      socialButtonsBlockButton:
                        'border border-ivory-300 hover:border-graphite-700 hover:bg-ivory-50 text-xs font-medium text-graphite-800 rounded-[2px] transition-all py-2.5 shadow-none',
                      socialButtonsBlockButtonText: 'text-xs font-medium text-graphite-800',
                      dividerRow: 'my-4',
                      dividerText:
                        'text-[10px] uppercase font-mono tracking-widest text-graphite-400',
                      formFieldLabel:
                        'text-[10px] uppercase font-mono tracking-wider text-graphite-600 mb-1',
                      formFieldInput:
                        'bg-ivory-50 border border-ivory-300 focus:border-cobalt-700 focus:bg-white text-xs text-graphite-900 rounded-[2px] transition-colors py-2.5 px-3.5 shadow-none',
                      formButtonPrimary:
                        'bg-graphite-900 hover:bg-cobalt-700 text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] py-3 transition-colors duration-150 shadow-none cursor-pointer',
                      footerActionLink:
                        'text-cobalt-700 hover:underline font-mono text-xs uppercase tracking-wider',
                      identityPreviewText: 'text-xs text-graphite-900 font-mono',
                      identityPreviewEditButton: 'text-xs text-cobalt-700 hover:underline',
                    },
                    variables: {
                      colorPrimary: '#111215',
                      colorText: '#111215',
                      colorBackground: '#FFFFFF',
                      colorInputBackground: '#FAF9F6',
                      colorInputText: '#111215',
                      borderRadius: '2px',
                      fontFamily: 'Inter, sans-serif',
                    },
                  }}
                />
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="text-amber-600 font-mono text-xs uppercase tracking-wider font-semibold">
                    Clerk Configuration Required
                  </div>
                  <p className="text-xs text-graphite-600 leading-relaxed">
                    <code className="font-mono bg-ivory-100 px-1 py-0.5 border border-ivory-200 text-graphite-800">
                      VITE_CLERK_PUBLISHABLE_KEY
                    </code>{' '}
                    is missing from{' '}
                    <code className="font-mono text-graphite-800">.env.local</code>.
                  </p>
                  <p className="text-[11px] text-graphite-400">
                    Add your publishable key to mount live authentication.
                  </p>
                </div>
              )}
            </div>

            {/* Platform Trust Note */}
            <div className="border border-ivory-300/80 p-3.5 bg-ivory-100/50 flex items-center justify-between text-[11px] text-graphite-500">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Evidence Ledger Protocol Active</span>
              </span>
              <span className="font-mono text-[10px] text-graphite-400 uppercase">ISO / VERIFIED</span>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/intro"
                className="font-mono text-xs text-cobalt-700 hover:text-cobalt-900 underline uppercase tracking-wider"
              >
                Read the Post-Login Scroll Story &rarr;
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
