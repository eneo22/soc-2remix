import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { TerminalContent } from '@/data/training';

interface Props {
  content: TerminalContent;
  onComplete: () => void;
}

export const TrainingTerminal = ({ content, onComplete }: Props) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: string; text: string }[]>([]);
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = () => {
    const cmd = input.trim();
    if (!cmd || validated) return;
    setHistory(h => [...h, { type: 'prompt', text: `kronos@workstation:~$ ${cmd}` }]);
    setInput('');

    if (cmd.toLowerCase() === content.expectedCommand.toLowerCase()) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < content.successOutput.length) {
          setHistory(h => [...h, { type: 'output', text: content.successOutput[i] }]);
          i++;
        } else {
          clearInterval(interval);
          setValidated(true);
          setTimeout(onComplete, 1500);
        }
      }, 300);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setHistory(h => [...h, { type: 'error', text: `bash: commande non reconnue ou incorrecte` }]);
      if (newAttempts >= 2) {
        setHistory(h => [...h, { type: 'hint', text: `💡 Indice : ${content.hint}` }]);
      }
    }
  };

  return (
    <div>
      <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-3">
        <p className="font-mono text-xs text-primary">🎯 <span className="font-bold">SCÉNARIO :</span> {content.scenario}</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-primary/30 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-primary/20 bg-secondary px-4 py-2">
          <div className="h-3 w-3 rounded-full bg-danger/70" />
          <div className="h-3 w-3 rounded-full bg-warning/70" />
          <div className="h-3 w-3 rounded-full bg-primary/70" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">Terminal — Entraînement</span>
        </div>
        <div ref={scrollRef} onClick={() => inputRef.current?.focus()} className="relative h-[350px] overflow-y-auto bg-terminal-bg p-4 font-mono text-sm cursor-text">
          <div className="scanline absolute inset-0" />
          {history.map((e, i) => (
            <div key={i} className={`mb-1 ${e.type === 'prompt' ? 'text-terminal terminal-glow' : e.type === 'error' ? 'text-danger' : e.type === 'hint' ? 'text-warning italic' : 'text-terminal/80'}`}>
              {e.text}
            </div>
          ))}
          {!validated && (
            <div className="flex items-center text-terminal terminal-glow">
              <span>kronos@workstation:~$&nbsp;</span>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCommand()} className="flex-1 bg-transparent outline-none text-terminal caret-terminal" autoFocus spellCheck={false} />
            </div>
          )}
          {validated && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-primary terminal-glow font-bold">
              ✓ Commande validée — Module réussi !
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
