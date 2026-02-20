import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from './Typewriter';

export const Scene1_Email = () => {
  const { nextScene, setChoice, addXP, setCompromised } = useGame();
  const [phase, setPhase] = useState<'intro' | 'email' | 'choice'>('intro');
  const [hoveredSender, setHoveredSender] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const introLines = [
    "Il est 2h14 du matin.",
    "Tu es un simple technicien support de nuit (Helpdesk) chez KRONOS Global, un fonds d'investissement qui gère 500 milliards de dollars.",
    "Ton job consiste à réinitialiser les mots de passe de banquiers trop payés.",
    "Soudain, un ticket \"URGENT - VIP\" pop sur ton écran...",
    "Il vient de Valeria Sterling, la glaciale et redoutée Directrice des Opérations (COO).",
    "Elle n'arrive pas à ouvrir une pièce jointe depuis sa chambre d'hôtel.",
    "Tu ouvres une copie de l'email bloqué par le filtre de base pour l'analyser..."
  ];

  const handleChoice = (choice: 'A' | 'B') => {
    setChoice('scene1', choice);
    if (choice === 'A') {
      setCompromised(true);
    } else {
      addXP('analytical', 50);
    }
    nextScene();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      {phase === 'intro' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl"
        >
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Scène 1 — L'Ennui et la Tentation
          </h2>
          <NarrativeBlock lines={introLines} onComplete={() => setTimeout(() => setPhase('email'), 800)} />
        </motion.div>
      )}

      {phase === 'email' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          {/* Fake Email Client */}
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
            {/* Email Header Bar */}
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-2">
              <div className="h-3 w-3 rounded-full bg-destructive/70" />
              <div className="h-3 w-3 rounded-full bg-warning/70" />
              <div className="h-3 w-3 rounded-full bg-primary/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">KRONOS Mail — Copie sécurisée</span>
            </div>

            {/* Email Content */}
            <div className="p-6">
              <div className="mb-4 space-y-2 border-b border-border pb-4">
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-semibold text-muted-foreground">De :</span>
                  <span
                    className="relative cursor-help text-foreground underline decoration-dotted"
                    onMouseEnter={() => { setHoveredSender(true); setShowTooltip('sender'); }}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    Elias Thorne &lt;Elias.Thorne@kronos-global.com&gt;
                    {showTooltip === 'sender' && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-10 left-0 z-10 whitespace-nowrap rounded border border-danger bg-card px-3 py-1 font-mono text-xs text-danger shadow-lg"
                      >
                        ⚠ Vraie adresse : Elias.Thorne@kronos-gl<span className="font-bold text-warning">0</span>bal.com
                      </motion.span>
                    )}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-semibold text-muted-foreground">À :</span>
                  <span className="text-foreground">Valeria Sterling</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-semibold text-muted-foreground">Objet :</span>
                  <span className="text-foreground">🔒 Transfert confidentiel — URGENT</span>
                </div>
              </div>

              <div className="rounded border-l-2 border-primary/30 bg-secondary/50 p-4 text-sm leading-relaxed text-foreground/80">
                <p className="mb-3">Valeria,</p>
                <p className="mb-3">
                  Le transfert offshore de <span className="font-bold text-warning">50 Millions</span> vers les Seychelles est prêt.
                  J'ai hâte de te retrouver au Plaza, Suite 402.
                </p>
                <p className="mb-3">
                  Ne laisse surtout pas ton mari voir ça.
                </p>
                <p>
                  Clique ici pour valider le routage confidentiel avant demain matin :{' '}
                  <span
                    className="relative cursor-pointer text-cyber-blue underline"
                    onMouseEnter={() => { setHoveredLink(true); setShowTooltip('link'); }}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    [LIEN_ROUTAGE_KRONOS]
                    {showTooltip === 'link' && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-10 left-0 z-10 whitespace-nowrap rounded border border-danger bg-card px-3 py-1 font-mono text-xs text-danger shadow-lg"
                      >
                        ⚠ URL : https://kronos-gl0bal.com/payload.exe
                      </motion.span>
                    )}
                  </span>
                </p>
                <p className="mt-3 italic text-muted-foreground">Je te veux.</p>
                <p className="mt-2 text-muted-foreground">— Elias</p>
              </div>

              {(hoveredSender || hoveredLink) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center font-mono text-xs text-primary terminal-glow"
                >
                  💡 Tu as repéré quelque chose de suspect...
                </motion.p>
              )}
            </div>
          </div>

          {/* Show choices after viewing email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <button
              onClick={() => handleChoice('A')}
              className="flex-1 rounded-lg border border-danger/30 bg-card px-6 py-4 text-left transition-all hover:border-danger hover:shadow-lg hover:shadow-danger/10"
            >
              <p className="font-mono text-xs text-danger">Option A — Naïveté</p>
              <p className="mt-1 text-sm text-foreground/70">Cliquer sur le lien pour voir les documents confidentiels.</p>
            </button>
            <button
              onClick={() => handleChoice('B')}
              className="flex-1 rounded-lg border border-primary/30 bg-card px-6 py-4 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            >
              <p className="font-mono text-xs text-primary">Option B — Analyse</p>
              <p className="mt-1 text-sm text-foreground/70">Signaler l'email comme suspect.</p>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
