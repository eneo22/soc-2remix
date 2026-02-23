import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

export const Ch4Scene3_ARPSpoof = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'terminal' | 'quiz' | 'done'>('intro');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [arpDone, setArpDone] = useState(false);
  const [tcpdumpDone, setTcpdumpDone] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';

    if (trimmed === 'arp -a') {
      output = '192.168.1.1   00:1A:9C:XX:XX:XX  [ether]  eth0   ← MAC SUSPECTE\n192.168.1.10  00:1A:9C:3F:22:CD  [ether]  eth0\n192.168.1.23  00:1A:9C:3F:22:EF  [ether]  eth0\n192.168.1.45  00:1A:9C:XX:XX:XX  [ether]  eth0   ← MÊME MAC !';
      setArpDone(true);
      addXP('detection', 30);
    } else if (trimmed === 'sudo tcpdump -i eth0 arp') {
      output = '02:17:33 ARP Reply 192.168.1.1 is-at 00:1A:9C:XX:XX:XX (UNSOLICITED)\n02:17:34 ARP Reply 192.168.1.1 is-at 00:1A:9C:XX:XX:XX (UNSOLICITED)\n02:17:35 ARP Reply 192.168.1.1 is-at 00:1A:9C:XX:XX:XX (UNSOLICITED)\n\n⚠ Réponses ARP non sollicitées détectées !';
      setTcpdumpDone(true);
      addXP('detection', 40);
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
          Chapitre 4 — ARP Spoofing
        </h2>

        {phase === 'intro' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-cyber-blue/30 bg-card p-4">
              <p className="font-mono text-xs text-cyber-blue mb-1">ILYAS</p>
              <p className="text-sm text-foreground/80">"Vérifions le cache ARP. Si quelqu'un se fait passer pour le routeur, on le verra là."</p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">🧠 RAPPEL — ARP SPOOFING</p>
              <div className="text-xs text-foreground/80 space-y-1">
                <p>ARP associe IP locale ↔ adresse MAC.</p>
                <p>Si une machine <span className="text-danger">ment</span> en répondant à la requête ARP :</p>
                <p>→ <span className="text-danger font-bold">ARP Spoofing</span> → Attaque Man-in-the-Middle</p>
                <p>Couche concernée : <span className="text-primary">Couche 2 — Liaison de données</span></p>
              </div>
            </div>
            <button onClick={() => setPhase('terminal')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Vérifier le cache ARP →
            </button>
          </div>
        )}

        {phase === 'terminal' && (
          <div className="space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-3">
              <p className="font-mono text-xs text-primary">🎯 OBJECTIF : {
                !arpDone ? 'Affiche le cache ARP avec arp -a' :
                !tcpdumpDone ? 'Capture le trafic ARP avec sudo tcpdump -i eth0 arp' :
                'Analyse terminée'
              }</p>
            </div>

            {arpDone && !tcpdumpDone && (
              <div className="rounded-lg border border-primary/30 bg-card p-3">
                <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
                <p className="text-xs text-foreground/80">"Cette MAC ne correspond pas au routeur officiel. Vérifie les réponses ARP avec <span className="text-primary">sudo tcpdump -i eth0 arp</span>."</p>
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

            {tcpdumpDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="rounded-lg border border-danger/30 bg-danger/5 p-3">
                  <p className="font-mono text-xs text-danger">⚠ Un équipement interne se fait passer pour le routeur !</p>
                </div>
                <button onClick={() => setPhase('quiz')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                  Comprendre l'attaque →
                </button>
              </motion.div>
            )}
          </div>
        )}

        {phase === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">QUIZ</p>
              <p className="text-sm text-foreground/80">L'ARP Spoofing permet à l'attaquant de...</p>
            </div>
            {[
              { text: 'Voler les mots de passe Wi-Fi', correct: false },
              { text: 'Intercepter tout le trafic réseau local (Man-in-the-Middle)', correct: true },
              { text: 'Désactiver le firewall', correct: false },
            ].map(opt => (
              <button
                key={opt.text}
                disabled={answered}
                onClick={() => {
                  setAnswered(true);
                  if (opt.correct) addXP('reflexion', 40);
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
            <p className="text-sm text-foreground/80">ARP Spoofing détecté. L'attaquant intercepte le trafic depuis la couche 2.</p>
            <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Continuer →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
