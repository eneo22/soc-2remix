import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { TerminalContent } from '@/data/training';
import { useAudio } from '@/contexts/AudioContext';

interface Props {
  content: TerminalContent;
  onComplete: () => void;
}

// Virtual File System
const VFS: Record<string, Record<string, string | Record<string, string>>> = {
  '/home/kronos': {
    'auth.log': '10:05 - User: Admin - IP: 192.168.1.5 - Status: FAILED\n10:06 - User: Admin - IP: 45.33.2.1 - Status: FAILED\n10:07 - User: Admin - IP: 45.33.2.1 - Status: SUCCESS',
    'server_dump.txt': 'error at 0x892 memory block. connection from 203.0.113.89 dropped. retry in 5s.',
    'notes.txt': 'Pense à vérifier les connexions suspectes sur le port 22.',
    logs: { 'access.log': 'GET /admin 403\nGET /login 200\nPOST /login 401', 'error.log': 'segfault at 0x0 ip 0x7f3...' },
  },
};

const MAN_PAGES: Record<string, string> = {
  ls: 'Usage: ls [dossier]\n  Liste le contenu du répertoire courant ou spécifié.',
  cd: 'Usage: cd [dossier]\n  Change le répertoire courant.',
  cat: 'Usage: cat [fichier]\n  Affiche le contenu d\'un fichier texte.',
  pwd: 'Usage: pwd\n  Affiche le chemin du répertoire courant.',
  grep: 'Usage: grep [MOT_CLE] [FICHIER]\n  Filtre les lignes contenant le mot-clé dans un fichier.',
  ping: 'Usage: ping [IP]\n  Envoie des paquets ICMP pour tester la connectivité réseau.',
  clear: 'Usage: clear\n  Efface l\'écran du terminal.',
  help: 'Usage: help\n  Affiche la liste des commandes disponibles.',
  man: 'Usage: man [commande]\n  Affiche le manuel d\'une commande.',
  iptables: 'Usage: iptables -A INPUT -s [IP] -j DROP\n  Ajoute une règle de pare-feu pour bloquer le trafic entrant.',
  nslookup: 'Usage: nslookup [domaine]\n  Résout un nom de domaine en adresse IP.',
  netstat: 'Usage: netstat -an\n  Affiche les connexions réseau actives.',
  whoami: 'Usage: whoami\n  Affiche l\'utilisateur courant.',
};

const SUPPORTED_CMDS = Object.keys(MAN_PAGES);

const TYPO_SUGGESTIONS: Record<string, string> = {
  sl: 'ls', pign: 'ping', cta: 'cat', gerp: 'grep', iptable: 'iptables',
};

// Mentor messages based on error count
const MENTOR_MESSAGES = [
  '', // 0 errors
  '', // 1 error - silence
  'Marcus : "Vérifie la syntaxe de ta commande, rookie. Souviens-toi de ce qu\'on a vu au briefing."',
  '', // will use hint from content
];

