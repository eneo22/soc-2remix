import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

export const AudioToggle = () => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button
      onClick={toggleMute}
      className="fixed top-3 right-4 z-50 rounded-lg border border-border bg-card/80 p-2 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card"
      aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
    >
      {isMuted ? (
        <VolumeX className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Volume2 className="h-4 w-4 text-primary" />
      )}
    </button>
  );
};
