import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';
import { XPNotification } from '../GameHUD';

export const Ch2Scene2_DNS = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'terminal' | 'quiz' | 'result'>('intro');
  const [showXP, setShowXP] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: string; text: string }[]>([]);
  const [validated, setValidated] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const introLines = [
    "Marcus projette l'IP récupérée hier : 185.199.108.153",
    "\"On sait qu'Oblivion a utilisé ce serveur. Mais comment les employés arrivent dessus ?\"",
    "Il te montre une nouvelle commande : nslookup.",
    "\"Tape 'nslookup kronos-gl0bal.com' pour voir comment le DNS traduit ce nom en adresse IP.\"",
  ];

  const successOutput = [
    "Server:  8.8.8.8",
    "Address: 8.8.8.8#53",
    "",
    "Non-authoritative answer:",
    "Name:    kronos-gl0bal.com",
    "Address: 185.199.108.153",
  ];

  const quizOptions = [
    { text: "Parce que c'est plus rapide", correct: false, feedback: "Non, la vitesse n'est pas le facteur principal." },
    { text: "Pour imiter un site légitime", correct: true, feedback: "Exact ! Le domaine ressemble au vrai pour tromper les victimes." },
    { text: "Pour éviter les antivirus", correct: false, feedback: "Les antivirus ne filtrent pas par nom de domaine uniquement." },
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    if (phase === 'terminal') inputRef.current?.focus();
  }, [phase]);

  const handleCommand = () => {
    const cmd = input.trim();
    if (!cmd || validated) return;
    setHistory(h => [...h, { type: 'prompt', text: `kronos@workstation:~$ ${cmd}` }]);
    setInput('');

    if (cmd.toLowerCase().startsWith('nslookup') && cmd.includes('kronos-gl0bal.com')) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < successOutput.length) {
          setHistory(h => [...h, { type: 'output', text: successOutput[i] }]);
          i++;
        } else {
          clearInterval(interval);
          setValidated(true);
          addXP('technical', 50);
          setShowXP(true);
          setTimeout(() => setShowXP(false), 2000);
          setTimeout(() => setPhase('quiz'), 2000);
        }
      }, 300);
    } else {
      setHistory(h => [...h, { type: 'error', text: `bash: ${cmd.split(' ')[0]}: command not found` }]);
    }
  };

  const handleAnswer = (i: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(i);
    if (quizOptions[i].correct) {
      addXP('analytical', 50);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 2000);
    }
    setTimeout(() => setPhase('result'), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <AnimatePresence>{showXP && <XPNotification category="XP" amount={50} />}</AnimatePresence>

      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Chapitre 2 — Le Faux Site
          </h2>
          <NarrativeBlock lines={introLines} onComplete={() => setPhase('terminal')} speed={25} />
        </motion.div>
      )}

      {(phase === 'terminal' || phase === 'quiz' || phase === 'result') && phase === 'terminal' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl">
          <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-3">
            <p className="font-mono text-xs text-primary">
              🎯 <span className="font-bold">OBJECTIF :</span> Tape <span className="text-warning font-bold">nslookup kronos-gl0bal.com</span> pour interroger le DNS.
            </p>
          </div>

          <div className="rounded-lg border border-primary/30 bg-card p-4 mb-4">
            <p className="font-mono text-xs text-primary mb-1">🧠 DNS = Domain Name System</p>
            <p className="text-xs text-foreground/70">Il traduit un nom lisible (google.com) en adresse IP numérique.</p>
          </div>

          <div className="overflow-hidden rounded-lg border border-primary/30 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 border-b border-primary/20 bg-secondary px-4 py-2">
              <div className="h-3 w-3 rounded-full bg-danger/70" />
              <div className="h-3 w-3 rounded-full bg-warning/70" />
              <div className="h-3 w-3 rounded-full bg-primary/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">Terminal</span>
            </div>
            <div ref={scrollRef} onClick={() => inputRef.current?.focus()} className="relative h-[300px] overflow-y-auto bg-terminal-bg p-4 font-mono text-sm cursor-text">
              <div className="scanline absolute inset-0" />
              {history.map((e, i) => (
                <div key={i} className={`mb-1 ${e.type === 'prompt' ? 'text-terminal terminal-glow' : e.type === 'error' ? 'text-danger' : 'text-terminal/80'}`}>{e.text}</div>
              ))}
              {!validated && (
                <div className="flex items-center text-terminal terminal-glow">
                  <span>kronos@workstation:~$&nbsp;</span>
                  <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCommand()} className="flex-1 bg-transparent outline-none text-terminal caret-terminal" autoFocus spellCheck={false} />
                </div>
              )}
              {validated && <div className="mt-4 text-primary terminal-glow font-bold">✓ DNS résolu — IP cible confirmée</div>}
            </div>
          </div>
        </motion.div>
      )}

      {phase === 'quiz' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <p className="font-mono text-xs text-primary mb-4">QUIZ — DNS</p>
          <div className="rounded-lg border border-primary/30 bg-card p-4 mb-4">
            <p className="text-sm text-foreground/90">Pourquoi les hackers utilisent-ils un faux domaine ?</p>
          </div>
          <div className="space-y-3">
            {quizOptions.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null}
                className={`w-full rounded-lg border p-4 text-left text-sm transition-all ${
                  selectedAnswer === i ? (opt.correct ? 'border-primary bg-primary/10 text-primary' : 'border-danger bg-danger/10 text-danger')
                  : selectedAnswer !== null && opt.correct ? 'border-primary/50 bg-primary/5' : 'border-border bg-card text-foreground/70 hover:border-primary/50'
                }`}>
                <span className="font-mono text-xs text-muted-foreground mr-2">{i + 1}.</span>{opt.text}
                {selectedAnswer === i && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs italic">{opt.feedback}</motion.p>}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl text-center">
          <div className="rounded-lg border border-primary/30 bg-card p-6 mb-4">
            <p className="font-mono text-xs text-primary mb-2">MARCUS</p>
            <p className="text-sm text-foreground/80">"Le DNS, c'est l'annuaire du réseau. Contrôle l'annuaire, et tu contrôles où les gens vont."</p>
          </div>
          <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
            Scène suivante →
          </button>
        </motion.div>
      )}
    </div>
  );
};
