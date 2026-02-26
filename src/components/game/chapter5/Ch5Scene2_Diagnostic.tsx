import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useAudio } from '@/contexts/AudioContext';
import { NarrativeBlock } from '../Typewriter';
import { DialogBox } from '../DialogBox';

export const Ch5Scene2_Diagnostic = () => {
  const { nextScene, addXP } = useGame();
  const { playSFX } = useAudio();
  const [step, setStep] = useState(0);
  const [cmd, setCmd] = useState('');
  const [outputs, setOutputs] = useState<{ cmd: string; result: string[] }[]>([]);

  const expectedSteps = [
    { cmd: 'ip a', output: ['eth0: <BROADCAST,MULTICAST,UP> mtu 1500', '    inet 192.168.1.100/24 brd 192.168.1.255', '    link/ether aa:bb:cc:dd:ee:ff', '', '[✓] Interface UP — Couche Physique OK'] },
    { cmd: 'ping 192.168.1.12', output: ['PING 192.168.1.12 (192.168.1.12) 56(84) bytes of data.', '64 bytes from 192.168.1.12: icmp_seq=1 ttl=64 time=0.5ms', '64 bytes from 192.168.1.12: icmp_seq=2 ttl=64 time=0.4ms', '', '[✓] Réseau OK — Couches 1, 2, 3 validées'] },
    { cmd: 'telnet 192.168.1.12 443', output: ['Trying 192.168.1.12...', 'Connected to 192.168.1.12.', 'Connection closed by foreign host.', '', '[⚠] Connexion acceptée puis immédiatement fermée.', 'Comportement ANORMAL — Service suspect sur port 443.'] },
  ];

  const handleSubmit = () => {
    const trimmed = cmd.trim().toLowerCase();
    const expected = expectedSteps[step];
    if (!expected) return;

    if (trimmed === expected.cmd || trimmed.startsWith(expected.cmd.split(' ')[0])) {
      playSFX('notification');
      setOutputs(o => [...o, { cmd: trimmed, result: expected.output }]);
      setStep(s => s + 1);
      setCmd('');
      if (step === 2) {
        addXP('technical', 15);
        setTimeout(() => nextScene(), 2500);
      }
    } else {
      playSFX('beep');
      setOutputs(o => [...o, { cmd: trimmed, result: [`bash: commande attendue pour cette étape. Indice : ${expected.cmd.split(' ')[0]}`] }]);
      setCmd('');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14 pb-10">
      <div className="max-w-2xl w-full space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary terminal-glow text-center mb-4">
          Diagnostic structuré par couches
        </h2>

        <DialogBox character="marcus">
          <p>"On descend couche par couche. Physique → Réseau → Transport."</p>
        </DialogBox>

        <div className="rounded-lg border border-primary/30 bg-card p-3 mt-2">
          <p className="font-mono text-xs text-muted-foreground mb-2">
            Étape {step + 1}/3 — {step === 0 ? 'Vérifier interface (ip a)' : step === 1 ? 'Tester connectivité (ping)' : 'Tester service (telnet)'}
          </p>
        </div>

        <div className="rounded-lg border border-primary/50 bg-black/80 p-4 font-mono text-xs min-h-[200px]">
          <p className="text-primary mb-2">analyst@soc:~$</p>
          {outputs.map((o, i) => (
            <div key={i} className="mb-3">
              <p className="text-primary">$ {o.cmd}</p>
              {o.result.map((line, j) => (
                <p key={j} className={`${line.startsWith('[') ? (line.includes('✓') ? 'text-primary' : 'text-warning') : 'text-foreground/70'}`}>{line}</p>
              ))}
            </div>
          ))}
          {step < 3 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-primary">$</span>
              <input
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="flex-1 bg-transparent text-foreground outline-none"
                placeholder="tape ta commande..."
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
