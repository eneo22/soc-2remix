import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from './Typewriter';
import { XPNotification } from './GameHUD';

export const Scene3_Terminal = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'terminal' | 'done'>('intro');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'prompt' | 'output' | 'error' | 'hint'; text: string }[]>([]);
  const [validated, setValidated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [typingOutput, setTypingOutput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const introLines = [
    "Marcus : \"Tu as fait une erreur (ou tu as été malin), mais je manque d'effectif ce soir. Tu vas m'aider à remonter la piste de ces enfoirés.\"",
    "\"Sais-tu ce qu'est une adresse IP ? C'est la plaque d'immatriculation d'un ordinateur sur internet.\"",
    "\"Et le serveur ? C'est le bâtiment physique où sont stockées les données. On va secouer leur serveur.\"",
    "Marcus déverrouille une console Linux sur ton écran.",
    "\"Tape la commande 'ping kronos-gl0bal.com' dans le terminal. Ça va envoyer un signal à leur faux site pour récupérer leur adresse IP.\""
  ];

  const successOutput = [
    "PING kronos-gl0bal.com (185.199.108.153) 56(84) bytes of data.",
    "64 bytes from 185.199.108.153: icmp_seq=1 ttl=52 time=14ms",
    "64 bytes from 185.199.108.153: icmp_seq=2 ttl=52 time=13ms",
    "64 bytes from 185.199.108.153: icmp_seq=3 ttl=52 time=15ms",
    "",
    "--- kronos-gl0bal.com ping statistics ---",
    "3 packets transmitted, 3 received, 0% packet loss",
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

    const parts = cmd.split(/\s+/);
    const command = parts[0]?.toLowerCase();
    const domain = parts[1];

    if (command === 'ping' && domain === 'kronos-gl0bal.com') {
      setTypingOutput(true);
      let i = 0;
      const interval = setInterval(() => {
        if (i < successOutput.length) {
          setHistory(h => [...h, { type: 'output', text: successOutput[i] }]);
          i++;
        } else {
          clearInterval(interval);
          setTypingOutput(false);
          setValidated(true);
          addXP('technical', 100);
          setShowXP(true);
          setTimeout(() => setShowXP(false), 2000);
          setTimeout(() => setPhase('done'), 2000);
        }
      }, 400);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (command === 'ping' && domain && domain !== 'kronos-gl0bal.com') {
        if (domain === 'kronos-global.com') {
          setHistory(h => [...h, { type: 'error', text: "ping: unknown host kronos-global.com" }]);
          if (newAttempts >= 2) {
            setHistory(h => [...h, { type: 'hint', text: "💡 Regarde attentivement : le domaine contient-il un zéro ou un \"o\" ?" }]);
          }
        } else {
          setHistory(h => [...h, { type: 'error', text: `ping: unknown host ${domain}` }]);
        }
      } else if (command !== 'ping') {
        setHistory(h => [...h, { type: 'error', text: `bash: ${command}: command not found` }]);
        if (newAttempts >= 2) {
          setHistory(h => [...h, { type: 'hint', text: "💡 Rappel : la commande commence par \"ping\"." }]);
        }
      } else {
        setHistory(h => [...h, { type: 'error', text: "ping: usage error: Destination address required" }]);
      }

      if (newAttempts >= 3) {
        setHistory(h => [...h, { type: 'hint', text: "Marcus : \"Vérifie bien l'orthographe du domaine. Regarde attentivement le 'o'…\"" }]);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCommand();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <AnimatePresence>{showXP && <XPNotification category="Technique" amount={100} />}</AnimatePresence>

      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Scène 3 — La Traque (Terminal 101)
          </h2>
          <NarrativeBlock lines={introLines} onComplete={() => setPhase('terminal')} speed={25} />
        </motion.div>
      )}

      {(phase === 'terminal' || phase === 'done') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl"
        >
          {/* Objective reminder */}
          <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-3">
            <p className="font-mono text-xs text-primary">
              🎯 <span className="font-bold">OBJECTIF :</span> Tape la commande <span className="text-warning font-bold">ping kronos-gl0bal.com</span> pour récupérer l'adresse IP du serveur ennemi.
            </p>
          </div>

          {/* Terminal Window */}
          <div className="overflow-hidden rounded-lg border border-primary/30 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 border-b border-primary/20 bg-secondary px-4 py-2">
              <div className="h-3 w-3 rounded-full bg-danger/70" />
              <div className="h-3 w-3 rounded-full bg-warning/70" />
              <div className="h-3 w-3 rounded-full bg-primary/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">Terminal — kronos@workstation</span>
            </div>

            <div
              ref={scrollRef}
              onClick={() => inputRef.current?.focus()}
              className="relative h-[400px] overflow-y-auto bg-terminal-bg p-4 font-mono text-sm cursor-text"
            >
              <div className="scanline absolute inset-0" />

              {history.map((entry, i) => (
                <div key={i} className={`mb-1 ${
                  entry.type === 'prompt' ? 'text-terminal terminal-glow' :
                  entry.type === 'error' ? 'text-danger' :
                  entry.type === 'hint' ? 'text-warning italic' :
                  'text-terminal/80'
                }`}>
                  {entry.text}
                </div>
              ))}

              {!validated && (
                <div className="flex items-center text-terminal terminal-glow">
                  <span>kronos@workstation:~$&nbsp;</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={typingOutput || validated}
                    className="flex-1 bg-transparent outline-none text-terminal caret-terminal"
                    autoFocus
                    spellCheck={false}
                  />
                </div>
              )}

              {validated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-primary terminal-glow font-bold"
                >
                  ✓ Commande validée — IP cible identifiée : 185.199.108.153
                </motion.div>
              )}
            </div>
          </div>

          {phase === 'done' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
              <div className="rounded-lg border border-primary/30 bg-card p-4 mb-4">
                <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
                <p className="text-sm text-foreground/80">
                  "Bingo. <span className="font-bold text-warning">185.199.108.153</span>. C'est un serveur hébergé en Russie. Oblivion est à l'autre bout de cette ligne."
                </p>
              </div>
              <div className="rounded border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
                <p className="font-bold text-primary mb-1">📚 Concepts appris :</p>
                <p>• Une <span className="text-foreground">adresse IP</span> identifie une machine sur un réseau</p>
                <p>• La commande <span className="font-mono text-terminal">ping</span> teste la connectivité vers un serveur</p>
                <p>• Un <span className="text-foreground">serveur</span> est une machine qui stocke des données</p>
              </div>
              <button
                onClick={nextScene}
                className="mt-4 w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20"
              >
                Scène suivante →
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
