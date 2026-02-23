import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

export const Ch4Scene5_Chain = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'chain' | 'quiz' | 'done'>('chain');
  const [answered, setAnswered] = useState(false);

  const chain = [
    { step: 1, title: 'ARP Spoofing', layer: 'Couche 2', desc: 'L\'attaquant se fait passer pour le routeur', color: 'text-danger' },
    { step: 2, title: 'Interception du trafic', layer: 'Couche 2-3', desc: 'Tout le trafic local passe par la machine attaquante', color: 'text-warning' },
    { step: 3, title: 'Redirection DNS', layer: 'Couche 7', desc: 'Les requêtes DNS sont falsifiées', color: 'text-warning' },
    { step: 4, title: 'Tunnel HTTPS vers serveur externe', layer: 'Couche 4 + 3', desc: 'Les données sont exfiltrées via un tunnel chiffré', color: 'text-danger' },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full">
        <h2 className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
          Chapitre 4 — Chaîne d'Attaque
        </h2>

        {phase === 'chain' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
              <p className="text-sm text-foreground/80">"Reconstruis la chaîne. Comprends comment chaque couche a été exploitée."</p>
            </div>

            <div className="space-y-3">
              {chain.map((c, i) => (
                <motion.div
                  key={c.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.5 }}
                  className="rounded border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-bold text-primary">
                      {c.step}
                    </div>
                    <div>
                      <p className={`font-mono text-sm font-bold ${c.color}`}>{c.title}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{c.layer}</p>
                      <p className="text-xs text-foreground/70 mt-1">{c.desc}</p>
                    </div>
                  </div>
                  {i < chain.length - 1 && <div className="ml-4 mt-2 h-4 w-px bg-primary/30" />}
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
              <button onClick={() => setPhase('quiz')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                Question de validation →
              </button>
            </motion.div>
          </div>
        )}

        {phase === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">QUIZ</p>
              <p className="text-sm text-foreground/80">Pourquoi HTTPS ne protège-t-il pas totalement ici ?</p>
            </div>
            {[
              { text: 'HTTPS est trop lent', correct: false },
              { text: 'L\'attaquant a un certificat valide', correct: false },
              { text: 'Le DNS redirige vers un faux serveur avant que HTTPS ne s\'établisse', correct: true },
            ].map(opt => (
              <button
                key={opt.text}
                disabled={answered}
                onClick={() => {
                  setAnswered(true);
                  if (opt.correct) addXP('reflexion', 50);
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
            <p className="text-sm text-foreground/80">La chaîne d'attaque est claire. Il faut maintenant isoler la machine malveillante.</p>
            <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Isoler la menace →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
