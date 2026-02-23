import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';

export const Ch3Scene1_OSI = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'osi' | 'quiz' | 'done'>('intro');
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const layers = [
    { n: 7, name: 'Application', desc: 'HTTP, FTP, DNS — les protocoles que vous utilisez.', ex: 'Quand vous tapez une URL dans votre navigateur.' },
    { n: 6, name: 'Présentation', desc: 'Chiffrement, compression, format des données.', ex: 'TLS/SSL qui sécurise vos connexions.' },
    { n: 5, name: 'Session', desc: 'Gestion des connexions entre machines.', ex: 'Maintenir votre session ouverte sur un site.' },
    { n: 4, name: 'Transport', desc: 'TCP / UDP — fiabilité de la transmission.', ex: 'TCP garantit que chaque paquet arrive.' },
    { n: 3, name: 'Réseau', desc: 'Adresses IP et routage.', ex: 'Le routeur choisit le chemin pour vos données.' },
    { n: 2, name: 'Liaison de données', desc: 'Adresses MAC, trames.', ex: 'Votre carte réseau communique avec le switch.' },
    { n: 1, name: 'Physique', desc: 'Câbles, signaux électriques, ondes.', ex: 'Le câble Ethernet branché sur votre PC.' },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full">
        <h2 className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
          Chapitre 3 — Les Couches Invisibles
        </h2>

        {phase === 'intro' && (
          <div className="space-y-4">
            <NarrativeBlock
              lines={[
                "La salle réseau est silencieuse.",
                "Les écrans du SOC clignotent en rouge.",
                "Marcus apparaît, l'air grave.",
              ]}
              speed={30}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
              <p className="text-sm text-foreground/80">
                "Un service critique ne répond plus. Les utilisateurs ne peuvent plus accéder à l'intranet.
                On ne devine pas un problème réseau. <span className="text-primary font-bold">On le découpe.</span>"
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5 }} className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-center">
              <p className="font-mono text-xs text-danger">❌ Erreur : Serveur intranet injoignable</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.5 }} className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
              <p className="text-sm text-foreground/80">"Aujourd'hui, tu vas apprendre à penser en couches."</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7 }} className="text-center">
              <button onClick={() => setPhase('osi')} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all">
                Découvrir le modèle OSI →
              </button>
            </motion.div>
          </div>
        )}

        {phase === 'osi' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4 mb-4">
              <p className="font-mono text-xs text-primary mb-2">🧠 MODULE PÉDAGOGIQUE — MODÈLE OSI</p>
              <p className="text-sm text-foreground/80">Un réseau fonctionne en <span className="text-primary font-bold">7 couches superposées</span>. Clique sur chaque couche pour comprendre son rôle.</p>
            </div>

            <div className="space-y-2">
              {layers.map((l) => (
                <button
                  key={l.n}
                  onClick={() => setSelectedLayer(l.n === selectedLayer ? null : l.n)}
                  className={`w-full rounded border p-3 text-left transition-all ${
                    selectedLayer === l.n
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">
                      <span className="text-primary font-bold">Couche {l.n}</span> — {l.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{selectedLayer === l.n ? '▼' : '▶'}</span>
                  </div>
                  {selectedLayer === l.n && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-2 text-xs text-foreground/70">
                      <p>{l.desc}</p>
                      <p className="mt-1 text-primary/70 italic">Ex: {l.ex}</p>
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <button onClick={() => setPhase('quiz')} className="mt-4 w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all">
              Valider mes connaissances →
            </button>
          </motion.div>
        )}

        {phase === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-card p-4">
              <p className="font-mono text-xs text-primary mb-2">QUIZ — MODÈLE OSI</p>
              <p className="text-sm text-foreground/80">À quelle couche appartiennent les adresses IP ?</p>
            </div>
            <div className="space-y-2">
              {[
                { text: 'Couche 7 — Application', correct: false },
                { text: 'Couche 4 — Transport', correct: false },
                { text: 'Couche 3 — Réseau', correct: true },
                { text: 'Couche 1 — Physique', correct: false },
              ].map((opt) => (
                <button
                  key={opt.text}
                  disabled={answered}
                  onClick={() => {
                    setAnswered(true);
                    if (opt.correct) {
                      addXP('analytical', 30);
                      setTimeout(() => setPhase('done'), 1500);
                    }
                  }}
                  className={`w-full rounded border p-3 text-left font-mono text-xs transition-all ${
                    answered
                      ? opt.correct ? 'border-primary bg-primary/20 text-primary' : 'border-border bg-muted/20 text-muted-foreground'
                      : 'border-border bg-card hover:border-primary/30 text-foreground'
                  }`}
                >
                  {opt.text}
                  {answered && opt.correct && <span className="ml-2">✓</span>}
                </button>
              ))}
            </div>
            {answered && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-primary">
                Exact ! La couche 3 (Réseau) gère les adresses IP et le routage.
              </motion.p>
            )}
            {answered && (
              <button onClick={() => setPhase('done')} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
                Continuer →
              </button>
            )}
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className="text-sm text-foreground/80 mb-4">Tu connais maintenant les 7 couches du modèle OSI.</p>
            <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20">
              Passer au diagnostic →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