export const TrainingTerminal = ({ content, onComplete }: Props) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: string; text: string }[]>([]);
  const [validated, setValidated] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPos, setHistoryPos] = useState(-1);
  const [cwd] = useState('/home/kronos');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playSFX } = useAudio();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addOutput = (type: string, text: string) => {
    setHistory(h => [...h, { type, text }]);
  };

  const getCurrentDir = () => {
    const parts = cwd.split('/').filter(Boolean);
    let dir: any = VFS;
    for (const p of parts) {
      dir = dir[p] || dir[`/${p}`] || dir;
    }
    return dir || {};
  };

  const processBuiltin = (cmd: string, args: string[]): boolean => {
    const baseCmd = cmd.toLowerCase();

    if (baseCmd === 'clear') {
      setHistory([]);
      return true;
    }

    if (baseCmd === 'help') {
      addOutput('output', `Commandes disponibles : ${SUPPORTED_CMDS.join(', ')}`);
      return true;
    }

    if (baseCmd === 'man') {
      const target = args[0];
      if (!target) { addOutput('error', 'Usage: man <commande>'); return true; }
      const page = MAN_PAGES[target.toLowerCase()];
      if (page) { addOutput('output', page); } else { addOutput('error', `No manual entry for ${target}`); }
      return true;
    }

    if (baseCmd === 'whoami') {
      addOutput('output', 'kronos');
      return true;
    }

    if (baseCmd === 'pwd') {
      addOutput('output', cwd);
      return true;
    }

    if (baseCmd === 'ls') {
      const dir = getCurrentDir();
      if (typeof dir === 'object') {
        const entries = Object.keys(dir).map(k => typeof dir[k] === 'object' ? `${k}/` : k);
        addOutput('output', entries.join('  ') || '(vide)');
      }
      return true;
    }

    if (baseCmd === 'cat') {
      const fname = args[0];
      if (!fname) { addOutput('error', 'cat: fichier manquant'); return true; }
      const dir = getCurrentDir();
      if (typeof dir[fname] === 'object') {
        addOutput('error', `cat: ${fname}: Is a directory`);
      } else if (typeof dir[fname] === 'string') {
        addOutput('output', dir[fname] as string);
      } else {
        addOutput('error', `cat: ${fname}: No such file or directory`);
      }
      return true;
    }

    if (baseCmd === 'cd') {
      const target = args[0];
      if (!target) { addOutput('error', 'cd: argument manquant'); return true; }
      if (target === '/root') { addOutput('error', `bash: cd: /root: Permission denied`); return true; }
      const dir = getCurrentDir();
      if (typeof dir[target] === 'string') {
        addOutput('error', `bash: cd: ${target}: Not a directory`);
      } else if (typeof dir[target] === 'object') {
        addOutput('output', `(navigation simulée vers ${target})`);
      } else {
        addOutput('error', `bash: cd: ${target}: No such file or directory`);
      }
      return true;
    }

    if (baseCmd === 'grep') {
      if (args.length < 2) { addOutput('error', 'Usage: grep [MOT_CLE] [FICHIER]'); return true; }
      const [keyword, fname] = args;
      const dir = getCurrentDir();
      if (typeof dir[fname] === 'string') {
        const lines = (dir[fname] as string).split('\n').filter(l => l.toLowerCase().includes(keyword.toLowerCase()));
        if (lines.length) { lines.forEach(l => addOutput('output', l)); } else { addOutput('output', '(aucun résultat)'); }
      } else {
        addOutput('error', `grep: ${fname}: No such file or directory`);
      }
      return true;
    }

    return false;
  };

  const handleCommand = () => {
    const raw = input.trim();
    if (!raw || validated) return;

    addOutput('prompt', `kronos@workstation:~$ ${raw}`);
    setCommandHistory(h => [...h, raw]);
    setHistoryPos(-1);
    setInput('');
    playSFX('beep');

    const parts = raw.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    // Check if it's the expected command
    if (raw.toLowerCase() === content.expectedCommand.toLowerCase()) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < content.successOutput.length) {
          addOutput('output', content.successOutput[i]);
          i++;
        } else {
          clearInterval(interval);
          setValidated(true);
          playSFX('success');
          setTimeout(onComplete, 1500);
        }
      }, 300);
      return;
    }

    // Try builtins
    if (processBuiltin(cmd.toLowerCase(), args)) return;

    // Check for typo suggestions
    if (TYPO_SUGGESTIONS[cmd.toLowerCase()]) {
      addOutput('hint', `Did you mean '${TYPO_SUGGESTIONS[cmd.toLowerCase()]}' ?`);
      playSFX('error');
      handleError();
      return;
    }

    // Unknown command
    addOutput('error', `bash: ${cmd}: command not found`);
    playSFX('error');
    handleError();
  };

  const handleError = () => {
    const newCount = errorCount + 1;
    setErrorCount(newCount);

    if (newCount === 2 && MENTOR_MESSAGES[2]) {
      addOutput('mentor', MENTOR_MESSAGES[2]);
    } else if (newCount >= 3) {
      addOutput('hint', `💡 Indice : ${content.hint}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newPos = historyPos === -1 ? commandHistory.length - 1 : Math.max(0, historyPos - 1);
      setHistoryPos(newPos);
      setInput(commandHistory[newPos]);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPos === -1) return;
      const newPos = historyPos + 1;
      if (newPos >= commandHistory.length) {
        setHistoryPos(-1);
        setInput('');
      } else {
        setHistoryPos(newPos);
        setInput(commandHistory[newPos]);
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const dir = getCurrentDir();
      const partial = input.split(/\s+/).pop() || '';
      if (partial) {
        const match = Object.keys(dir).find(k => k.startsWith(partial));
        if (match) {
          const parts = input.split(/\s+/);
          parts[parts.length - 1] = match;
          setInput(parts.join(' '));
        }
      }
    }
  };

  const lineClass = (type: string) => {
    switch (type) {
      case 'prompt': return 'text-terminal terminal-glow';
      case 'error': return 'text-danger';
      case 'hint': return 'text-warning italic';
      case 'mentor': return 'text-primary italic';
      default: return 'text-terminal/80';
    }
  };

  return (
    <div>
      {/* Objective banner */}
      <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-3">
        <p className="font-mono text-xs text-primary">
          🎯 <span className="font-bold">SCÉNARIO :</span> {content.scenario}
        </p>
      </div>

      {/* Terminal */}
      <div className="overflow-hidden rounded-lg border border-primary/30 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-primary/20 bg-secondary px-4 py-2">
          <div className="h-3 w-3 rounded-full bg-danger/70" />
          <div className="h-3 w-3 rounded-full bg-warning/70" />
          <div className="h-3 w-3 rounded-full bg-primary/70" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">Terminal — Entraînement</span>
        </div>
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="relative h-[400px] overflow-y-auto bg-terminal-bg p-4 font-mono text-sm cursor-text"
        >
          <div className="scanline absolute inset-0" />

          {/* Welcome message */}
          {history.length === 0 && !validated && (
            <div className="text-terminal/50 mb-2">
              <p>Bienvenue. Tape <span className="text-primary">help</span> pour voir les commandes disponibles.</p>
              <p>Utilise <span className="text-primary">↑/↓</span> pour naviguer dans l'historique.</p>
            </div>
          )}

          {history.map((e, i) => (
            <div key={i} className={`mb-1 whitespace-pre-wrap ${lineClass(e.type)}`}>
              {e.text}
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
              ✓ Commande validée — Module réussi !
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
