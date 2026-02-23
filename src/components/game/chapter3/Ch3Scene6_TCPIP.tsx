import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

export const Ch3Scene6_TCPIP = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'compare' | 'exercise' | 'done'>('compare');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const comparisons = [
    { osi: 'Physique + Liaison', tcpip: 'Accès réseau', desc: 'Câbles, MAC, trames' },
    { osi: 'Réseau', tcpip: 'Internet', desc: 'IP, routage' },
    { osi: 'Transport', tcpip: 'Transport', desc: 'TCP, UDP, ports' },
    { osi: 'Session + Présentation + Application', tcpip: 'Application', desc: 'HTTP, DNS, FTP...' },
  ];

  const exercises = [
    { id: 1, problem: 'Câble débranché', correctLayer: 'physique', correctTool: 'ping' },
    { id: 2, problem: 'Mauvais DNS', correctLayer: 'application', correctTool: 'nslookup' },
    { id: 3, problem: 'Port fermé', correctLayer: 'transport', correctTool: 'telnet' },
    { id: 4, problem: 'Route inexistante', correctLayer: 'internet', correctTool: 'traceroute' },
    { id: 5, problem: 'Conflit ARP', correctLayer: 'accès réseau', correctTool: 'arp' },
  ];

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    exercises.forEach(ex => {
      if (answers[ex.id]?.toLowerCase().includes(ex.correctLayer)) correct++;
    });
    addXP('analytical', correct * 20);
    addXP('reflexion', correct * 10);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full">
        <h2 className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
          Chapitre 3 — TCP/IP & Diagnostic
        </h2>

        {phase === 'compare' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
              <p className="text-sm text-foreground/80">"Maintenant simplifie. Le modèle TCP/IP regroupe les 7 couches OSI en 4."</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-mono text-xs text-primary mb-3">OSI → TCP/IP</p>
              <div className="space-y-2">
                {comparisons.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 rounded border border-border p-2">
                    <div className="flex-1 text-xs text-foreground/70">{c.osi}</div>
                    <span className="text-primary">→</span>
                    <div className="flex-1 font-mono text-xs text-primary font-bold">{c.tcpip}</div>
                    <div className="flex-1 text-[10px] text-muted-foreground italic">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setPhase('exercise')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Exercice pratique →
            </button>
          </div>
        )}

        {phase === 'exercise' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">🎯 EXERCICE — Associe chaque problème à sa couche TCP/IP</p>
              <p className="text-xs text-muted-foreground">Couches possibles : accès réseau, internet, transport, application</p>
            </div>

            {exercises.map(ex => (
              <div key={ex.id} className="rounded border border-border bg-card p-3">
                <p className="font-mono text-xs text-foreground mb-2">{ex.id}. {ex.problem}</p>
                <input
                  value={answers[ex.id] || ''}
                  onChange={(e) => setAnswers(a => ({ ...a, [ex.id]: e.target.value }))}
                  disabled={submitted}
                  placeholder="Couche TCP/IP..."
                  className="w-full rounded border border-input bg-background px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-primary"
                />
                {submitted && (
                  <p className={`mt-1 text-[10px] ${answers[ex.id]?.toLowerCase().includes(ex.correctLayer) ? 'text-primary' : 'text-danger'}`}>
                    {answers[ex.id]?.toLowerCase().includes(ex.correctLayer)
                      ? `✓ Correct — Outil : ${ex.correctTool}`
                      : `✗ Réponse attendue : ${ex.correctLayer} — Outil : ${ex.correctTool}`
                    }
                  </p>
                )}
              </div>
            ))}

            {!submitted ? (
              <button onClick={handleSubmit} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                Valider →
              </button>
            ) : (
              <button onClick={() => setPhase('done')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                Continuer →
              </button>
            )}
          </div>
        )}

        {phase === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
            <p className="text-sm text-foreground/80">Tu sais maintenant associer un problème réseau à sa couche et choisir le bon outil de diagnostic.</p>
            <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Conclusion du chapitre →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
