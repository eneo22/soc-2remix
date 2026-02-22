import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';
import { XPNotification } from '../GameHUD';

export const Ch2Scene1_SOC = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'narrative' | 'schema' | 'lesson' | 'quiz' | 'result'>('narrative');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showXP, setShowXP] = useState(false);

  const introLines = [
    "Il est 8h03.",
    "Les portes de l'ascenseur s'ouvrent sur le SOC de KRONOS Global.",
    "Mur d'écrans. Cartes du monde. Alertes rouges. Graphiques mouvants.",
    "Marcus t'attend, café noir à la main.",
  ];

  const marcusLines = [
    "\"Hier, tu as survécu. Aujourd'hui, tu vas comprendre comment on respire ici.\"",
    "\"La cybersécurité, ce n'est pas de la magie. C'est du réseau.\"",
    "Il affiche un schéma sur l'écran principal.",
    "Un bâtiment. Des ordinateurs. Un routeur. Internet. Des serveurs.",
    "\"Explique-moi ce que tu vois.\"",
  ];

  const quizOptions = [
    { text: "Pour décorer le réseau", correct: false, feedback: "Non, une adresse IP a un rôle fonctionnel essentiel." },
    { text: "Pour identifier une machine", correct: true, feedback: "Exact ! Chaque machine sur un réseau a une adresse unique." },
    { text: "Pour crypter les données", correct: false, feedback: "Non, le chiffrement utilise d'autres mécanismes." },
  ];

  const handleAnswer = (i: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(i);
    if (quizOptions[i].correct) {
      addXP('analytical', 50);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 2000);
    }
    setTimeout(() => setPhase('result'), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <AnimatePresence>{showXP && <XPNotification category="Analyse" amount={50} />}</AnimatePresence>

      {phase === 'narrative' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Chapitre 2 — Le 40ème Étage
          </h2>
          <NarrativeBlock lines={introLines} onComplete={() => setPhase('schema')} speed={25} />
        </motion.div>
      )}

      {phase === 'schema' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Chapitre 2 — Le 40ème Étage
          </h2>
          <NarrativeBlock lines={marcusLines} onComplete={() => setPhase('lesson')} speed={25} />
        </motion.div>
      )}

      {phase === 'lesson' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <div className="rounded-lg border border-primary/30 bg-card p-5 mb-4">
            <p className="font-mono text-xs font-bold text-primary mb-3">🧠 MODULE — QU'EST-CE QU'UN RÉSEAU ?</p>
            <p className="text-sm text-foreground/80 mb-3">
              Un <span className="font-bold text-primary">réseau</span> est un ensemble d'ordinateurs connectés entre eux pour échanger des données.
            </p>
            <div className="border-t border-border pt-3 mt-3">
              <p className="font-mono text-xs text-primary mb-2">Adresse IP :</p>
              <p className="text-sm text-foreground/70 mb-2">
                Chaque machine sur un réseau a une adresse. Comme une plaque d'immatriculation.
              </p>
              <div className="flex gap-4 text-sm font-mono">
                <span className="rounded bg-secondary px-2 py-1 text-warning">192.168.1.10 → interne</span>
                <span className="rounded bg-secondary px-2 py-1 text-danger">185.x.x.x → public</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setPhase('quiz')}
            className="mt-4 rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20"
          >
            Quiz de validation →
          </button>
        </motion.div>
      )}

      {phase === 'quiz' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <p className="font-mono text-xs text-primary mb-4">QUIZ — Validation</p>
          <div className="rounded-lg border border-primary/30 bg-card p-4 mb-4">
            <p className="text-sm text-foreground/90">Pourquoi une adresse IP est-elle importante ?</p>
          </div>
          <div className="space-y-3">
            {quizOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`w-full rounded-lg border p-4 text-left text-sm transition-all ${
                  selectedAnswer === i
                    ? opt.correct ? 'border-primary bg-primary/10 text-primary' : 'border-danger bg-danger/10 text-danger'
                    : selectedAnswer !== null && opt.correct ? 'border-primary/50 bg-primary/5' : 'border-border bg-card text-foreground/70 hover:border-primary/50'
                }`}
              >
                <span className="font-mono text-xs text-muted-foreground mr-2">{i + 1}.</span>
                {opt.text}
                {selectedAnswer === i && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs italic">{opt.feedback}</motion.p>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl text-center">
          <div className="rounded-lg border border-primary/30 bg-card p-6 mb-4">
            <p className="font-mono text-xs text-primary mb-2">MARCUS</p>
            <p className="text-sm text-foreground/80">
              {selectedAnswer !== null && quizOptions[selectedAnswer]?.correct
                ? "\"Bien. Tu commences à voir le réseau comme je le vois.\""
                : "\"La bonne réponse, c'est pour identifier une machine. Retiens ça, c'est la base de tout.\""
              }
            </p>
          </div>
          <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
            Scène suivante →
          </button>
        </motion.div>
      )}
    </div>
  );
};
