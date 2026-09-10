import React from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Download, 
  Code2, 
  Layers,
  Activity,
  Cpu
} from 'lucide-react';
import { STEMVisual } from '../types';

interface HeaderProps {
  currentVisual: STEMVisual | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onDownloadCode: () => void;
  onOpenCodeModal: () => void;
  onOpenPresets: () => void;
  isOffscreenPaused: boolean;
  isHealing: boolean;
  hasErrors: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentVisual,
  isFullscreen,
  onToggleFullscreen,
  onDownloadCode,
  onOpenCodeModal,
  onOpenPresets,
  isOffscreenPaused,
  isHealing,
  hasErrors,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d15]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Active Simulation Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold tracking-tight text-base text-slate-100 font-['Plus_Jakarta_Sans']">
                Visu
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                Studio
              </span>
            </div>
          </div>

          {currentVisual ? (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs truncate">
              <span className="text-slate-400 font-medium">{currentVisual.category}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200 font-medium truncate max-w-[280px]" title={currentVisual.title}>
                {currentVisual.title}
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs text-slate-500">
              <span>Simulation Workspace</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-[11px] text-slate-400">Ready</span>
            </div>
          )}
        </div>

        {/* Status Indicator & Action Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Subtle Live Instrument Status Indicator */}
          <div 
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border bg-slate-900/90 border-slate-800 text-slate-400"
            title={
              isOffscreenPaused
                ? 'Simulation paused while off-screen to preserve CPU'
                : isHealing
                ? 'Self-healing diagnostic engine repairing code'
                : 'Physics engine active'
            }
          >
            <span 
              className={`w-2 h-2 rounded-full ${
                isHealing 
                  ? 'bg-purple-400 animate-pulse' 
                  : hasErrors 
                  ? 'bg-rose-400' 
                  : isOffscreenPaused 
                  ? 'bg-amber-400' 
                  : 'bg-emerald-400'
              }`} 
            />
            <span className="text-[11px] text-slate-300">
              {isHealing 
                ? 'Auto-Recovering' 
                : isOffscreenPaused 
                ? 'Paused (Off-screen)' 
                : hasErrors 
                ? 'Runtime Error' 
                : 'Engine Ready'}
            </span>
          </div>

          {/* STEM Presets Library */}
          <button
            onClick={onOpenPresets}
            id="open-presets-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Library</span>
          </button>

          {/* Code Inspector */}
          <button
            onClick={onOpenCodeModal}
            disabled={!currentVisual}
            id="view-code-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title={currentVisual ? "View or edit visualization source code" : "No visualization loaded"}
          >
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Code</span>
          </button>

          {/* Download HTML */}
          <button
            onClick={onDownloadCode}
            disabled={!currentVisual}
            id="download-code-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title={currentVisual ? "Export standalone HTML simulation" : "No visualization loaded"}
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            disabled={!currentVisual}
            id="toggle-fullscreen-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand Fullscreen"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
