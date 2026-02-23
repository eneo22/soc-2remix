import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

export const Ch4Scene2_Netstat = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'terminal' | 'quiz' | 'doubt' | 'done'>('terminal');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [netstatDone, setNetstatDone] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    if (trimmed === 'netstat -tunap') {
      output = 'Proto  Local Address        Foreign Address        State       PID/Program\ntcp    192.168.1.23:49832   185.193.42.17:443      ESTABLISHED 4521/svchost\ntcp    192.168.1.10:80      192.168.1.50:52341     ESTABLISHED 1024/apache2\nudp    192.168.1.1:53       0.0.0.0:*                          892/dnsmasq';
      setNetstatDone(true);
      addXP('detection', 30);
    } else {
      output = `bash: ${cmd.trim().split(' ')[0]}: command not found`;
    }

    setHistory(h => [...h, { cmd, output }]);
    setInput('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full">
        <h2 className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
          Chapitre 4 — Analyse OSI
        </h2>

        {phase === 'terminal' && (
          <div className="space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-3">
              <p className="font-mono text-xs text-primary">🎯 OBJECTIF : Liste les connexions actives avec netstat -tunap</p>
            </div>

            <div className="rounded-lg border border-border bg-[hsl(var(--terminal-bg))] p-4 font-mono text-xs">
              <div className="max-h-60 overflow-y-auto space-y-1 mb-2">
                {history.map((h, i) => (
                  <div key={i}>
                    <p className="text-primary">kronos@soc:~$ {h.cmd}</p>
                    <pre className="text-foreground/70 whitespace-pre-wrap">{h.output}</pre>
                  </div>
                ))}
              </div>
              <div className="flex items-center">
                <span className="text-primary mr-2">kronos@soc:~$</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && input.trim() && handleCommand(input)}
                  className="flex-1 bg-transparent text-foreground outline-none"
                  autoFocus
                />
              </div>
            </div>

            {netstatDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button onClick={() => setPhase('quiz')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                  Analyser les résultats →
                </button>
              </motion.div>
            )}
          </div>
        )}

        {phase === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">QUIZ</p>
              <p className="text-sm text-foreground/80">À quelle couche OSI correspond HTTPS (port 443) ?</p>
            </div>
            {[
              { text: 'Couche 3 — Réseau', correct: false },
              { text: 'Couche 4 — Transport (TCP)', correct: false },
              { text: 'Couche 7 — Application', correct: true },
              { text: 'Couche 2 — Liaison', correct: false },
            ].map(opt => (
              <button
                key={opt.text}
                disabled={answered}
                onClick={() => {
                  setAnswered(true);
                  if (opt.correct) addXP('analytical', 30);
                  setTimeout(() => setPhase('doubt'), 1500);
                }}
                className={`w-full rounded border p-3 text-left font-mono text-xs transition-all ${
                  answered
                    ? opt.correct ? 'border-primary bg-primary/20 text-primary' : 'border-border bg-muted/20 text-muted-foreground'
                    : 'border-border bg-card hover:border-primary/30 text-foreground'
                }`}
              >
                {opt.text}
              </button>
            ))}
            <div className="rounded-lg border border-cyber-blue/30 bg-card p-3">
              <p className="font-mono text-xs text-cyber-blue mb-1">ILYAS</p>
              <p className="text-xs text-foreground/80">"Ne reste pas en surface. Si le trafic est chiffré, tu ne vois rien en couche 7."</p>
            </div>
          </motion.div>
        )}

        {phase === 'doubt' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-warning/30 bg-card p-4">
              <p className="font-mono text-xs text-warning mb-1">NORA</p>
              <p className="text-sm text-foreground/80">
                "Et si ce trafic était légitime ? Une mise à jour automatique ? Un backup cloud ?"
              </p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">🧠 LEÇON</p>
              <p className="text-xs text-foreground/80">Ne jamais conclure trop vite. Un bon analyste doute, vérifie, et confirme.</p>
            </div>
            <button onClick={nextScene} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Approfondir l'enquête →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
