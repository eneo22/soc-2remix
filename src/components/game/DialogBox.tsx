import { motion } from 'framer-motion';
import avatarMarcus from '@/assets/avatar-marcus.jpg';
import avatarValeria from '@/assets/avatar-valeria.jpg';
import avatarElias from '@/assets/avatar-elias.jpg';
import avatarOblivion from '@/assets/avatar-oblivion.jpg';

export type CharacterId = 'marcus' | 'valeria' | 'elias' | 'oblivion' | 'narrator' | 'player';

const CHARACTER_DATA: Record<CharacterId, { name: string; avatar?: string; color: string; border: string }> = {
  marcus: { name: 'Marcus', avatar: avatarMarcus, color: 'text-primary', border: 'border-primary/40' },
  valeria: { name: 'Valeria Sterling', avatar: avatarValeria, color: 'text-danger', border: 'border-danger/40' },
  elias: { name: 'Elias Thorne', avatar: avatarElias, color: 'text-warning', border: 'border-warning/40' },
  oblivion: { name: 'OBLIVION', avatar: avatarOblivion, color: 'text-danger', border: 'border-danger/60' },
  narrator: { name: '', color: 'text-muted-foreground', border: 'border-border' },
  player: { name: 'Toi', color: 'text-cyber-blue', border: 'border-cyber-blue/40' },
};

interface DialogBoxProps {
  character: CharacterId;
  children: React.ReactNode;
  className?: string;
}

export const DialogBox = ({ character, children, className = '' }: DialogBoxProps) => {
  const data = CHARACTER_DATA[character];
  const isNarrator = character === 'narrator';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${className}`}
    >
      {!isNarrator && data.avatar && (
        <div className={`shrink-0 h-12 w-12 rounded-full border-2 ${data.border} overflow-hidden ${character === 'oblivion' ? 'glitch-text' : ''}`}>
          <img src={data.avatar} alt={data.name} className="h-full w-full object-cover" />
        </div>
      )}
      <div className={`flex-1 rounded-lg border ${data.border} bg-card/80 backdrop-blur-sm px-4 py-3`}>
        {data.name && (
          <p className={`font-mono text-xs font-bold ${data.color} mb-1`}>{data.name}</p>
        )}
        <div className="text-sm text-foreground/90 leading-relaxed">{children}</div>
      </div>
    </motion.div>
  );
};
