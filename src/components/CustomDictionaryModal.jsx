import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, X, AlertCircle } from 'lucide-react';

export const CustomDictionaryModal = ({ isOpen, onClose, dictionary, onSaveDictionary }) => {
  const [items, setItems] = useState(dictionary || []);
  const [newTrigger, setNewTrigger] = useState('');
  const [newReplacement, setNewReplacement] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTrigger.trim() || !newReplacement.trim()) {
      setErrorMsg('Please specify both spoken word/phrase and written replacement.');
      return;
    }
    setErrorMsg('');
    const newItem = {
      id: Date.now().toString(),
      trigger: newTrigger.trim(),
      replacement: newReplacement.trim()
    };
    const updated = [...items, newItem];
    setItems(updated);
    onSaveDictionary(updated);
    setNewTrigger('');
    setNewReplacement('');
  };

  const handleDelete = (id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    onSaveDictionary(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Custom Vocabulary & Phonetics</h2>
              <p className="text-xs text-slate-400">Train specific vocabulary, acronyms, or accent homophones.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Entry Form */}
        <form onSubmit={handleAdd} className="p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">When Spoken / Heard:</label>
              <input
                type="text"
                placeholder='e.g. "dis" or "k eight s"'
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Replace With (Written):</label>
              <input
                type="text"
                placeholder='e.g. "this" or "Kubernetes"'
                value={newReplacement}
                onChange={(e) => setNewReplacement(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 mb-3">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </form>

        {/* Rules List */}
        <div className="overflow-y-auto p-5 flex-1 space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No custom vocabulary rules added yet. Add your first rule above.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                    "{item.trigger}"
                  </span>
                  <span className="text-slate-500">➔</span>
                  <span className="font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/50">
                    "{item.replacement}"
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  title="Remove rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
