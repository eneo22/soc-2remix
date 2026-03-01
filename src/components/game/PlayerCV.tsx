// === CV PROFESSIONNEL DYNAMIQUE ===
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { GRADES, CERTIFICATIONS } from '@/data/certifications';

export const PlayerCV = () => {
  const { state, goToScene } = useGame();
  const totalXP = Object.values(state.xp).reduce((a, b) => a + b, 0);
  const earnedCerts = Object.keys(state.skills).filter(s => s.startsWith('cert_'));
  const completedModules = Object.keys(state.skills).filter(s => !s.startsWith('cert_'));

  const currentGrade = [...GRADES].reverse().find(g =>
    totalXP >= g.requiredXP && g.requiredCerts.every(c => earnedCerts.includes(`cert_${c}`))
  ) || GRADES[0];

  const certDetails = CERTIFICATIONS.filter(c => earnedCerts.includes(`cert_${c.id}`));

  return (
    <div className="min-h-screen bg-background px-4 pt-14 pb-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-mono text-xl text-primary terminal-glow">📄 CV PROFESSIONNEL</h1>
          <button onClick={() => goToScene(-1)} className="rounded border border-border bg-secondary px-4 py-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">← Accueil</button>
        </div>

        {/* CV Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-primary/30 bg-card/90 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-cyber-blue/10 px-6 py-6 border-b border-primary/20">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full border-2 border-primary/50 bg-terminal-bg flex items-center justify-center text-2xl">
                {currentGrade.icon}
              </div>
              <div>
                <h2 className="font-mono text-xl font-bold text-foreground">{state.playerName}</h2>
                <p className="font-mono text-sm text-primary">{currentGrade.title}</p>
                <p className="text-xs text-muted-foreground mt-1">KRONOS Security Operations Center</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* XP Breakdown */}
            <div>
              <h3 className="font-mono text-xs text-primary font-bold mb-3">COMPÉTENCES</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(state.xp).map(([key, val]) => {
                  const labels: Record<string, string> = {
                    technical: '⚙️ Technique', analytical: '🔍 Analytique',
                    reflexion: '🧠 Réflexion', detection: '🎯 Détection',
                  };
                  const maxXP = 500;
                  const pct = Math.min(100, (val / maxXP) * 100);
                  return (
                    <div key={key} className="rounded border border-border bg-secondary/30 p-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-foreground/80">{labels[key] || key}</span>
                        <span className="font-mono text-xs text-primary">{val}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-right font-mono text-xs text-muted-foreground mt-2">XP totale : {totalXP}</p>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="font-mono text-xs text-primary font-bold mb-3">CERTIFICATIONS</h3>
              {certDetails.length > 0 ? (
                <div className="space-y-2">
                  {certDetails.map(c => (
                    <div key={c.id} className="flex items-center gap-2 rounded border border-primary/20 bg-primary/5 px-3 py-2">
                      <span>🏆</span>
                      <span className="font-mono text-xs text-foreground">{c.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Aucune certification obtenue pour le moment.</p>
              )}
            </div>

            {/* Chapters completed */}
            <div>
              <h3 className="font-mono text-xs text-primary font-bold mb-3">CHAPITRES COMPLÉTÉS</h3>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map(ch => (
                  <div key={ch} className={`rounded-full px-3 py-1 font-mono text-xs border ${
                    state.completedChapters.includes(ch)
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border bg-muted/20 text-muted-foreground'
                  }`}>
                    Ch.{ch} {state.completedChapters.includes(ch) ? '✓' : '—'}
                  </div>
                ))}
              </div>
            </div>

            {/* Modules */}
            <div>
              <h3 className="font-mono text-xs text-primary font-bold mb-3">MODULES VALIDÉS ({completedModules.length})</h3>
              <div className="flex flex-wrap gap-1">
                {completedModules.slice(0, 20).map(m => (
                  <span key={m} className="rounded bg-secondary/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border">
                    {m.replace(/_/g, '-')}
                  </span>
                ))}
                {completedModules.length > 20 && <span className="text-xs text-muted-foreground">+{completedModules.length - 20} autres</span>}
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-border pt-4">
              <h3 className="font-mono text-xs text-primary font-bold mb-3">STATISTIQUES</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded border border-border bg-secondary/30 p-3">
                  <p className="font-mono text-lg text-primary">{state.completedChapters.length}</p>
                  <p className="text-[10px] text-muted-foreground">Chapitres</p>
                </div>
                <div className="rounded border border-border bg-secondary/30 p-3">
                  <p className="font-mono text-lg text-primary">{completedModules.length}</p>
                  <p className="text-[10px] text-muted-foreground">Modules</p>
                </div>
                <div className="rounded border border-border bg-secondary/30 p-3">
                  <p className="font-mono text-lg text-primary">{certDetails.length}</p>
                  <p className="text-[10px] text-muted-foreground">Certifications</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
