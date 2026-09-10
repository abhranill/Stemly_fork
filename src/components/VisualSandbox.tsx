import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Download, 
  Cpu, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Code2,
  Play,
  Pause,
  Atom,
  Activity,
  Globe,
  Radio,
  Layers,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand
} from 'lucide-react';
import { STEMVisual, SimulationError } from '../types';
import { STANDARDIZED_TOUCH_GESTURE_SCRIPT } from '../utils/touchGestureScript';

interface VisualSandboxProps {
  visual: STEMVisual | null;
  isLoading: boolean;
  onRuntimeError: (error: SimulationError) => void;
  onVisibilityChange: (isVisible: boolean) => void;
  onDownloadCode: () => void;
  onOpenCodeModal: () => void;
  onOpenPresets?: () => void;
  onSelectPreset?: (prompt: string, category: string, presetId?: string) => void;
  isHealing: boolean;
  fixSuccessMessage: string | null;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
}

export const VisualSandbox: React.FC<VisualSandboxProps> = ({
  visual,
  isLoading,
  onRuntimeError,
  onVisibilityChange,
  onDownloadCode,
  onOpenCodeModal,
  onOpenPresets,
  onSelectPreset,
  isHealing,
  fixSuccessMessage,
  isFullscreen,
  setIsFullscreen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(true);
  const [isSandboxReady, setIsSandboxReady] = useState<boolean>(false);
  const [lastErrorTime, setLastErrorTime] = useState<number | null>(null);
  const [renderCount, setRenderCount] = useState<number>(0);
  const [currentZoom, setCurrentZoom] = useState<number>(1.0);
  const [currentPan, setCurrentPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset zoom and pan when visual changes
  useEffect(() => {
    setCurrentZoom(1.0);
    setCurrentPan({ x: 0, y: 0 });
  }, [visual?.id]);

  // Zoom and pan actions dispatched to sandboxed iframe
  const handleZoomIn = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'VISU_STEP_ZOOM', delta: 0.25 }, '*');
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'VISU_STEP_ZOOM', delta: -0.25 }, '*');
    }
  }, []);

  const handleResetTransform = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'VISU_RESET_TRANSFORM' }, '*');
    }
    setCurrentZoom(1.0);
    setCurrentPan({ x: 0, y: 0 });
  }, []);

  // 1. IntersectionObserver to pause rendering when scrolled off-screen to prevent CPU overload
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        setIsIntersecting(visible);
        onVisibilityChange(visible);

        // Notify the sandboxed iframe to pause or resume animation loops
        if (iframeRef.current && iframeRef.current.contentWindow) {
          try {
            iframeRef.current.contentWindow.postMessage(
              {
                type: 'VISU_VISIBILITY_CHANGE',
                isVisible: visible,
              },
              '*'
            );
          } catch {
            // Silently ignore cross-origin postMessage errors
          }
        }
      },
      {
        root: null, // viewport
        threshold: [0.0, 0.05, 0.2],
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [onVisibilityChange]);

  // 2. Window message listener for runtime errors, ready notifications, and touch transform updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'VISU_READY') {
        setIsSandboxReady(true);
      }

      // Handle touch zoom/pan changes broadcasted from the iframe gesture handler
      if (event.data.type === 'VISU_TRANSFORM_CHANGE') {
        if (typeof event.data.zoom === 'number') {
          setCurrentZoom(event.data.zoom);
        }
        if (typeof event.data.panX === 'number' && typeof event.data.panY === 'number') {
          setCurrentPan({ x: event.data.panX, y: event.data.panY });
        }
      }

      if (event.data.type === 'VISU_RUNTIME_ERROR') {
        const errPayload = event.data.error || {};
        const errorObj: SimulationError = {
          message: errPayload.message || 'Unknown sandbox execution error',
          line: errPayload.line,
          column: errPayload.column,
          stack: errPayload.stack || '',
          timestamp: Date.now(),
        };

        // Debounce rapid repeated errors to prevent LLM spam
        const now = Date.now();
        if (!lastErrorTime || now - lastErrorTime > 1500) {
          setLastErrorTime(now);
          onRuntimeError(errorObj);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onRuntimeError, lastErrorTime]);

  // 3. Fullscreen toggle & change detection
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        // Fallback to CSS fullscreen
        setIsFullscreen(true);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      }
      setIsFullscreen(false);
    }
  }, [setIsFullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [setIsFullscreen]);

  // Shortcut keys: 'f' toggles fullscreen, '+/-' zooms, '0' resets view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetTransform();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, handleZoomIn, handleZoomOut, handleResetTransform]);

  // Prepare iframe HTML with guaranteed error catcher and touch gesture handler injected
  const prepareSafeHtml = (rawHtml: string): string => {
    if (!rawHtml) return '';

    const safetyScript = `
<script>
  (function() {
    window.onerror = function(msg, url, line, col, err) {
      try {
        window.parent.postMessage({
          type: 'VISU_RUNTIME_ERROR',
          error: {
            message: String(msg),
            line: line,
            column: col,
            stack: err && err.stack ? err.stack : ''
          }
        }, '*');
      } catch(e) {}
      return false;
    };
    window.addEventListener('unhandledrejection', function(event) {
      try {
        window.parent.postMessage({
          type: 'VISU_RUNTIME_ERROR',
          error: {
            message: event.reason ? (event.reason.message || String(event.reason)) : 'Promise Rejection',
            stack: event.reason && event.reason.stack ? event.reason.stack : ''
          }
        }, '*');
      } catch(e) {}
    });
  })();
</script>`;

    const combinedScript = safetyScript + '\n' + STANDARDIZED_TOUCH_GESTURE_SCRIPT;

    // Inject before </head> or at the top of the HTML
    if (rawHtml.includes('<head>')) {
      return rawHtml.replace('<head>', '<head>' + combinedScript);
    } else if (rawHtml.includes('<html>')) {
      return rawHtml.replace('<html>', '<html><head>' + combinedScript + '</head>');
    } else {
      return combinedScript + rawHtml;
    }
  };

  const handleReload = () => {
    if (iframeRef.current && visual) {
      setRenderCount((prev) => prev + 1);
      iframeRef.current.srcdoc = prepareSafeHtml(visual.htmlCode);
    }
  };

  // Triggered when user wants to test the Self-Healing engine by intentionally breaking the code
  const simulateErrorTest = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    const testError: SimulationError = {
      message: "Uncaught ReferenceError: calcLagrangianDynamics is not defined (Simulated Sandbox Error)",
      line: 42,
      column: 15,
      stack: "ReferenceError: calcLagrangianDynamics is not defined\n    at physicsStep (index.html:42:15)\n    at loop (index.html:120:9)",
      timestamp: Date.now(),
    };
    onRuntimeError(testError);
  };

  return (
    <div
      ref={containerRef}
      id="visu-sandbox-container"
      className={`relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#080c14] shadow-2xl transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none w-screen h-screen'
          : 'w-full h-[580px] sm:h-[660px] lg:h-[720px]'
      }`}
    >
      {/* Visual Sandbox Header Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-[#090d15] via-[#090d15]/80 to-transparent backdrop-blur-sm pointer-events-auto">
        <div className="flex items-center gap-2 text-xs">
          {visual ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="truncate max-w-[200px] sm:max-w-[340px]">
                {visual.title}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span>Simulation Canvas · Standby</span>
            </div>
          )}

          {/* Scrolled-off CPU optimization indicator */}
          {!isIntersecting && visual && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 text-[11px] font-mono border border-amber-800/60">
              <Cpu className="w-3 h-3" />
              <span>Paused (Off-screen)</span>
            </div>
          )}

          {/* Self-healing active pill */}
          {isHealing && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 text-[11px] font-mono border border-purple-800/60 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Auto-Recovering...</span>
            </div>
          )}

          {/* Auto-healed success badge */}
          {fixSuccessMessage && !isHealing && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[11px] font-mono border border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Recovered</span>
            </div>
          )}
        </div>

        {/* Sandbox Quick Actions */}
        <div className="flex items-center gap-1.5">
          {visual ? (
            <>
              {/* Standardized Multi-Touch Zoom & Pan Controls */}
              <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
                <button
                  onClick={handleZoomOut}
                  id="zoom-out-btn"
                  disabled={currentZoom <= 0.4}
                  className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Zoom Out (Ctrl+Wheel / -)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetTransform}
                  id="zoom-level-pill-btn"
                  className={`px-1.5 py-0.5 rounded font-mono text-[11px] transition ${
                    Math.abs(currentZoom - 1.0) > 0.02 || Math.abs(currentPan.x) > 2 || Math.abs(currentPan.y) > 2
                      ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Click to reset zoom & pan (or double-tap canvas)"
                >
                  {Math.round(currentZoom * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  id="zoom-in-btn"
                  disabled={currentZoom >= 7.5}
                  className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Zoom In (Ctrl+Wheel / +)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                {(Math.abs(currentZoom - 1.0) > 0.02 || Math.abs(currentPan.x) > 2 || Math.abs(currentPan.y) > 2) && (
                  <button
                    onClick={handleResetTransform}
                    id="zoom-reset-action-btn"
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono text-cyan-400 bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-800/50 transition ml-0.5"
                    title="Reset simulation scale and pan position"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}
              </div>

              <button
                onClick={handleReload}
                id="reload-sim-btn"
                className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800 transition"
                title="Reset simulation state"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenCodeModal}
                id="inspect-code-modal-btn"
                className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800 transition"
                title="Inspect source code"
              >
                <Code2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onDownloadCode}
                id="download-sim-file-btn"
                className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800 transition"
                title="Export standalone HTML file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleFullscreen}
                id="toggle-fullscreen-overlay-btn"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-slate-800 transition"
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand Fullscreen (F)"}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>
            </>
          ) : (
            onOpenPresets && (
              <button
                onClick={onOpenPresets}
                id="sandbox-explore-presets-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Library</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Off-screen Pause CPU Protector Banner */}
      {!isIntersecting && visual && (
        <div className="absolute inset-x-4 top-14 z-30 flex items-center justify-between p-3 rounded-xl bg-amber-950/80 border border-amber-700/50 backdrop-blur-md shadow-lg shadow-black/40 text-amber-200 text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-900/50 flex items-center justify-center text-amber-300 border border-amber-700/50">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-amber-100">Rendering Paused (Off-screen)</p>
              <p className="text-[11px] text-amber-300/80">
                IntersectionObserver paused the simulation animation loop to eliminate background CPU and GPU load.
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-amber-900/40 text-[10px] font-mono border border-amber-700/40">
            Scroll back to resume
          </span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#090d15]/95 backdrop-blur-sm text-center p-6">
          <div className="relative mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <span className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Compiling Simulation Model
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4 font-mono">
            Formulating differential equations, coordinate mapping & canvas controls...
          </p>
          <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-full h-full bg-cyan-500/80 animate-[pulse_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Sandboxed Iframe (When visual is loaded) */}
      {visual?.htmlCode ? (
        <>
          <iframe
            key={`${visual.id}-${renderCount}`}
            ref={iframeRef}
            title={visual.title || "STEM Simulation"}
            srcDoc={prepareSafeHtml(visual.htmlCode)}
            sandbox="allow-scripts allow-modals allow-downloads"
            className="w-full h-full border-0 bg-transparent pt-10"
          />

          {/* Standardized Touch Gesture Hint Badge */}
          <div className="absolute bottom-2.5 left-3 z-10 hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#090d15]/80 backdrop-blur-md border border-slate-800/70 text-[11px] text-slate-400 font-mono pointer-events-none select-none">
            <Hand className="w-3 h-3 text-cyan-400/90" />
            <span>Pinch to zoom · 2-finger pan · Double-tap reset</span>
          </div>
        </>
      ) : (
        /* Empty State with Welcome Message */
        !isLoading && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center relative overflow-y-auto pt-14">
            {/* Subtle grid backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              {/* Clean Instrument Icon */}
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
                <Atom className="w-6 h-6" />
              </div>

              {/* Status Header */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/90 border border-slate-800 mb-2">
                <span>Interactive Workspace</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mb-2">
                STEM Simulation Canvas
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mb-6">
                Enter any theorem, physical mechanism, or dynamical system in the prompt below, or select a pre-configured experiment to begin.
              </p>

              {/* Quick Starter Simulation Cards */}
              <div className="w-full mb-6 text-left">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    Starter Experiments
                  </span>
                  {onOpenPresets && (
                    <button
                      onClick={onOpenPresets}
                      className="text-xs text-slate-400 hover:text-slate-200 transition flex items-center gap-1"
                    >
                      <span>Full Library</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  {/* Starter 1: Double Pendulum */}
                  <button
                    onClick={() =>
                      onSelectPreset &&
                      onSelectPreset(
                        'Double pendulum chaotic motion with Lagrangian mechanics, colored persistent trajectory trail, phase space graph, and draggable bobs',
                        'Physics',
                        'double-pendulum'
                      )
                    }
                    className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800/90 hover:border-slate-700 transition flex items-start gap-3 text-left group"
                  >
                    <div className="p-1.5 rounded bg-slate-800 text-cyan-400 mt-0.5 shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                          Double Pendulum
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Physics
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        Chaotic dynamics, Lagrangian mechanics & trajectory trails
                      </p>
                    </div>
                  </button>

                  {/* Starter 2: Gravitational N-Body */}
                  <button
                    onClick={() =>
                      onSelectPreset &&
                      onSelectPreset(
                        'Solar system gravitational n-body orbital mechanics simulation with Newton universal gravitation, velocity vectors, collision mergers, and click-to-spawn bodies',
                        'Astronomy',
                        'gravitational-nbody'
                      )
                    }
                    className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800/90 hover:border-slate-700 transition flex items-start gap-3 text-left group"
                  >
                    <div className="p-1.5 rounded bg-slate-800 text-cyan-400 mt-0.5 shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                          Gravitational N-Body
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Astronomy
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        Orbital mechanics, celestial gravity & velocity vectors
                      </p>
                    </div>
                  </button>

                  {/* Starter 3: Wave Interference */}
                  <button
                    onClick={() =>
                      onSelectPreset &&
                      onSelectPreset(
                        'Wave interference ripples in a 2D water/light field with dual point sources, phase shifting, wavelength controls, and intensity fringe detector',
                        'Physics',
                        'wave-interference'
                      )
                    }
                    className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800/90 hover:border-slate-700 transition flex items-start gap-3 text-left group"
                  >
                    <div className="p-1.5 rounded bg-slate-800 text-cyan-400 mt-0.5 shrink-0">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                          Wave Interference
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Optics
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        Young's double slit fringe patterns & wavefront superposition
                      </p>
                    </div>
                  </button>

                  {/* Starter 4: Fourier Epicycles */}
                  <button
                    onClick={() =>
                      onSelectPreset &&
                      onSelectPreset(
                        'Fourier transform epicycles drawing a complex shape with spinning harmonic circle vectors, frequency spectrum, and customizable harmonics count',
                        'Mathematics',
                        'fourier-epicycles'
                      )
                    }
                    className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800/90 hover:border-slate-700 transition flex items-start gap-3 text-left group"
                  >
                    <div className="p-1.5 rounded bg-slate-800 text-cyan-400 mt-0.5 shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                          Fourier Epicycles
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Math
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        Harmonic circle vectors & continuous mathematical curves
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Engine Capabilities Footer */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-mono">
                <span>60 FPS Native Canvas</span>
                <span>·</span>
                <span>RK4 / Symplectic Integration</span>
                <span>·</span>
                <span>Standalone Export</span>
              </div>
            </div>
          </div>
        )
      )}

      {/* Fullscreen Keyboard Hint */}
      {isFullscreen && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-slate-400 font-mono">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">F</kbd> to exit full screen
        </div>
      )}
    </div>
  );
};
