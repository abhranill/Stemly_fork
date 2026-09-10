import React from 'react';
import { X, Layers, ArrowRight, Activity, Cpu, Globe, Flame, Radio, GitBranch } from 'lucide-react';
import { PRESET_PROMPTS } from '../data/presets';
import { PresetPrompt } from '../types';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string, category: string, presetId?: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-5 h-5 text-cyan-400" />,
  Cpu: <Cpu className="w-5 h-5 text-purple-400" />,
  Globe: <Globe className="w-5 h-5 text-blue-400" />,
  Flame: <Flame className="w-5 h-5 text-amber-400" />,
  Radio: <Radio className="w-5 h-5 text-emerald-400" />,
  GitBranch: <GitBranch className="w-5 h-5 text-pink-400" />,
};

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[85vh] bg-[#090d16] border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0c121e]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Curated STEM Concept Library
              </h3>
              <p className="text-xs text-slate-400">
                Choose a concept to immediately generate and interact with in Visu AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of STEM Prompts */}
        <div className="p-6 overflow-y-auto space-y-3 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_PROMPTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPrompt(preset.prompt, preset.category, preset.id);
                  onClose();
                }}
                className="text-left p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 hover:border-cyan-500/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="p-1.5 rounded-lg bg-[#050811] border border-slate-800">
                      {ICON_MAP[preset.iconName] || <Activity className="w-5 h-5 text-cyan-400" />}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {preset.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-cyan-300 transition-colors mb-1">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform pt-2 border-t border-slate-800/60">
                  <span>Generate Visualization</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-[#0a0e17] text-xs text-slate-400">
          <span>Tip: You can also describe any custom formula or experiment in the prompt input.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
