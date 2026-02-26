import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { NarrativeBlock } from '../Typewriter';
import { DialogBox } from '../DialogBox';

export const Ch5Scene3_DNS = () => {
  const { nextScene, addXP } = useGame();
  const { playSFX } = useAudio();
  const [phase, setPhase] = useState(0);
  const [cmd, setCmd] = useState('');
  const [outputs, setOutputs] = useState<{ cmd: string; result: string[] }[]>([]);

  const advance = () => {
    playSFX('beep');
    setPhase(p => p + 1);
  };

  const handleCmd = () => {
    const trimmed = cmd.trim().toLowerCase();
    setCmd('');

    if (trimmed.includes('nslookup') && trimmed.includes('backup')) {
      playSFX('notification');
      setOutputs(o => [...o, { cmd: trimmed, result: [
        'Server:  10.0.0.1',
        'Address: 10.0.0.1#53',
        '',
        'Name:    backup.kronos.local',
        'Address: 192.168.1.99',
        '',
        '[⚠] INCOHÉRENCE DNS !',
        'Le fichier hosts résolvait → 192.168.1.12',
        'Le DNS résout → 192.168.1.99',
        'Deux adresses différentes pour le même nom.',
      ] }]);
      setTimeout(advance, 2000);
    } else if (trimmed.includes('cat') && trimmed.includes('resolv')) {
      playSFX('notification');
      setOutputs(o => [...o, { cmd: trimmed, result: [
        '# /etc/resolv.conf',
        '# Modifié le 2024-03-15 à 02:08',
        'nameserver 10.0.0.99',
        '',
        '[⚠] Le serveur DNS a été modifié dans la nuit !',
        'L\'ancien serveur était 10.0.0.1 (DNS Kronos officiel)',
        'Nouveau : 10.0.0.99 — NON RECONNU',
      ] }]);
      addXP('detection', 20);
      setTimeout(() => setPhase(3), 2000);
    } else {
      setOutputs(o => [...o, { cmd: trimmed, result: ['bash: essaie nslookup ou cat /etc/resolv.conf'] }]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-warning terminal-glow text-center mb-4">
          Premier Plot Twist — Incohérence DNS
        </h2>

        {phase === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <NarrativeBlock lines={["Nora affiche un log DNS interne :"]} speed={25} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="rounded-lg border border-warning/30 bg-card p-4 font-mono text-sm">
              <p className="text-foreground/70">backup.kronos.local → <span className="text-primary">192.168.1.12</span></p>
              <p className="text-xs text-muted-foreground mt-2 italic">Entrée du fichier hosts local</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
              <p className="text-sm text-foreground/80 mb-3">Vérifie avec un nslookup. Tape la commande :</p>
              <div className="rounded-lg border border-primary/50 bg-black/80 p-4 font-mono text-xs">
                {outputs.map((o, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-primary">$ {o.cmd}</p>
                    {o.result.map((l, j) => <p key={j} className={l.startsWith('[') ? 'text-warning' : 'text-foreground/70'}>{l}</p>)}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-primary">$</span>
                  <input value={cmd} onChange={e => setCmd(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCmd()} className="flex-1 bg-transparent text-foreground outline-none" autoFocus placeholder="nslookup backup.kronos.local" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <DialogBox character="marcus">
              <p>"<span className="text-danger font-bold">DNS incohérent.</span> Le fichier hosts a été falsifié. Vérifie qui a modifié resolv.conf."</p>
            </DialogBox>
            <p className="text-sm text-foreground/80">Inspecte la configuration DNS locale :</p>
            <div className="rounded-lg border border-primary/50 bg-black/80 p-4 font-mono text-xs">
              {outputs.map((o, i) => (
                <div key={i} className="mb-2">
                  <p className="text-primary">$ {o.cmd}</p>
                  {o.result.map((l, j) => <p key={j} className={l.startsWith('[') ? 'text-warning' : 'text-foreground/70'}>{l}</p>)}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-primary">$</span>
                <input value={cmd} onChange={e => setCmd(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCmd()} className="flex-1 bg-transparent text-foreground outline-none" autoFocus placeholder="cat /etc/resolv.conf" />
              </div>
            </div>
          </motion.div>
        )}

        {phase === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <DialogBox character="marcus">
              <p>"Quelqu'un a changé notre DNS dans la nuit. C'est <span className="text-danger font-bold">plus profond</span> qu'un ARP spoof."</p>
            </DialogBox>
            <button onClick={() => { playSFX('transition'); nextScene(); }} className="w-full rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary hover:bg-primary/20 transition-all">
              Suivant →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
