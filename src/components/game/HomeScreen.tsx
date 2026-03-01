import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';

export const HomeScreen = () => {
  const { state, goToScene, resetGame } = useGame();
  const { playBGM, playSFX } = useAudio();
  const totalXP = Object.values(state.xp).reduce((a, b) => a + b, 0);
  const hasSave = state.completedChapters.length > 0 || totalXP > 0;

  useEffect(() => { playBGM('menu'); }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg w-full">
        <motion.h1
          className="mb-2 font-mono text-4xl md:text-6xl font-bold text-primary terminal-glow"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          SOC ASCENSION
        </motion.h1>
        <p className="mb-1 text-sm text-muted-foreground">Apprends la cybersécurité. Vis l'aventure.</p>

        {hasSave && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 mb-6 rounded border border-primary/20 bg-primary/5 p-3">
            <p className="font-mono text-xs text-primary">{totalXP} XP • {state.completedChapters.length} chapitre(s) terminé(s)</p>
          </motion.div>
        )}

        <div className="mt-8 space-y-3">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => { goToScene(-2); playSFX('click'); }}
            className="w-full rounded-lg border border-primary bg-primary/10 px-8 py-4 font-mono text-sm text-primary transition-all hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10"
          >
            <span className="text-lg">📖</span>
            <span className="ml-3">MODE HISTOIRE</span>
            <p className="mt-1 text-xs text-muted-foreground font-sans">Suis la narration et apprends en situation réelle</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => { goToScene(100); playSFX('click'); }}
            className="w-full rounded-lg border border-border bg-secondary px-8 py-4 font-mono text-sm text-muted-foreground transition-all hover:text-foreground hover:border-primary/30"
          >
            <span className="text-lg">🏋️</span>
            <span className="ml-3">MODE ENTRAÎNEMENT</span>
            <p className="mt-1 text-xs text-muted-foreground font-sans">Renforce tes compétences avec des exercices</p>
          </motion.button>

          <div className="grid grid-cols-3 gap-3">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => { goToScene(101); playSFX('click'); }}
              className="rounded-lg border border-border bg-secondary px-3 py-4 font-mono text-xs text-muted-foreground transition-all hover:text-foreground hover:border-cyber-blue/30"
            >
              <span className="text-lg block mb-1">📖</span>
              Academy
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              onClick={() => { goToScene(102); playSFX('click'); }}
              className="rounded-lg border border-border bg-secondary px-3 py-4 font-mono text-xs text-muted-foreground transition-all hover:text-foreground hover:border-warning/30"
            >
              <span className="text-lg block mb-1">🏆</span>
              Certifications
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={() => { goToScene(103); playSFX('click'); }}
              className="rounded-lg border border-border bg-secondary px-3 py-4 font-mono text-xs text-muted-foreground transition-all hover:text-foreground hover:border-primary/30"
            >
              <span className="text-lg block mb-1">📄</span>
              Mon CV
            </motion.button>
          </div>
        </div>

        {hasSave && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => { if (confirm('Effacer toute la progression ?')) resetGame(); }}
            className="mt-6 font-mono text-[10px] text-muted-foreground/50 hover:text-danger transition-colors"
          >
            Réinitialiser la sauvegarde
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
