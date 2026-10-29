export const ACCENT_PROFILES = [
  {
    code: 'en-US',
    name: 'United States',
    flag: '🇺🇸',
    region: 'North America',
    description: 'General American rhotic phonology, standard US vocabulary and spelling.',
    acousticProfile: 'Flapped t/d, rhotic r-coloring, broad /æ/ in bat/cat.'
  },
  {
    code: 'en-GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    description: 'Received Pronunciation & British regional dialects, UK spelling conventions.',
    acousticProfile: 'Non-rhotic, broad /ɑː/ in bath/dance, distinct glottal stops.'
  },
  {
    code: 'en-IN',
    name: 'India',
    flag: '🇮🇳',
    region: 'South Asia',
    description: 'Indian English acoustic models, retroflex consonants, and subcontinental idioms.',
    acousticProfile: 'Retroflex /ʈ/ & /ɖ/, unaspirated voiceless stops, syllable-timed cadence.'
  },
  {
    code: 'en-AU',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
    description: 'General & Broad Australian English, distinctive vowel shifts and colloquialisms.',
    acousticProfile: 'Diphthong shifts (/eɪ/ -> [aɪ]), non-rhotic, high rising terminal intonation.'
  },
  {
    code: 'en-CA',
    name: 'Canada',
    flag: '🇨🇦',
    region: 'North America',
    description: 'Canadian English with rhotic pronunciation and Canadian vowel raising.',
    acousticProfile: 'Canadian raising before voiceless consonants (/aɪ/ and /aʊ/), cot-caught merger.'
  },
  {
    code: 'en-IE',
    name: 'Ireland',
    flag: '🇮🇪',
    region: 'Europe',
    description: 'Hiberno-English dialects, dental stops, and melodic cadence.',
    acousticProfile: 'Slender/broad distinction, rhotic r, slit fricatives for /t/ and /d/.'
  },
  {
    code: 'en-NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    region: 'Oceania',
    description: 'Kiwi English acoustic models, centralized short vowels.',
    acousticProfile: 'Centralized short /ɪ/ (sounds like "uh"), fronted /e/ and /æ/.'
  },
  {
    code: 'en-ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    region: 'Africa',
    description: 'South African English accents (general and broad), distinct vowel qualities.',
    acousticProfile: 'Non-rhotic, kit split, retracted /æ/ vowel, backed /ɑː/.'
  },
  {
    code: 'en-NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    region: 'Africa',
    description: 'West African & Nigerian English intonation, non-rhotic vowel system.',
    acousticProfile: 'Syllable-timed rhythm, monophthongal diphthongs, distinctive pitch patterns.'
  },
  {
    code: 'en-SG',
    name: 'Singapore',
    flag: '🇸🇬',
    region: 'Southeast Asia',
    description: 'Singaporean English, syllable-timed cadence and local discourse particles.',
    acousticProfile: 'Non-rhotic, th-stopping (/θ/ -> [t]), lack of vowel length distinctions.'
  },
  {
    code: 'en-PH',
    name: 'Philippines',
    flag: '🇵🇭',
    region: 'Southeast Asia',
    description: 'Philippine English, rhotic with distinctive vowel length and stress patterns.',
    acousticProfile: 'Rhotic pronunciation, /f/ and /p/ alternations, distinctive stress shifts.'
  },
  {
    code: 'en-JM',
    name: 'Jamaica',
    flag: '🇯🇲',
    region: 'Caribbean',
    description: 'Caribbean English phonology, characteristic prosodic rhythm and vowels.',
    acousticProfile: 'Non-rhotic, variable h-dropping, semi-syllable-timed musical intonation.'
  }
];

export const getAccentByCode = (code) => {
  return ACCENT_PROFILES.find(a => a.code.toLowerCase() === (code || '').toLowerCase()) || ACCENT_PROFILES[0];
};
