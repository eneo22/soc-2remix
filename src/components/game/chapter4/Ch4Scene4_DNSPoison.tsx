import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

export const Ch4Scene4_DNSPoison = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'terminal' | 'done'>('intro');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [localDone, setLocalDone] = useState(false);
  const [externalDone, setExternalDone] = useState(false);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    if (trimmed === 'nslookup secure-backup.local') {
      output = 'Server: 192.168.1.1\nAddress: 192.168.1.1#53\n\nName: secure-backup.local\nAddress: 192.168.1.45   ← IP INTERNE INATTENDUE';
      setLocalDone(true);
      addXP('detection', 30);
    } else if (trimmed === 'nslookup secure-backup.local 8.8.8.8') {
      output = 'Server: 8.8.8.8\nAddress: 8.8.8.8#53\n\nName: secure-backup.local\nAddress: 10.50.0.12   ← IP DIFFÉRENTE !';
      setExternalDone(true);
      addXP('detection', 30);
      addXP('analytical', 30);
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
          Chapitre 4 — DNS Poisoning
        </h2>

        {phase === 'intro' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-warning/30 bg-card p-4">
              <p className="font-mono text-xs text-warning mb-1">NORA</p>
              <p className="text-sm text-foreground/80">"Si quelqu'un intercepte le trafic... il peut aussi rediriger le DNS."</p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">🧠 DNS POISONING</p>
              <div className="text-xs text-foreground/80 space-y-1">
                <p>Si l'attaquant contrôle le trafic (via ARP Spoofing), il peut falsifier les réponses DNS.</p>
                <p>Résultat : les utilisateurs sont redirigés vers un faux serveur sans le savoir.</p>
                <p>Couche 7 (Application), mais rendu possible par la couche 2 compromise.</p>
              </div>
            </div>
            <button onClick={() => setPhase('terminal')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Vérifier le DNS →
            </button>
          </div>
        )}

        {phase === 'terminal' && (
          <div className="space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-3">
              <p className="font-mono text-xs text-primary">🎯 OBJECTIF : {
                !localDone ? 'Résous secure-backup.local : nslookup secure-backup.local' :
                !externalDone ? 'Compare avec un DNS externe : nslookup secure-backup.local 8.8.8.8' :
                'DNS Poisoning confirmé !'
              }</p>
            </div>

            {localDone && !externalDone && (
              <div className="rounded-lg border border-warning/30 bg-card p-3">
                <p className="font-mono text-xs text-warning mb-1">NORA</p>
                <p className="text-xs text-foreground/80">"Cette IP ne devrait pas pointer vers un poste interne. Compare avec un DNS externe : <span className="text-primary">nslookup secure-backup.local 8.8.8.8</span>"</p>
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

            {externalDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="rounded-lg border border-danger/30 bg-danger/5 p-3">
                  <p className="font-mono text-xs text-danger">⚠ DNS POISONING CONFIRMÉ</p>
                  <p className="text-xs text-foreground/70 mt-1">Le DNS local renvoie 192.168.1.45 au lieu de 10.50.0.12. Le trafic est redirigé.</p>
                </div>
                <button onClick={() => setPhase('done')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                  Comprendre la chaîne d'attaque →
                </button>
              </motion.div>
            )}
          </div>
        )}

        {phase === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
            <p className="text-sm text-foreground/80">DNS Poisoning détecté. L'attaquant redirige le trafic vers sa propre machine.</p>
            <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Reconstruire la chaîne d'attaque →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
