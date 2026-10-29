import React, { useState } from 'react';
import { Download, FileText, Subtitles, FileCode, Copy, Check, X, Printer, FileSpreadsheet } from 'lucide-react';
import {
  exportToDocx,
  exportToTxt,
  exportToSrt,
  exportToVtt,
  exportToMarkdown,
  exportToJson,
  formatTime
} from '../utils/exportUtils';

export const ExportModal = ({ isOpen, onClose, title, segments, rawText }) => {
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeSpeakers, setIncludeSpeakers] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  if (!isOpen) return null;

  const handleCopyClipboard = () => {
    let fullText = '';
    if (segments && segments.length > 0) {
      fullText = segments
        .map(seg => {
          let line = '';
          if (includeTimestamps) line += `[${formatTime(seg.timestamp || 0)}] `;
          if (includeSpeakers) line += `${seg.speaker || 'Speaker'}: `;
          line += seg.text;
          return line;
        })
        .join('\n\n');
    } else {
      fullText = rawText || '';
    }

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(title, segments, rawText);
    } catch (e) {
      alert('Error exporting DOCX: ' + e.message);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Export Transcript</h2>
              <p className="text-xs text-slate-400">Download in professional formats or copy to clipboard.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5">
          {/* Export Options */}
          <div className="flex gap-4 p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTimestamps}
                onChange={(e) => setIncludeTimestamps(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
              />
              Include Timestamps
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSpeakers}
                onChange={(e) => setIncludeSpeakers(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
              />
              Include Speaker Labels
            </label>
          </div>

          {/* Formats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Word DOCX */}
            <button
              onClick={handleDocx}
              disabled={isExportingDocx}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-blue-600/15 hover:border-blue-500 text-left transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Microsoft Word (.docx)</div>
                <div className="text-[11px] text-slate-400">Formatted headings & speaker styles</div>
              </div>
            </button>

            {/* Plain Text TXT */}
            <button
              onClick={() => exportToTxt(title, segments, rawText, { includeTimestamps, includeSpeakers })}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-slate-700/60 text-left transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Plain Text (.txt)</div>
                <div className="text-[11px] text-slate-400">Universal unformatted text</div>
              </div>
            </button>

            {/* SRT Subtitles */}
            <button
              onClick={() => exportToSrt(title, segments)}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-purple-600/15 hover:border-purple-500 text-left transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
                <Subtitles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">SubRip Subtitles (.srt)</div>
                <div className="text-[11px] text-slate-400">For YouTube, Premiere & video editors</div>
              </div>
            </button>

            {/* WebVTT */}
            <button
              onClick={() => exportToVtt(title, segments)}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-amber-600/15 hover:border-amber-500 text-left transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
                <Subtitles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">WebVTT (.vtt)</div>
                <div className="text-[11px] text-slate-400">HTML5 web video captioning</div>
              </div>
            </button>

            {/* Markdown */}
            <button
              onClick={() => exportToMarkdown(title, segments, rawText)}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-cyan-600/15 hover:border-cyan-500 text-left transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Markdown (.md)</div>
                <div className="text-[11px] text-slate-400">For Notion, Obsidian & GitHub</div>
              </div>
            </button>

            {/* JSON Data */}
            <button
              onClick={() => exportToJson(title, segments, rawText)}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-rose-600/15 hover:border-rose-500 text-left transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Structured JSON (.json)</div>
                <div className="text-[11px] text-slate-400">Raw programmatic timestamp data</div>
              </div>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCopyClipboard}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Full Transcript to Clipboard'}
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
