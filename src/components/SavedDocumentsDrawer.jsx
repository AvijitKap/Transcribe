import React from 'react';
import { FolderOpen, Plus, Trash2, X, Clock, FileText } from 'lucide-react';
import { getAccentByCode } from '../utils/accents';

export const SavedDocumentsDrawer = ({
  isOpen,
  onClose,
  documents,
  activeDocId,
  onSelectDoc,
  onNewDoc,
  onDeleteDoc
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Transcripts & Projects</h2>
              <p className="text-xs text-slate-400">{documents.length} saved documents</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => {
              onNewDoc();
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition"
          >
            <Plus className="w-4 h-4" />
            Start New Transcription
          </button>
        </div>

        {/* Documents List */}
        <div className="overflow-y-auto p-4 flex-1 space-y-2.5">
          {documents.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No saved documents yet. Start typing or recording!
            </div>
          ) : (
            documents.map((doc) => {
              const isActive = doc.id === activeDocId;
              const accentInfo = getAccentByCode(doc.accent);
              const wordCount = doc.segments
                ? doc.segments.reduce((acc, s) => acc + (s.text ? s.text.split(/\s+/).filter(Boolean).length : 0), 0)
                : (doc.rawText ? doc.rawText.split(/\s+/).filter(Boolean).length : 0);

              const formattedDate = doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Recent';

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectDoc(doc.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-150 relative group ${
                    isActive
                      ? 'bg-blue-600/15 border-blue-500/80 shadow-md shadow-blue-500/10'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-xs font-semibold text-white truncate max-w-[240px]">
                      {doc.title || 'Untitled Transcription'}
                    </h3>
                    <div className="flex items-center gap-1">
                      {isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 font-medium">
                          Active
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${doc.title || 'Untitled'}"?`)) {
                            onDeleteDoc(doc.id);
                          }
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition opacity-60 group-hover:opacity-100"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Snippet */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 font-light">
                    {doc.segments?.[0]?.text || doc.rawText || 'Empty transcript...'}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/70 pt-2">
                    <div className="flex items-center gap-2">
                      <span title={accentInfo.name}>{accentInfo.flag} {accentInfo.code}</span>
                      <span>•</span>
                      <span>{wordCount} words</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formattedDate}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
