import { useState, useEffect, useRef, useCallback } from 'react';
import { processVoiceCommands } from '../utils/voiceCommands';

export const useSpeechRecognition = ({
  accent = 'en-US',
  autoPunctuation = true,
  customDictionary = [],
  onSegmentFinalized,
  onInterimText
}) => {
  // Check browser support for Web Speech API
  const isSupported = typeof window !== 'undefined' && Boolean(
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition
  );

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentConfidence, setCurrentConfidence] = useState(1.0);
  const [error, setError] = useState(() => {
    if (typeof window !== 'undefined' && !(window.SpeechRecognition || window.webkitSpeechRecognition)) {
      return 'Web Speech API is not supported in this browser. For best real-time dictation, please open this app in Google Chrome, Microsoft Edge, or Safari.';
    }
    return null;
  });

  const recognitionRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);
  const restartTimeoutRef = useRef(null);
  const startSessionRef = useRef(null);

  // Keep latest props in refs to avoid stale closures in event listeners
  const accentRef = useRef(accent);
  const autoPunctuationRef = useRef(autoPunctuation);
  const customDictionaryRef = useRef(customDictionary);
  const onSegmentFinalizedRef = useRef(onSegmentFinalized);
  const onInterimTextRef = useRef(onInterimText);

  useEffect(() => {
    accentRef.current = accent;
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.lang = accent;
      } catch (err) {
        console.warn('Could not update lang dynamically:', err);
      }
    }
  }, [accent, isListening]);

  useEffect(() => {
    autoPunctuationRef.current = autoPunctuation;
  }, [autoPunctuation]);

  useEffect(() => {
    customDictionaryRef.current = customDictionary;
  }, [customDictionary]);

  useEffect(() => {
    onSegmentFinalizedRef.current = onSegmentFinalized;
  }, [onSegmentFinalized]);

  useEffect(() => {
    onInterimTextRef.current = onInterimText;
  }, [onInterimText]);

  // Clean teardown of any active recognition instance
  const cleanupRecognition = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch {
        // ignore abort errors
      }
      recognitionRef.current = null;
    }
  }, []);

  // Instantiate and start recognition
  const startSession = useCallback(() => {
    const SpeechRecognition = typeof window !== 'undefined'
      ? (window.SpeechRecognition ||
         window.webkitSpeechRecognition ||
         window.mozSpeechRecognition ||
         window.msSpeechRecognition)
      : null;

    if (!SpeechRecognition) {
      setError('Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
      setIsListening(false);
      shouldKeepListeningRef.current = false;
      return;
    }

    // Teardown previous instance if any
    cleanupRecognition();

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.lang = accentRef.current || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalized = '';
        let confidence = 0.95;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcriptPart = result[0]?.transcript || '';

          if (result[0]?.confidence && result[0].confidence > 0) {
            confidence = result[0].confidence;
          }

          if (result.isFinal) {
            finalized += transcriptPart;
          } else {
            interim += transcriptPart;
          }
        }

        setCurrentConfidence(confidence);

        if (interim) {
          setInterimTranscript(interim);
          if (onInterimTextRef.current) onInterimTextRef.current(interim);
        }

        if (finalized.trim()) {
          setInterimTranscript('');
          if (onInterimTextRef.current) onInterimTextRef.current('');

          let processedText = finalized.trim();
          if (autoPunctuationRef.current) {
            processedText = processVoiceCommands(processedText, customDictionaryRef.current);
          }

          if (onSegmentFinalizedRef.current) {
            onSegmentFinalizedRef.current({
              text: processedText,
              confidence: confidence,
              timestamp: Date.now()
            });
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error event:', event.error);

        // 'no-speech' is normal when pausing to think. Continue listening.
        if (event.error === 'no-speech') {
          return;
        }

        if (event.error === 'aborted') {
          // Normal when stopping or refreshing
          return;
        }

        if (event.error === 'not-allowed') {
          shouldKeepListeningRef.current = false;
          setIsListening(false);
          setError('Microphone access denied. Please click the lock or camera icon in your browser address bar and choose "Allow" for Microphone.');
          return;
        }

        if (event.error === 'audio-capture') {
          shouldKeepListeningRef.current = false;
          setIsListening(false);
          setError('No microphone found, or the microphone is being used exclusively by another app.');
          return;
        }

        if (event.error === 'network') {
          shouldKeepListeningRef.current = false;
          setIsListening(false);
          setError('Speech service network error. Chrome requires an active internet connection for speech recognition. If you are using Brave browser, enable Google Services in brave://settings/privacy.');
          return;
        }

        if (event.error === 'language-not-supported') {
          console.warn(`Language ${recognition.lang} not supported, falling back to en-US`);
          recognition.lang = 'en-US';
          return;
        }

        if (event.error === 'service-not-allowed') {
          shouldKeepListeningRef.current = false;
          setIsListening(false);
          setError('Speech recognition service is not permitted by your browser or OS security settings.');
          return;
        }

        // Generic error
        setError(`Speech recognition encountered an issue (${event.error}). Please check microphone permissions.`);
      };

      recognition.onend = () => {
        if (shouldKeepListeningRef.current) {
          // Chrome speech recognition stops automatically after pauses.
          // Restart after a small tick (150ms) to provide uninterrupted dictation.
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldKeepListeningRef.current && startSessionRef.current) {
              startSessionRef.current();
            }
          }, 150);
        } else {
          setIsListening(false);
          setInterimTranscript('');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      if (err.name === 'InvalidStateError') {
        // Recognition is already starting/active
        return;
      }
      setError('Unable to activate speech recognition: ' + err.message);
      setIsListening(false);
      shouldKeepListeningRef.current = false;
    }
  }, [cleanupRecognition]);

  // Keep startSession reference up to date for recursive restarts
  useEffect(() => {
    startSessionRef.current = startSession;
  }, [startSession]);

  const startListening = useCallback(() => {
    setError(null);
    shouldKeepListeningRef.current = true;
    startSession();
  }, [startSession]);

  const stopListening = useCallback(() => {
    shouldKeepListeningRef.current = false;
    setIsListening(false);
    setInterimTranscript('');
    cleanupRecognition();
  }, [cleanupRecognition]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Teardown on unmount
  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      cleanupRecognition();
    };
  }, [cleanupRecognition]);

  return {
    isListening,
    isSupported,
    interimTranscript,
    currentConfidence,
    error,
    startListening,
    stopListening,
    toggleListening
  };
};
