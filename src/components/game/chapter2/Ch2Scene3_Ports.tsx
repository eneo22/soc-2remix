import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';
import { XPNotification } from '../GameHUD';

export const Ch2Scene3_Ports = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'scan' | 'lesson' | 'quiz' | 'result'>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showXP, setShowXP] = useState(false);

  const introLines = [
    "Marcus ouvre un autre écran.",
    "\"Un serveur, c'est un immeuble. Les ports sont les portes.\"",
    "Il lance une commande : nmap 185.199.108.153",
  ];

  const scanResults = [
    { port: '22/tcp', state: 'open', service: 'ssh' },
    { port: '80/tcp', state: 'open', service: 'http' },
    { port: '443/tcp', state: 'open', service: 'https' },
  ];

  const quizOptions = [
    { text: "Port 22 (SSH)", correct: false, feedback: "SSH sert aux connexions distantes, pas à héberger un site web." },
    { text: "Port 80 (HTTP)", correct: true, feedback: "Exact ! Le port 80 sert aux sites web non sécurisés — parfait pour un faux site." },
    { text: "Port 443 (HTTPS)", correct: false, feedback: "HTTPS est sécurisé, un faux site utilise souvent HTTP pour sa simplicité." },
  ];

  const handleAnswer = (i: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(i);
    if (quizOptions[i].correct) {
      addXP('technical', 50);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 2000);
    }
    setTimeout(() => setPhase('result'), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <AnimatePresence>{showXP && <XPNotification category="Technique" amount={50} />}</AnimatePresence>

      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Chapitre 2 — Les Portes du Bâtiment
          </h2>
          <NarrativeBlock lines={introLines} onComplete={() => setPhase('scan')} speed={25} />
        </motion.div>
      )}

      {phase === 'scan' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <div className="overflow-hidden rounded-lg border border-primary/30 bg-terminal-bg p-4 font-mono text-sm mb-4">
            <p className="text-primary terminal-glow mb-2">$ nmap 185.199.108.153</p>
            <p className="text-terminal/60 mb-3">Starting Nmap scan...</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-primary/70">
                  <th className="text-left py-1">PORT</th>
                  <th className="text-left py-1">STATE</th>
                  <th className="text-left py-1">SERVICE</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.map((r, i) => (
                  <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }} className="text-terminal/80">
                    <td className="py-1">{r.port}</td>
                    <td className="py-1 text-primary">{r.state}</td>
                    <td className="py-1">{r.service}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setPhase('lesson')} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
            Comprendre les ports →
          </button>
        </motion.div>
      )}

      {phase === 'lesson' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <div className="rounded-lg border border-primary/30 bg-card p-5 mb-4">
            <p className="font-mono text-xs font-bold text-primary mb-3">🧠 MODULE — LES PORTS</p>
            <p className="text-sm text-foreground/80 mb-3">Un port est un canal de communication sur un serveur.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-mono text-warning bg-secondary rounded px-2 py-1 text-xs">80</span>
                <span className="text-foreground/70">HTTP — site web non sécurisé</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-primary bg-secondary rounded px-2 py-1 text-xs">443</span>
                <span className="text-foreground/70">HTTPS — site web sécurisé</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-danger bg-secondary rounded px-2 py-1 text-xs">22</span>
                <span className="text-foreground/70">SSH — connexion distante</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-primary/30 bg-card p-4 mb-4">
            <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
            <p className="text-sm text-foreground/80">"Si tu voulais piéger quelqu'un avec un faux site, quel port serait ouvert ?"</p>
          </div>
          <button onClick={() => setPhase('quiz')} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
            Répondre →
          </button>
        </motion.div>
      )}

      {phase === 'quiz' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <div className="space-y-3">
            {quizOptions.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null}
                className={`w-full rounded-lg border p-4 text-left text-sm transition-all ${
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

      {phase === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl text-center">
          <div className="rounded-lg border border-primary/30 bg-card p-6 mb-4">
            <p className="font-mono text-xs text-primary mb-2">MARCUS</p>
            <p className="text-sm text-foreground/80">"Les ports ouverts, c'est ta surface d'attaque. Moins il y en a, plus c'est sûr."</p>
          </div>
          <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
            Scène suivante →
          </button>
        </motion.div>
      )}
    </div>
  );
};
