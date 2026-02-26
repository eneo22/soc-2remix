import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { DialogBox } from '../DialogBox';

const STEPS = [
  { label: 'Compromission initiale via 192.168.1.45', layer: '7', hint: 'SSH = Application' },
  { label: 'Déplacement latéral vers serveur backup', layer: '4', hint: 'Connexion TCP' },
  { label: 'Modification DNS interne', layer: '7', hint: 'DNS = Application' },
  { label: 'Faux service système (system-update)', layer: '7', hint: 'Processus applicatif' },
  { label: 'Exfiltration chiffrée TCP/443', layer: '4', hint: 'Transport TCP' },
];

export const Ch5Scene5_Chain = () => {
  const { nextScene, addXP } = useGame();
  const { playSFX } = useAudio();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    playSFX('notification');
    setSubmitted(true);
    const correct = STEPS.filter((s, i) => answers[i] === s.layer).length;
    addXP('analytical', correct * 10);
    addXP('technical', correct * 5);
  };

  const score = STEPS.filter((s, i) => answers[i] === s.layer).length;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary terminal-glow text-center mb-4">
          Reconstruction de la Kill Chain
        </h2>

        <DialogBox character="marcus">
          <p>"Reconstitue l'attaque. Associe chaque étape à sa couche OSI."</p>
        </DialogBox>

        <div className="space-y-3 mt-4">
          {STEPS.map((step, i) => (
            <div key={i} className={`rounded-lg border p-4 ${submitted ? (answers[i] === step.layer ? 'border-primary/50 bg-primary/5' : 'border-danger/50 bg-danger/5') : 'border-border bg-card'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-mono text-xs text-muted-foreground">Étape {i + 1}</p>
                  <p className="text-sm text-foreground/80">{step.label}</p>
                </div>
                <select
                  value={answers[i] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
                  disabled={submitted}
                  className="rounded border border-border bg-secondary px-3 py-2 font-mono text-xs text-foreground outline-none"
                >
                  <option value="">Couche ?</option>
                  {['1', '2', '3', '4', '5', '6', '7'].map(l => (
                    <option key={l} value={l}>Couche {l}</option>
                  ))}
                </select>
              </div>
              {submitted && answers[i] !== step.layer && (
                <p className="mt-2 text-xs text-danger">Réponse : Couche {step.layer} — {step.hint}</p>
              )}
              {submitted && answers[i] === step.layer && (
                <p className="mt-2 text-xs text-primary">✓ Correct — {step.hint}</p>
              )}
            </div>
          ))}
        </div>

        {!submitted ? (
          <button onClick={handleSubmit} disabled={Object.keys(answers).length < STEPS.length}
            className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all disabled:opacity-50">
            Valider la reconstruction
          </button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="rounded-lg border border-primary/30 bg-card p-4 text-center">
              <p className="font-mono text-lg text-primary terminal-glow">{score}/{STEPS.length} correct</p>
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
