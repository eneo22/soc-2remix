// === CERTIFICATION CENTER ===
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { CERTIFICATIONS, GRADES, Certification } from '@/data/certifications';
import { XPNotification } from './GameHUD';
import { useAudio } from '@/contexts/AudioContext';

export const CertificationCenter = () => {
  const { state, goToScene, addXP, unlockSkill } = useGame();
  const { playSFX } = useAudio();
  const [activeCert, setActiveCert] = useState<Certification | null>(null);
  const [examMode, setExamMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [examDone, setExamDone] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const totalXP = Object.values(state.xp).reduce((a, b) => a + b, 0);
  const earnedCerts = Object.keys(state.skills).filter(s => s.startsWith('cert_'));

  const currentGrade = [...GRADES].reverse().find(g =>
    totalXP >= g.requiredXP && g.requiredCerts.every(c => earnedCerts.includes(`cert_${c}`))
  ) || GRADES[0];

  const canAttempt = (cert: Certification) => {
    if (earnedCerts.includes(`cert_${cert.id}`)) return false;
    if (totalXP < cert.requiredXP) return false;
    return cert.requiredModules.every(m => state.skills[m.replace(/-/g, '_')]);
  };

  const startExam = () => {
    setExamMode(true);
    setCurrentQ(0);
    setScore(0);
    setExamDone(false);
  };

  const answerQuestion = (correct: boolean) => {
    if (correct) {
      setScore(s => s + 1);
      playSFX('success');
    } else {
      playSFX('error');
    }

    if (currentQ + 1 >= (activeCert?.examQuestions.length || 0)) {
      const finalScore = correct ? score + 1 : score;
      const passing = finalScore >= Math.ceil((activeCert?.examQuestions.length || 1) * 0.7);
      setExamDone(true);

      if (passing && activeCert) {
        unlockSkill(`cert_${activeCert.id}`);
        addXP('analytical', 50);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 2500);
        playSFX('success');
      }
    } else {
      setCurrentQ(q => q + 1);
    }
  };

  const levelColors = { 1: 'text-primary', 2: 'text-warning', 3: 'text-danger' };
  const levelLabels = { 1: 'Basique', 2: 'Intermédiaire', 3: 'Avancé' };

  // Exam view
  if (activeCert && examMode) {
    const q = activeCert.examQuestions[currentQ];
    const finalScore = score;
    const passing = finalScore >= Math.ceil(activeCert.examQuestions.length * 0.7);

    if (examDone) {
      return (
        <div className="min-h-screen bg-background px-4 pt-14 pb-10">
          <AnimatePresence>{showXP && <XPNotification category="Certification" amount={50} />}</AnimatePresence>
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <p className={`font-mono text-4xl mb-4 ${passing ? 'text-primary' : 'text-danger'}`}>
                {passing ? '🏆' : '❌'}
              </p>
              <h2 className={`font-mono text-xl mb-2 ${passing ? 'text-primary terminal-glow' : 'text-danger'}`}>
                {passing ? 'CERTIFICATION OBTENUE !' : 'ÉCHEC — Réessaie'}
              </h2>
              <p className="text-sm text-muted-foreground mb-2">Score : {score}/{activeCert.examQuestions.length}</p>
              {passing && <p className="font-mono text-sm text-primary">{activeCert.title}</p>}
              <button onClick={() => { setActiveCert(null); setExamMode(false); }} className="mt-6 rounded border border-primary/50 bg-primary/10 px-6 py-2 font-mono text-sm text-primary hover:bg-primary/20 transition-colors">
                Retour
              </button>
            </motion.div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background px-4 pt-14 pb-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs text-primary">EXAMEN — {activeCert.title}</p>
            <p className="font-mono text-xs text-muted-foreground">Question {currentQ + 1}/{activeCert.examQuestions.length}</p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-card/80 p-6">
            <p className="text-sm font-bold mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answerQuestion(opt.correct)}
                  className="w-full rounded border border-border bg-secondary/50 px-4 py-3 text-left text-sm hover:border-primary/50 transition-colors"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cert detail view
  if (activeCert) {
    const earned = earnedCerts.includes(`cert_${activeCert.id}`);
    const canDo = canAttempt(activeCert);

    return (
      <div className="min-h-screen bg-background px-4 pt-14 pb-10">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setActiveCert(null)} className="mb-4 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">← Retour</button>

          <div className="rounded-lg border border-primary/30 bg-card/80 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{earned ? '🏆' : '📜'}</span>
              <div>
                <h2 className="font-mono text-lg font-bold text-foreground">{activeCert.title}</h2>
                <p className={`font-mono text-xs ${levelColors[activeCert.level]}`}>{levelLabels[activeCert.level]}</p>
              </div>
            </div>

            <p className="text-sm text-foreground/80 mb-4">{activeCert.description}</p>

            <div className="space-y-2 mb-4">
              <p className="font-mono text-xs text-muted-foreground">Prérequis :</p>
              <p className={`text-xs ${totalXP >= activeCert.requiredXP ? 'text-primary' : 'text-danger'}`}>
                • XP minimum : {activeCert.requiredXP} (actuel : {totalXP})
              </p>
              {activeCert.requiredModules.map(m => {
                const has = state.skills[m.replace(/-/g, '_')];
                return <p key={m} className={`text-xs ${has ? 'text-primary' : 'text-danger'}`}>• Module : {m} {has ? '✓' : '✗'}</p>;
              })}
            </div>

            {earned && <p className="font-mono text-sm text-primary terminal-glow font-bold">✓ Certification obtenue</p>}

            {!earned && (
              <button
                onClick={startExam}
                disabled={!canDo}
                className={`mt-2 rounded px-6 py-2 font-mono text-sm transition-colors ${
                  canDo ? 'border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20' : 'border border-border bg-muted/20 text-muted-foreground cursor-not-allowed'
                }`}
              >
                {canDo ? 'Passer l\'examen' : 'Prérequis non remplis'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="min-h-screen bg-background px-4 pt-14 pb-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-mono text-xl text-primary terminal-glow">🏆 CERTIFICATIONS</h1>
            <p className="text-xs text-muted-foreground mt-1">Valide tes compétences pour progresser</p>
          </div>
          <button onClick={() => goToScene(-1)} className="rounded border border-border bg-secondary px-4 py-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">← Accueil</button>
        </div>

        {/* Current grade */}
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 mb-6">
          <p className="font-mono text-xs text-muted-foreground mb-1">GRADE ACTUEL</p>
          <p className="font-mono text-lg text-primary terminal-glow">{currentGrade.icon} {currentGrade.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{totalXP} XP totale • {earnedCerts.length} certification(s)</p>
        </div>

        {/* Grades progression */}
        <div className="mb-6">
          <p className="font-mono text-xs text-muted-foreground mb-3">PROGRESSION DES GRADES</p>
          <div className="flex gap-1 flex-wrap">
            {GRADES.map((g, i) => {
              const unlocked = totalXP >= g.requiredXP && g.requiredCerts.every(c => earnedCerts.includes(`cert_${c}`));
              return (
                <div key={g.id} className={`rounded px-3 py-1.5 text-xs font-mono border ${
                  unlocked ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-muted/20 text-muted-foreground'
                }`}>
                  {g.icon} {g.title}
                </div>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-3">
          {CERTIFICATIONS.map(cert => {
            const earned = earnedCerts.includes(`cert_${cert.id}`);
            const canDo = canAttempt(cert);
            return (
              <motion.button
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveCert(cert)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  earned ? 'border-primary/30 bg-primary/5' :
                  canDo ? 'border-warning/30 bg-warning/5 hover:shadow-lg' :
                  'border-border bg-card/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{earned ? '🏆' : canDo ? '📝' : '🔒'}</span>
                    <div>
                      <p className="font-mono text-sm font-bold">{cert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cert.description}</p>
                    </div>
                  </div>
                  <span className={`font-mono text-[10px] ${levelColors[cert.level]}`}>{levelLabels[cert.level]}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
