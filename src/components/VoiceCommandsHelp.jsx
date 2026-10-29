import React from 'react';
import { Mic, X, Sparkles, MessageSquare } from 'lucide-react';

export const VoiceCommandsHelp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const punctuationList = [
    { voice: '"period" or "full stop"', effect: 'Inserts . and capitalizes next word' },
    { voice: '"comma"', effect: 'Inserts ,' },
    { voice: '"question mark"', effect: 'Inserts ? and capitalizes next word' },
    { voice: '"exclamation mark"', effect: 'Inserts ! and capitalizes next word' },
    { voice: '"colon" / "semicolon"', effect: 'Inserts : or ;' },
    { voice: '"dash" or "hyphen"', effect: 'Inserts -' },
    { voice: '"open quote" / "close quote"', effect: 'Inserts "..." quotation marks' },
    { voice: '"open bracket" / "close bracket"', effect: 'Inserts (...) parenthesis' },
    { voice: '"new line"', effect: 'Breaks to the next line' },
    { voice: '"new paragraph"', effect: 'Creates a double line break' },
    { voice: '"dollar sign" / "percent"', effect: 'Inserts $ or %' }
  ];

  const tips = [
    'Speak in full conversational phrases rather than isolated single words for contextual neural decoding.',
    'Select your regional English dialect (US, UK, India, Australia, etc.) in the accent switcher to optimize acoustic phonetics.',
    'Keep your microphone at a consistent distance of 6-10 inches to prevent breath plosives.',
    'Use the Custom Dictionary to train specialized acronyms, clinical terms, or regional proper nouns.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Voice Dictation Commands & Tips</h2>
              <p className="text-xs text-slate-400">Punctuate, format, and structure text hands-free while speaking.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5">
          {/* Punctuation Table */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Voice Punctuation Commands
            </h3>
            <div className="bg-slate-950/50 rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
              {punctuationList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 text-xs hover:bg-slate-800/30 transition">
                  <span className="font-mono text-purple-300 font-medium">{item.voice}</span>
                  <span className="text-slate-400">{item.effect}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Dictation Best Practices */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Accent & Dictation Best Practices
            </h3>
            <div className="space-y-2">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition"
          >
            Got it, Let's Dictate
          </button>
        </div>
      </div>
    </div>
  );
};
