import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';

export const SettingsModal = ({ isOpen, onClose, settings, onSaveSettings }) => {
  const [form, setForm] = useState(settings);
  const [activeTab, setActiveTab] = useState('general');

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onSaveSettings(updated);
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
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Transcribe Settings</h2>
              <p className="text-xs text-slate-400">Audio processing, AI acceleration, and editor behavior.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3 font-medium border-b-2 transition ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            General & Playback
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-3 font-medium border-b-2 transition ${
              activeTab === 'ai'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Models & Cloud API
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`py-3 px-3 font-medium border-b-2 transition ${
              activeTab === 'shortcuts'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Hotkeys & Foot Pedal
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Auto Punctuation */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div>
                  <div className="text-xs font-semibold text-white">Automatic Punctuation</div>
                  <div className="text-[11px] text-slate-400">
                    Converts spoken punctuation commands ("comma", "period", "question mark") into symbols.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.autoPunctuation}
                    onChange={(e) => handleChange('autoPunctuation', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Smart Auto Rewind */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Smart Auto-Rewind on Pause</div>
                  <span className="text-xs font-mono text-blue-400">{form.autoRewindSeconds}s</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  When you pause and resume audio playback, automatically rewinds by this duration to maintain listening context.
                </p>
                <div className="flex gap-2 pt-1">
                  {[0, 1, 1.5, 2, 3].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleChange('autoRewindSeconds', sec)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border font-mono transition ${
                        form.autoRewindSeconds === sec
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {sec === 0 ? 'Off' : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Noise Suppression & Echo */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div>
                  <div className="text-xs font-semibold text-white">Mic Noise Suppression & Echo Cancellation</div>
                  <div className="text-[11px] text-slate-400">
                    Filters out background ambient noise and keyboard clicks.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.noiseSuppression}
                    onChange={(e) => handleChange('noiseSuppression', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300">
                <strong>Standard Mode:</strong> Uses ultra-fast client-side neural acoustic models for live dictation with zero setup.
                <br />
                <strong>Whisper Cloud Acceleration:</strong> For batch audio files, connect Groq or OpenAI Whisper to transcribe multi-hour files in seconds.
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">AI Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('whisperProvider', 'groq')}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      form.whisperProvider === 'groq'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-semibold text-white">Groq (Whisper-large-v3)</div>
                    <div className="text-[11px] text-slate-400">Blazing fast (250x realtime), free tier available</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('whisperProvider', 'openai')}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      form.whisperProvider === 'openai'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-semibold text-white">OpenAI Whisper API</div>
                    <div className="text-[11px] text-slate-400">Official OpenAI API key</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  {form.whisperProvider === 'groq' ? 'Groq API Key' : 'OpenAI API Key'} (Optional)
                </label>
                <input
                  type="password"
                  placeholder={form.whisperProvider === 'groq' ? 'gsk_...' : 'sk-...'}
                  value={form.whisperApiKey || ''}
                  onChange={(e) => handleChange('whisperApiKey', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Stored strictly in your local browser storage. Never transmitted to third-party servers.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                These hotkeys match industry-standard transcription software and hardware foot-pedals (like Infinity USB foot pedals).
              </p>

              <div className="bg-slate-950/50 rounded-xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-slate-300">Play / Pause Audio</span>
                  <div className="flex gap-1.5">
                    <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Esc</kbd>
                    <span className="text-slate-500">or</span>
                    <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Alt + Tab</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-slate-300">Rewind 5 Seconds</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">F1 / Alt + ←</kbd>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-slate-300">Fast Forward 5 Seconds</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">F2 / Alt + →</kbd>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-slate-300">Insert Current Timestamp</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Ctrl + J / F4</kbd>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-slate-300">Insert / Change Speaker Tag</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Ctrl + K</kbd>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-slate-300">Toggle Real-Time Dictation</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Ctrl + M</kbd>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-slate-300">Manual Save</span>
                  <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Ctrl + S</kbd>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
