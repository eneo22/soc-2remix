import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';

export const Ch3Scene3_ARP = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'terminal' | 'quiz' | 'done'>('intro');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [arpDone, setArpDone] = useState(false);
  const [flushDone, setFlushDone] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    if (trimmed === 'arp -a') {
      output = '192.168.1.1   00:1A:9C:3F:22:AB  [ether]  eth0\n192.168.1.10  00:1A:9C:3F:22:CD  [ether]  eth0\n192.168.1.23  00:1A:9C:3F:22:EF  [ether]  eth0';
      setArpDone(true);
    } else if (trimmed === 'sudo ip neigh flush all') {
      output = '[OK] Cache ARP vidé.';
      setFlushDone(true);
      addXP('technical', 25);
    } else if (trimmed.startsWith('ping')) {
      output = flushDone
        ? 'PING: 64 bytes from target: icmp_seq=1 ttl=64 time=1ms'
        : 'PING: 64 bytes from target: icmp_seq=1 ttl=64 time=2ms';
      if (flushDone) {
        addXP('technical', 15);
        setTimeout(() => setPhase('quiz'), 1000);
      }
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
          Chapitre 3 — ARP
        </h2>

        {phase === 'intro' && (
          <div className="space-y-4">
            <NarrativeBlock
              lines={[
                "Marcus reprend la parole.",
                "\"Mais comment une machine trouve-t-elle l'adresse MAC correspondant à une IP locale ?\"",
              ]}
              speed={30}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">🧠 ARP — Address Resolution Protocol</p>
              <div className="text-xs text-foreground/80 space-y-1">
                <p>Quand une machine veut envoyer un paquet à une IP locale :</p>
                <p>1. Elle regarde son <span className="text-primary">cache ARP</span></p>
                <p>2. Si l'adresse MAC n'est pas connue, elle envoie une requête ARP en broadcast : <span className="text-primary">"Qui a 192.168.1.10 ?"</span></p>
                <p>3. La machine cible répond avec son adresse MAC</p>
                <p>4. L'information est stockée temporairement</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }}>
              <button onClick={() => setPhase('terminal')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                Ouvrir le terminal →
              </button>
            </motion.div>
          </div>
        )}

        {phase === 'terminal' && (
          <div className="space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-3">
              <p className="font-mono text-xs text-primary">🎯 OBJECTIF : {
                !arpDone ? 'Affiche le cache ARP avec arp -a' :
                !flushDone ? 'Vide le cache ARP avec sudo ip neigh flush all' :
                'Teste avec ping pour observer la nouvelle entrée ARP'
              }</p>
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
          </div>
        )}

        {phase === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">QUIZ</p>
              <p className="text-sm text-foreground/80">Pourquoi ARP fonctionne uniquement sur un réseau local ?</p>
            </div>
            {[
              { text: 'Parce qu\'il est trop lent pour Internet', correct: false },
              { text: 'Parce qu\'il utilise le broadcast', correct: true },
              { text: 'Parce qu\'il nécessite un serveur DNS', correct: false },
            ].map((opt) => (
              <button
                key={opt.text}
                disabled={answered}
                onClick={() => {
                  setAnswered(true);
                  if (opt.correct) addXP('reflexion', 30);
                  setTimeout(() => setPhase('done'), 1500);
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
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
            <p className="text-sm text-foreground/80">ARP utilise le broadcast, limité au réseau local. Au-delà, c'est le routeur qui prend le relais.</p>
            <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Continuer →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
