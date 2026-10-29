const STORAGE_KEY_DOCS = 'transcribe_pro_documents_v1';
const STORAGE_KEY_ACTIVE_ID = 'transcribe_pro_active_id';
const STORAGE_KEY_SETTINGS = 'transcribe_pro_settings_v1';
const STORAGE_KEY_DICTIONARY = 'transcribe_pro_custom_dictionary';

export const loadDocuments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOCS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load documents:', err);
    return [];
  }
};

export const saveDocuments = (documents) => {
  try {
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(documents));
  } catch (err) {
    console.error('Failed to save documents:', err);
  }
};

export const getActiveDocId = () => {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || null;
};

export const setActiveDocId = (id) => {
  localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
};

export const loadSettings = () => {
  const defaults = {
    selectedAccent: 'en-US',
    autoPunctuation: true,
    autoRewindSeconds: 2,
    playbackSpeed: 1,
    theme: 'dark',
    micGain: 1.0,
    noiseSuppression: true,
    echoCancellation: true,
    whisperApiKey: '',
    whisperProvider: 'groq'
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!saved) return defaults;
    return { ...defaults, ...JSON.parse(saved) };
  } catch {
    return defaults;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
};

export const loadCustomDictionary = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DICTIONARY);
    if (!raw) {
      return [
        { id: '1', trigger: 'AI', replacement: 'A.I.' },
        { id: '2', trigger: 'SaaS', replacement: 'SaaS' },
        { id: '3', trigger: 'gonna', replacement: 'going to' }
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveCustomDictionary = (dictionary) => {
  try {
    localStorage.setItem(STORAGE_KEY_DICTIONARY, JSON.stringify(dictionary));
  } catch (err) {
    console.error('Failed to save dictionary:', err);
  }
};
