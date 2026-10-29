import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  onPlayPause,
  onRewind,
  onFastForward,
  onInsertTimestamp,
  onInsertSpeaker,
  onToggleDictation,
  onSave
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Escape: Play / Pause audio
      if (event.key === 'Escape') {
        event.preventDefault();
        if (onPlayPause) onPlayPause();
        return;
      }

      // Alt + Tab: Play / Pause
      if (event.key === 'Tab' && event.altKey) {
        event.preventDefault();
        if (onPlayPause) onPlayPause();
        return;
      }

      // F1 or Alt + ArrowLeft: Rewind 5s
      if (event.key === 'F1' || (event.altKey && event.key === 'ArrowLeft')) {
        event.preventDefault();
        if (onRewind) onRewind();
        return;
      }

      // F2 or Alt + ArrowRight: Fast Forward 5s
      if (event.key === 'F2' || (event.altKey && event.key === 'ArrowRight')) {
        event.preventDefault();
        if (onFastForward) onFastForward();
        return;
      }

      // F4 or Ctrl+J: Insert Timestamp
      if (event.key === 'F4' || (event.ctrlKey && event.key.toLowerCase() === 'j')) {
        event.preventDefault();
        if (onInsertTimestamp) onInsertTimestamp();
        return;
      }

      // Ctrl+K: Insert Speaker tag
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (onInsertSpeaker) onInsertSpeaker();
        return;
      }

      // Ctrl+M: Toggle Dictation
      if ((event.ctrlKey && event.key.toLowerCase() === 'm') || (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd')) {
        event.preventDefault();
        if (onToggleDictation) onToggleDictation();
        return;
      }

      // Ctrl+S: Save
      if (event.ctrlKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (onSave) onSave();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause, onRewind, onFastForward, onInsertTimestamp, onInsertSpeaker, onToggleDictation, onSave]);
};
