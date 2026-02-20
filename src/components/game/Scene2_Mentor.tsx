import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from './Typewriter';
import { XPNotification } from './GameHUD';

export const Scene2_Mentor = () => {
  const { state, nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'narrative' | 'lesson' | 'quiz' | 'result'>('narrative');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showXP, setShowXP] = useState(false);
  const [timer, setTimer] = useState(15);
  const choseA = state.choices.scene1 === 'A';

  const narrativeA = [
    "Ton écran devient soudainement rouge sang.",
    "Des lignes de code défilent à une vitesse folle. Tes accès sont bloqués.",
    "Un pop-up s'affiche : \"OBLIVION HAS YOU. CHUNK ENCRYPTED.\"",
    "Ton cœur rate un battement. Tu viens de faire entrer un ransomware chez Kronos.",
    "Soudain, ton terminal s'éteint et redémarre de force. Une fenêtre de chat s'ouvre..."
  ];

  const narrativeB = [
    "Tu bloques le mail.",
    "Immédiatement, une fenêtre de chat sécurisée s'ouvre...",
  ];

  const quizOptions = [
    { text: "Pour contourner l'antivirus.", correct: false, feedback: "Non, l'antivirus ne vérifie pas l'identité de l'expéditeur." },
    { text: "Pour créer un faux sentiment d'autorité et d'urgence.", correct: true, feedback: "Exact ! C'est le principe du Social Engineering." },
    { text: "Pour pirater le mot de passe d'Elias.", correct: false, feedback: "Non, le but n'est pas de pirater Elias mais d'exploiter son autorité." },
  ];

  // Timer for quiz
  useEffect(() => {
    if (phase !== 'quiz' || timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [phase, timer]);

  useEffect(() => {
    if (timer === 0 && phase === 'quiz' && selectedAnswer === null) {
      setSelectedAnswer(-1); // timeout
    }
  }, [timer, phase, selectedAnswer]);

  const handleAnswer = (i: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(i);
    if (quizOptions[i].correct) {
      addXP('reflexion', 50);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 2000);
    }
    setTimeout(() => setPhase('result'), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <AnimatePresence>{showXP && <XPNotification category="Réflexion" amount={50} />}</AnimatePresence>

      {phase === 'narrative' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Scène 2 — La Frappe et le Mentor
          </h2>

          {choseA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, backgroundColor: ['hsl(0 85% 10%)', 'hsl(0 85% 5%)'] }}
              transition={{ duration: 0.5 }}
              className="mb-6 rounded border border-danger/50 p-4"
            >
              <NarrativeBlock lines={narrativeA} onComplete={() => {}} speed={20} />
            </motion.div>
          )}
          {!choseA && (
            <NarrativeBlock lines={narrativeB} onComplete={() => {}} speed={20} />
          )}

          {/* Marcus Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: choseA ? 6 : 2 }}
            className="mt-6 rounded-lg border border-primary/30 bg-card p-4"
          >
            <p className="mb-1 font-mono text-xs font-bold text-primary">MARCUS — Chef du SOC</p>
            {choseA ? (
              <p className="text-sm leading-relaxed text-foreground/80">
                "Bordel de merde, Rookie ! Tu viens vraiment de cliquer sur un lien de cul impliquant le grand patron ?
                J'ai isolé ton poste (Sandboxing) à la milliseconde près. Tu as failli nous coûter 50 millions."
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-foreground/80">
                "Pas mal, le bleu. 90% des mecs à ta place auraient cliqué pour voir la sextape d'Elias.
                Tu as repéré le zéro dans 'gl0bal', hein ?"
              </p>
            )}
          </motion.div>

          {/* Lesson */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: choseA ? 9 : 4 }}
            className="mt-4 rounded-lg border border-primary/30 bg-card p-4"
          >
            <p className="mb-1 font-mono text-xs font-bold text-primary">MARCUS</p>
            <p className="text-sm leading-relaxed text-foreground/80">
              "Écoute-moi bien. C'est ce qu'on appelle du <span className="font-bold text-warning">Spear-Phishing</span> (Hameçonnage ciblé).
              Le hacker, un groupe appelé '<span className="font-bold text-danger">Oblivion</span>', n'a pas utilisé de code complexe.
              Il a utilisé la <span className="font-bold text-primary">psychologie</span>.
              Le sexe, l'urgence, la cupidité, la peur de l'autorité.
              La faille, ce n'est pas Windows. <span className="font-bold text-warning">La faille, c'est l'humain.</span>"
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: choseA ? 12 : 6 }}
            onClick={() => { setPhase('quiz'); setTimer(15); }}
            className="mt-6 rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20"
          >
            Continuer →
          </motion.button>
        </motion.div>
      )}

      {phase === 'quiz' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs text-primary">QUIZ — Validation pédagogique</p>
            <div className={`font-mono text-sm font-bold ${timer <= 5 ? 'text-danger glitch-text' : 'text-warning'}`}>
              {timer}s
            </div>
          </div>

          <div className="rounded-lg border border-primary/30 bg-card p-4 mb-4">
            <p className="mb-1 font-mono text-xs text-primary">MARCUS</p>
            <p className="text-sm text-foreground/90">
              "Pourquoi Oblivion a imité l'adresse du PDG plutôt qu'un inconnu ?"
            </p>
          </div>

          <div className="space-y-3">
            {quizOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`w-full rounded-lg border p-4 text-left text-sm transition-all ${
                  selectedAnswer === i
                    ? opt.correct
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-danger bg-danger/10 text-danger'
                    : selectedAnswer !== null && opt.correct
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border bg-card text-foreground/70 hover:border-primary/50'
                }`}
              >
                <span className="font-mono text-xs text-muted-foreground mr-2">{i + 1}.</span>
                {opt.text}
                {selectedAnswer === i && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs italic">
                    {opt.feedback}
                  </motion.p>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl text-center">
          <div className="rounded-lg border border-primary/30 bg-card p-6 mb-6">
            <p className="mb-1 font-mono text-xs text-primary">MARCUS</p>
            {selectedAnswer !== null && quizOptions[selectedAnswer]?.correct ? (
              <p className="text-sm text-foreground/80">"Bien. Tu commences à comprendre comment ces enfoirés pensent."</p>
            ) : (
              <p className="text-sm text-foreground/80">
                "La bonne réponse, c'est l'autorité et l'urgence. Le PDG, tout le monde lui obéit sans réfléchir. Retiens ça."
              </p>
            )}
          </div>
          <button
            onClick={nextScene}
            className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20"
          >
            Scène suivante →
          </button>
        </motion.div>
      )}
    </div>
  );
};
