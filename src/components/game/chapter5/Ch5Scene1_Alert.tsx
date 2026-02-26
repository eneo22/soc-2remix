import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { NarrativeBlock } from '../Typewriter';
import { DialogBox } from '../DialogBox';

export const Ch5Scene1_Alert = () => {
  const { nextScene } = useGame();
  const { playBGM, playSFX } = useAudio();
  const [phase, setPhase] = useState(0);

  useState(() => { playBGM('crisis'); });

  const advance = () => {
    playSFX('beep');
    setPhase(p => p + 1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-danger terminal-glow text-center mb-6">
          Chapitre 5 — L'Ombre Persistante
        </h2>

        {phase === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <NarrativeBlock lines={["07h42. Le SOC est convoqué en urgence.", "Les écrans clignotent."]} speed={30} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              className="rounded-lg border border-danger/50 bg-danger/5 p-4 font-mono text-sm space-y-2">
              <p className="text-danger font-bold animate-pulse">⚠ KRONOS INTERNAL BACKUP SERVER - UNREACHABLE</p>
              <div className="text-foreground/70 text-xs space-y-1 mt-3">
                <p>Unexpected outbound encrypted traffic detected</p>
                <p>Source: <span className="text-danger">192.168.1.12</span></p>
                <p>Destination: <span className="text-danger">185.193.XX.XX</span></p>
                <p>Protocol: TCP/443</p>
                <p>Status: <span className="text-warning">Intermittent</span></p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>
              <button onClick={advance} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all">
                Suivant →
              </button>
            </motion.div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <NarrativeBlock lines={["Marcus ne parle pas immédiatement.", "Ilyas fixe le flux réseau.", "Nora observe les logs sans lever les yeux."]} speed={25} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
              <DialogBox character="marcus">
                <p>"Ce n'est pas la même signature qu'au chapitre précédent."</p>
                <p className="mt-1">"Mais c'est la <span className="text-danger font-bold">même destination</span>."</p>
              </DialogBox>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }}>
              <NarrativeBlock lines={["Silence."]} speed={40} />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6 }}>
              <button onClick={advance} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all">
                Suivant →
              </button>
            </motion.div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <DialogBox character="marcus">
              <p>"Procédure. <span className="text-primary font-bold">Toujours procédure.</span>"</p>
            </DialogBox>

            <div className="rounded-lg border border-primary/30 bg-card p-4 mt-4">
              <p className="font-mono text-xs text-primary mb-3">📋 QUESTION — Identifier la couche du symptôme</p>
              <p className="text-sm text-foreground/80 mb-4">Le serveur interne est injoignable et du trafic sortant suspect est détecté. À quelle(s) couche(s) OSI se situe le symptôme visible ?</p>
              
              {['Couche 1 — Physique', 'Couche 4 — Transport & Couche 7 — Application', 'Couche 2 — Liaison de données'].map((opt, i) => (
                <button key={i} onClick={() => {
                  if (i === 1) {
                    playSFX('notification');
                    setTimeout(() => nextScene(), 1500);
                  } else {
                    playSFX('beep');
                  }
                }} className={`w-full mb-2 rounded-lg border p-3 text-left text-sm transition-all ${
                  i === 1 ? 'border-border bg-card hover:border-primary/50 text-foreground/70' : 'border-border bg-card hover:border-border text-foreground/70'
                }`}>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
