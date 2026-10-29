import { useState, useEffect, useRef, useCallback } from 'react';
import { processVoiceCommands } from '../utils/voiceCommands';

export const useSpeechRecognition = ({
  accent = 'en-US',
  autoPunctuation = true,
  customDictionary = [],
  onSegmentFinalized,
  onInterimText
}) => {
  const [isSupported] = useState(() => {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentConfidence, setCurrentConfidence] = useState(1.0);
  const [error, setError] = useState(() => {
    if (typeof window !== 'undefined' && !Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)) {
      return 'Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.';
    }
    return null;
  });

  const recognitionRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);
  const accentRef = useRef(accent);
  const autoPunctuationRef = useRef(autoPunctuation);
  const customDictionaryRef = useRef(customDictionary);

  // Keep refs up to date
  useEffect(() => {
    accentRef.current = accent;
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.lang = accent;
      } catch (err) {
        console.warn('Could not update lang on active recognition instance', err);
      }
    }
  }, [accent, isListening]);

  useEffect(() => {
    autoPunctuationRef.current = autoPunctuation;
  }, [autoPunctuation]);

  useEffect(() => {
    customDictionaryRef.current = customDictionary;
  }, [customDictionary]);

  const createRecognitionInstance = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

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
        const transcriptPart = result[0].transcript;

        if (result[0].confidence && result[0].confidence > 0) {
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
        if (onInterimText) onInterimText(interim);
      }

      if (finalized.trim()) {
        setInterimTranscript('');
        if (onInterimText) onInterimText('');

        let processedText = finalized.trim();
        if (autoPunctuationRef.current) {
          processedText = processVoiceCommands(processedText, customDictionaryRef.current);
        }

        if (onSegmentFinalized) {
          onSegmentFinalized({
            text: processedText,
            confidence: confidence,
            timestamp: Date.now()
          });
        }
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        return;
      }
      if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please allow microphone permission in your browser.');
        setIsListening(false);
        shouldKeepListeningRef.current = false;
        return;
      }
      if (event.error === 'audio-capture') {
        setError('No microphone was found or microphone is busy.');
        setIsListening(false);
        shouldKeepListeningRef.current = false;
        return;
      }
    };

    recognition.onend = () => {
      if (shouldKeepListeningRef.current) {
        try {
          recognition.start();
        } catch {
          setTimeout(() => {
            if (shouldKeepListeningRef.current) {
              try {
                recognition.start();
              } catch (err) {
                console.error('Failed to restart speech recognition', err);
              }
            }
          }, 300);
        }
      } else {
        setIsListening(false);
        setInterimTranscript('');
      }
    };

    return recognition;
  }, [onInterimText, onSegmentFinalized]);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    setError(null);
    shouldKeepListeningRef.current = true;

    try {
      if (!recognitionRef.current) {
        recognitionRef.current = createRecognitionInstance();
      } else {
        recognitionRef.current.lang = accentRef.current;
      }
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      recognitionRef.current = createRecognitionInstance();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (reErr) {
        setError('Failed to start microphone speech recognition: ' + reErr.message);
      }
    }
  }, [createRecognitionInstance, isSupported]);

  const stopListening = useCallback(() => {
    shouldKeepListeningRef.current = false;
    setIsListening(false);
    setInterimTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping recognition', err);
      }
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

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
