import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuizContent } from '@/data/training';

interface Props {
  content: QuizContent;
  onComplete: () => void;
}

export const TrainingQuiz = ({ content, onComplete }: Props) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const question = content.questions[currentQ];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (question.options[i].correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQ < content.questions.length - 1) {
        setCurrentQ(c => c + 1);
        setSelected(null);
      } else {
        setDone(true);
        onComplete();
      }
    }, 2000);
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
        <p className="text-4xl mb-4">{score === content.questions.length ? '🎉' : '📚'}</p>
        <p className="font-mono text-lg text-primary terminal-glow">{score}/{content.questions.length} correct</p>
        <p className="text-sm text-muted-foreground mt-2">Module terminé !</p>
      </motion.div>
    );
  }

  return (
    <div>
      <p className="font-mono text-xs text-muted-foreground mb-2">Question {currentQ + 1}/{content.questions.length}</p>
      <div className="rounded-lg border border-primary/30 bg-card p-4 mb-4">
        <p className="text-sm text-foreground/90">{question.question}</p>
      </div>
      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={selected !== null}
            className={`w-full rounded-lg border p-4 text-left text-sm transition-all ${
              selected === i
                ? opt.correct ? 'border-primary bg-primary/10 text-primary' : 'border-danger bg-danger/10 text-danger'
                : selected !== null && opt.correct ? 'border-primary/50 bg-primary/5' : 'border-border bg-card text-foreground/70 hover:border-primary/50'
            }`}
          >
            {opt.text}
            {selected === i && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs italic">{opt.feedback}</motion.p>
            )}
          </button>
        ))}
      </div>
      {selected !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded border border-border bg-secondary/50 p-3 text-xs text-foreground/70">
          <p className="font-bold text-primary mb-1">💡 Explication</p>
          <p>{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
};
