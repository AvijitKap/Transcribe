import React from 'react';
import {
  Waves,
  FolderOpen,
  Download,
  Settings,
  Plus,
  Radio,
  FileAudio,
  Maximize2
} from 'lucide-react';

export const Navbar = ({
  activeMode,
  onChangeMode,
  onOpenSavedDocs,
  onOpenExport,
  onOpenSettings,
  onNewProject,
  savedDocsCount = 0
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Waves className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">Transcribe</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Real-Time English Speech-to-Text Studio</p>
          </div>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="hidden md:flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => onChangeMode('unified')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeMode === 'unified'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Unified Studio
          </button>
          <button
            onClick={() => onChangeMode('dictation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeMode === 'dictation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Live Voice Typing
          </button>
          <button
            onClick={() => onChangeMode('audio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeMode === 'audio'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileAudio className="w-3.5 h-3.5" />
            Audio / Video Player
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* New Project */}
          <button
            onClick={onNewProject}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-white transition"
            title="Start fresh project"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            New
          </button>

          {/* Saved Documents Drawer */}
          <button
            onClick={onOpenSavedDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition"
            title="View saved projects"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Projects</span>
            {savedDocsCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300 font-mono">
                {savedDocsCount}
              </span>
            )}
          </button>

          {/* Export Modal */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition"
            title="Export to Word, SRT, TXT, Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition"
            title="Settings & shortcuts"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
