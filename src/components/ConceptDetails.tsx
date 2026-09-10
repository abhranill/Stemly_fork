import React from 'react';
import { 
  Atom, 
  Sliders, 
  Layers,
  Clock,
  Compass
} from 'lucide-react';
import { STEMVisual } from '../types';

interface ConceptDetailsProps {
  visual: STEMVisual | null;
}

export const ConceptDetails: React.FC<ConceptDetailsProps> = ({ visual }) => {
  if (!visual) return null;

  return (
    <div className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md space-y-5">
      {/* Title & Description Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-900 text-cyan-400 border border-slate-800">
            {visual.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
            <Clock className="w-3 h-3" />
            {new Date(visual.createdAt).toLocaleTimeString()}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 mb-1.5 font-sans">
          {visual.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          {visual.description}
        </p>
      </div>

      {/* Two Column Grid: Scientific Principles & Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3 border-t border-slate-800/80">
        {/* Scientific Principles */}
        <div className="rounded-lg bg-[#080b12] border border-slate-800/90 p-4">
          <div className="flex items-center gap-2 mb-2.5 text-slate-300 font-medium text-xs tracking-wider uppercase font-mono">
            <Atom className="w-3.5 h-3.5 text-cyan-400" />
            <span>Underlying Principles & Equations</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-400">
            {visual.scientificPrinciples && visual.scientificPrinciples.length > 0 ? (
              visual.scientificPrinciples.map((principle, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed text-slate-300">{principle}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500">Numerical physics integration and conservation laws applied.</li>
            )}
          </ul>
        </div>

        {/* Interactive Controls Guide */}
        <div className="rounded-lg bg-[#080b12] border border-slate-800/90 p-4">
          <div className="flex items-center gap-2 mb-2.5 text-slate-300 font-medium text-xs tracking-wider uppercase font-mono">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Interactive Controls & Parameters</span>
          </div>

          <ul className="space-y-2 text-xs text-slate-400">
            {visual.interactiveFeatures && visual.interactiveFeatures.length > 0 ? (
              visual.interactiveFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed text-slate-300">{feat}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500">
                Drag on canvas elements to interact directly or adjust on-screen parameter sliders.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
