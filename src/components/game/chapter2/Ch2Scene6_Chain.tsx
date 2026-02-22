import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';

export const Ch2Scene6_Chain = () => {
  const { nextScene } = useGame();
  const [phase, setPhase] = useState<'intro' | 'chain' | 'done'>('intro');

  const introLines = [
    "Marcus affiche un schéma sur l'écran principal.",
    "\"Ce n'est pas de la magie. C'est une chaîne logique.\"",
    "\"Chaque étape mène à la suivante.\"",
  ];

  const chainSteps = [
    { icon: '📧', title: 'Spear-Phishing', desc: "L'attaquant envoie un email ciblé avec un faux domaine." },
    { icon: '🌐', title: 'Faux DNS', desc: "Le domaine kronos-gl0bal.com redirige vers le serveur d'Oblivion." },
    { icon: '🖥️', title: 'Site Clone', desc: "La victime croit accéder au vrai site de Kronos." },
    { icon: '🦠', title: 'Malware', desc: "Un ransomware/spyware est téléchargé silencieusement." },
    { icon: '📡', title: 'Canal C2', desc: "Le malware communique avec le serveur tous les 10 secondes." },
    { icon: '💰', title: 'Exfiltration', desc: "Les données sont volées et converties en cryptomonnaie." },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Chapitre 2 — Comprendre l'Attaque
          </h2>
          <NarrativeBlock lines={introLines} onComplete={() => setPhase('chain')} speed={25} />
        </motion.div>
      )}

      {phase === 'chain' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl w-full">
          <h3 className="font-mono text-xs text-primary mb-6 text-center terminal-glow">CHAÎNE D'ATTAQUE — KILL CHAIN</h3>
          <div className="space-y-3">
            {chainSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.4 }}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl">{step.icon}</span>
                  {i < chainSteps.length - 1 && <div className="mt-2 h-6 w-px bg-primary/30" />}
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-primary">{i + 1}. {step.title}</p>
                  <p className="text-sm text-foreground/70 mt-1">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => setPhase('done')}
            className="mt-6 w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20"
          >
            Comprendre la synthèse →
          </button>
        </motion.div>
      )}

      {phase === 'done' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <div className="rounded border border-border bg-secondary/50 p-4 text-left mb-6">
            <p className="font-bold text-primary mb-2 font-mono text-xs">📚 SYNTHÈSE PÉDAGOGIQUE</p>
            <ul className="space-y-1 text-sm text-foreground/70">
              <li>• Un <span className="text-foreground font-bold">réseau</span> connecte des machines.</li>
              <li>• Une <span className="text-foreground font-bold">IP</span> identifie une machine.</li>
              <li>• Le <span className="text-foreground font-bold">DNS</span> traduit nom → IP.</li>
              <li>• Les <span className="text-foreground font-bold">ports</span> sont des canaux de communication.</li>
              <li>• Un trafic répétitif peut indiquer un <span className="text-danger font-bold">malware</span>.</li>
            </ul>
          </div>
          <button onClick={nextScene} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
            Scène suivante →
          </button>
        </motion.div>
      )}
    </div>
  );
};
