import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  UploadCloud,
  FileAudio,
  Sparkles,
  Music,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { formatTime } from '../utils/exportUtils';
import { createSampleSynthesizedAudioBlob } from '../utils/sampleData';

export const AudioTranscriber = ({
  audioUrl,
  onAudioLoaded,
  currentTime,
  onTimeUpdate,
  onSeekAudio,
  autoRewindSeconds = 2,
  onRunBatchAiTranscription,
  isTranscribingFile
}) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isReady, setIsReady] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#475569',
      progressColor: '#3b82f6',
      cursorColor: '#60a5fa',
      cursorWidth: 2,
      height: 70,
      barWidth: 3,
      barGap: 2,
      barRadius: 2,
      normalize: true,
      backend: 'WebAudio'
    });

    waveSurferRef.current = ws;

    ws.on('ready', () => {
      setIsReady(true);
      setDuration(ws.getDuration());
      ws.setPlaybackRate(playbackSpeed);
    });

    ws.on('audioprocess', () => {
      const time = ws.getCurrentTime();
      if (onTimeUpdate) onTimeUpdate(time);
    });

    ws.on('seeking', () => {
      const time = ws.getCurrentTime();
      if (onTimeUpdate) onTimeUpdate(time);
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => setIsPlaying(false));

    return () => {
      ws.destroy();
    };
  }, []);

  // Load audio URL when changed
  useEffect(() => {
    if (audioUrl && waveSurferRef.current) {
      setIsReady(false);
      waveSurferRef.current.load(audioUrl);
    }
  }, [audioUrl]);

  // Handle external seek requests
  useEffect(() => {
    if (waveSurferRef.current && isReady && onSeekAudio !== undefined) {
      const current = waveSurferRef.current.getCurrentTime();
      if (Math.abs(current - onSeekAudio) > 0.3) {
        const total = waveSurferRef.current.getDuration();
        if (total > 0) {
          waveSurferRef.current.seekTo(Math.min(1, Math.max(0, onSeekAudio / total)));
        }
      }
    }
  }, [onSeekAudio, isReady]);

  // Play/Pause with smart auto-rewind
  const togglePlayPause = useCallback(() => {
    if (!waveSurferRef.current || !isReady) return;

    if (waveSurferRef.current.isPlaying()) {
      waveSurferRef.current.pause();
    } else {
      if (autoRewindSeconds > 0) {
        const current = waveSurferRef.current.getCurrentTime();
        const newTime = Math.max(0, current - autoRewindSeconds);
        const total = waveSurferRef.current.getDuration();
        if (total > 0) {
          waveSurferRef.current.seekTo(newTime / total);
        }
      }
      waveSurferRef.current.play();
    }
  }, [isReady, autoRewindSeconds]);

  const handleRewind = (seconds = 5) => {
    if (!waveSurferRef.current || !isReady) return;
    const current = waveSurferRef.current.getCurrentTime();
    const newTime = Math.max(0, current - seconds);
    const total = waveSurferRef.current.getDuration();
    if (total > 0) {
      waveSurferRef.current.seekTo(newTime / total);
    }
  };

  const handleForward = (seconds = 5) => {
    if (!waveSurferRef.current || !isReady) return;
    const current = waveSurferRef.current.getCurrentTime();
    const total = waveSurferRef.current.getDuration();
    const newTime = Math.min(total, current + seconds);
    if (total > 0) {
      waveSurferRef.current.seekTo(newTime / total);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (waveSurferRef.current) {
      waveSurferRef.current.setPlaybackRate(speed, true);
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    if (onAudioLoaded) onAudioLoaded(url, file.name);
  };

  const loadSampleAudio = async () => {
    try {
      setIsLoadingSample(true);
      const blob = await createSampleSynthesizedAudioBlob();
      const url = URL.createObjectURL(blob);
      setFileName('Sample-Accent-Interview-Audio.wav');
      if (onAudioLoaded) onAudioLoaded(url, 'Sample-Accent-Interview-Audio.wav');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSample(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* File Upload / Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileAudio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              {fileName || 'Transcription Audio Player'}
              {isReady && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Ready
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {isReady
                ? `${formatTime(currentTime)} / ${formatTime(duration)} • Smart rewind ${autoRewindSeconds}s on pause`
                : 'Upload MP3, WAV, M4A, OGG or MP4 for synchronized playback'}
            </p>
          </div>
        </div>

        {/* Upload & Sample Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadSampleAudio}
            disabled={isLoadingSample}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition"
          >
            {isLoadingSample ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Music className="w-3.5 h-3.5 text-blue-400" />}
            Demo Audio
          </button>

          <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition">
            <UploadCloud className="w-3.5 h-3.5" />
            Upload File
            <input
              type="file"
              accept="audio/*,video/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
            />
          </label>

          {onRunBatchAiTranscription && isReady && (
            <button
              onClick={onRunBatchAiTranscription}
              disabled={isTranscribingFile}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-medium text-white flex items-center gap-1.5 shadow-md shadow-purple-500/10 transition"
              title="Automatically transcribe this audio file into text segments"
            >
              {isTranscribingFile ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  Auto Transcribe
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Overlay or Waveform */}
      {!audioUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
          }`}
        >
          <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-xs text-slate-300 font-medium mb-1">
            Drag and drop an audio or video file here
          </p>
          <p className="text-[11px] text-slate-500 mb-3">
            Supports MP3, WAV, M4A, AAC, FLAC, OGG, WebM, MP4
          </p>
          <button
            onClick={loadSampleAudio}
            className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
          >
            Or load a demo interview audio track
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Waveform Canvas */}
          <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
            <div ref={containerRef} className="w-full cursor-pointer" />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRewind(5)}
                disabled={!isReady}
                title="Rewind 5s (F1)"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlayPause}
                disabled={!isReady}
                title="Play / Pause (Esc or Tab)"
                className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 transition active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => handleForward(5)}
                disabled={!isReady}
                title="Forward 5s (F2)"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-slate-300 px-2 py-1 rounded bg-slate-800/60 border border-slate-700/60">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Playback Speeds */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 px-2 font-medium">Speed:</span>
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changeSpeed(rate)}
                  className={`text-xs px-2 py-1 rounded-lg font-mono transition ${
                    playbackSpeed === rate
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
