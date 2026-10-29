import React from 'react';
import { ACCENT_PROFILES } from '../utils/accents';
import { Globe, Check, Sparkles, X } from 'lucide-react';

export const AccentSelector = ({ selectedAccent, onSelectAccent, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                English Dialect & Accent Profiles
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  12 Dialects
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Calibrates acoustic neural networks to specific regional vowel shifts and phonetics.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accent Grid */}
        <div className="overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACCENT_PROFILES.map((accent) => {
            const isSelected = selectedAccent === accent.code;
            return (
              <button
                key={accent.code}
                onClick={() => {
                  onSelectAccent(accent.code);
                  onClose();
                }}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl leading-none">{accent.flag}</span>
                    <span className="font-semibold text-sm text-white">
                      {accent.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                      {accent.code}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                  {accent.description}
                </p>

                <div className="mt-auto pt-2 border-t border-slate-800/60 flex items-center gap-1 text-[11px] text-blue-400/90">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span className="truncate">{accent.acousticProfile}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            💡 <strong>Tip:</strong> Switching accent dynamically reloads speech recognition acoustic weights without refreshing.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
          >
            Apply Accent
          </button>
        </div>
      </div>
    </div>
  );
};
