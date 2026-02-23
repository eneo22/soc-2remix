import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';

export const Ch3Scene4_DNS = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'terminal' | 'fix' | 'done'>('intro');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [nslookupDone, setNslookupDone] = useState(false);
  const [catDone, setCatDone] = useState(false);
  const [dnsFixed, setDnsFixed] = useState(false);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    if (trimmed === 'nslookup intranet.local') {
      if (dnsFixed) {
        output = 'Server: 8.8.8.8\nAddress: 8.8.8.8#53\n\nName: intranet.local\nAddress: 192.168.1.10';
        addXP('technical', 40);
        setTimeout(() => setPhase('done'), 1500);
      } else {
        output = 'Server: 8.8.8.8\nAddress: 8.8.8.8#53\n\n** server can\'t find intranet.local: NXDOMAIN';
        setNslookupDone(true);
      }
    } else if (trimmed === 'cat /etc/resolv.conf') {
      output = dnsFixed
        ? 'nameserver 192.168.1.1'
        : 'nameserver 10.255.255.1  # <- serveur DNS incorrect';
      setCatDone(true);
    } else if (trimmed.includes('echo') && trimmed.includes('resolv.conf') || trimmed === 'fix-dns') {
      output = '[OK] Serveur DNS mis à jour : 192.168.1.1';
      setDnsFixed(true);
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
          Chapitre 3 — Problème DNS
        </h2>

        {phase === 'intro' && (
          <div className="space-y-4">
            <NarrativeBlock
              lines={[
                "Nouvelle alerte sur l'écran.",
                "Le serveur intranet est toujours injoignable par son nom.",
              ]}
              speed={30}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
              <p className="text-sm text-foreground/80">"Maintenant on monte dans les couches. Le DNS traduit les noms en adresses IP. Si le DNS est cassé, le nom ne veut plus rien dire."</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }} className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">🧠 NSLOOKUP</p>
              <p className="text-xs text-foreground/80">
                <span className="text-primary">nslookup</span> interroge un serveur DNS pour résoudre un nom de domaine en adresse IP.
                Si le résultat est <span className="text-danger">NXDOMAIN</span>, le domaine n'existe pas ou le DNS est mal configuré.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }}>
              <button onClick={() => setPhase('terminal')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                Diagnostiquer →
              </button>
            </motion.div>
          </div>
        )}

        {(phase === 'terminal' || phase === 'fix') && (
          <div className="space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-3">
              <p className="font-mono text-xs text-primary">🎯 OBJECTIF : {
                !nslookupDone ? 'Teste le DNS avec nslookup intranet.local' :
                !catDone ? 'Vérifie la config DNS avec cat /etc/resolv.conf' :
                !dnsFixed ? 'Corrige le DNS (tape fix-dns)' :
                'Reteste avec nslookup intranet.local'
              }</p>
            </div>

            {nslookupDone && !catDone && (
              <div className="rounded-lg border border-primary/30 bg-card p-3">
                <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
                <p className="text-xs text-foreground/80">"NXDOMAIN. Le DNS ne connaît pas ce domaine. Vérifie la config avec <span className="text-primary">cat /etc/resolv.conf</span>."</p>
              </div>
            )}

            {catDone && !dnsFixed && (
              <div className="rounded-lg border border-primary/30 bg-card p-3">
                <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
                <p className="text-xs text-foreground/80">"Le serveur DNS est incorrect. Corrige-le — tape <span className="text-primary">fix-dns</span>."</p>
              </div>
            )}

            {dnsFixed && (
              <div className="rounded-lg border border-primary/30 bg-card p-3">
                <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
                <p className="text-xs text-foreground/80">"Bien. Reteste avec <span className="text-primary">nslookup intranet.local</span>."</p>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">✓ PROBLÈME DNS RÉSOLU</p>
              <p className="text-sm text-foreground/80">Le domaine est maintenant résolu correctement. Couche 7 — Application (DNS).</p>
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
