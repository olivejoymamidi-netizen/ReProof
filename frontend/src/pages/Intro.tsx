import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const stages = [
  { id: 'section-01', name: '01 / Learned', num: 1, title: 'YOU LEARNED.', lead: 'You absorbed concepts, read documentation, and completed tutorials.', detail: 'Knowledge accumulated: algorithms, system designs, design patterns.' },
  { id: 'section-02', name: '02 / Trained', num: 2, title: 'YOU TRAINED.', lead: 'You ran repetitive exercises and solved canned algorithmic prompts.', detail: 'Controlled test cases. Deterministic problem setups with known answers.' },
  { id: 'section-03', name: '03 / Certified', num: 3, title: 'YOU WERE CERTIFIED.', lead: 'Badges and certificates declared you technically qualified.', detail: 'Multiple-choice examinations and timed coding puzzles verified memory.' },
  { id: 'section-04', name: '04 / Perform', num: 4, title: 'THEN YOU HAD TO PERFORM.', lead: 'In production, nothing is pre-briefed. The system is live, noisy, and ambiguous.', detail: 'Unexpected logs. Intermittent network timeouts. Real stakes.' },
  { id: 'section-05', name: '05 / Evidence', num: 5, title: 'EVIDENCE OVER CREDENTIALS.', lead: 'Competence is not a certificate. It is the artifact you produce.', detail: 'Git commits, test suites, telemetry traces, and architecture memos.' },
  { id: 'section-06', name: '06 / Observe', num: 6, title: 'WE OBSERVE HOW YOU WORK.', lead: 'Not just the final code, but your process of isolating failure vectors.', detail: 'How you write reproducible tests, debug edge conditions, and verify bounds.' },
  { id: 'section-07', name: '07 / The Gap', num: 7, title: 'THE GAP IS REVEALED.', lead: 'Concrete diagnostic rubrics surface the exact fracture in your solution.', detail: 'Not a generic score: specific precision errors, race conditions, or missing guards.' },
  { id: 'section-08', name: '08 / Practice', num: 8, title: 'TARGETED REMEDIATION.', lead: 'Micro-drills calibrated directly to the specific vulnerabilities uncovered.', detail: 'Zero fluff. High-leverage practice on the exact missing competency.' },
  { id: 'section-09', name: '09 / Pause', num: 9, title: 'THINK YOU MASTERED IT?', lead: 'You fixed the immediate problem in your local environment.', detail: 'Now the true evaluation begins.' },
  { id: 'section-10', name: '10 / Conditions', num: 10, title: 'THE CONDITIONS MUTATE.', lead: 'Infrastructure rules change. Latency spikes. Zero external cache allowed.', detail: 'Can your architecture survive when the original assumptions collapse?' },
  { id: 'section-11', name: '11 / Transfer', num: 11, title: 'TRANSFER VERIFICATION.', lead: 'True mastery is the ability to adapt your solution under altered reality.', detail: 'Adapting to strict constraints demonstrates true engineering depth.' },
  { id: 'section-12', name: '12 / ReProof', num: 12, title: 'RE-PROVE YOUR MASTERY.', lead: 'Definitive evidence of adaptability permanently verified in your public dossier.', detail: 'Proof that endures through dynamic production volatility.' },
];

export const Intro: React.FC = () => {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = Math.min(Math.max(scrollTop / (docHeight || 1), 0), 1);
      setScrollProgress(fraction * 100);

      // Determine active section based on scroll offset
      const stageIndex = Math.min(
        Math.floor(fraction * stages.length) + 1,
        stages.length
      );
      setActiveStage(stageIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-[#FAF9F6] text-graphite-900 min-h-screen">
      {/* Sticky Progress Sub-header */}
      <div className="sticky top-16 z-30 w-full bg-[#FAF9F6]/95 backdrop-blur-xs border-b border-ivory-300 px-6 sm:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-bold text-cobalt-700 uppercase tracking-widest">
            {stages[activeStage - 1]?.name || '01 / Learned'}
          </span>
          <div className="w-28 h-1 bg-ivory-300 relative overflow-hidden rounded-[1px] hidden sm:block">
            <div
              className="absolute left-0 top-0 h-full bg-cobalt-700 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => scrollToSection('section-12')}
          className="font-mono text-[10px] uppercase tracking-wider text-graphite-600 hover:text-cobalt-700 transition-colors cursor-pointer"
        >
          Skip to Re-Proof &rarr;
        </button>
      </div>

      {/* Lateral Story Index Tracker (Desktop Fixed) */}
      <aside className="fixed left-6 xl:left-12 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-col gap-2 border-l border-ivory-300 pl-3 py-1">
          {stages.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`text-left font-mono text-[10px] tracking-widest uppercase transition-all duration-200 pointer-events-auto cursor-pointer ${
                activeStage === s.num
                  ? 'font-bold text-cobalt-700 translate-x-1'
                  : 'text-graphite-400 hover:text-graphite-700'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Story Sections Narrative */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:pl-44 divide-y divide-ivory-300">
        {stages.map((stage) => (
          <section
            key={stage.id}
            id={stage.id}
            className="min-h-[75vh] flex flex-col justify-center py-20 relative"
          >
            <div className="space-y-6">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-graphite-400">
                <span className="text-cobalt-700 font-bold">{stage.name}</span>
                <span>•</span>
                <span>REPROOF MANIFESTO</span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-graphite-900 leading-[0.95]">
                {stage.title}
              </h2>

              {/* Lead copy */}
              <p className="text-lg sm:text-xl text-graphite-700 max-w-2xl font-normal leading-relaxed">
                {stage.lead}
              </p>

              {/* Technical detail plate */}
              <div className="bg-ivory-100 border border-ivory-300 p-5 rounded-[2px] max-w-xl">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cobalt-700 font-semibold mb-1">
                  OBSERVABLE PRINCIPLE:
                </div>
                <p className="text-xs text-graphite-600 leading-relaxed">{stage.detail}</p>
              </div>

              {/* Interactive Next trigger for Section 12 */}
              {stage.num === 12 && (
                <div className="pt-8 space-y-4">
                  <div className="text-xs text-graphite-500 max-w-md leading-relaxed">
                    Ready to proceed to your candidate cockpit. Evidence ledgers, assessment protocols, and domain matrices are initialized.
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => navigate('/domains')}
                      className="px-8 py-4 bg-graphite-900 text-white hover:bg-cobalt-700 transition-colors duration-200 text-xs sm:text-sm font-semibold tracking-wide uppercase flex items-center gap-3 cursor-pointer rounded-[2px]"
                    >
                      <span>Enter ReProof Domains</span>
                      <span>&rarr;</span>
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-6 py-4 border border-graphite-900 text-graphite-900 hover:bg-graphite-900 hover:text-white transition-colors duration-200 text-xs sm:text-sm font-semibold tracking-wide uppercase cursor-pointer rounded-[2px]"
                    >
                      Open Candidate Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
