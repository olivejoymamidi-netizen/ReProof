import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  startProject,
  saveProjectDraft,
  logProjectIntegrity,
  submitProject,
} from '../api/project';
import type {
  ProjectSpecification,
  ProjectAttemptResponse,
} from '../api/project';
import { IntegrityMonitor } from '../components/common/IntegrityMonitor';

export const Project: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dynamic parameters
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
    searchParams.get('levelNumber') ||
    localStorage.getItem('reproof_selected_level') ||
    '1';

  const levelNumber = Number(levelId) || 1;

  // State
  const [attempt, setAttempt] = useState<ProjectAttemptResponse | null>(null);
  const [spec, setSpec] = useState<ProjectSpecification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form / Evidence fields
  const [sourceCode, setSourceCode] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [architectureNotes, setArchitectureNotes] = useState('');
  const [executionLogs, setExecutionLogs] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'editor' | 'architecture' | 'logs' | 'repo'>('editor');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [integritySignalsCount, setIntegritySignalsCount] = useState(0);

  // Auto-save debouncing
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  // Initialize or resume attempt
  useEffect(() => {
    isMountedRef.current = true;

    async function initProject() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await startProject(domainId, skillId, levelNumber);
        if (!isMountedRef.current) return;

        setAttempt(response);
        setSpec(response.projectSpec);
        setIntegritySignalsCount(response.integritySignalsCount || 0);

        // Load draft code if available, otherwise starter code
        if (response.draftSubmission?.sourceCode) {
          setSourceCode(response.draftSubmission.sourceCode);
        } else if (response.projectSpec?.starterCode) {
          setSourceCode(response.projectSpec.starterCode);
        }

        if (response.draftSubmission?.repoUrl) {
          setRepoUrl(response.draftSubmission.repoUrl);
        }
        if (response.draftSubmission?.architectureNotes) {
          setArchitectureNotes(response.draftSubmission.architectureNotes);
        }
        if (response.draftSubmission?.executionLogs) {
          setExecutionLogs(response.draftSubmission.executionLogs);
        }
      } catch (err: any) {
        if (!isMountedRef.current) return;
        setErrorMessage(err.message || 'Failed to initialize project session.');
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    }

    initProject();

    return () => {
      isMountedRef.current = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [domainId, skillId, levelNumber]);

  // Debounced draft save
  const triggerAutoSave = useCallback(
    (code: string, repo: string, notes: string, logs: string) => {
      if (!attempt?.attemptId) return;

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSavingDraft(true);
          await saveProjectDraft(attempt.attemptId, {
            sourceCode: code,
            repoUrl: repo,
            architectureNotes: notes,
            executionLogs: logs,
          });
          const now = new Date();
          setLastSavedTime(
            now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          );
        } catch (e) {
          console.warn('[Project] Error auto-saving draft:', e);
        } finally {
          setIsSavingDraft(false);
        }
      }, 1500);
    },
    [attempt?.attemptId]
  );

  // Monitor visibility / tab change integrity events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && attempt?.attemptId) {
        logProjectIntegrity(attempt.attemptId, 'TAB_BLUR', {
          timestamp: new Date().toISOString(),
          context: 'Candidate switched away from Project workstation',
        }).catch(() => {});
        setIntegritySignalsCount((prev) => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attempt?.attemptId]);

  // Handle source code modification
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSourceCode(val);
    triggerAutoSave(val, repoUrl, architectureNotes, executionLogs);
  };

  // Handle paste tracking for integrity
  const handlePasteCode = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.length > 150 && attempt?.attemptId) {
      logProjectIntegrity(attempt.attemptId, 'BULK_PASTE', {
        charCount: pastedText.length,
        linesCount: pastedText.split('\n').length,
        timestamp: new Date().toISOString(),
      }).catch(() => {});
      setIntegritySignalsCount((prev) => prev + 1);
    }
  };

  // Submit project
  const handleFinalSubmit = async () => {
    if (!attempt?.attemptId) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const result = await submitProject(attempt.attemptId, {
        sourceCode,
        repoUrl,
        architectureNotes,
        executionLogs,
      });

      navigate(
        `/project-result?attemptId=${encodeURIComponent(attempt.attemptId)}&domainId=${encodeURIComponent(domainId)}&skillId=${encodeURIComponent(skillId)}&levelId=${encodeURIComponent(levelId)}`,
        { state: { result } }
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting project deliverables.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-ivory-300 bg-white rounded-[2px] shadow-sm space-y-6 text-center">
          <div className="w-8 h-8 border-2 border-cobalt-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
              INITIALIZING PROJECT ENVIRONMENT
            </span>
            <h2 className="text-xl font-black uppercase text-graphite-900">
              Loading Project Specification
            </h2>
            <p className="text-xs text-graphite-600 font-mono">
              Tailoring deliverables for {skillId} (Level 0{levelNumber})...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !spec) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center bg-[#FAF9F6] text-graphite-900 px-6">
        <div className="max-w-md w-full p-8 border border-rose-300 bg-white rounded-[2px] shadow-sm space-y-4 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-rose-700 font-bold block">
            PROJECT ACCESS ERROR
          </span>
          <h2 className="text-lg font-bold text-graphite-900">
            {errorMessage || 'Project specification not found'}
          </h2>
          <div className="pt-2">
            <Link
              to={`/domains?domainId=${domainId}`}
              className="px-5 py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] transition-colors inline-block"
            >
              Return to Curriculum Matrix &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6] text-graphite-900 pb-16">
      {/* Editorial Header */}
      <section className="w-full border-b border-ivory-300 bg-[#FAF9F6]">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-graphite-500">
              <span className="w-2 h-2 bg-cobalt-700"></span>
              <span className="text-cobalt-700 font-bold">
                {(spec.domainId || domainId || 'AI-ML').toUpperCase()} // {(spec.skillId || skillId || 'MACHINE-LEARNING').toUpperCase()}
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-700 font-semibold">
                LEVEL 0{spec.levelNumber || levelNumber} ({(spec.difficulty || 'Beginner').toUpperCase()})
              </span>
              <span className="text-ivory-300">/</span>
              <span className="text-graphite-500 font-mono">
                PRJ REF: {spec.id || 'BENCHMARK'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              {isSavingDraft ? (
                <span className="text-cobalt-700 animate-pulse flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-cobalt-700 rounded-full"></span>
                  Saving draft...
                </span>
              ) : lastSavedTime ? (
                <span className="text-graphite-500">
                  Draft saved at {lastSavedTime}
                </span>
              ) : null}

              <IntegrityMonitor
                onIntegritySignal={(type, detail) => {
                  if (attempt?.attemptId) {
                    logProjectIntegrity(attempt.attemptId, type, { detail, timestamp: new Date().toISOString() }).catch(() => {});
                    setIntegritySignalsCount((prev) => prev + 1);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-4xl">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-graphite-900 uppercase">
                {spec.title || 'Project Benchmark Workstation'}
              </h1>
              <p className="text-xs sm:text-sm text-graphite-600 leading-relaxed">
                {spec.problemStatement || spec.objective || ''}
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={isSubmitting || !sourceCode.trim()}
                className="w-full sm:w-auto px-8 py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-[2px] font-bold shadow-sm flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <span>Submit Project for Rubric Evaluation</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace (Two Columns: Specs & Evidence Workstation) */}
      <section className="w-full max-w-[1600px] mx-auto px-6 sm:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5 Cols): Project Specs, Constraints, and Rubrics */}
          <div className="lg:col-span-5 space-y-6">
            {/* Objective Card */}
            <div className="bg-white border border-ivory-300 p-5 rounded-[2px] space-y-3 shadow-sm">
              <div className="border-b border-ivory-200 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                  PROJECT OBJECTIVE
                </span>
                <h3 className="text-sm font-bold text-graphite-900 mt-0.5">
                  Core Implementation Goal
                </h3>
              </div>
              <p className="text-xs text-graphite-700 leading-relaxed font-sans">
                {spec.objective || spec.problemStatement || 'Fulfill project requirements according to the evaluation rubric.'}
              </p>
            </div>

            {/* Requirements Checklist */}
            <div className="bg-white border border-ivory-300 p-5 rounded-[2px] space-y-3 shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                FUNCTIONAL REQUIREMENTS
              </span>
              <ul className="space-y-2 text-xs text-graphite-700">
                {(spec.requirements || []).map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-cobalt-700 font-bold shrink-0">0{idx + 1}.</span>
                    <span className="leading-normal">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strict Constraints Card */}
            <div className="bg-amber-50/50 border border-amber-300/80 p-5 rounded-[2px] space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-900 font-bold">
                  STRICT BENCHMARK CONSTRAINTS
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-950 font-mono">
                {(spec.constraints || []).map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">!</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected Functionality & Deliverables */}
            <div className="bg-white border border-ivory-300 p-5 rounded-[2px] space-y-4 shadow-sm">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block mb-1">
                  EXPECTED DELIVERABLES
                </span>
                <div className="space-y-1 text-xs text-graphite-600">
                  {((spec.expectedDeliverables && spec.expectedDeliverables.length > 0)
                    ? spec.expectedDeliverables
                    : (spec.expectedFunctionality || [])
                  ).map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold font-mono">✓</span>
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Evaluation Rubric Breakdown */}
            <div className="bg-white border border-ivory-300 p-5 rounded-[2px] space-y-3 shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                EVALUATION CRITERIA & WEIGHTS
              </span>
              <div className="divide-y divide-ivory-200">
                {((spec.rubricCriteria || spec.evaluationCriteria) || []).map((c) => (
                  <div key={c.id} className="py-2 flex items-start justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-graphite-900">{c.name}</div>
                      <div className="text-[11px] text-graphite-500">{c.description}</div>
                    </div>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-ivory-100 border border-ivory-300 text-cobalt-700 shrink-0">
                      {c.weight}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Interactive Evidence Workstation */}
          <div className="lg:col-span-7 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-ivory-300 bg-white rounded-t-[2px]">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-3 font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                  activeTab === 'editor'
                    ? 'border-b-2 border-cobalt-700 text-cobalt-900 bg-ivory-50'
                    : 'text-graphite-500 hover:text-graphite-900'
                }`}
              >
                Implementation Code ({sourceCode.split('\n').length} lines)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                className={`px-4 py-3 font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                  activeTab === 'architecture'
                    ? 'border-b-2 border-cobalt-700 text-cobalt-900 bg-ivory-50'
                    : 'text-graphite-500 hover:text-graphite-900'
                }`}
              >
                Architecture & Rationale
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('logs')}
                className={`px-4 py-3 font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                  activeTab === 'logs'
                    ? 'border-b-2 border-cobalt-700 text-cobalt-900 bg-ivory-50'
                    : 'text-graphite-500 hover:text-graphite-900'
                }`}
              >
                Execution & Test Logs
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('repo')}
                className={`px-4 py-3 font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                  activeTab === 'repo'
                    ? 'border-b-2 border-cobalt-700 text-cobalt-900 bg-ivory-50'
                    : 'text-graphite-500 hover:text-graphite-900'
                }`}
              >
                External Repo URL
              </button>
            </div>

            {/* Workstation Tab Viewports */}
            <div className="bg-white border border-ivory-300 p-4 rounded-b-[2px] shadow-sm min-h-[550px] flex flex-col justify-between">
              {activeTab === 'editor' && (
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs font-mono text-graphite-500">
                    <span>Source Code Buffer • UTF-8</span>
                    <span>Characters: {sourceCode.length}</span>
                  </div>
                  <textarea
                    value={sourceCode}
                    onChange={handleCodeChange}
                    onPaste={handlePasteCode}
                    placeholder="Enter or paste your project source code here..."
                    className="flex-1 w-full p-4 font-mono text-xs bg-graphite-900 text-ivory-100 rounded-[2px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-cobalt-500 min-h-[480px] resize-y"
                    spellCheck={false}
                  />
                </div>
              )}

              {activeTab === 'architecture' && (
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="text-xs text-graphite-600">
                    Explain the design decisions, component hierarchy, trade-offs, and invariants you established. This will be evaluated by the rubric and cited during the Final Technical Interview.
                  </div>
                  <textarea
                    value={architectureNotes}
                    onChange={(e) => {
                      setArchitectureNotes(e.target.value);
                      triggerAutoSave(sourceCode, repoUrl, e.target.value, executionLogs);
                    }}
                    placeholder="E.g., We architected the pipeline with explicit separation of concern between input ingestion, invariant normalization, and output formatting. We ruled out iterative looping because..."
                    className="flex-1 w-full p-4 font-mono text-xs bg-ivory-50 border border-ivory-300 text-graphite-900 rounded-[2px] leading-relaxed focus:border-cobalt-700 focus:outline-none min-h-[480px] resize-y"
                  />
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="text-xs text-graphite-600">
                    Paste local test runs, terminal execution outputs, benchmark times, or assertion outputs demonstrating functional correctness.
                  </div>
                  <textarea
                    value={executionLogs}
                    onChange={(e) => {
                      setExecutionLogs(e.target.value);
                      triggerAutoSave(sourceCode, repoUrl, architectureNotes, e.target.value);
                    }}
                    placeholder="E.g., $ pytest tests/ --verbose&#10;test_boundary_normalization PASSED [100%]&#10;test_high_volume_throughput PASSED (0.04s)"
                    className="flex-1 w-full p-4 font-mono text-xs bg-graphite-900 text-emerald-400 rounded-[2px] leading-relaxed focus:outline-none min-h-[480px] resize-y"
                    spellCheck={false}
                  />
                </div>
              )}

              {activeTab === 'repo' && (
                <div className="space-y-4 p-4 flex-1">
                  <div className="text-xs text-graphite-600">
                    Optional: Link an external GitHub, GitLab, or public repository containing the full codebase, commits, and tests.
                  </div>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => {
                      setRepoUrl(e.target.value);
                      triggerAutoSave(sourceCode, e.target.value, architectureNotes, executionLogs);
                    }}
                    placeholder="https://github.com/username/project-repo"
                    className="w-full p-3 font-mono text-xs bg-ivory-50 border border-ivory-300 text-graphite-900 rounded-[2px] focus:border-cobalt-700 focus:outline-none"
                  />
                  <div className="p-4 bg-ivory-100 border border-ivory-300 rounded-[2px] text-xs font-mono text-graphite-700 space-y-1">
                    <div className="font-bold uppercase text-[10px] text-graphite-500">Repository Evidence Invariant</div>
                    <p>
                      External repositories provide supplementary audit proof. In-platform source code and architecture notes remain the primary evaluation artifacts.
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Quick Controls */}
              <div className="pt-4 border-t border-ivory-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    triggerAutoSave(sourceCode, repoUrl, architectureNotes, executionLogs)
                  }
                  className="px-4 py-2 border border-ivory-300 hover:bg-ivory-100 font-mono text-xs uppercase tracking-wider text-graphite-700 transition-colors rounded-[2px] cursor-pointer"
                >
                  Save Draft Now
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isSubmitting || !sourceCode.trim()}
                  className="px-6 py-2.5 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors rounded-[2px] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Evaluating Submission...' : 'Submit Project →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-ivory-300 max-w-lg w-full p-6 rounded-[2px] space-y-5 shadow-2xl">
            <div className="border-b border-ivory-200 pb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-bold block">
                SUBMISSION AUDIT CONFIRMATION
              </span>
              <h3 className="text-lg font-bold text-graphite-900 mt-1">
                Confirm Project Deliverables Submission
              </h3>
            </div>

            <div className="text-xs text-graphite-600 space-y-2">
              <p>
                You are about to finalize and lock your project deliverables for <strong>{spec.title}</strong>.
              </p>
              <div className="p-3 bg-ivory-100 border border-ivory-300 rounded-[2px] space-y-1 font-mono text-[11px]">
                <div>• Code buffer: {sourceCode.length} characters ({sourceCode.split('\n').length} lines)</div>
                <div>• Architecture notes: {architectureNotes.length > 0 ? 'Provided' : 'Omitted'}</div>
                <div>• Execution logs: {executionLogs.length > 0 ? 'Provided' : 'Omitted'}</div>
                <div>• Integrity signals: {integritySignalsCount} events captured</div>
              </div>
              <p className="text-graphite-500 italic">
                Your submission will be scored against the official 5-criterion rubric and synthesized into evidence for your Final Technical Interview.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-ivory-300 hover:bg-ivory-100 text-graphite-700 font-mono text-xs uppercase tracking-wider rounded-[2px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] cursor-pointer"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
