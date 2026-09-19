import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface StageData {
  id: string;
  name: string;
  num: number;
  phase: string;
  title: string;
  lead: string;
  detail: string;
  principle: string;
}

const stages: StageData[] = [
  {
    id: 'section-01',
    name: '01 / Learned',
    num: 1,
    phase: 'PHASE 01 // CONVENTIONAL CREDENTIALING',
    title: 'YOU LEARNED.',
    lead: 'You absorbed concepts, read documentation, and completed tutorials.',
    detail: 'Knowledge accumulated: algorithms, system designs, design patterns.',
    principle: 'SYNTACTIC DRILL',
  },
  {
    id: 'section-02',
    name: '02 / Trained',
    num: 2,
    phase: 'PHASE 01 // CONVENTIONAL CREDENTIALING',
    title: 'YOU TRAINED.',
    lead: 'You ran repetitive exercises and solved canned algorithmic prompts.',
    detail: 'Controlled test cases. Deterministic problem setups with known answers.',
    principle: 'ALGORITHMIC CANNED INPUTS',
  },
  {
    id: 'section-03',
    name: '03 / Certified',
    num: 3,
    phase: 'PHASE 01 // CONVENTIONAL CREDENTIALING',
    title: 'YOU WERE CERTIFIED.',
    lead: 'Badges and certificates declared you technically qualified.',
    detail: 'Multiple-choice examinations and timed coding puzzles verified memory.',
    principle: 'ACADEMIC BADGE LEDGER',
  },
  {
    id: 'section-04',
    name: '04 / Perform',
    num: 4,
    phase: 'PHASE 02 // PRODUCTION REALITY & ARTIFACTS',
    title: 'THEN YOU HAD TO PERFORM.',
    lead: 'In production, nothing is pre-briefed. The system is live, noisy, and ambiguous.',
    detail: 'Unexpected logs. Intermittent network timeouts. Real stakes.',
    principle: 'UNSCRIPTED LATENCY',
  },
  {
    id: 'section-05',
    name: '05 / Evidence',
    num: 5,
    phase: 'PHASE 02 // PRODUCTION REALITY & ARTIFACTS',
    title: 'EVIDENCE OVER CREDENTIALS.',
    lead: 'Competence is not a certificate. It is the artifact you produce.',
    detail: 'Git commits, test suites, telemetry traces, and architecture memos.',
    principle: 'CODE & ARCHITECTURE EVIDENCE',
  },
  {
    id: 'section-06',
    name: '06 / Observe',
    num: 6,
    phase: 'PHASE 02 // PRODUCTION REALITY & ARTIFACTS',
    title: 'WE OBSERVE HOW YOU WORK.',
    lead: 'Not just the final code, but your process of isolating failure vectors.',
    detail: 'How you write reproducible tests, debug edge conditions, and verify bounds.',
    principle: 'FAILURE VECTOR TRACING',
  },
  {
    id: 'section-07',
    name: '07 / The Gap',
    num: 7,
    phase: 'PHASE 03 // DIAGNOSTIC GAP ISOLATION',
    title: 'THE GAP IS REVEALED.',
    lead: 'Concrete diagnostic rubrics surface the exact fracture in your solution.',
    detail: 'Not a generic score: specific precision errors, race conditions, or missing guards.',
    principle: 'CONCRETE DEFICIENCY DELTA',
  },
  {
    id: 'section-08',
    name: '08 / Practice',
    num: 8,
    phase: 'PHASE 03 // DIAGNOSTIC GAP ISOLATION',
    title: 'TARGETED REMEDIATION.',
    lead: 'Micro-drills calibrated directly to the specific vulnerabilities uncovered.',
    detail: 'Zero fluff. High-leverage practice on the exact missing competency.',
    principle: 'CALIBRATED LEVERAGE DRILLS',
  },
  {
    id: 'section-09',
    name: '09 / Pause',
    num: 9,
    phase: 'PHASE 03 // DIAGNOSTIC GAP ISOLATION',
    title: 'THINK YOU MASTERED IT?',
    lead: 'You fixed the immediate problem in your local environment.',
    detail: 'Now the true evaluation begins.',
    principle: 'BASELINE AUDIT',
  },
  {
    id: 'section-10',
    name: '10 / Conditions',
    num: 10,
    phase: 'PHASE 04 // ADAPTIVE TRANSFER & RE-PROOF',
    title: 'THE CONDITIONS MUTATE.',
    lead: 'Infrastructure rules change. Latency spikes. Zero external cache allowed.',
    detail: 'Can your architecture survive when the original assumptions collapse?',
    principle: 'CONSTRAINT MUTATION',
  },
  {
    id: 'section-11',
    name: '11 / Transfer',
    num: 11,
    phase: 'PHASE 04 // ADAPTIVE TRANSFER & RE-PROOF',
    title: 'TRANSFER VERIFICATION.',
    lead: 'True mastery is the ability to adapt your solution under altered reality.',
    detail: 'Adapting to strict constraints demonstrates true engineering depth.',
    principle: 'ADAPTIVE ENGINEERING DEPTH',
  },
  {
    id: 'section-12',
    name: '12 / ReProof',
    num: 12,
    phase: 'PHASE 04 // ADAPTIVE TRANSFER & RE-PROOF',
    title: 'RE-PROVE YOUR MASTERY.',
    lead: 'Definitive evidence of adaptability permanently verified in your public dossier.',
    detail: 'Proof that endures through dynamic production volatility.',
    principle: 'PERMANENT PUBLIC DOSSIER',
  },
];

