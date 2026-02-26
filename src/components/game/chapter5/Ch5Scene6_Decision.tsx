import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { NarrativeBlock } from '../Typewriter';
import { DialogBox } from '../DialogBox';

const CHOICES = [
  {
    id: 'isolate',
    label: '🔒 Isolation immédiate',
    desc: 'Couper le serveur pour stopper l\'exfiltration. Risque : perte de preuves.',
    consequence: 'L\'exfiltration est stoppée. Mais l\'attaquant sait qu\'il est repéré et peut changer de méthode.',
    xp: { technical: 20, reflexion: 10 },
  },
  {
    id: 'observe',
    label: '👁️ Surveillance via tcpdump',
    desc: 'Observer le trafic pour identifier le pattern et le C2. Risque : données continuent de fuiter.',
    consequence: 'Tu captures un beaconing toutes les 30 secondes. Pattern régulier. Possible C2 identifié : 185.193.XX.XX.',
    xp: { analytical: 25, detection: 20 },
  },
  {
    id: 'trace',
    label: '🔍 Traçage du flux',
    desc: 'Remonter la chaîne complète avant d\'agir. Risque : temps perdu si l\'attaque s\'intensifie.',
    consequence: 'Tu découvres que le compte "backup" a été réactivé depuis 192.168.1.12 lui-même. Compromission interne confirmée.',
    xp: { analytical: 20, reflexion: 20 },
  },
];

export const Ch5Scene6_Decision = () => {
  const { nextScene, addXP, setChoice } = useGame();
  const { playSFX } = useAudio();
  const [phase, setPhase] = useState(0);
  const [selected, setSelected] = useState<typeof CHOICES[0] | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-danger terminal-glow text-center mb-4">
          Plot Twist majeur — Décision stratégique
        </h2>

        {phase === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <NarrativeBlock lines={["Nora révèle une information critique."]} speed={25} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="rounded-lg border border-danger/50 bg-danger/5 p-4">
              <p className="text-sm text-foreground/80">Le login <span className="text-danger font-bold">"backup"</span> utilisé à 02h13 correspond à un compte <span className="text-danger font-bold">désactivé il y a 3 mois</span>.</p>
              <p className="text-sm text-foreground/80 mt-2">Quelqu'un l'a <span className="text-danger font-bold">réactivé</span>.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
              className="rounded-lg border border-warning/30 bg-card p-4 font-mono text-xs space-y-1">
              <p className="text-muted-foreground"># Journal d'administration</p>
              <p className="text-danger">usermod -U backup</p>
              <p className="text-foreground/70">Exécuté depuis : <span className="text-danger font-bold">192.168.1.12 lui-même</span></p>
              <p className="text-warning mt-2 italic">Compromission déjà interne AVANT l'attaque ARP du chapitre 4.</p>
              <p className="text-danger mt-1 italic">L'attaque précédente était peut-être une DIVERSION.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.5 }}>
              <button onClick={() => { playSFX('beep'); setPhase(1); }} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all">
                Suivant →
              </button>
            </motion.div>
          </motion.div>
        )}

        {phase === 1 && !selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <DialogBox character="marcus">
              <p>"On coupe le serveur ? Ou on observe encore pour identifier l'attaquant ?"</p>
            </DialogBox>

            <p className="font-mono text-xs text-muted-foreground text-center">Choisis ta stratégie :</p>

            {CHOICES.map(choice => (
              <button key={choice.id} onClick={() => {
                playSFX('notification');
                setChoice('ch5_strategy', choice.id);
                setSelected(choice);
                Object.entries(choice.xp).forEach(([k, v]) => addXP(k as any, v));
              }} className="w-full rounded-lg border border-border bg-card p-4 text-left hover:border-primary/50 transition-all">
                <p className="font-mono text-sm font-bold text-foreground">{choice.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{choice.desc}</p>
              </button>
            ))}
          </motion.div>
        )}

        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="font-mono text-xs text-primary mb-2">📋 RÉSULTAT</p>
              <p className="text-sm text-foreground/80">{selected.consequence}</p>
            </div>
            <button onClick={() => { playSFX('transition'); nextScene(); }}
              className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all">
              Suivant →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
