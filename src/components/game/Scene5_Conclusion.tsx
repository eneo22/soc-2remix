import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from './Typewriter';

export const Scene5_Conclusion = () => {
  const { state, goToScene, completeChapter } = useGame();

  const handleContinue = (target: number) => {
    completeChapter(1);
    goToScene(target);
  };
  const totalXP = Object.values(state.xp).reduce((a, b) => a + b, 0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full"
      >
        <h2 className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
          Scène 5 — L'Aube d'un Analyste
        </h2>

        <div className="space-y-4 mb-8">
          <NarrativeBlock
            lines={[
              "Tu coupes l'accès Wi-Fi de la suite de Valeria.",
              "Le flux de données illégales s'arrête net.",
              "Le silence retombe dans la salle des serveurs.",
            ]}
            speed={30}
          />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }} className="rounded-lg border border-danger/30 bg-card p-4">
            <p className="font-mono text-xs text-danger mb-1">💬 VALERIA STERLING</p>
            <p className="text-sm text-foreground/80 italic">"Tu le regretteras."</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.5 }} className="rounded-lg border border-primary/30 bg-card p-4">
            <p className="font-mono text-xs text-primary mb-1">MARCUS</p>
            <p className="text-sm text-foreground/80">
              "T'as du cran, petit. T'as fait perdre son bonus à Valeria, mais t'as sauvé les meubles.
              Oblivion est toujours dans la nature, et ils savent qu'on les a bloqués.
              Ils vont revenir taper plus fort."
            </p>
            <p className="mt-3 text-sm text-foreground/80">
              "T'en as marre de réinitialiser des mots de passe ?
              Demain, tu montes au 40ème étage. <span className="font-bold text-primary">Bienvenue dans le SOC.</span>"
            </p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 8 }} className="rounded-xl border border-primary/50 bg-card p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 8.5, type: 'spring' }} className="mb-4 inline-block rounded-full border-2 border-primary bg-primary/10 p-4">
            <span className="text-3xl">🔓</span>
          </motion.div>

          <h3 className="mb-2 font-mono text-lg font-bold text-primary terminal-glow">CHAPITRE 1 TERMINÉ</h3>
          <p className="mb-6 text-sm text-muted-foreground">L'Appât — The Bait</p>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {[
              { label: 'Technique', value: state.xp.technical, icon: '⚡' },
              { label: 'Analytique', value: state.xp.analytical, icon: '🔍' },
              { label: 'Réflexion', value: state.xp.reflexion, icon: '🧠' },
              { label: 'Détection', value: state.xp.detection, icon: '🎯' },
            ].map((cat) => (
              <div key={cat.label} className="rounded border border-border bg-secondary/50 p-3">
                <p className="text-lg">{cat.icon}</p>
                <p className="font-mono text-xs text-muted-foreground">{cat.label}</p>
                <p className="font-mono text-sm font-bold text-primary">+{cat.value} XP</p>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded border border-primary/20 bg-primary/5 p-4">
            <p className="font-mono text-2xl font-bold text-primary terminal-glow">{totalXP} XP Total</p>
          </div>

          <div className="mb-6 rounded border border-border bg-secondary/50 p-4 text-left">
            <p className="mb-2 font-mono text-xs font-bold text-primary">📚 Résumé pédagogique</p>
            <ul className="mt-2 space-y-1 text-sm text-foreground/70">
              <li>1. Le <span className="font-bold text-warning">Phishing</span> exploite l'humain, pas la machine.</li>
              <li>2. Une <span className="font-bold text-primary">adresse IP</span> identifie une machine sur un réseau.</li>
              <li>3. En cas d'attaque, on <span className="font-bold text-primary">Isole d'abord</span> (Containment).</li>
            </ul>
          </div>

          <div className="mb-6 rounded border border-border bg-secondary/50 p-4 text-left">
            <p className="mb-2 font-mono text-xs font-bold text-muted-foreground">Vos choix :</p>
            <p className="text-xs text-foreground/60">
              Email suspect : <span className={state.choices.scene1 === 'B' ? 'text-primary' : 'text-danger'}>
                {state.choices.scene1 === 'B' ? '✓ Signalé' : '✗ Cliqué'}
              </span>
            </p>
            <p className="text-xs text-foreground/60">
              Réponse incident : <span className={state.choices.scene4 === 'C' ? 'text-primary' : 'text-danger'}>
                {state.choices.scene4 === 'C' ? '✓ Isolation' : state.choices.scene4 === 'B' ? '~ Antivirus' : '✗ Corruption'}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleContinue(6)}
              className="flex-1 rounded-lg border border-primary bg-primary/10 px-6 py-4 font-mono text-sm text-primary transition-all hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10"
            >
              ▶ CHAPITRE 2
            </button>
            <button
              onClick={() => handleContinue(-1)}
              className="flex-1 rounded-lg border border-border bg-secondary px-6 py-4 font-mono text-sm text-muted-foreground transition-all hover:text-foreground hover:border-primary/30"
            >
              ← ACCUEIL
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
