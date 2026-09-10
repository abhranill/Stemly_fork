import React, { useState, useCallback } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { Header } from './components/Header';
import { VisualSandbox } from './components/VisualSandbox';
import { PromptInput } from './components/PromptInput';
import { SelfHealingPanel } from './components/SelfHealingPanel';
import { ConceptDetails } from './components/ConceptDetails';
import { CodeModal } from './components/CodeModal';
import { PresetsModal } from './components/PresetsModal';
import { 
  DEFAULT_INITIAL_VISUAL, 
  PRESET_VISUALS_MAP, 
  findPresetVisual 
} from './data/presets';
import { STEMVisual, SimulationError, FixLogEntry } from './types';

interface GenerationErrorState {
  message: string;
  is503?: boolean;
  prompt: string;
  category?: string;
  fallbackVisual?: STEMVisual | null;
}

interface ParsedApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  rawText?: string;
}

async function safeParseJsonResponse<T = any>(response: Response): Promise<ParsedApiResponse<T>> {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const data = await response.json();
      return { ok: response.ok, status: response.status, data };
    } catch {
      // Fall through to text parsing
    }
  }

  const rawText = await response.text();
  try {
    const data = JSON.parse(rawText);
    return { ok: response.ok, status: response.status, data };
  } catch {
    let userFriendlyError = '';
    if (response.status === 404) {
      userFriendlyError = 'API endpoint not found (HTTP 404). When hosting on Vercel, ensure the /api serverless functions and vercel.json are deployed, and that GEMINI_API_KEY is configured in Vercel Project Settings > Environment Variables.';
    } else if (response.status === 504 || response.status === 502) {
      userFriendlyError = `Gateway timeout / upstream error (HTTP ${response.status}). The server or AI model took too long to respond.`;
    } else {
      userFriendlyError = `Unexpected server response (HTTP ${response.status}).`;
    }

    return {
      ok: false,
      status: response.status,
      data: {
        success: false,
        error: userFriendlyError,
      } as any,
      rawText,
    };
  }
}

