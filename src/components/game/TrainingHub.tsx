import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { trainingModules, TrainingModule, QuizContent, TerminalContent, ProjectContent } from '@/data/training';
import { XPNotification } from './GameHUD';
import { TrainingQuiz } from './TrainingQuiz';
import { TrainingTerminal } from './TrainingTerminal';
import { TrainingProject } from './TrainingProject';

export const TrainingHub = () => {
  const { state, goToScene, addXP, unlockSkill } = useGame();
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [showXP, setShowXP] = useState(false);
  const [xpInfo, setXpInfo] = useState({ cat: '', amt: 0 });
  const [filter, setFilter] = useState<string>('all');

  const allCategories = Array.from(new Set(trainingModules.map(m => m.category)));
  const filtered = filter === 'all' ? trainingModules : trainingModules.filter(m => m.category === filter);

  const isUnlocked = (m: TrainingModule) => {
    if (m.requiredSkills.length === 0) return true;
    return m.requiredSkills.every(s => state.skills[s]);
  };

  const handleComplete = (module: TrainingModule) => {
    setCompletedModules(c => [...c, module.id]);
    const xp = module.xpReward;
    let totalXP = 0;
    if (xp.technical) { addXP('technical', xp.technical); totalXP += xp.technical; }
    if (xp.analytical) { addXP('analytical', xp.analytical); totalXP += xp.analytical; }
    if (xp.reflexion) { addXP('reflexion', xp.reflexion); totalXP += xp.reflexion; }
    if (xp.detection) { addXP('detection', xp.detection); totalXP += xp.detection; }
    unlockSkill(module.id.replace(/-/g, '_'));
    setXpInfo({ cat: 'Total', amt: totalXP });
    setShowXP(true);
    setTimeout(() => setShowXP(false), 2500);
    setTimeout(() => setActiveModule(null), 1500);
  };

  const categoryLabels: Record<string, string> = {
    all: 'Tous',
    analysis: '🔍 Analyse',
    linux: '💻 Linux',
    response: '🛡️ Réponse',
    network: '🌐 Réseau',
    threats: '⚔️ Menaces',
  };

  const categoryColors: Record<string, string> = {
    analysis: 'text-cyber-blue border-cyber-blue/30 bg-cyber-blue/5',
    linux: 'text-primary border-primary/30 bg-primary/5',
    response: 'text-danger border-danger/30 bg-danger/5',
    network: 'text-warning border-warning/30 bg-warning/5',
    threats: 'text-accent border-accent/30 bg-accent/5',
  };

  const difficultyColors: Record<string, string> = {
    'débutant': 'text-primary',
    'intermédiaire': 'text-warning',
    'avancé': 'text-danger',
  };

  if (activeModule) {
    return (
      <div className="min-h-screen bg-background px-4 pt-14 pb-10">
        <AnimatePresence>{showXP && <XPNotification category={xpInfo.cat} amount={xpInfo.amt} />}</AnimatePresence>
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setActiveModule(null)} className="mb-4 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">← Retour au hub</button>
          <h2 className="mb-6 font-mono text-lg text-primary terminal-glow">{activeModule.title}</h2>
          {activeModule.content.type === 'quiz' && <TrainingQuiz content={activeModule.content as QuizContent} onComplete={() => handleComplete(activeModule)} />}
          {activeModule.content.type === 'terminal' && <TrainingTerminal content={activeModule.content as TerminalContent} onComplete={() => handleComplete(activeModule)} />}
          {activeModule.content.type === 'project' && <TrainingProject content={activeModule.content as ProjectContent} onComplete={() => handleComplete(activeModule)} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-14 pb-10">
      <AnimatePresence>{showXP && <XPNotification category={xpInfo.cat} amount={xpInfo.amt} />}</AnimatePresence>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-mono text-xl text-primary terminal-glow">🏋️ MODE ENTRAÎNEMENT</h1>
            <p className="text-xs text-muted-foreground mt-1">Renforce tes compétences avec des exercices pratiques</p>
          </div>
          <button onClick={() => goToScene(-1)} className="rounded border border-border bg-secondary px-4 py-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">← Accueil</button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', ...allCategories].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all ${
                filter === f ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-secondary text-muted-foreground border border-border hover:border-primary/30'
              }`}
            >
              {categoryLabels[f] || f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((module) => {
            const unlocked = isUnlocked(module);
            const completed = completedModules.includes(module.id);
            return (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => unlocked && !completed && setActiveModule(module)}
                disabled={!unlocked || completed}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  completed ? 'border-primary/30 bg-primary/5 opacity-70' :
                  unlocked ? `${categoryColors[module.category] || 'border-border bg-card'} hover:shadow-lg cursor-pointer` :
                  'border-border bg-muted/20 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{completed ? '✅' : !unlocked ? '🔒' : module.type === 'quiz' ? '📝' : module.type === 'terminal' ? '💻' : '🔧'}</span>
                    <div>
                      <p className="font-mono text-sm font-bold">{module.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{module.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono text-[10px] ${difficultyColors[module.difficulty]}`}>{module.difficulty}</span>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1">+{Object.values(module.xpReward).reduce((a, b) => a + (b || 0), 0)} XP</p>
                  </div>
                </div>
                {!unlocked && module.requiredSkills.length > 0 && (
                  <p className="mt-2 text-[10px] text-muted-foreground italic">Requiert : {module.requiredSkills.join(', ')}</p>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
