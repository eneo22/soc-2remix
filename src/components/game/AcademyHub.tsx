// === ACADEMY HUB ===
// Skill reference, revision center with diagrams and external links

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { ACADEMY_SKILLS, AcademySkill } from '@/data/certifications';

export const AcademyHub = () => {
  const { state, goToScene } = useGame();
  const [activeSkill, setActiveSkill] = useState<AcademySkill | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('kronos-favorites') || '[]'); } catch { return []; }
  });
  const [toReview, setToReview] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('kronos-review') || '[]'); } catch { return []; }
  });

  const categories = Array.from(new Set(ACADEMY_SKILLS.map(s => s.category)));
  const filtered = filter === 'all' ? ACADEMY_SKILLS
    : filter === 'favorites' ? ACADEMY_SKILLS.filter(s => favorites.includes(s.id))
    : filter === 'review' ? ACADEMY_SKILLS.filter(s => toReview.includes(s.id))
    : ACADEMY_SKILLS.filter(s => s.category === filter);

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem('kronos-favorites', JSON.stringify(next));
  };

  const toggleReview = (id: string) => {
    const next = toReview.includes(id) ? toReview.filter(f => f !== id) : [...toReview, id];
    setToReview(next);
    localStorage.setItem('kronos-review', JSON.stringify(next));
  };

  const catLabels: Record<string, string> = {
    all: 'Toutes', network: '🌐 Réseau', linux: '💻 Linux',
    analysis: '🔍 Analyse', python: '🐍 Python', response: '🛡️ Réponse',
    favorites: '⭐ Favoris', review: '📌 À revoir',
  };

  const diffColors: Record<string, string> = {
    'débutant': 'text-primary', 'intermédiaire': 'text-warning', 'avancé': 'text-danger',
  };

  if (activeSkill) {
    return (
      <div className="min-h-screen bg-background px-4 pt-14 pb-10">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setActiveSkill(null)} className="mb-4 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">← Retour à l'Academy</button>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-lg text-primary terminal-glow">{activeSkill.title}</h2>
            <div className="flex gap-2">
              <button onClick={() => toggleFavorite(activeSkill.id)} className={`text-lg ${favorites.includes(activeSkill.id) ? 'text-warning' : 'text-muted-foreground'}`}>
                {favorites.includes(activeSkill.id) ? '⭐' : '☆'}
              </button>
              <button onClick={() => toggleReview(activeSkill.id)} className={`text-lg ${toReview.includes(activeSkill.id) ? 'text-primary' : 'text-muted-foreground'}`}>
                {toReview.includes(activeSkill.id) ? '📌' : '📎'}
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-primary/20 bg-card/80 p-4 mb-4">
            <p className="font-mono text-xs text-primary mb-1 font-bold">RÉSUMÉ</p>
            <p className="text-sm text-foreground/90">{activeSkill.summary}</p>
          </div>

          {/* Explanation */}
          <div className="rounded-lg border border-border bg-card/50 p-4 mb-4">
            <p className="font-mono text-xs text-cyber-blue mb-2 font-bold">EXPLICATION TECHNIQUE</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{activeSkill.explanation}</p>
          </div>

          {/* Diagram */}
          {activeSkill.diagram && (
            <div className="rounded-lg border border-primary/30 bg-terminal-bg p-4 mb-4">
              <p className="font-mono text-xs text-primary mb-2 font-bold">SCHÉMA</p>
              <pre className="font-mono text-xs text-foreground/90 whitespace-pre overflow-x-auto">{activeSkill.diagram}</pre>
            </div>
          )}

          {/* Practical example */}
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-4 mb-4">
            <p className="font-mono text-xs text-warning mb-1 font-bold">💡 CAS PRATIQUE</p>
            <p className="text-sm text-foreground/80">{activeSkill.practicalExample}</p>
          </div>

          {/* External links */}
          <div className="rounded-lg border border-border bg-card/50 p-4">
            <p className="font-mono text-xs text-cyber-blue mb-3 font-bold">📚 RESSOURCES EXTERNES</p>
            <div className="space-y-2">
              {activeSkill.externalLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded border border-border bg-secondary/50 px-3 py-2 hover:border-primary/30 transition-colors"
                >
                  <span className="text-xs text-foreground/80">{link.label}</span>
                  <span className={`font-mono text-[10px] ${diffColors[link.level]}`}>{link.level}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-14 pb-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-mono text-xl text-primary terminal-glow">📖 ACADEMY</h1>
            <p className="text-xs text-muted-foreground mt-1">Fiches de révision, schémas et ressources</p>
          </div>
          <button onClick={() => goToScene(-1)} className="rounded border border-border bg-secondary px-4 py-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">← Accueil</button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', ...categories, 'favorites', 'review'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 font-mono text-xs transition-all ${
                filter === f ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-secondary text-muted-foreground border border-border hover:border-primary/30'
              }`}
            >
              {catLabels[f] || f}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map(skill => (
            <motion.button
              key={skill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setActiveSkill(skill)}
              className="rounded-lg border border-border bg-card/50 p-4 text-left hover:border-primary/30 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-mono text-sm font-bold text-foreground">{skill.title}</p>
                <span className={`font-mono text-[10px] ${diffColors[skill.difficulty]}`}>{skill.difficulty}</span>
              </div>
              <p className="text-xs text-muted-foreground">{skill.summary}</p>
              <div className="flex gap-1 mt-2">
                {favorites.includes(skill.id) && <span className="text-xs">⭐</span>}
                {toReview.includes(skill.id) && <span className="text-xs">📌</span>}
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-2 text-center py-8">Aucune fiche dans cette catégorie.</p>
          )}
        </div>
      </div>
    </div>
  );
};
