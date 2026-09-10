import React, { useState } from 'react';
import { ArrowUpRight, Compass, Terminal, Sparkles, Send } from 'lucide-react';
import { PRESET_PROMPTS } from '../data/presets';

interface PromptInputProps {
  onSubmit: (prompt: string, category?: string) => void;
  isLoading: boolean;
}

const STEM_CATEGORIES = [
  { name: 'All Concepts', value: '' },
  { name: 'Physics', value: 'Physics' },
  { name: 'Mathematics', value: 'Mathematics' },
  { name: 'Chemistry', value: 'Chemistry' },
  { name: 'Astronomy', value: 'Astronomy' },
  { name: 'Computer Science', value: 'Computer Science' },
  { name: 'Biology', value: 'Biology' },
];

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim(), selectedCategory || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectPreset = (presetPrompt: string, category: string) => {
    setPrompt(presetPrompt);
    setSelectedCategory(category);
    onSubmit(presetPrompt, category);
  };

  return (
    <div className="w-full bg-[#0b0f17] border border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-lg relative">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Simulation Prompt</span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {STEM_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800/80 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Form */}
      <form onSubmit={handleSubmit}>
        <div className="relative rounded-lg border border-slate-800 bg-[#080b12] focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={3}
            placeholder="Specify any physical system, theorem, or mathematical formula (e.g., 'Coupled spring-mass oscillators with resonance curve', 'Quantum wave packet tunneling through potential barrier', 'Lorenz chaotic attractor phase trajectory')..."
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/80 bg-slate-900/50 rounded-b-lg">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="hidden sm:inline">Press ⌘+Enter to run</span>
            </div>

            <div className="flex items-center gap-2">
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                id="generate-visual-btn"
                disabled={!prompt.trim() || isLoading}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all ${
                  !prompt.trim() || isLoading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 active:scale-[0.99] border border-cyan-400/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Compiling Model...</span>
                  </>
                ) : (
                  <>
                    <span>Run Simulation</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Curated Quick-Run Scientific Concepts */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
            Quick Experiments:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_PROMPTS.slice(0, 5).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.prompt, preset.category)}
              disabled={isLoading}
              className="text-left px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-800/90 text-xs text-slate-300 hover:text-cyan-300 hover:border-slate-700 transition flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/70" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
