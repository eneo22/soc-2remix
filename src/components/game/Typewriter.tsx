import { useState, useEffect } from 'react';
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

  const handleLineComplete = () => {
    if (currentLine < lines.length - 1) {
      setTimeout(() => setCurrentLine(c => c + 1), 400);
    } else {
      setAllDone(true);
      onComplete?.();
    }
  };

  return (
    <div className="space-y-3">
      {lines.slice(0, currentLine + 1).map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm md:text-base leading-relaxed text-foreground/90"
        >
          {i === currentLine && !allDone ? (
            <Typewriter text={line} speed={speed} onComplete={handleLineComplete} />
          ) : (
            line
          )}
        </motion.p>
      ))}
    </div>
  );
};
