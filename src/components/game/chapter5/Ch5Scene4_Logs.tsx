import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { NarrativeBlock } from '../Typewriter';
import { DialogBox } from '../DialogBox';

export const Ch5Scene4_Logs = () => {
  const { nextScene, addXP } = useGame();
  const { playSFX } = useAudio();
  const [phase, setPhase] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-danger terminal-glow text-center mb-4">
          Corrélation multi-logs
        </h2>

        {phase === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <NarrativeBlock lines={[
              "Nora ouvre les logs système du serveur 192.168.1.12.",
              "Elle remonte /var/log/auth.log."
            ]} speed={25} />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              className="rounded-lg border border-danger/30 bg-black/80 p-4 font-mono text-xs space-y-1">
              <p className="text-muted-foreground"># /var/log/auth.log — serveur 192.168.1.12</p>
              <p className="text-foreground/70">Mar 15 02:11:44 backup sshd[8821]: Failed password for backup from 192.168.1.45</p>
              <p className="text-foreground/70">Mar 15 02:12:01 backup sshd[8822]: Failed password for backup from 192.168.1.45</p>
              <p className="text-danger font-bold">Mar 15 02:13:18 backup sshd[8823]: Accepted password for backup from 192.168.1.45</p>
              <p className="text-foreground/70">Mar 15 02:13:22 backup sshd[8823]: pam_unix(sshd:session): session opened for user backup</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}
              className="rounded-lg border border-warning/50 bg-warning/5 p-3">
              <p className="font-mono text-xs text-warning">⚠ 192.168.1.45 — C'est la machine isolée au chapitre 4 !</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.5 }}>
              <button onClick={() => { playSFX('beep'); setPhase(1); }} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all">
                Suivant →
              </button>
            </motion.div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <DialogBox character="marcus">
              <p>"Ou on a bloqué <span className="text-danger font-bold">ce qu'on voulait voir</span>."</p>
            </DialogBox>

            <NarrativeBlock lines={["Sur 192.168.1.12, tu lances netstat."]} speed={25} />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              className="rounded-lg border border-primary/30 bg-black/80 p-4 font-mono text-xs space-y-1">
              <p className="text-muted-foreground"># netstat -tunap</p>
              <p className="text-foreground/70">tcp  0  0  192.168.1.12:22      192.168.1.100:54322   ESTABLISHED  1201/sshd</p>
              <p className="text-danger font-bold">tcp  0  0  192.168.1.12:49822   185.193.XX.XX:443     ESTABLISHED  6666/system-update</p>
              <p className="text-foreground/70">tcp  0  0  192.168.1.12:80      0.0.0.0:*             LISTEN       412/apache2</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
              className="rounded-lg border border-danger/30 bg-card p-4">
              <p className="font-mono text-xs text-danger mb-2">🔍 Processus suspect détecté</p>
              <p className="text-sm text-foreground/70">PID <span className="text-danger font-bold">6666</span> — <code className="text-primary">/usr/bin/system-update</code></p>
              <p className="text-xs text-muted-foreground mt-1">Nom crédible. Mais ce binaire n'existe pas dans les dépôts officiels.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5 }}>
              <button onClick={() => { addXP('analytical', 20); addXP('detection', 15); playSFX('transition'); nextScene(); }} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all">
                Suivant →
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
