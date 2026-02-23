import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

export const Ch3Scene5_Transport = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'terminal' | 'done'>('intro');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [telnetDone, setTelnetDone] = useState(false);
  const [statusDone, setStatusDone] = useState(false);
  const [started, setStarted] = useState(false);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    if (trimmed === 'telnet 192.168.1.10 80') {
      if (started) {
        output = 'Trying 192.168.1.10...\nConnected to 192.168.1.10.\nEscape character is \'^]\'.\n\nConnexion réussie !';
        addXP('technical', 40);
        setTimeout(() => setPhase('done'), 1500);
      } else {
        output = 'Trying 192.168.1.10...\ntelnet: Unable to connect to remote host: Connection refused';
        setTelnetDone(true);
      }
    } else if (trimmed === 'sudo systemctl status apache2') {
      output = '● apache2.service - Apache HTTP Server\n   Loaded: loaded\n   Active: inactive (dead)';
      setStatusDone(true);
    } else if (trimmed === 'sudo systemctl start apache2') {
      output = '[OK] apache2.service started.';
      setStarted(true);
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
          Chapitre 3 — Couche Transport
        </h2>

        {phase === 'intro' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
              <p className="text-sm text-foreground/80">
                "Le DNS fonctionne. Mais le site reste inaccessible. Ici, on parle <span className="text-primary font-bold">transport</span>.
                Couche 4 — TCP/UDP. Si le port est fermé, le service n'écoute pas."
              </p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">🧠 COUCHE 4 — TRANSPORT</p>
              <div className="text-xs text-foreground/80 space-y-1">
                <p><span className="text-primary">TCP</span> — garantit la livraison des paquets (connexion fiable)</p>
                <p><span className="text-primary">UDP</span> — plus rapide, sans garantie (streaming, DNS)</p>
                <p><span className="text-primary">telnet</span> — permet de tester si un port est ouvert</p>
              </div>
            </div>
            <button onClick={() => setPhase('terminal')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Diagnostiquer →
            </button>
          </div>
        )}

        {phase === 'terminal' && (
          <div className="space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-3">
              <p className="font-mono text-xs text-primary">🎯 OBJECTIF : {
                !telnetDone ? 'Teste le port 80 avec telnet 192.168.1.10 80' :
                !statusDone ? 'Vérifie le service avec sudo systemctl status apache2' :
                !started ? 'Démarre le service avec sudo systemctl start apache2' :
                'Reteste avec telnet 192.168.1.10 80'
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

        {phase === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">✓ SERVICE RÉTABLI</p>
              <p className="text-sm text-foreground/80">Le port 80 est de nouveau ouvert. Le site intranet est accessible.</p>
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
