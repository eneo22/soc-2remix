import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export const Typewriter = ({ text, speed = 30, onComplete, className = '' }: TypewriterProps) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayed}{!done && <span className="cursor-blink">▌</span>}</span>;
};

interface NarrativeBlockProps {
  lines: string[];
  onComplete?: () => void;
  speed?: number;
}

export const NarrativeBlock = ({ lines, onComplete, speed = 25 }: NarrativeBlockProps) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [lineTypingDone, setLineTypingDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const handleLineComplete = useCallback(() => {
    setLineTypingDone(true);
  }, []);

  const advance = useCallback(() => {
    if (!lineTypingDone && !skipped) {
      // Skip current line typing animation
      setSkipped(true);
      setLineTypingDone(true);
      return;
    }
    if (currentLine < lines.length - 1) {
      setCurrentLine(c => c + 1);
      setLineTypingDone(false);
      setSkipped(false);
    } else if (!allDone) {
      setAllDone(true);
      onComplete?.();
    }
  }, [lineTypingDone, skipped, currentLine, lines.length, allDone, onComplete]);

  const skipAll = useCallback(() => {
    setCurrentLine(lines.length - 1);
    setSkipped(true);
    setLineTypingDone(true);
    setAllDone(true);
    onComplete?.();
  }, [lines.length, onComplete]);

  return (
    <div className="space-y-3">
      {lines.slice(0, currentLine + 1).map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm md:text-base leading-relaxed text-foreground/90"
        >
          {i === currentLine && !skipped ? (
            <Typewriter text={line} speed={speed} onComplete={handleLineComplete} />
          ) : (
            line
          )}
        </motion.p>
      ))}

      <div className="flex items-center gap-3 mt-4">
        {!allDone && (
          <>
            <button
              onClick={advance}
              className="rounded border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs text-primary transition-all hover:bg-primary/20"
            >
              {lineTypingDone ? 'Suivant →' : 'Passer ▶'}
            </button>
            <button
              onClick={skipAll}
              className="font-mono text-xs text-muted-foreground transition-all hover:text-foreground"
            >
              Tout passer ⏭
            </button>
          </>
        )}
      </div>
    </div>
  );
};
