/**
 * Voice commands and punctuation replacement rules
 */
export const PUNCTUATION_COMMANDS = [
  { trigger: /\b(period|full stop)\b/gi, replacement: '.' },
  { trigger: /\b(comma)\b/gi, replacement: ',' },
  { trigger: /\b(question mark)\b/gi, replacement: '?' },
  { trigger: /\b(exclamation mark|exclamation point)\b/gi, replacement: '!' },
  { trigger: /\b(colon)\b/gi, replacement: ':' },
  { trigger: /\b(semicolon|semi colon)\b/gi, replacement: ';' },
  { trigger: /\b(ellipsis|dot dot dot)\b/gi, replacement: '...' },
  { trigger: /\b(hyphen|dash)\b/gi, replacement: ' - ' },
  { trigger: /\b(open quote|open quotation|start quote)\b/gi, replacement: ' "' },
  { trigger: /\b(close quote|close quotation|end quote)\b/gi, replacement: '" ' },
  { trigger: /\b(open bracket|open parenthesis|open paren)\b/gi, replacement: ' (' },
  { trigger: /\b(close bracket|close parenthesis|close paren)\b/gi, replacement: ') ' },
  { trigger: /\b(new line|next line)\b/gi, replacement: '\n' },
  { trigger: /\b(new paragraph|next paragraph)\b/gi, replacement: '\n\n' },
  { trigger: /\b(at sign|at symbol)\b/gi, replacement: '@' },
  { trigger: /\b(hashtag|hash tag|pound sign)\b/gi, replacement: '#' },
  { trigger: /\b(dollar sign|dollars)\b/gi, replacement: '$' },
  { trigger: /\b(percent sign|percentage)\b/gi, replacement: '%' }
];

/**
 * Apply punctuation and voice formatting commands to text
 */
export const processVoiceCommands = (text, customDictionary = []) => {
  if (!text) return '';

  let processed = text;

  // Apply custom vocabulary and phonetic corrections first
  if (customDictionary && customDictionary.length > 0) {
    for (const item of customDictionary) {
      if (item.trigger && item.replacement) {
        const regex = new RegExp(`\\b${escapeRegExp(item.trigger)}\\b`, 'gi');
        processed = processed.replace(regex, item.replacement);
      }
    }
  }

  // Apply standard punctuation commands
  for (const cmd of PUNCTUATION_COMMANDS) {
    processed = processed.replace(cmd.trigger, cmd.replacement);
  }

  // Clean up punctuation spacing:
  // Remove space BEFORE . , ? ! : ; ) "
  processed = processed.replace(/\s+([.,?!:;)])/g, '$1');
  // Ensure single space AFTER . , ? ! : ; unless followed by newline or already spaced
  processed = processed.replace(/([.,?!:;])([^\s\d\n"'])/g, '$1 $2');
  // Clean double spaces
  processed = processed.replace(/[ \t]{2,}/g, ' ');

  // Auto capitalize after . ! ? or start of paragraph
  processed = autoCapitalizeSentences(processed);

  return processed;
};

/**
 * Auto capitalize sentences
 */
export const autoCapitalizeSentences = (text) => {
  if (!text) return '';
  return text.replace(/(^|[.?!]\s+|\n+)([a-z])/g, (match, prefix, char) => {
    return prefix + char.toUpperCase();
  });
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Common accent phonetic hints and default dictionary entries
 */
export const DEFAULT_PHONETIC_DICTIONARY = [
  { trigger: 'gonna', replacement: 'going to' },
  { trigger: 'wanna', replacement: 'want to' },
  { trigger: 'kinda', replacement: 'kind of' },
  { trigger: 'gotta', replacement: 'got to' },
  { trigger: 'lemme', replacement: 'let me' },
  { trigger: 'dunno', replacement: "don't know" }
];
