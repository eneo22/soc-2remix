import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { GameState } from '@/types/game';

const defaultState: GameState = {
  currentScene: 0,
  currentChapter: 1,
  xp: { technical: 0, analytical: 0, reflexion: 0, detection: 0 },
  choices: {},
  skills: {},
  isCompromised: false,
  playerName: 'Rookie',
};

interface GameContextType {
  state: GameState;
  nextScene: () => void;
  goToScene: (n: number) => void;
  addXP: (category: keyof GameState['xp'], amount: number) => void;
  setChoice: (key: string, value: string) => void;
  unlockSkill: (skill: string) => void;
  setCompromised: (v: boolean) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(defaultState);

  const nextScene = useCallback(() => setState(s => ({ ...s, currentScene: s.currentScene + 1 })), []);
  const goToScene = useCallback((n: number) => setState(s => ({ ...s, currentScene: n })), []);
  const addXP = useCallback((cat: keyof GameState['xp'], amt: number) =>
    setState(s => ({ ...s, xp: { ...s.xp, [cat]: s.xp[cat] + amt } })), []);
  const setChoice = useCallback((k: string, v: string) =>
    setState(s => ({ ...s, choices: { ...s.choices, [k]: v } })), []);
  const unlockSkill = useCallback((skill: string) =>
    setState(s => ({ ...s, skills: { ...s.skills, [skill]: true } })), []);
  const setCompromised = useCallback((v: boolean) => setState(s => ({ ...s, isCompromised: v })), []);
  const resetGame = useCallback(() => setState(defaultState), []);

  return (
    <GameContext.Provider value={{ state, nextScene, goToScene, addXP, setChoice, unlockSkill, setCompromised, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};
