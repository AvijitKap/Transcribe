import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

/**
 * Format seconds into HH:MM:SS
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format seconds into SRT timestamp format: HH:MM:SS,mmm
 */
export const formatSrtTime = (seconds) => {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return '00:00:00,000';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
};

/**
 * Format seconds into WebVTT timestamp format: HH:MM:SS.mmm
 */
export const formatVttTime = (seconds) => {
  return formatSrtTime(seconds).replace(',', '.');
};

/**
 * Trigger browser file download
 */
export const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Export to Microsoft Word (.docx)
 */
export const exportToDocx = async (title, segments = [], rawText = '', options = { includeTimestamps: true, includeSpeakers: true }) => {
  const docTitle = title || 'Transcription Document';
  const paragraphs = [
    new Paragraph({
      text: docTitle,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Transcribed with TranscribePro • ${new Date().toLocaleDateString(undefined, { dateStyle: 'long' })} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          italics: true,
          color: '64748B',
          size: 20
        })
      ],
      spacing: { after: 360 }
    })
  ];

  const validSegments = (segments || []).filter(s => s && s.text && s.text.trim());

  if (validSegments.length > 0) {
    validSegments.forEach((seg) => {
      const runs = [];

      if (options.includeTimestamps) {
        runs.push(
          new TextRun({
            text: `[${formatTime(seg.timestamp || 0)}] `,
            bold: true,
            color: '2563EB',
            size: 22
          })
        );
      }

      if (options.includeSpeakers && seg.speaker) {
        runs.push(
          new TextRun({
            text: `${seg.speaker}: `,
            bold: true,
            color: '0F172A',
            size: 22
          })
        );
      }

      runs.push(
        new TextRun({
          text: seg.text.trim(),
          size: 22,
          color: '334155'
        })
      );

      paragraphs.push(
        new Paragraph({
          children: runs,
          spacing: { after: 200, line: 300 }
        })
      );
    });
  } else if (rawText && rawText.trim()) {
    const rawLines = rawText.split('\n').filter(l => l.trim());
    rawLines.forEach((line) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 22,
              color: '334155'
            })
          ],
          spacing: { after: 180, line: 300 }
        })
      );
    });
  } else {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Transcript is empty.',
            italics: true,
            size: 22,
            color: '94A3B8'
          })
        ]
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanFilename = (docTitle).toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  triggerDownload(blob, `${cleanFilename}.docx`);
};

/**
 * Copy transcript to clipboard
 */
export const copyTranscriptToClipboard = async (segments = [], rawText = '', options = { includeTimestamps: true, includeSpeakers: true }) => {
  let content = '';

  const validSegments = (segments || []).filter(s => s && s.text && s.text.trim());

  if (validSegments.length > 0) {
    content = validSegments
      .map((seg) => {
        let line = '';
        if (options.includeTimestamps) line += `[${formatTime(seg.timestamp || 0)}] `;
        if (options.includeSpeakers && seg.speaker) line += `${seg.speaker}: `;
        line += seg.text.trim();
        return line;
      })
      .join('\n\n');
  } else if (rawText) {
    content = rawText;
  }

  if (!content.trim()) {
    return false;
  }

  await navigator.clipboard.writeText(content);
  return true;
};

/**
 * Export to Plain Text (.txt)
 */
export const exportToTxt = (title, segments, rawText, options = { includeTimestamps: true, includeSpeakers: true }) => {
  let content = `${title || 'Transcription'}\n`;
  content += `Date: ${new Date().toLocaleString()}\n`;
  content += `----------------------------------------\n\n`;

  if (segments && segments.length > 0) {
    segments.forEach((seg) => {
      let line = '';
      if (options.includeTimestamps) line += `[${formatTime(seg.timestamp || 0)}] `;
      if (options.includeSpeakers) line += `${seg.speaker || 'Speaker'}: `;
      line += seg.text || '';
      content += line + '\n\n';
    });
  } else {
    content += rawText || '';
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const cleanFilename = (title || 'transcription').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  triggerDownload(blob, `${cleanFilename}.txt`);
};

/**
 * Export to SubRip (.srt)
 */
export const exportToSrt = (title, segments) => {
  if (!segments || segments.length === 0) {
    alert('No timestamped segments available to export as SRT subtitles.');
    return;
  }

  let srtContent = '';
  segments.forEach((seg, idx) => {
    const start = seg.timestamp || (idx * 3);
    const end = seg.endTimestamp || (start + 3);

    srtContent += `${idx + 1}\n`;
    srtContent += `${formatSrtTime(start)} --> ${formatSrtTime(end)}\n`;
    srtContent += `${seg.speaker ? `${seg.speaker}: ` : ''}${seg.text || ''}\n\n`;
  });

  const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
  const cleanFilename = (title || 'subtitles').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  triggerDownload(blob, `${cleanFilename}.srt`);
};

/**
 * Export to WebVTT (.vtt)
 */
export const exportToVtt = (title, segments) => {
  if (!segments || segments.length === 0) {
    alert('No timestamped segments available to export as WebVTT subtitles.');
    return;
  }

  let vttContent = 'WEBVTT\n\n';
  segments.forEach((seg, idx) => {
    const start = seg.timestamp || (idx * 3);
    const end = seg.endTimestamp || (start + 3);

    vttContent += `${idx + 1}\n`;
    vttContent += `${formatVttTime(start)} --> ${formatVttTime(end)}\n`;
    vttContent += `${seg.speaker ? `<v ${seg.speaker}>` : ''}${seg.text || ''}\n\n`;
  });

  const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8' });
  const cleanFilename = (title || 'subtitles').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  triggerDownload(blob, `${cleanFilename}.vtt`);
};

/**
 * Export to Markdown (.md)
 */
export const exportToMarkdown = (title, segments, rawText) => {
  let content = `# ${title || 'Transcription'}\n\n`;
  content += `*Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*\n\n---\n\n`;

  if (segments && segments.length > 0) {
    segments.forEach((seg) => {
      content += `**\`[${formatTime(seg.timestamp || 0)}]\` ${seg.speaker || 'Speaker'}:**\n`;
      content += `> ${seg.text || ''}\n\n`;
    });
  } else {
    content += rawText || '';
  }

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const cleanFilename = (title || 'transcription').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  triggerDownload(blob, `${cleanFilename}.md`);
};

/**
 * Export to JSON
 */
export const exportToJson = (title, segments, rawText) => {
  const data = {
    title: title || 'Untitled Transcription',
    exportedAt: new Date().toISOString(),
    segments: segments || [],
    rawText: rawText || ''
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const cleanFilename = (title || 'transcription').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  triggerDownload(blob, `${cleanFilename}.json`);
};
