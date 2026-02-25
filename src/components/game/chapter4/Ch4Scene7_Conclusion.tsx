import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { NarrativeBlock } from '../Typewriter';
import { DialogBox } from '../DialogBox';

export const Ch4Scene7_Conclusion = () => {
  const { state, goToScene, completeChapter } = useGame();
  const { playSFX } = useAudio();
  const totalXP = Object.values(state.xp).reduce((a, b) => a + b, 0);

  const handleFinish = (target: number) => {
    playSFX('transition');
    completeChapter(4);
    goToScene(target);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="max-w-2xl w-full">
        <h2 className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
          Chapitre 4 — Conclusion
        </h2>

        <div className="space-y-4 mb-8">
          <NarrativeBlock lines={["Le silence retombe sur le SOC.", "La menace a été contenue. Mais le doute persiste."]} speed={30} />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
            <DialogBox character="marcus">
              <p>"Un réseau, ce n'est pas un câble. C'est une superposition de couches. Si une seule ment, <span className="text-danger font-bold">tout ment</span>."</p>
            </DialogBox>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }}>
            <DialogBox character="oblivion">
              <p className="glitch-text">"Vous avez colmaté une fissure. Le barrage est toujours fragile."</p>
            </DialogBox>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6.5 }} className="rounded-lg border border-danger/30 bg-danger/5 p-4 text-center">
            <p className="font-mono text-xs text-danger">⚠ NOUVELLE ALERTE</p>
            <p className="text-sm text-danger/80 mt-1">External scan detected from 185.193.XX.XX</p>
            <p className="text-xs text-muted-foreground mt-2 italic">L'attaque ne faisait que commencer...</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 8 }} className="rounded-xl border border-primary/50 bg-card p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 8.5, type: 'spring' }} className="mb-4 inline-block rounded-full border-2 border-primary bg-primary/10 p-4">
            <span className="text-3xl">🕸️</span>
          </motion.div>
          <h3 className="mb-2 font-mono text-lg font-bold text-primary terminal-glow">CHAPITRE 4 TERMINÉ</h3>
          <p className="mb-6 text-sm text-muted-foreground">Les Couches du Mensonge</p>

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
              <li>✓ Analyse multi-couches avancée</li>
              <li>✓ Détection ARP Spoofing</li>
              <li>✓ Détection DNS Poisoning</li>
              <li>✓ Cartographie de chaîne d'attaque</li>
              <li>✓ netstat, tcpdump, nmap</li>
            </ul>
          </div>

          <div className="mb-4 rounded border border-border bg-secondary/50 p-4 text-left">
            <p className="mb-2 font-mono text-xs font-bold text-muted-foreground">🧑‍🤝‍🧑 Nouveaux alliés</p>
            <div className="flex gap-3">
              <div className="flex-1 rounded border border-cyber-blue/20 p-2 text-center">
                <p className="font-mono text-xs text-cyber-blue">Ilyas</p>
                <p className="text-[10px] text-muted-foreground">Ingénieur réseau</p>
              </div>
              <div className="flex-1 rounded border border-warning/20 p-2 text-center">
                <p className="font-mono text-xs text-warning">Nora</p>
                <p className="text-[10px] text-muted-foreground">Threat intel</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleFinish(100)} className="flex-1 rounded-lg border border-primary bg-primary/10 px-6 py-4 font-mono text-sm text-primary transition-all hover:bg-primary/20">
              🏋️ ENTRAÎNEMENT
            </button>
            <button onClick={() => handleFinish(-1)} className="flex-1 rounded-lg border border-border bg-secondary px-6 py-4 font-mono text-sm text-muted-foreground transition-all hover:text-foreground hover:border-primary/30">
              ← ACCUEIL
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
