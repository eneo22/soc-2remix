import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';
import { XPNotification } from '../GameHUD';

export const Ch2Scene4_Traffic = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'traffic' | 'quiz' | 'result'>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showXP, setShowXP] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState(0);

  const introLines = [
    "Les écrans affichent un graphique de trafic en temps réel.",
    "Marcus pointe l'écran du doigt.",
    "\"Regarde ça. Depuis 6h12, un poste interne parle toutes les 10 secondes avec 185.199.108.153.\"",
  ];

  const trafficLogs = [
    { time: '10:12:01', src: 'POSTE-VALERIA', dst: '185.199.108.153', size: '1.2KB' },
    { time: '10:12:11', src: 'POSTE-VALERIA', dst: '185.199.108.153', size: '1.3KB' },
    { time: '10:12:21', src: 'POSTE-VALERIA', dst: '185.199.108.153', size: '1.1KB' },
    { time: '10:12:31', src: 'POSTE-VALERIA', dst: '185.199.108.153', size: '1.4KB' },
    { time: '10:12:41', src: 'POSTE-VALERIA', dst: '185.199.108.153', size: '1.2KB' },
  ];

  const quizOptions = [
    { text: "C'est normal, c'est une mise à jour", correct: false, feedback: "Une mise à jour ne communique pas toutes les 10 secondes avec un serveur externe." },
    { text: "Cela ressemble à un canal automatique (C2)", correct: true, feedback: "Correct ! Un trafic régulier vers un serveur externe suspect indique un malware de type C2." },
    { text: "C'est un bug réseau", correct: false, feedback: "Un bug ne crée pas de communications régulières et ciblées." },
  ];

  useEffect(() => {
    if (phase === 'traffic' && visibleLogs < trafficLogs.length) {
      const t = setTimeout(() => setVisibleLogs(v => v + 1), 800);
      return () => clearTimeout(t);
    }
  }, [phase, visibleLogs]);

  const handleAnswer = (i: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(i);
    if (quizOptions[i].correct) {
      addXP('detection', 60);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 2000);
    }
    setTimeout(() => setPhase('result'), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <AnimatePresence>{showXP && <XPNotification category="Détection" amount={60} />}</AnimatePresence>

      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Chapitre 2 — Le Flux Invisible
          </h2>
          <NarrativeBlock lines={introLines} onComplete={() => setPhase('traffic')} speed={25} />
        </motion.div>
      )}

      {phase === 'traffic' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl w-full">
          <div className="overflow-hidden rounded-lg border border-danger/30 bg-terminal-bg font-mono text-xs">
            <div className="border-b border-danger/20 bg-danger/5 px-4 py-2">
              <span className="text-danger">⚠ TRAFIC SUSPECT DÉTECTÉ</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-4 gap-2 text-primary/60 mb-2 text-[10px]">
                <span>TIME</span><span>SOURCE</span><span>DESTINATION</span><span>SIZE</span>
              </div>
              {trafficLogs.slice(0, visibleLogs).map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-4 gap-2 text-terminal/80 mb-1">
                  <span>{log.time}</span>
                  <span className="text-warning">{log.src}</span>
                  <span className="text-danger">{log.dst}</span>
                  <span>{log.size}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-primary/30 bg-card p-4 mt-4 mb-4">
            <p className="font-mono text-xs font-bold text-primary mb-2">🧠 MODULE — TRAFIC RÉSEAU & TCP</p>
            <p className="text-sm text-foreground/70 mb-2">Quand un ordinateur communique régulièrement avec un serveur externe suspect, cela peut être :</p>
            <ul className="text-sm text-foreground/60 space-y-1">
              <li>• Un <span className="text-danger font-bold">malware</span></li>
              <li>• Une <span className="text-danger font-bold">exfiltration de données</span></li>
              <li>• Un <span className="text-danger font-bold">canal de commande (C2)</span></li>
            </ul>
            <p className="text-sm text-foreground/70 mt-2"><span className="text-primary font-bold">TCP</span> garantit que les données arrivent correctement.</p>
          </div>

          {visibleLogs >= trafficLogs.length && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-mono text-xs text-primary mb-3">Pourquoi une communication répétée toutes les 10 secondes est suspecte ?</p>
              <div className="space-y-3">
                {quizOptions.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null}
                    className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${
                      selectedAnswer === i ? (opt.correct ? 'border-primary bg-primary/10 text-primary' : 'border-danger bg-danger/10 text-danger')
                      : selectedAnswer !== null && opt.correct ? 'border-primary/50 bg-primary/5' : 'border-border bg-card text-foreground/70 hover:border-primary/50'
                    }`}>
                    {opt.text}
                    {selectedAnswer === i && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs italic">{opt.feedback}</motion.p>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl text-center">
          <div className="rounded-lg border border-primary/30 bg-card p-6 mb-4">
            <p className="font-mono text-xs text-primary mb-2">MARCUS</p>
            <p className="text-sm text-foreground/80">"Un canal C2, c'est la laisse du hacker. Coupe la laisse, et le malware est aveugle."</p>
          </div>
          <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
            Scène suivante →
          </button>
        </motion.div>
      )}
    </div>
  );
};