export const Intro: React.FC = () => {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Left-side tracker indicator position
  const [trackerTop, setTrackerTop] = useState(0);
  const [trackerHeight, setTrackerHeight] = useState(24);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Update left-side progress beam position when active stage changes
  useEffect(() => {
    const currentBtn = buttonRefs.current[activeStage - 1];
    if (currentBtn) {
      setTrackerTop(currentBtn.offsetTop);
      setTrackerHeight(currentBtn.offsetHeight);
    }
  }, [activeStage]);

  // High-performance scroll tracking using requestAnimationFrame
  const updateScrollState = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / (docHeight || 1), 0), 1);
    setScrollProgress(progress * 100);

    // Calculate which section is closest to the focal line (42% from top of viewport)
    const focalY = window.innerHeight * 0.42;
    let bestStage = 1;
    let minDistance = Infinity;

    for (let i = 0; i < stages.length; i++) {
      const el = document.getElementById(stages[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Distance from element center to focal point
        const elCenter = rect.top + rect.height * 0.4;
        const dist = Math.abs(elCenter - focalY);
        if (dist < minDistance) {
          minDistance = dist;
          bestStage = stages[i].num;
        }
      }
    }

    setActiveStage(bestStage);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Initial evaluation
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [updateScrollState]);

  // Smooth click scroll to specific stage
  const scrollToSection = (id: string, num: number) => {
    setActiveStage(num);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative w-full bg-[#FAF9F6] text-graphite-900 min-h-screen">
      {/* Sticky Progress Sub-header */}
      <div className="sticky top-16 z-30 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-ivory-300 px-6 sm:px-12 py-3 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cobalt-700 rounded-full inline-block" />
            <span className="font-mono text-[11px] font-bold text-cobalt-700 uppercase tracking-widest transition-all">
              {stages[activeStage - 1]?.name || '01 / Learned'}
            </span>
          </div>
          <span className="text-graphite-300 hidden sm:inline">/</span>
          <span className="font-mono text-[10px] text-graphite-500 uppercase tracking-wider hidden sm:inline">
            {stages[activeStage - 1]?.phase || 'PHASE 01'}
          </span>
          <div className="w-28 h-1 bg-ivory-300 relative overflow-hidden rounded-[1px] hidden md:block">
            <div
              className="absolute left-0 top-0 h-full bg-cobalt-700 transition-all duration-150 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase text-graphite-400 hidden sm:inline">
            STAGE 0{activeStage} // 12
          </span>
          <button
            onClick={() => scrollToSection('section-12', 12)}
            className="font-mono text-[10px] uppercase tracking-wider text-graphite-600 hover:text-cobalt-700 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Skip to Re-Proof</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Lateral Story Index Tracker (Desktop Fixed Sidebar) */}
      <aside className="fixed left-6 xl:left-12 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col select-none">
        <div className="text-[9px] font-mono font-bold tracking-widest text-graphite-400 uppercase mb-3 flex items-center gap-1.5 pl-4">
          <span className="w-1.5 h-1.5 bg-cobalt-700 inline-block" />
          <span>PROGRESSION TRACK</span>
        </div>

        <div className="relative pl-4 flex flex-col gap-1">
          {/* Vertical Track Rail */}
          <div className="absolute left-0 top-1 bottom-1 w-[1px] bg-ivory-300" />

          {/* Animated Sliding Active Beam */}
          <div
            className="absolute left-0 w-[2.5px] bg-cobalt-700 transition-all duration-300 ease-out rounded-full shadow-xs"
            style={{
              top: `${trackerTop}px`,
              height: `${trackerHeight}px`,
            }}
          />

          {/* Points List */}
          {stages.map((s, idx) => {
            const isActive = activeStage === s.num;
            const isPast = s.num < activeStage;

            return (
              <button
                key={s.id}
                ref={(el) => {
                  buttonRefs.current[idx] = el;
                }}
                onClick={() => scrollToSection(s.id, s.num)}
                className={`text-left font-mono text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 py-1 px-2 rounded-[2px] ${
                  isActive
                    ? 'font-bold text-cobalt-700 translate-x-1.5 bg-cobalt-50/80 border-l-2 border-cobalt-700 shadow-2xs'
                    : isPast
                    ? 'text-graphite-600 hover:text-graphite-900 opacity-75 hover:opacity-100 translate-x-0'
                    : 'text-graphite-400 hover:text-graphite-700 opacity-50 hover:opacity-100 translate-x-0'
                }`}
                title={`Jump to ${s.name}`}
              >
                <span className={`w-1.5 h-[1.5px] inline-block transition-all ${
                  isActive ? 'bg-cobalt-700 w-2.5' : 'bg-transparent'
                }`} />
                <span>{s.name}</span>
                {isActive && (
                  <span className="text-[8px] tracking-tighter text-cobalt-600/80 font-normal ml-auto">
                    [ACTIVE]
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Story Sections Narrative with Zero-Style Scroll Text Animations */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:pl-52 divide-y divide-ivory-300">
        {stages.map((stage) => {
          const isActive = activeStage === stage.num;
          const isPast = stage.num < activeStage;

          return (
            <section
              key={stage.id}
              id={stage.id}
              data-stage-num={stage.num}
              className={`min-h-[80vh] flex flex-col justify-center py-20 relative transition-all duration-700 ease-out ${
                isActive
                  ? 'opacity-100 translate-y-0 scale-100'
                  : isPast
                  ? 'opacity-35 sm:opacity-40 -translate-y-2 scale-[0.99] pointer-events-none'
                  : 'opacity-20 sm:opacity-25 translate-y-8 sm:translate-y-10 scale-[0.985] pointer-events-none'
              }`}
            >
              <div className="space-y-6">
                {/* 1. Eyebrow Tag with Staggered Entrance */}
                <div
                  className={`flex items-center gap-3 font-mono text-xs uppercase tracking-widest transition-all duration-500 delay-75 ease-out ${
                    isActive
                      ? 'opacity-100 translate-y-0 text-cobalt-700'
                      : 'opacity-50 translate-y-2 text-graphite-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 font-bold">
                    <span className="w-1.5 h-1.5 bg-cobalt-700 inline-block" />
                    <span>{stage.name}</span>
                  </span>
                  <span className="text-graphite-300">•</span>
                  <span className="text-graphite-500 font-medium text-[11px] hidden sm:inline">
                    {stage.phase}
                  </span>
                </div>

                {/* 2. Monumental Headline with Cinematic Text Reveal */}
                <h2
                  className={`text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-graphite-900 leading-[0.95] transition-all duration-600 delay-150 ease-out ${
                    isActive
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-60 translate-y-4'
                  }`}
                >
                  {stage.title}
                </h2>

                {/* 3. Lead Paragraph Narrative with Smooth Slide-in */}
                <p
                  className={`text-lg sm:text-2xl text-graphite-700 max-w-3xl font-normal leading-relaxed transition-all duration-700 delay-225 ease-out ${
                    isActive
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-50 translate-y-5'
                  }`}
                >
                  {stage.lead}
                </p>

                {/* 4. Observable Principle Technical Card */}
                <div
                  className={`p-6 rounded-[2px] max-w-2xl transition-all duration-800 delay-300 ease-out border ${
                    isActive
                      ? 'bg-white border-cobalt-300 shadow-md translate-y-0 opacity-100'
                      : 'bg-ivory-100/60 border-ivory-300 translate-y-4 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-ivory-200">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-cobalt-700 font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cobalt-700 inline-block" />
                      <span>OBSERVABLE PRINCIPLE // {stage.principle}</span>
                    </div>
                    <span className="font-mono text-[10px] text-graphite-400 uppercase font-semibold">
                      STAGE 0{stage.num}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-graphite-700 leading-relaxed font-mono">
                    {stage.detail}
                  </p>
                </div>

                {/* Interactive Launch Actions for Final Stage (Section 12) */}
                {stage.num === 12 && (
                  <div
                    className={`pt-8 space-y-5 transition-all duration-700 delay-350 ease-out ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
                    }`}
                  >
                    <div className="text-xs text-graphite-600 max-w-xl leading-relaxed font-mono">
                      Candidate verification matrix is initialized. Proceed to select your target technical domain, benchmark level, and execute empirical assessment protocols.
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => navigate('/domains')}
                        className="px-8 py-4 bg-graphite-900 text-white hover:bg-cobalt-700 transition-colors duration-200 text-xs sm:text-sm font-semibold tracking-widest uppercase flex items-center gap-3 cursor-pointer rounded-[2px] shadow-sm"
                      >
                        <span>Select Domain &amp; Skill</span>
                        <span>&rarr;</span>
                      </button>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-4 border border-graphite-900 text-graphite-900 hover:bg-graphite-900 hover:text-white transition-colors duration-200 text-xs sm:text-sm font-semibold tracking-widest uppercase cursor-pointer rounded-[2px]"
                      >
                        Candidate Cockpit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
