# 🎙️ TranscribePro - Real-Time Multi-Accent Auto Transcriber

A modern, professional auto-transcription workstation for the English language inspired by **[transcribe.com](https://transcribe.com/)**. Built with real-time continuous speech-to-text dictation, multi-accent acoustic tuning, interactive waveform audio player, smart auto-rewind, speaker diarization tags, and a full export suite (Word DOCX, SRT, VTT, TXT, Markdown).

---

## 🌟 Key Features

### 1. ⚡ High-Accuracy Real-Time Speech-to-Text (Voice Typing)
* **Real-time ghost-text streaming**: Words stream and type in real time as you speak with visual typing indicators and acoustic confidence metrics.
* **Continuous listening resilience**: Automatically prevents silence timeouts or abrupt connection resets, allowing seamless uninterrupted speech dictation.
* **Live audio visualizer & decibel meter**: Real-time canvas audio visualizer and volume meter to monitor input level.

### 2. 🌍 12 Regional English Dialect & Accent Profiles
Different English accents have unique phonology, vowel shifts, and cadences. TranscribePro switches acoustic models directly:
* 🇺🇸 **United States (`en-US`)**: General American, rhotic r-coloring, flapped t/d.
* 🇬🇧 **United Kingdom (`en-GB`)**: Received Pronunciation & regional British, non-rhotic, broad vowels.
* 🇮🇳 **India (`en-IN`)**: Indian English, retroflex consonants, syllable-timed cadence.
* 🇦🇺 **Australia (`en-AU`)**: Australian English, diphthong shifts, distinctive inflections.
* 🇨🇦 **Canada (`en-CA`)**: Canadian English, Canadian raising.
* 🇮🇪 **Ireland (`en-IE`)**: Hiberno-English dialects and melodic phrasing.
* 🇳🇿 **New Zealand (`en-NZ`)**: Kiwi English, short vowel shifts.
* 🇿🇦 **South Africa (`en-ZA`)**: South African English phonetics.
* 🇳🇬 **Nigeria (`en-NG`)**: West African & Nigerian English intonation.
* 🇸🇬 **Singapore (`en-SG`)**: Singaporean English syntax and rhythm.
* 🇵🇭 **Philippines (`en-PH`)**: Philippine English acoustic models.
* 🇯🇲 **Jamaica (`en-JM`)**: Caribbean English prosody.

### 3. 🗣️ Smart Voice Commands & Punctuation
Speak naturally while hands-free:
* *"period"* or *"full stop"* ➔ `.`
* *"comma"* ➔ `,`
* *"question mark"* ➔ `?`
* *"exclamation mark"* ➔ `!`
* *"colon"* / *"semicolon"* ➔ `:` / `;`
* *"open quote"* / *"close quote"* ➔ `"..."`
* *"open bracket"* / *"close bracket"* ➔ `(...)`
* *"new line"* / *"new paragraph"* ➔ line break
* Automatic sentence capitalization following punctuation.

### 4. 📚 Custom Vocabulary & Phonetic Replacement Dictionary
* Add domain-specific terminology (e.g. medical, legal, tech acronyms like `K8s` ➔ `Kubernetes`).
* Add phonetic accent corrections for regional homophones.

### 5. 🎧 Audio & Video Transcription Studio (Transcribe.com Workflow)
* **WaveSurfer.js waveform visualizer**: Interactive audio scrubbing, zoom, playhead tracking.
* **Variable playback speed**: `0.5x`, `0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x` with pitch preservation.
* **Smart Auto-Rewind on Pause**: Automatically rewinds 1s–3s upon resume so you never lose conversational context.
* **Click-to-Seek synchronization**: Click any timestamp in the transcript to jump audio playback instantly to that exact moment.
* **Sample Audio Mode**: Includes instant synthetic speech generator so you can test features with a single click.

### 6. ⌨️ Professional Foot Pedal & Hotkey Shortcuts
Matches industry-standard software (Transcribe.com, Express Scribe):
* `Esc` or `Alt + Tab`: Play / Pause Audio
* `F1` or `Alt + ←`: Rewind 5 seconds
* `F2` or `Alt + →`: Fast Forward 5 seconds
* `Ctrl + J` or `F4`: Insert timestamp at current audio position
* `Ctrl + K`: Cycle / Insert speaker tag
* `Ctrl + M`: Toggle real-time dictation
* `Ctrl + S`: Quick save

### 7. 📤 Professional Export Suite
* **Microsoft Word (`.docx`)**: Styled document with headers, timestamps, and speaker styles.
* **SubRip Subtitles (`.srt`)**: Millisecond-accurate subtitle timings for video editors.
* **WebVTT (`.vtt`)**: Web-standard HTML5 video captioning.
* **Plain Text (`.txt`)**: Clean text with selectable timestamp/speaker options.
* **Markdown (`.md`)**: Formatted for Notion, Obsidian, GitHub.
* **Structured JSON (`.json`)**: Programmatic segment data.
* **One-Click Copy & Print / PDF**.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Modern browser (Google Chrome, Microsoft Edge, or Safari recommended for Web Speech recognition)

### Development
```bash
npm install
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

Open `http://localhost:4173/` or `http://localhost:5173/` in your browser.

---

## 🔒 Privacy & Offline Capability
* In-browser neural processing: Real-time dictation works directly in the browser.
* Local persistence: All transcripts are saved to your local storage; no text is sent to third-party databases unless you explicitly configure a cloud AI key in Settings.
