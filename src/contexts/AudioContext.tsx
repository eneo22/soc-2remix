import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playBGM: (track: string) => void;
  stopBGM: () => void;
  playSFX: (sfx: 'beep' | 'notification' | 'error' | 'success' | 'typing') => void;
  setBGMVolume: (v: number) => void;
  setSFXVolume: (v: number) => void;
}

const AudioCtx = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};

// Simple oscillator-based SFX (no external files needed)
function playOscillator(type: OscillatorType, freq: number, duration: number, volume: number) {
  try {
    const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + duration);
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + duration);
  } catch {}
}

const SFX_MAP: Record<string, () => void> = {
  beep: () => playOscillator('sine', 800, 0.1, 0.15),
  notification: () => {
    playOscillator('sine', 600, 0.15, 0.12);
    setTimeout(() => playOscillator('sine', 900, 0.15, 0.12), 150);
  },
  error: () => playOscillator('sawtooth', 200, 0.3, 0.1),
  success: () => {
    playOscillator('sine', 523, 0.15, 0.12);
    setTimeout(() => playOscillator('sine', 659, 0.15, 0.12), 120);
    setTimeout(() => playOscillator('sine', 784, 0.2, 0.12), 240);
  },
  typing: () => playOscillator('square', 1200, 0.02, 0.05),
};

// Ambient BGM URLs (royalty-free dark ambient loops)
const BGM_TRACKS: Record<string, string> = {
  menu: 'https://cdn.pixabay.com/audio/2024/11/29/audio_d4e4e6898c.mp3',
  helpdesk: 'https://cdn.pixabay.com/audio/2024/11/29/audio_d4e4e6898c.mp3',
  soc: 'https://cdn.pixabay.com/audio/2022/10/25/audio_33043bbbef.mp3',
  tension: 'https://cdn.pixabay.com/audio/2023/10/24/audio_3f4fb3e5a5.mp3',
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(() => {
    try { return localStorage.getItem('kronos-muted') === 'true'; } catch { return false; }
  });
  const [bgmVolume, setBGMVolume] = useState(0.3);
  const [sfxVolume, setSFXVolume] = useState(0.5);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = useRef('');

  useEffect(() => {
    try { localStorage.setItem('kronos-muted', String(isMuted)); } catch {}
    if (bgmRef.current) bgmRef.current.muted = isMuted;
  }, [isMuted]);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);

  const playBGM = useCallback((track: string) => {
    const url = BGM_TRACKS[track];
    if (!url || currentTrack.current === track) return;
    currentTrack.current = track;
    if (bgmRef.current) {
      bgmRef.current.pause();
    }
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = bgmVolume;
    audio.muted = isMuted;
    audio.play().catch(() => {});
    bgmRef.current = audio;
  }, [bgmVolume, isMuted]);

  const stopBGM = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current = null;
      currentTrack.current = '';
    }
  }, []);

  const playSFX = useCallback((sfx: keyof typeof SFX_MAP) => {
    if (isMuted) return;
    SFX_MAP[sfx]?.();
  }, [isMuted]);

  useEffect(() => {
    return () => {
      bgmRef.current?.pause();
    };
  }, []);

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute, playBGM, stopBGM, playSFX, setBGMVolume: setBGMVolume, setSFXVolume: setSFXVolume }}>
      {children}
    </AudioCtx.Provider>
  );
};
