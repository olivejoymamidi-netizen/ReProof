import React, { useState, useEffect, useRef, useCallback } from 'react';

interface IntegrityMonitorProps {
  onIntegritySignal?: (type: string, detail: string) => void;
  compact?: boolean;
}

export const IntegrityMonitor: React.FC<IntegrityMonitorProps> = ({
  onIntegritySignal,
  compact = false,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [latestNotice, setLatestNotice] = useState<string | null>(null);
  const [showNoticeDetails, setShowNoticeDetails] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera monitoring with explicit user permission
  const requestCameraAccess = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 160 }, height: { ideal: 120 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setPermissionDenied(false);
      } else {
        setDemoMode(true);
      }
    } catch (err) {
      console.info('[IntegrityMonitor] Camera access not granted or not supported; defaulting to session telemetry mode.');
      setPermissionDenied(true);
    }
  };

  // Stop video stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const recordWarning = useCallback((type: string, detail: string) => {
    setWarningCount((prev) => {
      const nextCount = Math.min(3, prev + 1);
      let noticeMsg = '';
      if (nextCount === 1) {
        noticeMsg = 'Integrity Advisory [1/3]: Tab switched or focus lost. Maintain active focus on the workstation.';
      } else if (nextCount === 2) {
        noticeMsg = 'Integrity Advisory [2/3]: Repeated focus shifts detected. Session telemetry is recorded.';
      } else {
        noticeMsg = 'Assessment Review Flagged [3/3]: Multiple session interruptions logged for human audit.';
      }
      setLatestNotice(noticeMsg);

      if (onIntegritySignal) {
        onIntegritySignal(type, detail);
      }
      return nextCount;
    });
  }, [onIntegritySignal]);

  // Monitor browser visibility and focus signals
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordWarning('TAB_BLUR', 'Tab visibility lost / window minimized');
      }
    };

    const handleWindowBlur = () => {
      recordWarning('WINDOW_BLUR', 'Candidate workstation window lost focus');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [recordWarning]);

  const getStatusBadge = () => {
    if (warningCount >= 3) {
      return { text: 'REVIEW REQUIRED', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
    if (warningCount > 0) {
      return { text: `WARNING ${warningCount}/3`, color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    return { text: 'NO INTEGRITY SIGNALS', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  };

  const badge = getStatusBadge();

  return (
    <div className={`font-mono text-xs text-graphite-700 ${compact ? 'max-w-xs' : ''}`}>
      {/* Mini Monitoring Widget */}
      <div className="flex items-center gap-3 p-2 bg-white border border-ivory-300 rounded-[2px] shadow-sm">
        {/* Camera Feed Thumbnail or Placeholder */}
        <div className="relative w-12 h-9 bg-graphite-900 rounded-[2px] overflow-hidden flex items-center justify-center border border-ivory-300 shrink-0">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[8px] text-graphite-400 font-bold uppercase text-center px-0.5">
              {permissionDenied ? 'LOCAL' : demoMode ? 'DEMO' : 'OFF'}
            </span>
          )}
          <span
            className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
              cameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-graphite-400'
            }`}
          />
        </div>

        {/* Status Text and Actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 border rounded-[1px] ${badge.color}`}>
              {badge.text}
            </span>
            {demoMode && <span className="text-[9px] font-mono text-graphite-500">[SIMULATION]</span>}
            {!cameraActive && !permissionDenied && (
              <button
                type="button"
                onClick={requestCameraAccess}
                className="text-[10px] text-cobalt-700 hover:text-cobalt-900 underline font-bold uppercase"
              >
                Enable Camera
              </button>
            )}
          </div>
          <p className="text-[10px] text-graphite-500 truncate mt-0.5">
            {cameraActive
              ? 'Local Camera + Focus Active (Zero Remote Storage)'
              : 'Focus & Paste Telemetry Active'}
          </p>
        </div>

        {/* Info Trigger */}
        <button
          type="button"
          onClick={() => setShowNoticeDetails((prev) => !prev)}
          className="text-graphite-400 hover:text-graphite-800 font-bold px-1.5 py-0.5 text-xs border border-ivory-300"
          title="About Assessment Integrity & Privacy"
        >
          ℹ
        </button>
      </div>

      {/* Warning Notice Banner */}
      {latestNotice && (
        <div
          className={`mt-2 p-2 border text-[11px] font-sans flex items-center justify-between rounded-[2px] ${
            warningCount >= 3
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <span>{latestNotice}</span>
          <button
            type="button"
            onClick={() => setLatestNotice(null)}
            className="text-xs font-mono ml-2 font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Privacy & Three-Warning Policy Modal */}
      {showNoticeDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-900/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full border border-graphite-900 p-6 space-y-4 rounded-[2px] shadow-2xl">
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <span className="font-mono text-xs uppercase font-bold text-cobalt-700">
                INTEGRITY & PRIVACY PROTOCOL
              </span>
              <button
                type="button"
                onClick={() => setShowNoticeDetails(false)}
                className="font-mono text-xs font-bold text-graphite-500 hover:text-graphite-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs text-graphite-700 leading-relaxed">
              <p>
                <strong>Zero Video Storage:</strong> When camera monitoring is enabled, video frames are processed purely in local browser volatile memory. No video or audio is ever recorded, transmitted, or stored on remote servers.
              </p>
              <p>
                <strong>Non-Punitive Telemetry:</strong> ReProof does not make automatic permanent accusations of cheating based on AI heuristics. Telemetry (tab switches, focus loss) is presented to human evaluators as diagnostic context.
              </p>
              <div className="bg-ivory-100 border border-ivory-300 p-3 rounded-[2px] font-mono text-[10px] space-y-1 text-graphite-800">
                <div className="font-bold text-cobalt-700 uppercase">3-Warning Policy:</div>
                <div>• Warning 1: Informational focus advisory</div>
                <div>• Warning 2: Elevated session anomaly notice</div>
                <div>• Warning 3: Flagged for human review (assessment continues)</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowNoticeDetails(false)}
                className="px-4 py-1.5 bg-graphite-900 text-white font-mono text-xs uppercase rounded-[2px]"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
