import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Typewriter } from './Typewriter';

export const GameIntro = () => {
  const { nextScene } = useGame();
  const [phase, setPhase] = useState<'title' | 'boot' | 'ready'>('title');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <AnimatePresence mode="wait">
        {phase === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.h1
              className="mb-2 font-mono text-4xl md:text-6xl font-bold text-primary terminal-glow"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              SOC ASCENSION
            </motion.h1>
            <motion.p
              className="mb-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Apprends la cybersécurité. Vis l'aventure.
            </motion.p>
            <motion.p
              className="mb-8 font-mono text-xs text-danger/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              [ARC 1 — CHAPITRE 1 : L'APPÂT]
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => setPhase('boot')}
              className="rounded-lg border border-primary bg-primary/10 px-8 py-4 font-mono text-sm text-primary transition-all hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10"
            >
              ▶ LANCER LA MISSION
            </motion.button>
          </motion.div>
        )}

        {phase === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-lg font-mono text-xs text-terminal/70 space-y-1"
          >
            <Typewriter
              text="[KRONOS GLOBAL — Système de sécurité interne]"
              speed={20}
              className="terminal-glow"
              onComplete={() => setTimeout(() => setPhase('ready'), 800)}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <p>Initialisation du poste de travail...</p>
              <p>Connexion au réseau KRONOS... OK</p>
              <p>Chargement des modules SOC... OK</p>
              <p>Niveau d'accès : <span className="text-warning">HELPDESK — Niveau 1</span></p>
              <p className="text-primary terminal-glow mt-2">Bienvenue, technicien.</p>
            </motion.div>
          </motion.div>
        )}

        {phase === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="mb-4 font-mono text-sm text-primary terminal-glow">Système prêt.</p>
            <button
              onClick={nextScene}
              className="rounded-lg border border-primary bg-primary/10 px-8 py-4 font-mono text-sm text-primary transition-all hover:bg-primary/20"
            >
              Commencer →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
