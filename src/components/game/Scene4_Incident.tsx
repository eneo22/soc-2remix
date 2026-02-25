import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { NarrativeBlock } from './Typewriter';
import { DialogBox } from './DialogBox';
import { XPNotification } from './GameHUD';

export const Scene4_Incident = () => {
  const { nextScene, addXP, setChoice } = useGame();
  const { playBGM, playSFX } = useAudio();
  const [phase, setPhase] = useState<'narrative' | 'marcus_alert' | 'valeria' | 'marcus_question' | 'decision' | 'result'>('narrative');
  const [timer, setTimer] = useState(10);
  const [chosen, setChosen] = useState<string | null>(null);
  const [showXP, setShowXP] = useState(false);

  useEffect(() => { playBGM('tension'); }, []);

  const introLines = [
    "Les alarmes rouges du bâtiment se déclenchent.",
    "Le téléphone de ton bureau sonne dans le vide.",
    "Le chat de Marcus s'affole..."
  ];

  useEffect(() => {
    if (phase !== 'decision' || timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [phase, timer]);

  useEffect(() => {
    if (timer <= 0 && phase === 'decision' && !chosen) {
      handleChoice('timeout');
    }
  }, [timer, phase, chosen]);

  const handleChoice = (choice: string) => {
    if (chosen) return;
    setChosen(choice);
    setChoice('scene4', choice);
    playSFX(choice === 'C' ? 'success' : 'error');
    if (choice === 'C') {
      addXP('analytical', 50);
      addXP('technical', 50);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 2000);
    }
    setTimeout(() => setPhase('result'), 1500);
  };

  const options = [
    { id: 'A', desc: "Essayer d'effacer les traces de Valeria dans les logs pour la protéger." },
    { id: 'B', desc: "Lancer un scan Antivirus sur tout le réseau." },
    { id: 'C', desc: "Isoler immédiatement l'appareil de Valeria du réseau." },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <AnimatePresence>{showXP && <XPNotification category="Analyse + Technique" amount={100} />}</AnimatePresence>

      {phase === 'narrative' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-danger">
            Scène 4 — La Catastrophe (Incident Response)
          </h2>
          <NarrativeBlock lines={introLines} onComplete={() => { setPhase('marcus_alert'); playSFX('alert'); }} speed={30} />
        </motion.div>
      )}

      {phase === 'marcus_alert' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-4">
          <DialogBox character="marcus">
            <p className="text-danger">
              "MERDE ! Valeria vient de cliquer sur le lien depuis son téléphone personnel, sur le réseau Wi-Fi VIP.
              Elle voulait vraiment l'argent. Oblivion vient de rentrer dans le réseau interne.
              Le serveur des transactions est en train d'être siphonné !"
            </p>
          </DialogBox>
          <button onClick={() => setPhase('valeria')} className="rounded-lg border border-danger bg-danger/10 px-6 py-3 font-mono text-sm text-danger transition-all hover:bg-danger/20">
            Continuer →
          </button>
        </motion.div>
      )}

      {phase === 'valeria' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-4">
          <DialogBox character="valeria">
            <p className="italic">
              "Aidez-moi, s'il vous plaît ! Couvrez-moi, si Elias ou le conseil d'administration apprennent que c'est moi
              qui ai cliqué sur un mail parlant de notre liaison, je suis morte dans ce milieu ! Je vous paierai !"
            </p>
          </DialogBox>
          <button onClick={() => setPhase('marcus_question')} className="rounded-lg border border-danger bg-danger/10 px-6 py-3 font-mono text-sm text-danger transition-all hover:bg-danger/20">
            Continuer →
          </button>
        </motion.div>
      )}

      {phase === 'marcus_question' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-4">
          <DialogBox character="marcus">
            <p>
              "Rookie, on n'a que <span className="font-bold text-danger">10 secondes</span>. Quelle est la première règle
              en réponse à incident face à une compromission active ?"
            </p>
          </DialogBox>
          <button onClick={() => { setPhase('decision'); playSFX('alert'); }} className="rounded-lg border border-danger bg-danger/10 px-6 py-3 font-mono text-sm text-danger transition-all hover:bg-danger/20">
            ⚡ DÉCIDER MAINTENANT
          </button>
        </motion.div>
      )}

      {phase === 'decision' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl w-full">
          <div className="mb-6 text-center">
            <div className={`inline-block rounded-full border-2 px-6 py-2 font-mono text-2xl font-bold ${
              timer <= 3 ? 'border-danger text-danger glitch-text pulse-danger' : 'border-warning text-warning'
            }`}>
              {timer}s
            </div>
          </div>
          <div className="space-y-3">
            {options.map(opt => (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice(opt.id)}
                disabled={chosen !== null}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  chosen === opt.id ? 'border-foreground/50 bg-foreground/10' : 'border-border bg-card hover:border-foreground/30'
                }`}
              >
                <p className="font-mono text-xs text-muted-foreground">Option {opt.id}</p>
                <p className="mt-1 text-sm text-foreground/70">{opt.desc}</p>
              </motion.button>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} className="mt-4 h-20 overflow-hidden rounded border border-danger/20 bg-terminal-bg p-2 font-mono text-[10px] text-danger/60">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>
                [{new Date().toISOString()}] EXFILTRATION: {Math.floor(Math.random() * 900000 + 100000)}€ → crypto_wallet_0x{Math.random().toString(16).slice(2, 10)}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl text-center space-y-4">
          <DialogBox character="marcus">
            {chosen === 'C' ? (
              <p>"Bien joué. Tu as isolé l'appareil. C'est la règle numéro 1 : <span className="font-bold text-primary">Containment</span> — couper l'accès avant tout. On analyse après."</p>
            ) : chosen === 'B' ? (
              <p>"Un antivirus ?! C'est comme appeler une ambulance pendant un tremblement de terre ! On a perdu 5 millions le temps que ça scanne. La bonne réponse : <span className="font-bold text-primary">ISOLER d'abord</span>."</p>
            ) : chosen === 'A' ? (
              <p>"Tu as essayé de couvrir Valeria ? Tu es viré. Enfin, presque. On ne falsifie JAMAIS les logs. C'est un crime. La bonne réponse : <span className="font-bold text-primary">ISOLER l'appareil compromis</span>."</p>
            ) : (
              <p>"Trop lent ! En cybersécurité, chaque seconde compte. La bonne réponse était : <span className="font-bold text-primary">ISOLER l'appareil du réseau</span>."</p>
            )}
          </DialogBox>

          <div className="rounded border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
            <p className="font-bold text-primary mb-1">📚 Concept appris : Incident Response</p>
            <p>La <span className="text-foreground font-bold">Contention (Containment)</span> est toujours la priorité absolue :
            couper l'accès réseau de l'appareil compromis avant même de chercher à comprendre l'attaque.</p>
          </div>

          <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
            Scène finale →
          </button>
        </motion.div>
      )}
    </div>
  );
};
