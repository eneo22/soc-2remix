import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';

export const Ch3Scene2_Physical = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'terminal' | 'fix' | 'done'>('intro');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [pingDone, setPingDone] = useState(false);
  const [ipaDone, setIpaDone] = useState(false);
  const [fixed, setFixed] = useState(false);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    if (trimmed === 'ping 192.168.1.10') {
      output = fixed
        ? 'PING 192.168.1.10: 64 bytes from 192.168.1.10: icmp_seq=1 ttl=64 time=1ms\n--- 3 packets transmitted, 3 received, 0% packet loss'
        : 'PING 192.168.1.10: Destination host unreachable';
      if (!fixed) setPingDone(true);
      else { addXP('technical', 40); setPhase('done'); }
    } else if (trimmed === 'ip a' || trimmed === 'ip addr') {
      output = fixed
        ? 'eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n    inet 192.168.1.50/24'
        : 'eth0: <BROADCAST,MULTICAST> mtu 1500\n    state DOWN';
      setIpaDone(true);
    } else if (trimmed === 'sudo ip link set eth0 up') {
      if (!fixed) {
        output = '[OK] Interface eth0 activée.';
        setFixed(true);
        addXP('technical', 30);
      } else {
        output = 'Interface déjà active.';
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
          Chapitre 3 — Scène 2
        </h2>

        {phase === 'intro' && (
          <div className="space-y-4">
            <NarrativeBlock
              lines={[
                "Marcus te tend une console.",
                "\"Commence par le bas. Vérifie si le serveur intranet répond.\"",
              ]}
              speed={30}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
              <button onClick={() => setPhase('terminal')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                Ouvrir le terminal →
              </button>
            </motion.div>
          </div>
        )}

        {(phase === 'terminal' || phase === 'fix') && (
          <div className="space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-3">
              <p className="font-mono text-xs text-primary">🎯 OBJECTIF : {
                !pingDone ? 'Teste la connectivité avec ping 192.168.1.10' :
                !ipaDone ? 'Vérifie l\'interface réseau avec ip a' :
                !fixed ? 'Active l\'interface : sudo ip link set eth0 up' :
                'Reteste avec ping 192.168.1.10'
              }</p>
            </div>

            {pingDone && !ipaDone && (
              <div className="rounded-lg border border-primary/30 bg-card p-3">
                <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
                <p className="text-xs text-foreground/80">"Destination unreachable. Vérifie l'état de l'interface avec <span className="text-primary">ip a</span>."</p>
              </div>
            )}

            {ipaDone && !fixed && (
              <div className="rounded-lg border border-primary/30 bg-card p-3">
                <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
                <p className="text-xs text-foreground/80">"L'interface est DOWN. Active-la avec <span className="text-primary">sudo ip link set eth0 up</span>."</p>
              </div>
            )}

            {fixed && (
              <div className="rounded-lg border border-primary/30 bg-card p-3">
                <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
                <p className="text-xs text-foreground/80">"Bien. Maintenant reteste avec <span className="text-primary">ping 192.168.1.10</span>."</p>
              </div>
            )}

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

        {phase === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-center">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
              <p className="text-sm text-foreground/80">
                "Si aucun paquet ne sort, on suspecte le câble, le switch ou l'IP mal configurée. Tu viens de résoudre un problème de <span className="text-primary font-bold">Couche 1/3</span>."
              </p>
            </div>
            <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Continuer →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
