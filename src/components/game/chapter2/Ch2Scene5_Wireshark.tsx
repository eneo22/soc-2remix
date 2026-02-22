import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { NarrativeBlock } from '../Typewriter';
import { XPNotification } from '../GameHUD';

export const Ch2Scene5_Wireshark = () => {
  const { nextScene, addXP } = useGame();
  const [phase, setPhase] = useState<'intro' | 'analysis' | 'answers' | 'result'>('intro');
  const [answers, setAnswers] = useState({ ip_interne: '', ip_externe: '', port: '' });
  const [submitted, setSubmitted] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const introLines = [
    "Marcus : \"Tu vas analyser le trafic.\"",
    "Une interface d'analyse de paquets s'affiche à l'écran.",
    "Tu dois identifier les éléments clés de la communication suspecte.",
  ];

  const packets = [
    { id: 1, src: '192.168.1.23', dst: '185.199.108.153', port: '443', proto: 'TLS', size: '1240', info: 'Client Hello' },
    { id: 2, src: '185.199.108.153', dst: '192.168.1.23', port: '443', proto: 'TLS', size: '3420', info: 'Server Hello, Certificate' },
    { id: 3, src: '192.168.1.23', dst: '185.199.108.153', port: '443', proto: 'TLS', size: '820', info: 'Application Data' },
    { id: 4, src: '192.168.1.23', dst: '185.199.108.153', port: '443', proto: 'TLS', size: '15240', info: 'Application Data [EXFIL]' },
    { id: 5, src: '185.199.108.153', dst: '192.168.1.23', port: '443', proto: 'TLS', size: '120', info: 'ACK' },
  ];

  const handleSubmit = () => {
    setSubmitted(true);
    const correct =
      answers.ip_interne.trim() === '192.168.1.23' &&
      answers.ip_externe.trim() === '185.199.108.153' &&
      answers.port.trim() === '443';
    if (correct) {
      addXP('technical', 100);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 2000);
    }
    setTimeout(() => setPhase('result'), 1500);
  };

  const isCorrect = answers.ip_interne.trim() === '192.168.1.23' && answers.ip_externe.trim() === '185.199.108.153' && answers.port.trim() === '443';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      <AnimatePresence>{showXP && <XPNotification category="Technique" amount={100} />}</AnimatePresence>

      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-primary terminal-glow">
            Chapitre 2 — La Première Analyse
          </h2>
          <NarrativeBlock lines={introLines} onComplete={() => setPhase('analysis')} speed={25} />
        </motion.div>
      )}

      {phase === 'analysis' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full">
          <div className="mb-4 rounded border border-primary/30 bg-primary/5 px-4 py-3">
            <p className="font-mono text-xs text-primary">
              🎯 <span className="font-bold">OBJECTIF :</span> Analyse les paquets et identifie l'IP interne compromise, l'IP externe suspecte, et le port utilisé.
            </p>
          </div>

          {/* Fake Wireshark */}
          <div className="overflow-hidden rounded-lg border border-primary/30 bg-terminal-bg mb-4">
            <div className="border-b border-primary/20 bg-secondary px-4 py-2">
              <span className="font-mono text-xs text-muted-foreground">📊 Analyseur de paquets — Capture réseau</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-[11px]">
                <thead>
                  <tr className="text-primary/70 border-b border-border">
                    <th className="text-left p-2">No.</th>
                    <th className="text-left p-2">Source</th>
                    <th className="text-left p-2">Destination</th>
                    <th className="text-left p-2">Port</th>
                    <th className="text-left p-2">Proto</th>
                    <th className="text-left p-2">Size</th>
                    <th className="text-left p-2">Info</th>
                  </tr>
                </thead>
                <tbody>
                  {packets.map((p) => (
                    <tr key={p.id} className={`border-b border-border/30 ${p.info.includes('EXFIL') ? 'bg-danger/10 text-danger' : 'text-terminal/80'}`}>
                      <td className="p-2">{p.id}</td>
                      <td className="p-2">{p.src}</td>
                      <td className="p-2">{p.dst}</td>
                      <td className="p-2">{p.port}</td>
                      <td className="p-2">{p.proto}</td>
                      <td className="p-2">{p.size}</td>
                      <td className="p-2">{p.info}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Answer form */}
          <div className="rounded-lg border border-primary/30 bg-card p-4 space-y-3">
            <p className="font-mono text-xs text-primary mb-2">📝 Identifie :</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">1. IP interne compromise</label>
                <input value={answers.ip_interne} onChange={e => setAnswers(a => ({ ...a, ip_interne: e.target.value }))} className="w-full mt-1 rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary" placeholder="ex: 192.168.x.x" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">2. IP externe suspecte</label>
                <input value={answers.ip_externe} onChange={e => setAnswers(a => ({ ...a, ip_externe: e.target.value }))} className="w-full mt-1 rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary" placeholder="ex: 185.x.x.x" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">3. Port utilisé</label>
                <input value={answers.port} onChange={e => setAnswers(a => ({ ...a, port: e.target.value }))} className="w-full mt-1 rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary" placeholder="ex: 443" />
              </div>
            </div>
            {!submitted && (
              <button onClick={handleSubmit} className="mt-3 rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20 w-full">
                Valider l'analyse ✓
              </button>
            )}
            {submitted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-3 rounded text-sm ${isCorrect ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                {isCorrect ? '✓ Analyse correcte ! Toutes les réponses sont bonnes.' : '✗ Vérifie tes réponses. Regarde attentivement les colonnes Source et Destination.'}
              </motion.div>
            )}
          </div>

          {submitted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
              <button onClick={() => setPhase('result')} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
                Continuer →
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl text-center">
          <div className="rounded-lg border border-primary/30 bg-card p-6 mb-4">
            <p className="font-mono text-xs text-primary mb-2">MARCUS</p>
            <p className="text-sm text-foreground/80">"L'analyse de paquets, c'est lire entre les lignes du réseau. Chaque octet raconte une histoire."</p>
          </div>
          <button onClick={nextScene} className="rounded-lg border border-primary bg-primary/10 px-6 py-3 font-mono text-sm text-primary transition-all hover:bg-primary/20">
            Scène suivante →
          </button>
        </motion.div>
      )}
    </div>
  );
};
