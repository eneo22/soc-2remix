import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';

export const Ch3Scene7_Conclusion = () => {
  const { state, goToScene, completeChapter } = useGame();
  const totalXP = Object.values(state.xp).reduce((a, b) => a + b, 0);

  const handleContinue = (target: number) => {
    completeChapter(3);
    goToScene(target);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="max-w-2xl w-full">
        <h2 className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
          Chapitre 3 — Conclusion
        </h2>

        <div className="space-y-4 mb-8">
          <NarrativeBlock
            lines={[
              "Marcus regarde le tableau de bord.",
              "Tous les services sont restaurés.",
            ]}
            speed={30}
          />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="rounded-lg border border-primary/30 bg-card p-4">
            <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
            <p className="text-sm text-foreground/80">
              "Un réseau ne tombe jamais en panne au hasard. Chaque problème vit dans une couche. 
              Si tu penses en couches, tu gagnes."
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }} className="rounded-lg border border-danger/30 bg-danger/5 p-4 text-center">
            <p className="font-mono text-xs text-danger">⚠ ALERTE</p>
            <p className="text-sm text-danger/80 mt-1">External scan detected from 185.193.XX.XX</p>
            <p className="text-xs text-muted-foreground mt-2 italic">L'attaque ne faisait que commencer...</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 7 }} className="rounded-xl border border-primary/50 bg-card p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 7.5, type: 'spring' }} className="mb-4 inline-block rounded-full border-2 border-primary bg-primary/10 p-4">
            <span className="text-3xl">🧬</span>
          </motion.div>
          <h3 className="mb-2 font-mono text-lg font-bold text-primary terminal-glow">CHAPITRE 3 TERMINÉ</h3>
          <p className="mb-6 text-sm text-muted-foreground">Les Couches Invisibles</p>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {[
              { label: 'Technique', value: state.xp.technical, icon: '⚡' },
              { label: 'Analytique', value: state.xp.analytical, icon: '🔍' },
              { label: 'Réflexion', value: state.xp.reflexion, icon: '🧠' },
              { label: 'Détection', value: state.xp.detection, icon: '🎯' },
            ].map((cat) => (
              <div key={cat.label} className="rounded border border-border bg-secondary/50 p-3">
                <p className="text-lg">{cat.icon}</p>
                <p className="font-mono text-xs text-muted-foreground">{cat.label}</p>
                <p className="font-mono text-sm font-bold text-primary">+{cat.value} XP</p>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded border border-primary/20 bg-primary/5 p-4">
            <p className="font-mono text-2xl font-bold text-primary terminal-glow">{totalXP} XP Total</p>
          </div>

          <div className="mb-6 rounded border border-border bg-secondary/50 p-4 text-left">
            <p className="mb-2 font-mono text-xs font-bold text-primary">📚 Compétences débloquées</p>
            <ul className="space-y-1 text-sm text-foreground/70">
              <li>✓ Modèle OSI (7 couches)</li>
              <li>✓ Modèle TCP/IP (4 couches)</li>
              <li>✓ ARP — Address Resolution Protocol</li>
              <li>✓ Diagnostic multi-couches</li>
              <li>✓ nslookup, telnet, ip a</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleContinue(20)}
              className="flex-1 rounded-lg border border-primary bg-primary/10 px-6 py-4 font-mono text-sm text-primary transition-all hover:bg-primary/20"
            >
              ▶ CHAPITRE 4
            </button>
            <button
              onClick={() => handleContinue(-1)}
              className="flex-1 rounded-lg border border-border bg-secondary px-6 py-4 font-mono text-sm text-muted-foreground transition-all hover:text-foreground hover:border-primary/30"
            >
              ← ACCUEIL
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
