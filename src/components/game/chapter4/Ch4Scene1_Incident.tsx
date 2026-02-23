import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';

export const Ch4Scene1_Incident = () => {
  const { nextScene } = useGame();
  const [phase, setPhase] = useState<'intro' | 'alert' | 'team' | 'ready'>('intro');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full">
        <h2 className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
          Chapitre 4 — Les Couches du Mensonge
        </h2>

        {phase === 'intro' && (
          <div className="space-y-4">
            <NarrativeBlock
              lines={[
                "02h17.",
                "Le SOC est en alerte maximale.",
                "Des transferts massifs de données sortent du réseau interne vers une IP externe inconnue.",
              ]}
              speed={30}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}>
              <button onClick={() => setPhase('alert')} className="w-full font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
                Suivant →
              </button>
            </motion.div>
          </div>
        )}

        {phase === 'alert' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-danger/50 bg-danger/5 p-4 pulse-danger">
              <p className="font-mono text-xs text-danger mb-2">⚠ ALERTE CRITIQUE</p>
              <table className="w-full text-xs font-mono">
                <tbody className="text-foreground/80">
                  <tr><td className="text-muted-foreground pr-4">Type</td><td>Data exfiltration suspected</td></tr>
                  <tr><td className="text-muted-foreground pr-4">Destination</td><td className="text-danger">185.193.XX.XX</td></tr>
                  <tr><td className="text-muted-foreground pr-4">Protocol</td><td>HTTPS</td></tr>
                  <tr><td className="text-muted-foreground pr-4">Volume</td><td className="text-danger">4.3 GB in 12 minutes</td></tr>
                </tbody>
              </table>
            </div>
            <button onClick={() => setPhase('team')} className="w-full font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              Suivant →
            </button>
          </motion.div>
        )}

        {phase === 'team' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">NARRATEUR</p>
              <p className="text-sm text-foreground/80">Marcus entre, suivi de deux nouveaux membres de l'équipe.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded border border-cyber-blue/30 bg-cyber-blue/5 p-3">
                <p className="font-mono text-xs text-cyber-blue font-bold">ILYAS</p>
                <p className="text-[10px] text-muted-foreground">Ingénieur réseau senior</p>
                <p className="text-xs text-foreground/70 mt-1">Méthodique, sceptique.</p>
              </div>
              <div className="rounded border border-warning/30 bg-warning/5 p-3">
                <p className="font-mono text-xs text-warning font-bold">NORA VALEN</p>
                <p className="text-[10px] text-muted-foreground">Analyste threat intelligence</p>
                <p className="text-xs text-foreground/70 mt-1">Efficacité froide, observe plus qu'elle ne parle.</p>
              </div>
            </div>

            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
              <p className="text-sm text-foreground/80">
                "Quelqu'un sort des données. Soit on est déjà compromis. Soit on est manipulés."
              </p>
              <p className="text-sm text-foreground/80 mt-2">
                Il te regarde. "On reprend depuis la base. <span className="text-primary font-bold">Pense en couches.</span>"
              </p>
            </div>

            <button onClick={() => setPhase('ready')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Commencer l'analyse →
            </button>
          </motion.div>
        )}

        {phase === 'ready' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Analyser selon le modèle OSI →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
