// === SYNTAX HIGHLIGHTING FOR TERMINAL OUTPUT ===
import React from 'react';

// ANSI escape code parser + keyword coloring
const ANSI_COLORS: Record<string, string> = {
  '\x1b[31m': 'text-danger',
  '\x1b[32m': 'text-primary',
  '\x1b[33m': 'text-warning',
  '\x1b[34m': 'text-cyber-blue',
  '\x1b[0m': '',
};

// Keyword patterns for syntax coloring
const KEYWORD_PATTERNS: { regex: RegExp; className: string }[] = [
  // IPs
  { regex: /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g, className: 'text-warning' },
  // Ports
  { regex: /:(\d{2,5})\b/g, className: 'text-cyber-blue' },
  // Statuses
  { regex: /\b(ESTABLISHED|LISTEN|OPEN|UP|active|running|SUCCESS|loaded)\b/gi, className: 'text-primary' },
  { regex: /\b(CLOSED|DOWN|FAILED|BLOCK|DROP|denied|timeout|refused|error|crit)\b/gi, className: 'text-danger' },
  { regex: /\b(ALERT|WARNING|WARN|suspicious|suspect|anomal|malicious)\b/gi, className: 'text-warning' },
  // Protocols
  { regex: /\b(TCP|UDP|ICMP|HTTP|HTTPS|SSH|DNS|ARP|FTP|TLS|SSL)\b/g, className: 'text-cyber-blue' },
  // Flags
  { regex: /\[(S|S\.|P\.|F\.|R\.|\.)]/g, className: 'text-primary' },
  // Paths
  { regex: /(\/[\w\-./]+)/g, className: 'text-muted-foreground' },
  // Permissions
  { regex: /^([drwx\-]{10})/gm, className: 'text-cyber-blue' },
];

function parseAnsiCodes(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let currentClass = '';
  let key = 0;

  while (remaining.length > 0) {
    let earliest = -1;
    let earliestCode = '';
    let earliestClass = '';

    for (const [code, cls] of Object.entries(ANSI_COLORS)) {
      const idx = remaining.indexOf(code);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        earliestCode = code;
        earliestClass = cls;
      }
    }

    if (earliest === -1) {
      parts.push(<span key={key++} className={currentClass}>{remaining}</span>);
      break;
    }

    if (earliest > 0) {
      parts.push(<span key={key++} className={currentClass}>{remaining.slice(0, earliest)}</span>);
    }

    remaining = remaining.slice(earliest + earliestCode.length);
    currentClass = earliestClass;
  }

  return parts;
}

export function highlightLine(text: string, type: string): React.ReactNode {
  // First handle ANSI codes
  if (text.includes('\x1b[')) {
    return <>{parseAnsiCodes(text)}</>;
  }

  // For output lines, apply keyword highlighting
  if (type === 'output' || type === 'system') {
    let segments: { text: string; className?: string; index: number }[] = [{ text, index: 0 }];

    for (const pattern of KEYWORD_PATTERNS) {
      const newSegments: typeof segments = [];
      for (const seg of segments) {
        if (seg.className) {
          newSegments.push(seg);
          continue;
        }
        let lastIdx = 0;
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        let match;
        while ((match = regex.exec(seg.text)) !== null) {
          if (match.index > lastIdx) {
            newSegments.push({ text: seg.text.slice(lastIdx, match.index), index: lastIdx });
          }
          newSegments.push({ text: match[0], className: pattern.className, index: match.index });
          lastIdx = match.index + match[0].length;
        }
        if (lastIdx < seg.text.length) {
          newSegments.push({ text: seg.text.slice(lastIdx), index: lastIdx });
        }
      }
      segments = newSegments;
    }

    return (
      <>
        {segments.map((s, i) => (
          <span key={i} className={s.className || ''}>{s.text}</span>
        ))}
      </>
    );
  }

  return text;
}

// Highlight prompt with user@host coloring
export function highlightPrompt(prompt: string): React.ReactNode {
  const match = prompt.match(/^(\w+@[\w\-]+)(:.+?\$)(.*)$/);
  if (match) {
    return (
      <>
        <span className="text-primary font-bold">{match[1]}</span>
        <span className="text-cyber-blue">{match[2]}</span>
        <span className="text-foreground">{match[3]}</span>
      </>
    );
  }
  return <span className="text-terminal">{prompt}</span>;
}
