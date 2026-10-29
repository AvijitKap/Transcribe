/**
 * Sample transcripts representing diverse accents and professional interviews
 */
export const SAMPLE_DOCUMENTS = [
  {
    id: 'sample-tech-interview',
    title: 'Executive Podcast: Building Global AI Systems',
    updatedAt: new Date().toISOString(),
    accent: 'en-US',
    segments: [
      {
        id: 'seg-1',
        speaker: 'Sarah (Host)',
        timestamp: 0.0,
        endTimestamp: 4.5,
        text: "Welcome back to the Future Tech Summit. Today we're joined by Dr. Liam Vance, Principal AI Researcher."
      },
      {
        id: 'seg-2',
        speaker: 'Liam (Guest)',
        timestamp: 4.8,
        endTimestamp: 10.2,
        text: "Thanks for having me, Sarah. It's fantastic to be here discussing how speech recognition models have evolved."
      },
      {
        id: 'seg-3',
        speaker: 'Sarah (Host)',
        timestamp: 10.6,
        endTimestamp: 16.0,
        text: "Liam, one of the biggest hurdles historically has been handling regional accents and conversational speech. How did modern architectures overcome that?"
      },
      {
        id: 'seg-4',
        speaker: 'Liam (Guest)',
        timestamp: 16.4,
        endTimestamp: 25.0,
        text: "Earlier models relied on strict phonetic dictionaries. Modern deep neural models, like Transformer-based sequence-to-sequence networks, train across thousands of dialectal hours, learning contextual phonetics in real time."
      },
      {
        id: 'seg-5',
        speaker: 'Sarah (Host)',
        timestamp: 25.5,
        endTimestamp: 31.0,
        text: "That explains why the transcription accuracy stays high whether the speaker has a British, Indian, Australian, or North American accent."
      }
    ]
  },
  {
    id: 'sample-medical-consult',
    title: 'Clinical Consultation - Dr. Patel & Patient',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    accent: 'en-GB',
    segments: [
      {
        id: 'med-1',
        speaker: 'Dr. Patel',
        timestamp: 0.0,
        endTimestamp: 5.2,
        text: "Good morning, Mrs. Davies. Please have a seat. How has the new medication been working out for you this past fortnight?"
      },
      {
        id: 'med-2',
        speaker: 'Mrs. Davies',
        timestamp: 5.5,
        endTimestamp: 11.8,
        text: "Morning, Doctor. The joint stiffness in my knee has noticeably subsided, especially during my morning walks."
      },
      {
        id: 'med-3',
        speaker: 'Dr. Patel',
        timestamp: 12.0,
        endTimestamp: 18.5,
        text: "That is encouraging to hear. We'll maintain the current dosage of 20 milligrams daily and schedule our review in six weeks."
      }
    ]
  }
];

/**
 * Generates synthetic speech audio using Web Audio API harmonic wave
 */
export const createSampleSynthesizedAudioBlob = async () => {
  return new Promise((resolve) => {
    const sampleRate = 44100;
    const duration = 12;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < sampleRate * duration; i++) {
      const t = i / sampleRate;
      const speechEnvelope = Math.sin(t * 1.5) * Math.sin(t * 0.4) > 0 ? 0.8 : 0.05;
      const fundamental = 160 + 40 * Math.sin(t * 2);
      data[i] = speechEnvelope * (
        0.5 * Math.sin(2 * Math.PI * fundamental * t) +
        0.3 * Math.sin(2 * Math.PI * fundamental * 2 * t) +
        0.15 * Math.sin(2 * Math.PI * fundamental * 3 * t) +
        0.05 * (Math.random() * 2 - 1)
      );
    }

    const wavBlob = audioBufferToWav(buffer);
    resolve(wavBlob);
  });
};

function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels = [];
  let sample;
  let offset = 0;
  let pos = 0;

  function setUint16(data) {
    out.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8);
  setUint32(0x45564157); // "WAVE"

  // FMT sub-chunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16);
  setUint16(1); // PCM
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);

  // Data sub-chunk
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out.buffer], { type: 'audio/wav' });
}
