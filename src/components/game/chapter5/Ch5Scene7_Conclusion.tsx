import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { NarrativeBlock } from '../Typewriter';
import { DialogBox } from '../DialogBox';

export const Ch5Scene7_Conclusion = () => {
  const { state, goToScene, completeChapter, unlockSkill } = useGame();
  const { playSFX } = useAudio();
  const totalXP = Object.values(state.xp).reduce((a, b) => a + b, 0);

  const handleFinish = (target: number) => {
    playSFX('transition');
    unlockSkill('layered_investigation_mastery');
    unlockSkill('log_correlation');
    unlockSkill('multi_incident_analysis');
    unlockSkill('transport_layer_deep');
    completeChapter(5);
    goToScene(target);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="max-w-2xl w-full">
        <h2 className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-danger terminal-glow">
          Chapitre 5 — Conclusion
        </h2>

        <div className="space-y-4 mb-8">
          <NarrativeBlock lines={["Le SOC est plongé dans un silence pesant.", "La confiance se fissure."]} speed={30} />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
            <DialogBox character="marcus">
              <p>"Ce n'est plus un incident."</p>
              <p className="mt-1">"C'est une <span className="text-danger font-bold">infiltration</span>."</p>
            </DialogBox>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5 }}
            className="rounded-lg border border-danger/50 bg-danger/5 p-4 font-mono text-xs space-y-2">
            <p className="text-danger animate-pulse">Multiple failed SSH attempts detected across 5 internal machines</p>
            <p className="text-warning">Privilege escalation attempt detected.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6 }}>
            <DialogBox character="oblivion">
              <p className="glitch-text">"Vous pensiez m'avoir arrêté. Mais j'étais déjà à l'intérieur."</p>
            </DialogBox>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 8 }} className="rounded-xl border border-danger/50 bg-card p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 8.5, type: 'spring' }} className="mb-4 inline-block rounded-full border-2 border-danger bg-danger/10 p-4">
            <span className="text-3xl">🕵️</span>
          </motion.div>
          <h3 className="mb-2 font-mono text-lg font-bold text-danger terminal-glow">CHAPITRE 5 TERMINÉ</h3>
          <p className="mb-6 text-sm text-muted-foreground">L'Ombre Persistante</p>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {[
              { label: 'Technique', value: state.xp.technical, icon: '⚡' },
              { label: 'Analytique', value: state.xp.analytical, icon: '🔍' },
              { label: 'Réflexion', value: state.xp.reflexion, icon: '🧠' },
              { label: 'Détection', value: state.xp.detection, icon: '🎯' },
            ].map(cat => (
              <div key={cat.label} className="rounded border border-border bg-secondary/50 p-3">
                <p className="text-lg">{cat.icon}</p>
                <p className="font-mono text-xs text-muted-foreground">{cat.label}</p>
                <p className="font-mono text-sm font-bold text-primary">+{cat.value} XP</p>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded border border-danger/20 bg-danger/5 p-4">
            <p className="font-mono text-2xl font-bold text-danger terminal-glow">{totalXP} XP Total</p>
          </div>

          <div className="mb-6 rounded border border-border bg-secondary/50 p-4 text-left">
            <p className="mb-2 font-mono text-xs font-bold text-primary">📚 Compétences débloquées</p>
            <ul className="space-y-1 text-sm text-foreground/70">
              <li>✓ Investigation multi-couches maîtrisée</li>
              <li>✓ Corrélation de logs</li>
              <li>✓ Analyse multi-incidents</li>
              <li>✓ Compréhension approfondie couche Transport</li>
              <li>✓ Détection de persistance</li>
            </ul>
          </div>

          <div className="mb-6 rounded border border-danger/20 bg-danger/5 p-4 text-left">
            <p className="mb-2 font-mono text-xs font-bold text-danger">🔮 État narratif</p>
            <ul className="space-y-1 text-xs text-foreground/70">
              <li>• L'attaquant est persistant et connaît l'architecture</li>
              <li>• L'incident précédent était peut-être un leurre</li>
              <li>• Compromission latérale confirmée</li>
              <li>• Compte interne réactivé — suspicion interne</li>
              <li>• La confiance au sein du SOC se fissure</li>
            </ul>
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
