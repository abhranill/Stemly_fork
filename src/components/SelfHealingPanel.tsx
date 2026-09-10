import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  CheckCircle2, 
  X,
  Code2
} from 'lucide-react';
import { SimulationError, FixLogEntry } from '../types';

interface SelfHealingPanelProps {
  currentError: SimulationError | null;
  isHealing: boolean;
  fixAttempt: number;
  fixHistory: FixLogEntry[];
  onRetryFix: () => void;
  onDismissError: () => void;
  onOpenCodeModal: () => void;
}

export const SelfHealingPanel: React.FC<SelfHealingPanelProps> = ({
  currentError,
  isHealing,
  fixAttempt,
  fixHistory,
  onRetryFix,
  onDismissError,
  onOpenCodeModal,
}) => {
  const [showStackTrace, setShowStackTrace] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (!currentError && fixHistory.length === 0) {
    return null;
  }

  const latestFix = fixHistory[fixHistory.length - 1];

  return (
    <div className="w-full space-y-3">
      {/* Active Error & Self-Healing Progress Banner */}
      {currentError && (
        <div className="rounded-xl border border-rose-800/60 bg-rose-950/40 backdrop-blur-md p-4 shadow-xl transition-all animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-900/50 border border-rose-700/50 text-rose-400 mt-0.5">
                {isHealing ? (
                  <Sparkles className="w-5 h-5 animate-spin text-purple-400" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-rose-200">
                    {isHealing
                      ? 'Sandbox Error Intercepted — Auto-Healing in Progress'
                      : 'Sandbox Runtime / Syntax Error Detected'}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-900/80 text-rose-300 border border-rose-700/60">
                    Attempt {fixAttempt}/3
                  </span>
                </div>

                <p className="text-xs text-rose-300/90 mt-1 font-mono break-all">
                  {currentError.message}
                  {currentError.line ? ` (Line ${currentError.line}${currentError.column ? `:${currentError.column}` : ''})` : ''}
                </p>

                {isHealing && (
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-purple-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span>Feeding stack trace back to LLM to rewrite and repair visualization code...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenCodeModal}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700 flex items-center gap-1 transition"
                title="Inspect broken code"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Code</span>
              </button>

              {!isHealing && (
                <button
                  onClick={onRetryFix}
                  className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold flex items-center gap-1 shadow transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Fix</span>
                </button>
              )}

              <button
                onClick={onDismissError}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stack Trace Collapsible Drawer */}
          {currentError.stack && (
            <div className="mt-3 pt-3 border-t border-rose-900/40">
              <button
                onClick={() => setShowStackTrace(!showStackTrace)}
                className="flex items-center gap-1.5 text-xs text-rose-400/90 hover:text-rose-300 font-mono transition"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{showStackTrace ? 'Hide Stack Trace' : 'View Caught Stack Trace'}</span>
                {showStackTrace ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showStackTrace && (
                <pre className="mt-2 p-3 rounded-lg bg-black/60 border border-rose-950 text-[11px] font-mono text-rose-300/80 overflow-x-auto max-h-40 scrollbar-thin">
                  {currentError.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      {/* Latest Successful Auto-Heal Feedback */}
      {latestFix && latestFix.success && !currentError && (
        <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 backdrop-blur-md p-3.5 shadow-lg flex items-center justify-between gap-3 text-xs text-emerald-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-emerald-100">Self-Healing Resolved Error: </span>
              <span className="text-emerald-300/90">{latestFix.fixSummary}</span>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono underline shrink-0"
          >
            {showHistory ? 'Close Log' : 'View Log'}
          </button>
        </div>
      )}

      {/* Fix History Log Drawer */}
      {showHistory && fixHistory.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#080c14] p-4 text-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Self-Healing Diagnostic History</span>
            </h4>
            <span className="text-slate-500 font-mono text-[11px]">
              {fixHistory.length} incident{fixHistory.length > 1 ? 's' : ''} resolved
            </span>
          </div>

          <div className="space-y-2">
            {fixHistory.map((item, idx) => (
              <div key={item.id} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80">
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-1">
                  <span>Incident #{idx + 1}</span>
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="font-mono text-rose-300 text-[11px] mb-1">
                  ⚠️ {item.error.message}
                </p>
                <p className="text-slate-300 text-xs">
                  ✨ <span className="font-medium text-emerald-400">Fixed:</span> {item.fixSummary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
