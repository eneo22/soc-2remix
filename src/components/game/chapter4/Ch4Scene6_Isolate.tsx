import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

export const Ch4Scene6_Isolate = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'terminal' | 'resolve' | 'done'>('terminal');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [nmapDone, setNmapDone] = useState(false);
  const [flushed, setFlushed] = useState(false);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    if (trimmed === 'nmap -sn 192.168.1.0/24') {
      output = 'Nmap scan report for 192.168.1.1 (router)\nMAC: 00:1A:9C:3F:22:01\n\nNmap scan report for 192.168.1.10 (intranet)\nMAC: 00:1A:9C:3F:22:CD\n\nNmap scan report for 192.168.1.23 (valeria-pc)\nMAC: 00:1A:9C:3F:22:EF\n\nNmap scan report for 192.168.1.45 (UNKNOWN)\nMAC: 00:1A:9C:XX:XX:XX   ← CORRESPONDANCE MAC SUSPECTE\n\nNmap done: 4 hosts up';
      setNmapDone(true);
      addXP('technical', 40);
    } else if (trimmed === 'sudo ip neigh flush all') {
      output = '[OK] Cache ARP vidé.\n[OK] Trafic sortant vers 185.193.XX.XX : ARRÊTÉ';
      setFlushed(true);
      addXP('technical', 30);
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
          Chapitre 4 — Isolation
        </h2>

        {phase === 'terminal' && (
          <div className="space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-3">
              <p className="font-mono text-xs text-primary">🎯 OBJECTIF : {
                !nmapDone ? 'Scanne le réseau : nmap -sn 192.168.1.0/24' :
                !flushed ? 'Vide le cache ARP : sudo ip neigh flush all' :
                'Menace isolée !'
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

            {nmapDone && !flushed && (
              <div className="rounded-lg border border-primary/30 bg-card p-3">
                <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
                <p className="text-xs text-foreground/80">"Machine 192.168.1.45. C'est elle. Bloque la MAC sur le switch et vide le cache ARP."</p>
              </div>
            )}

            {flushed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button onClick={() => setPhase('resolve')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                  Résolution →
                </button>
              </motion.div>
            )}
          </div>
        )}

        {phase === 'resolve' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">✓ MENACE ISOLÉE</p>
              <p className="text-sm text-foreground/80">La machine 192.168.1.45 a été identifiée et bloquée. Le trafic sortant suspect est arrêté.</p>
            </div>

            <div className="rounded-lg border border-warning/30 bg-card p-4">
              <p className="font-mono text-xs text-warning mb-1">NORA</p>
              <p className="text-sm text-foreground/80">"La machine appartient à un poste interne récemment installé. Ou quelqu'un est entré physiquement... ou quelqu'un ici savait exactement quoi faire."</p>
            </div>

            <div className="rounded-lg border border-cyber-blue/30 bg-card p-4">
              <p className="font-mono text-xs text-cyber-blue mb-1">ILYAS</p>
              <p className="text-sm text-foreground/80">"Quelqu'un a testé notre architecture."</p>
            </div>

            <div className="rounded-lg border border-warning/30 bg-card p-4">
              <p className="font-mono text-xs text-warning mb-1">NORA</p>
              <p className="text-sm text-foreground/80 italic">"Et maintenant ils savent qu'on les a vus."</p>
            </div>

            <button onClick={() => setPhase('done')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Continuer →
            </button>
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Conclusion du chapitre →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