export default function App() {
  const [currentVisual, setCurrentVisual] = useState<STEMVisual | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHealing, setIsHealing] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<GenerationErrorState | null>(null);
  const [currentError, setCurrentError] = useState<SimulationError | null>(null);
  const [fixAttempt, setFixAttempt] = useState<number>(0);
  const [fixHistory, setFixHistory] = useState<FixLogEntry[]>([]);
  const [fixSuccessMessage, setFixSuccessMessage] = useState<string | null>(null);
  const [isOffscreenPaused, setIsOffscreenPaused] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState<boolean>(false);

  // Generate Visual via Gemini API with resilient fallback
  const handleGenerateVisual = async (prompt: string, category?: string, presetId?: string) => {
    // If explicit preset ID with pre-compiled simulation is clicked, load directly
    if (presetId && PRESET_VISUALS_MAP[presetId]) {
      const presetVisual = PRESET_VISUALS_MAP[presetId];
      setCurrentVisual(presetVisual);
      setGenerationError(null);
      setCurrentError(null);
      setFixSuccessMessage(null);
      const sandboxEl = document.getElementById('visu-sandbox-container');
      if (sandboxEl && !isFullscreen) {
        sandboxEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    setGenerationError(null);
    setCurrentError(null);
    setFixSuccessMessage(null);
    setFixAttempt(0);

    try {
      const response = await fetch('/api/generate-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category }),
      });

      const parsed = await safeParseJsonResponse(response);
      const data = parsed.data;

      if (!parsed.ok || !data?.success) {
        const errorMsg = data?.error || 'Failed to generate visual from Gemini API';
        const is503 = parsed.status === 503 || data?.is503 || errorMsg.includes('high demand') || errorMsg.includes('503');
        const fallback = findPresetVisual(prompt);

        setGenerationError({
          message: errorMsg,
          is503,
          prompt,
          category,
          fallbackVisual: fallback,
        });

        // If high demand 503 and a verified fallback visual matches the concept, automatically offer or load it
        if (is503 && fallback) {
          console.info('High demand detected: fallback visual available for', prompt);
        }
        return;
      }

      const newVisual: STEMVisual = {
        id: `visual-${Date.now()}`,
        title: data.data.title,
        category: data.data.category || category || 'Physics',
        description: data.data.description,
        scientificPrinciples: data.data.scientificPrinciples || [],
        interactiveFeatures: data.data.interactiveFeatures || [],
        htmlCode: data.data.htmlCode,
        createdAt: Date.now(),
        prompt,
      };

      setCurrentVisual(newVisual);

      // Scroll smoothly to sandbox if not already in view
      const sandboxEl = document.getElementById('visu-sandbox-container');
      if (sandboxEl && !isFullscreen) {
        sandboxEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err: any) {
      console.error('Generation network or parsing error:', err);
      const fallback = findPresetVisual(prompt);
      setGenerationError({
        message: err.message || 'Network error while contacting AI service.',
        is503: false,
        prompt,
        category,
        fallbackVisual: fallback,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Automated Self-Healing: Intercepts sandbox syntax/runtime errors and sends to Gemini
  const handleRuntimeError = useCallback(
    async (error: SimulationError) => {
      console.warn('Visu AI Sandbox caught runtime/syntax error:', error);
      setCurrentError(error);

      // Maximum 3 automatic healing attempts
      if (fixAttempt >= 3 || isHealing) return;

      setIsHealing(true);
      const nextAttempt = fixAttempt + 1;
      setFixAttempt(nextAttempt);

      try {
        const response = await fetch('/api/fix-visual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originalPrompt: currentVisual.prompt || currentVisual.title,
            brokenCode: currentVisual.htmlCode,
            error: {
              message: error.message,
              line: error.line,
              column: error.column,
              stack: error.stack,
            },
            fixAttempt: nextAttempt,
          }),
        });

        const parsed = await safeParseJsonResponse(response);
        const data = parsed.data;

        if (!parsed.ok || !data?.success) {
          const isHighDemand = parsed.status === 503 || data?.is503;
          const failMsg = isHighDemand
            ? 'The AI model is experiencing temporary high demand (503). You can click "Retry Fix" in a few moments, or inspect the code.'
            : (data?.error || 'Self-healing repair failed.');
          
          setCurrentError({
            ...error,
            message: failMsg,
          });
          return;
        }

        const healedCode = data.data.htmlCode;
        const fixSummary = data.data.fixSummary || 'Resolved runtime syntax/logic error';

        // Update current visual with repaired code
        setCurrentVisual((prev) => (prev ? {
          ...prev,
          htmlCode: healedCode,
          fixedCount: (prev.fixedCount || 0) + 1,
          lastFixSummary: fixSummary,
        } : null));

        // Log fix entry
        const logEntry: FixLogEntry = {
          id: `fix-${Date.now()}`,
          timestamp: Date.now(),
          error,
          fixSummary,
          success: true,
        };
        setFixHistory((prev) => [...prev, logEntry]);
        setFixSuccessMessage(fixSummary);
        setCurrentError(null);
      } catch (fixErr: any) {
        console.error('Self-healing error:', fixErr);
        setCurrentError({
          ...error,
          message: 'Unable to reach repair service. You can retry in a moment or edit code directly.',
        });
      } finally {
        setIsHealing(false);
      }
    },
    [currentVisual, fixAttempt, isHealing]
  );

  const handleRetryFix = () => {
    if (currentError) {
      setFixAttempt(0);
      handleRuntimeError(currentError);
    }
  };

  const handleDismissError = () => {
    setCurrentError(null);
  };

  // Download Standalone HTML file
  const handleDownloadCode = () => {
    if (!currentVisual?.htmlCode) return;
    const blob = new Blob([currentVisual.htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (currentVisual.title || 'visu-ai-stem-visual')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    link.href = url;
    link.download = `${safeTitle}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApplyModifiedCode = (newCode: string) => {
    setCurrentVisual((prev) => (prev ? {
      ...prev,
      htmlCode: newCode,
    } : null));
    setCurrentError(null);
  };

  const handleVisibilityChange = useCallback((isVisible: boolean) => {
    setIsOffscreenPaused(!isVisible);
  }, []);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header
        currentVisual={currentVisual}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onDownloadCode={handleDownloadCode}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        isOffscreenPaused={isOffscreenPaused}
        isHealing={isHealing}
        hasErrors={Boolean(currentError)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Generation High-Demand or Error Banner */}
        {generationError && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 backdrop-blur-md p-4 shadow-xl text-amber-200 transition-all animate-in fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-900/50 border border-amber-700/50 text-amber-400 mt-0.5 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-100">
                    {generationError.is503
                      ? 'AI Model Experiencing High Demand (503)'
                      : 'Generation Request Failed'}
                  </h3>
                  <p className="text-xs text-amber-300/90 mt-1 leading-relaxed">
                    {generationError.message}
                  </p>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleGenerateVisual(generationError.prompt, generationError.category)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Generation</span>
                    </button>

                    {generationError.fallbackVisual && (
                      <button
                        onClick={() => {
                          setCurrentVisual(generationError.fallbackVisual!);
                          setGenerationError(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-900/70 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Load Verified Simulation: {generationError.fallbackVisual.title}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setIsPresetsModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                    >
                      Explore Instant STEM Library
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setGenerationError(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Self-Healing Alerts / Error Panel */}
        <SelfHealingPanel
          currentError={currentError}
          isHealing={isHealing}
          fixAttempt={fixAttempt}
          fixHistory={fixHistory}
          onRetryFix={handleRetryFix}
          onDismissError={handleDismissError}
          onOpenCodeModal={() => setIsCodeModalOpen(true)}
        />

        {/* Interactive Visualization Sandbox */}
        <section aria-label="Interactive STEM Visualization">
          <VisualSandbox
            visual={currentVisual}
            isLoading={isLoading}
            onRuntimeError={handleRuntimeError}
            onVisibilityChange={handleVisibilityChange}
            onDownloadCode={handleDownloadCode}
            onOpenCodeModal={() => setIsCodeModalOpen(true)}
            onOpenPresets={() => setIsPresetsModalOpen(true)}
            onSelectPreset={(prompt, cat, presetId) => handleGenerateVisual(prompt, cat, presetId)}
            isHealing={isHealing}
            fixSuccessMessage={fixSuccessMessage}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        </section>

        {/* Prompt Input Form */}
        <section aria-label="STEM Concept Prompt Input">
          <PromptInput
            onSubmit={(prompt, cat) => handleGenerateVisual(prompt, cat)}
            isLoading={isLoading}
          />
        </section>

        {/* Concept Details & Educational Breakdown */}
        <section aria-label="Scientific Principles & Interaction Guide">
          <ConceptDetails visual={currentVisual} />
        </section>
      </main>

      {/* Code Inspector & Download Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        visual={currentVisual}
        onApplyModifiedCode={handleApplyModifiedCode}
      />

      {/* STEM Presets Library Modal */}
      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onSelectPrompt={(prompt, cat, presetId) => handleGenerateVisual(prompt, cat, presetId)}
      />

      {/* Dark Subtle Footer */}
      <footer className="border-t border-slate-900 bg-[#060910] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Visu AI · Next-Gen Interactive STEM Visualization Engine</span>
          <span className="font-mono text-slate-600">
            IntersectionObserver Optimization · Self-Healing Error Recovery · Gemini AI
          </span>
        </div>
      </footer>
    </div>
  );
}
