import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectContent } from '@/data/training';

interface Props {
  content: ProjectContent;
  onComplete: () => void;
}

export const TrainingProject = ({ content, onComplete }: Props) => {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{ passed: boolean; feedback: string } | null>(null);

  const handleSubmit = () => {
    const r = content.validator(answer);
    setResult(r);
    if (r.passed) {
      setTimeout(onComplete, 2000);
    }
  };

  const displayInstructions = content.externalInstructions || (content.instructions ? content.instructions.split('\n') : []);

  return (
    <div>
      <div className="rounded-lg border border-primary/30 bg-card p-5 mb-4">
        <p className="font-mono text-xs font-bold text-primary mb-2">📋 SCÉNARIO</p>
        <p className="text-sm text-foreground/80 mb-4">{content.scenario}</p>

        <p className="font-mono text-xs font-bold text-primary mb-2">🎯 OBJECTIFS</p>
        <ul className="space-y-1 mb-4">
          {content.objectives.map((o, i) => (
            <li key={i} className="text-sm text-foreground/70">• {o}</li>
          ))}
        </ul>

        <p className="font-mono text-xs font-bold text-primary mb-2">📝 INSTRUCTIONS</p>
        {content.instructions ? (
          <pre className="text-sm text-foreground/70 whitespace-pre-wrap bg-secondary/50 rounded p-3 border border-border">
            {content.instructions}
          </pre>
        ) : content.externalInstructions ? (
          <div className="space-y-2 bg-secondary/50 rounded p-3 border border-border">
            {content.externalInstructions.map((line, i) => (
              <p key={i} className="text-sm text-foreground/70 font-mono">{line}</p>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border border-primary/30 bg-card p-4">
        <p className="font-mono text-xs text-muted-foreground mb-2">💡 {content.validationHint}</p>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Colle ta réponse ici..."
          className="w-full h-24 rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary resize-none"
        />
        {!result?.passed && (
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="mt-3 w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20 disabled:opacity-50"
          >
            Soumettre ✓
          </button>
        )}
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-3 rounded p-3 text-sm ${result.passed ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
            {result.passed ? '✓ ' : '✗ '}{result.feedback}
          </motion.div>
        )}
      </div>
    </div>
  );
};
