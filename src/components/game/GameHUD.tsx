import { motion } from 'framer-motion';

interface XPNotificationProps {
  category: string;
  amount: number;
}

export const XPNotification = ({ category, amount }: XPNotificationProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20 }}
    className="fixed bottom-6 right-6 z-50 rounded-lg border border-primary/50 bg-card px-4 py-3 shadow-lg"
  >
    <p className="font-mono text-sm font-bold text-primary terminal-glow">
      +{amount} XP {category}
    </p>
  </motion.div>
);

interface GameHUDProps {
  xp: { technical: number; analytical: number; reflexion: number; detection: number };
  chapter: number;
  scene: number;
}

export const GameHUD = ({ xp, chapter, scene }: GameHUDProps) => {
  const totalXP = Object.values(xp).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-border/50 bg-background/90 px-4 py-2 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-primary terminal-glow">KRONOS SOC</span>
        <span className="text-xs text-muted-foreground">
          ARC 1 — CH.{chapter} / Scène {scene + 1}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-primary">{totalXP} XP</span>
        <div className="hidden md:flex gap-2 text-[10px] text-muted-foreground">
          <span>TEC:{xp.technical}</span>
          <span>ANA:{xp.analytical}</span>
          <span>REF:{xp.reflexion}</span>
          <span>DET:{xp.detection}</span>
        </div>
      </div>
    </motion.div>
  );
};
