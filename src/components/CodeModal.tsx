import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, Play, Code2, AlertCircle } from 'lucide-react';
import { STEMVisual } from '../types';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  visual: STEMVisual | null;
  onApplyModifiedCode: (newCode: string) => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  visual,
  onApplyModifiedCode,
}) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (visual?.htmlCode) {
      setCode(visual.htmlCode);
      setIsEdited(false);
    }
  }, [visual?.htmlCode, isOpen]);

  if (!isOpen || !visual) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (visual.title || 'visu-ai-simulation')
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

  const handleApply = () => {
    onApplyModifiedCode(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] bg-[#090d16] border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0c121e]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base truncate">
                Simulation Source Code: {visual.title}
              </h3>
              <p className="text-xs text-slate-400">
                Self-contained HTML5 + Canvas + JS. Runs locally in any web browser.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Copy code to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition"
              title="Download standalone HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .html</span>
            </button>

            {isEdited && (
              <button
                onClick={handleApply}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition"
                title="Run modified code in sandbox"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Edits</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Editor Body */}
        <div className="relative flex-1 bg-[#050811] overflow-hidden">
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setIsEdited(true);
            }}
            spellCheck={false}
            className="w-full h-full p-4 font-mono text-xs sm:text-sm text-slate-200 bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-cyan-500/30 overflow-auto scrollbar-thin"
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-[#0a0e17] text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-500">
              {code.split('\n').length} lines · {(code.length / 1024).toFixed(1)} KB
            </span>
            {isEdited && (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Unsaved manual edits</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
            {isEdited && (
              <button
                onClick={handleApply}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm"
              >
                Apply & Run
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
