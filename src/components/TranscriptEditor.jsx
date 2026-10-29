import React, { useState, useRef, useEffect } from 'react';
import {
  Clock,
  User,
  Plus,
  Trash2,
  Search,
  Replace,
  Bold,
  Italic,
  Sparkles,
  AlignLeft,
  LayoutList,
  Check,
  FileText,
  Copy,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { formatTime, exportToDocx, copyTranscriptToClipboard } from '../utils/exportUtils';

export const TranscriptEditor = ({
  title,
  onTitleChange,
  segments = [],
  onUpdateSegments,
  currentTime,
  onJumpToTime,
  onInsertTimestampAtCurrentAudio,
  activeSpeaker = 'Speaker 1',
  interimTranscript = '',
  isListening = false,
  isAutoSaved = true
}) => {
  const [editorMode, setEditorMode] = useState('segmented');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [editingSpeakerIndex, setEditingSpeakerIndex] = useState(null);
  const [speakerInput, setSpeakerInput] = useState('');

  // Copy & Word Export states
  const [copyFeedback, setCopyFeedback] = useState('');
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearedBackup, setClearedBackup] = useState(null);

  const segmentsEndRef = useRef(null);

  // Auto-scroll when new segment arrives while dictating
  useEffect(() => {
    if (isListening && segmentsEndRef.current) {
      segmentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [segments.length, isListening]);

  // Statistics calculation
  const totalWords = segments.reduce((acc, seg) => {
    return acc + (seg.text ? seg.text.split(/\s+/).filter(Boolean).length : 0);
  }, 0);

  const totalChars = segments.reduce((acc, seg) => {
    return acc + (seg.text ? seg.text.length : 0);
  }, 0);

  const readingTimeMin = Math.ceil(totalWords / 200);
  const speakingTimeMin = Math.ceil(totalWords / 130);

  // Segment Handlers
  const handleTextChange = (index, newText) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], text: newText };
    onUpdateSegments(updated);
  };

  const handleSpeakerChange = (index, newSpeaker) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], speaker: newSpeaker.trim() || 'Speaker' };
    onUpdateSegments(updated);
    setEditingSpeakerIndex(null);
  };

  const handleDeleteSegment = (index) => {
    const updated = segments.filter((_, i) => i !== index);
    onUpdateSegments(updated);
  };

  const handleAddSegment = () => {
    const lastSeg = segments[segments.length - 1];
    const newTimestamp = currentTime || (lastSeg ? (lastSeg.timestamp || 0) + 5 : 0);
    const newSeg = {
      id: Date.now().toString(),
      speaker: lastSeg ? lastSeg.speaker : 'Speaker 1',
      timestamp: Math.round(newTimestamp * 10) / 10,
      text: ''
    };
    onUpdateSegments([...segments, newSeg]);
  };

  // Direct Word (.docx) Save
  const handleDirectWordSave = async () => {
    if (segments.length === 0) {
      alert('Transcript is empty. Please dictate or type some text first.');
      return;
    }
    try {
      setIsExportingWord(true);
      await exportToDocx(title, segments);
      setCopyFeedback('Word file downloaded!');
      setTimeout(() => setCopyFeedback(''), 3000);
    } catch (err) {
      alert('Error creating Word document: ' + err.message);
    } finally {
      setIsExportingWord(false);
    }
  };

  // Direct Copy to Clipboard (formatted for Word, Docs, etc.)
  const handleCopy = async (includeTimestamps = true) => {
    if (segments.length === 0) {
      setCopyFeedback('Nothing to copy (empty transcript)');
      setTimeout(() => setCopyFeedback(''), 2500);
      return;
    }

    const success = await copyTranscriptToClipboard(segments, '', {
      includeTimestamps,
      includeSpeakers: true
    });

    if (success) {
      setCopyFeedback(includeTimestamps ? 'Copied with timestamps!' : 'Copied clean text!');
      setTimeout(() => setCopyFeedback(''), 3000);
    }
  };

  // Clear Handler with Undo protection
  const handleClearTranscript = () => {
    if (segments.length === 0) return;
    setClearedBackup([...segments]);
    onUpdateSegments([]);
    setShowClearConfirm(false);
    setCopyFeedback('Transcript cleared');
    setTimeout(() => setCopyFeedback(''), 4000);
  };

  const handleUndoClear = () => {
    if (clearedBackup) {
      onUpdateSegments(clearedBackup);
      setClearedBackup(null);
      setCopyFeedback('Restored previous transcript!');
      setTimeout(() => setCopyFeedback(''), 2500);
    }
  };

  // Find and Replace Handlers
  const handleReplaceAll = () => {
    if (!searchQuery) return;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const updated = segments.map((seg) => ({
      ...seg,
      text: seg.text.replace(regex, replaceQuery)
    }));
    onUpdateSegments(updated);
  };

  // Quick formatting wrapper for current segment
  const formatCurrentSegment = (idx, wrapper) => {
    const seg = segments[idx];
    if (!seg) return;
    const currentText = seg.text || '';
    const updatedText = `${wrapper}${currentText}${wrapper}`;
    handleTextChange(idx, updatedText);
  };

  // Speaker color helpers
  const getSpeakerColor = (speakerName) => {
    const colors = [
      'bg-blue-500/15 text-blue-300 border-blue-500/30',
      'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      'bg-purple-500/15 text-purple-300 border-purple-500/30',
      'bg-amber-500/15 text-amber-300 border-amber-500/30',
      'bg-rose-500/15 text-rose-300 border-rose-500/30',
      'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    ];
    let hash = 0;
    for (let i = 0; i < (speakerName || '').length; i++) {
      hash = speakerName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-xl overflow-hidden min-h-[500px]">
      {/* Editor Top Bar: Title & Autosave status */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled Transcription Project..."
            className="w-full bg-transparent text-base font-semibold text-white placeholder-slate-500 border-none outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Save as Word (.docx) Button */}
          <button
            onClick={handleDirectWordSave}
            disabled={isExportingWord || segments.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition active:scale-95"
            title="Download formatted Microsoft Word document (.docx)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isExportingWord ? 'Saving Word...' : 'Save as Word (.docx)'}</span>
          </button>

          {/* Copy to Clipboard Button */}
          <div className="relative group/copy">
            <button
              onClick={() => handleCopy(true)}
              disabled={segments.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Copy transcript to clipboard to paste into Word, Docs, or Email"
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span>Copy</span>
            </button>
          </div>

          {/* Clear Button */}
          <button
            onClick={() => {
              if (segments.length === 0) return;
              setShowClearConfirm(true);
            }}
            disabled={segments.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/50 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700 transition"
            title="Clear current transcript"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Autosave badge */}
          <span className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono ml-1">
            <span className={`w-2 h-2 rounded-full ${isAutoSaved ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
            {isAutoSaved ? 'Saved' : 'Saving...'}
          </span>

          {/* View Mode Toggle: Segmented vs Continuous */}
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setEditorMode('segmented')}
              className={`p-1.5 rounded text-xs transition ${
                editorMode === 'segmented' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Timestamped & Speaker Segments View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setEditorMode('continuous')}
              className={`p-1.5 rounded text-xs transition ${
                editorMode === 'continuous' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Continuous Document View"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Find & Replace Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-lg border text-xs transition ${
              showSearch
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Find and Replace"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Temporary Toast Banner (Copy Feedback or Undo Clear) */}
      {copyFeedback && (
        <div className="bg-blue-600/20 border-b border-blue-500/40 px-4 py-2 flex items-center justify-between text-xs text-blue-300 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{copyFeedback}</span>
          </div>
          {clearedBackup && (
            <button
              onClick={handleUndoClear}
              className="px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Undo Clear
            </button>
          )}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Clear Transcript?</h3>
                <p className="text-xs text-slate-400">This will erase all {totalWords} words from the active document.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleClearTranscript}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Find and Replace Bar */}
      {showSearch && (
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center gap-2 animate-fade-in text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Find text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white placeholder-slate-500 outline-none w-32 sm:w-44"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg">
            <Replace className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="bg-transparent text-white placeholder-slate-500 outline-none w-32 sm:w-44"
            />
          </div>
          <button
            onClick={handleReplaceAll}
            disabled={!searchQuery}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium transition"
          >
            Replace All
          </button>
          <button
            onClick={() => setShowSearch(false)}
            className="text-slate-400 hover:text-white px-2 py-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[600px]">
        {segments.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
            <Sparkles className="w-8 h-8 opacity-40 text-blue-400" />
            <p className="text-sm font-medium text-slate-300">Transcript is currently empty</p>
            <p className="text-xs text-slate-500 max-w-sm">
              Press "Start Voice Typing" to dictate with real-time speech-to-text, or upload an audio file to transcribe.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleAddSegment}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Paragraph Manually
              </button>
              {clearedBackup && (
                <button
                  onClick={handleUndoClear}
                  className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 text-xs rounded-xl flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore Cleared Text
                </button>
              )}
            </div>
          </div>
        ) : editorMode === 'segmented' ? (
          // Segmented Blocks
          <div className="space-y-3">
            {segments.map((seg, idx) => {
              const speakerBadgeStyle = getSpeakerColor(seg.speaker);
              const isCurrentPlaying =
                currentTime !== undefined &&
                currentTime >= (seg.timestamp || 0) &&
                (seg.endTimestamp ? currentTime <= seg.endTimestamp : currentTime <= (seg.timestamp || 0) + 5);

              return (
                <div
                  key={seg.id || idx}
                  className={`p-3.5 rounded-xl border transition-all duration-150 relative group ${
                    isCurrentPlaying
                      ? 'bg-blue-600/10 border-blue-500/60 shadow-sm shadow-blue-500/10'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Segment Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* Timestamp Button (click to seek) */}
                      <button
                        onClick={() => onJumpToTime && onJumpToTime(seg.timestamp || 0)}
                        className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-slate-700/80 transition"
                        title="Click to jump audio to this moment"
                      >
                        <Clock className="w-3 h-3" />
                        {formatTime(seg.timestamp || 0)}
                      </button>

                      {/* Speaker Badge */}
                      {editingSpeakerIndex === idx ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={speakerInput}
                            autoFocus
                            onChange={(e) => setSpeakerInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSpeakerChange(idx, speakerInput);
                              if (e.key === 'Escape') setEditingSpeakerIndex(null);
                            }}
                            className="text-xs bg-slate-900 border border-blue-500 rounded px-2 py-0.5 text-white outline-none w-28"
                          />
                          <button
                            onClick={() => handleSpeakerChange(idx, speakerInput)}
                            className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingSpeakerIndex(idx);
                            setSpeakerInput(seg.speaker || 'Speaker');
                          }}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 transition ${speakerBadgeStyle}`}
                          title="Click to rename speaker"
                        >
                          <User className="w-3 h-3" />
                          {seg.speaker || 'Speaker 1'}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Quick formatting buttons */}
                      <button
                        onClick={() => formatCurrentSegment(idx, '**')}
                        className="p-1 text-slate-500 hover:text-slate-300 rounded transition opacity-0 group-hover:opacity-100"
                        title="Bold segment"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => formatCurrentSegment(idx, '*')}
                        className="p-1 text-slate-500 hover:text-slate-300 rounded transition opacity-0 group-hover:opacity-100"
                        title="Italicize segment"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Segment */}
                      <button
                        onClick={() => handleDeleteSegment(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition opacity-0 group-hover:opacity-100"
                        title="Delete block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Editable Segment Text */}
                  <textarea
                    rows={Math.max(2, Math.ceil((seg.text || '').length / 90))}
                    value={seg.text || ''}
                    onChange={(e) => handleTextChange(idx, e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none resize-none leading-relaxed border-none focus:ring-0"
                    placeholder="Type or dictate text here..."
                  />
                </div>
              );
            })}
          </div>
        ) : (
          // Continuous Document Mode
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <textarea
              rows={16}
              value={segments
                .map((s) => `${s.speaker ? `${s.speaker}: ` : ''}${s.text || ''}`)
                .join('\n\n')}
              onChange={(e) => {
                const lines = e.target.value.split('\n\n');
                const newSegs = lines.map((line, idx) => {
                  const parts = line.split(': ');
                  const speaker = parts.length > 1 ? parts[0] : (segments[idx]?.speaker || 'Speaker');
                  const text = parts.length > 1 ? parts.slice(1).join(': ') : line;
                  return {
                    id: segments[idx]?.id || Date.now() + idx,
                    timestamp: segments[idx]?.timestamp || idx * 5,
                    speaker,
                    text
                  };
                });
                onUpdateSegments(newSegs);
              }}
              className="w-full bg-transparent text-sm text-slate-200 outline-none resize-none leading-relaxed font-sans"
              placeholder="Continuous transcription document..."
            />
          </div>
        )}

        {/* Interim ghost text at the bottom when live dictation is running */}
        {isListening && interimTranscript && (
          <div className="p-3.5 rounded-xl border border-blue-500/40 bg-blue-950/20 text-sm text-blue-200 italic animate-pulse">
            <span className="font-semibold not-italic text-blue-400 mr-2">{activeSpeaker}:</span>
            {interimTranscript}
          </div>
        )}

        <div ref={segmentsEndRef} />
      </div>

      {/* Bottom Footer Statistics & Quick Insert */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSegment}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-medium flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Paragraph
          </button>
          {onInsertTimestampAtCurrentAudio && (
            <button
              onClick={onInsertTimestampAtCurrentAudio}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-blue-400 font-medium flex items-center gap-1.5 transition"
              title="Insert current timestamp at audio position (Ctrl+J)"
            >
              <Clock className="w-3.5 h-3.5" />
              Stamp Audio [Ctrl+J]
            </button>
          )}
          {/* Quick Copy Clean Text button */}
          <button
            onClick={() => handleCopy(false)}
            disabled={segments.length === 0}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition"
            title="Copy plain text without timestamps directly for Word or Notepad"
          >
            <Copy className="w-3 h-3 text-slate-400" />
            Copy Clean Text
          </button>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span>{totalWords} Words</span>
          <span>•</span>
          <span>{totalChars} Characters</span>
          <span>•</span>
          <span>~{readingTimeMin} min read</span>
          <span>•</span>
          <span>~{speakingTimeMin} min speak</span>
        </div>
      </div>
    </div>
  );
};
