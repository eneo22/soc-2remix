import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

const chapters = [
  { id: 1, title: "L'Appât", subtitle: 'The Bait', icon: '🎣', startScene: 0, description: 'Phishing, social engineering, premiers réflexes.' },
  { id: 2, title: 'Anatomie d\'un Réseau', subtitle: 'Network Anatomy', icon: '🌐', startScene: 6, description: 'IP, DNS, ports, trafic réseau, Wireshark.' },
  { id: 3, title: 'Les Couches Invisibles', subtitle: 'The Invisible Layers', icon: '🧬', startScene: 13, description: 'Modèle OSI, TCP/IP, ARP, diagnostic réseau.' },
  { id: 4, title: 'Les Couches du Mensonge', subtitle: 'Layers of Deception', icon: '🕸️', startScene: 20, description: 'ARP spoofing, DNS poisoning, attaque multi-couches.' },
  { id: 5, title: "L'Ombre Persistante", subtitle: 'The Persistent Shadow', icon: '🕵️', startScene: 27, description: 'Investigation avancée, corrélation multi-logs, persistance attaquant.' },
];

export const ChapterSelect = () => {
  const { state, goToScene } = useGame();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-mono text-xl text-primary terminal-glow">📖 MODE HISTOIRE</h1>
            <p className="text-xs text-muted-foreground mt-1">ARC 1 — Sélectionne un chapitre</p>
          </div>
          <button
            onClick={() => goToScene(-1)}
            className="rounded border border-border bg-secondary px-4 py-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Accueil
          </button>
        </div>

        <div className="space-y-4">
          {chapters.map((ch, i) => {
            const unlocked = state.unlockedChapters.includes(ch.id);
            const completed = state.completedChapters.includes(ch.id);

            return (
              <motion.button
                key={ch.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => unlocked && goToScene(ch.startScene)}
                disabled={!unlocked}
                className={`w-full rounded-lg border p-5 text-left transition-all ${
                  completed
                    ? 'border-primary/40 bg-primary/5 hover:bg-primary/10 cursor-pointer'
                    : unlocked
                    ? 'border-primary/30 bg-card hover:bg-primary/10 hover:shadow-lg cursor-pointer'
                    : 'border-border bg-muted/20 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{unlocked ? ch.icon : '🔒'}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">CHAPITRE {ch.id}</span>
                      {completed && <span className="font-mono text-[10px] text-primary">✓ TERMINÉ</span>}
                    </div>
                    <p className="font-mono text-sm font-bold text-foreground mt-0.5">{ch.title}</p>
                    <p className="text-xs text-muted-foreground italic">{ch.subtitle}</p>
                    <p className="text-xs text-foreground/60 mt-1">{ch.description}</p>
                  </div>
                  {unlocked && (
                    <span className="font-mono text-xs text-primary">
                      {completed ? 'REJOUER →' : 'LANCER →'}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
