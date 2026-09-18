import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockPracticeExercises } from '../data/mockData';

export const Practice: React.FC = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState(mockPracticeExercises);
  const [activeExerciseId, setActiveExerciseId] = useState<string>(exercises[0].id);

  const toggleComplete = (id: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, completed: !ex.completed } : ex))
    );
  };

  const activeExercise = exercises.find((e) => e.id === activeExerciseId) || exercises[0];

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Top Eyebrow */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-3 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-graphite-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cobalt-700"></span>
            <span className="uppercase font-bold text-cobalt-700">STAGE 02 // TARGETED PRACTICE</span>
            <span>/</span>
            <span>GAP REMEDIATION WORKSTATION</span>
          </div>
          <span className="font-mono text-[10px] uppercase text-graphite-400">
            AUDITED ISOLATION MODE
          </span>
        </div>
      </section>

      {/* Monumental Heading */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-10 sm:py-12">
          <div className="max-w-4xl space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold">
              CALIBRATION & TARGETED DRILLS
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-graphite-900 leading-none">
              REMEDIATE THE ISOLATED GAPS.
            </h1>
            <p className="text-sm sm:text-base text-graphite-600 leading-relaxed">
              Targeted micro-challenges to eliminate the concurrency, memory allocation, and boundary condition defects uncovered during your baseline assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Main Practice Workstation Split */}
      <section className="max-w-[1600px] mx-auto w-full px-6 sm:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Drills List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-graphite-500 font-bold mb-2">
              ACTIVE REMEDIATION DRILLS:
            </div>

            {exercises.map((drill) => {
              const isSelected = drill.id === activeExerciseId;

              return (
                <div
                  key={drill.id}
                  onClick={() => setActiveExerciseId(drill.id)}
                  className={`p-5 border cursor-pointer transition-all duration-150 rounded-[2px] relative ${
                    isSelected
                      ? 'border-cobalt-700 bg-white'
                      : 'border-ivory-300 bg-ivory-100 hover:bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-cobalt-700" />
                  )}

                  <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
                    <span
                      className={`px-2 py-0.5 border font-semibold ${
                        drill.completed
                          ? 'border-emerald-400 text-emerald-800 bg-emerald-50'
                          : 'border-ivory-300 text-graphite-600 bg-white'
                      }`}
                    >
                      {drill.completed ? 'COMPLETED' : 'PENDING'}
                    </span>
                    <span className="text-graphite-500">{drill.estimatedMinutes}m</span>
                  </div>

                  <h3 className="text-sm font-bold uppercase text-graphite-900 mb-1">
                    {drill.title}
                  </h3>
                  <p className="text-xs text-graphite-600 leading-relaxed mb-3">
                    {drill.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-ivory-200">
                    <span className="font-mono text-[10px] text-cobalt-700 uppercase">
                      Topic: {drill.topic}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(drill.id);
                      }}
                      className="font-mono text-[10px] uppercase font-bold text-graphite-700 hover:text-cobalt-700 cursor-pointer"
                    >
                      {drill.completed ? 'Mark Incomplete' : 'Mark Done ✓'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive Sandbox (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-ivory-300 bg-white p-6 rounded-[2px] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <span className="font-mono text-xs font-bold text-graphite-900 uppercase">
                  DRILL EXECUTION SANDBOX // {activeExercise.title}
                </span>
                <span className="font-mono text-[10px] text-cobalt-700 font-bold uppercase">
                  {activeExercise.completed ? 'CALIBRATED' : 'ACTIVE'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-graphite-500">
                  REMEDIATION GOAL:
                </div>
                <p className="text-xs text-graphite-800 leading-relaxed font-sans">
                  {activeExercise.taskGoal}
                </p>
              </div>

              {/* Code Sandbox Viewport */}
              <div className="border border-ivory-300 bg-graphite-900 text-ivory-200 p-4 font-mono text-xs rounded-[2px] space-y-1 leading-relaxed overflow-x-auto">
                <div className="text-graphite-500">// Remediation Implementation Pattern</div>
                <div>func ExecuteOptimizedBatch(ctx context.Context, records []Record) error &#123;</div>
                <div className="pl-4 text-cobalt-300">// Pre-allocated circular ring buffer; zero dynamic heap allocations</div>
                <div className="pl-4">ringBuffer := make([]byte, 1024 * 16)</div>
                <div className="pl-4">return FastDecimalCompute(ringBuffer, records)</div>
                <div>&#125;</div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-ivory-200">
                <button
                  onClick={() => toggleComplete(activeExercise.id)}
                  className="px-4 py-2 border border-ivory-300 bg-ivory-100 hover:bg-ivory-200 text-graphite-900 font-mono text-xs uppercase tracking-wider cursor-pointer rounded-[2px]"
                >
                  {activeExercise.completed ? 'Mark Incomplete' : 'Verify & Complete Drill'}
                </button>

                <button
                  onClick={() => navigate('/changed-condition')}
                  className="px-6 py-3 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer rounded-[2px]"
                >
                  <span>Proceed to Changed Condition</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <Link to="/skill-gap" className="text-graphite-500 hover:text-graphite-900 uppercase">
                &larr; Return to Skill Gap Report
              </Link>
              <Link to="/changed-condition" className="text-cobalt-700 font-bold uppercase hover:underline">
                Skip to The Changed Condition &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
