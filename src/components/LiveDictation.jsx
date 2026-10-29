import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  FileText,
  Copy,
  Trash2,
  Check
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { getAccentByCode } from '../utils/accents';

export const LiveDictation = ({
  isListening,
  onToggleListening,
  selectedAccent,
  onOpenAccentSelector,
  onOpenVoiceCommands,
  onOpenDictionary,
  audioLevel,
  interimTranscript,
  confidence = 0.98,
  errorMessage,
  autoPunctuation,
  onSaveWord,
  onCopyText,
  onClearText,
  hasContent = false
}) => {
  const accent = getAccentByCode(selectedAccent);
  const [copiedPill, setCopiedPill] = useState(false);

  const handleCopyClick = async () => {
    if (!onCopyText) return;
    const res = await onCopyText();
    if (res) {
      setCopiedPill(true);
      setTimeout(() => setCopiedPill(false), 2500);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Status & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isListening
              ? 'bg-rose-500/15 border border-rose-500/40 text-rose-400 animate-pulse'
              : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
          }`}>
            {isListening ? <Mic className="w-5 h-5 text-rose-400" /> : <MicOff className="w-5 h-5 text-slate-400" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Live Real-Time Dictation
              {isListening && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  Listening & Typing...
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {isListening
                ? `Streaming continuous speech recognition with ${accent.name} phonetics`
                : 'Click "Start Voice Typing" or press Ctrl+M to begin speaking'}
            </p>
          </div>
        </div>

        {/* Accent Selector Button & Utility Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Accent Switcher Button */}
          <button
            onClick={onOpenAccentSelector}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-850 border border-slate-700/80 text-xs font-medium text-white transition hover:border-blue-500/60 shadow-xs"
            title="Switch English accent profile"
          >
            <span className="text-base leading-none">{accent.flag}</span>
            <span className="font-semibold text-slate-200">{accent.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-blue-400 border border-slate-800">
              {accent.code}
            </span>
          </button>

          {/* Voice Commands Cheatsheet */}
          <button
            onClick={onOpenVoiceCommands}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
            title="View voice commands and punctuation rules"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Commands</span>
          </button>

          {/* Custom Dictionary */}
          <button
            onClick={onOpenDictionary}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
            title="Configure custom vocabulary"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Dictionary</span>
          </button>
        </div>
      </div>

      {/* Main Mic Trigger & Visualizer Area */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        {/* Big Mic Button */}
        <button
          onClick={onToggleListening}
          className={`w-full md:w-auto px-6 py-3.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 shadow-lg ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Stop Dictating</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 animate-bounce" />
              <span>Start Voice Typing</span>
            </>
          )}
        </button>

        {/* Audio Visualizer */}
        <div className="flex-1 w-full">
          <AudioVisualizer isActive={isListening} audioLevel={audioLevel} />
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1 text-slate-400" title="Audio level">
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono">{audioLevel}%</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400" title="Acoustic model confidence score">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">{Math.round((confidence || 0.95) * 100)}% Acc</span>
          </div>
          {autoPunctuation && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Auto-Punctuation
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions Row: Save Word, Copy, Clear */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {onSaveWord && (
            <button
              onClick={onSaveWord}
              disabled={!hasContent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition"
              title="Download formatted Microsoft Word document (.docx)"
            >
              <FileText className="w-3.5 h-3.5" />
              Save as Word (.docx)
            </button>
          )}

          {onCopyText && (
            <button
              onClick={handleCopyClick}
              disabled={!hasContent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Copy transcript to clipboard"
            >
              {copiedPill ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
              {copiedPill ? 'Copied to Clipboard!' : 'Copy Text'}
            </button>
          )}
        </div>

        {onClearText && (
          <button
            onClick={onClearText}
            disabled={!hasContent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/50 disabled:opacity-40 text-slate-400 text-xs font-medium border border-slate-700 transition"
            title="Clear current transcript"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Error Message if any */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Real-time Ghost Typing Indicator */}
      {isListening && (
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-blue-500/30 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400 font-medium mr-1.5">Live Typing:</span>
            {interimTranscript ? (
              <span className="interim-text text-blue-200 font-mono">{interimTranscript}</span>
            ) : (
              <span className="text-slate-500 italic">Speak now... words will appear here instantly</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
