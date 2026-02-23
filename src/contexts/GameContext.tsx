import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { GameState } from '@/types/game';

const SAVE_KEY = 'soc-ascension-save';

const defaultState: GameState = {
  currentScene: -1, // -1 = home
  currentChapter: 1,
  xp: { technical: 0, analytical: 0, reflexion: 0, detection: 0 },
  choices: {},
  skills: {},
  isCompromised: false,
  playerName: 'Rookie',
  unlockedChapters: [1],
  completedChapters: [],
};

function loadSave(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...defaultState, ...saved, currentScene: -1 };
    }
  } catch {}
  return defaultState;
}

function persistSave(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {}
}

interface GameContextType {
  state: GameState;
  nextScene: () => void;
  goToScene: (n: number) => void;
  addXP: (category: keyof GameState['xp'], amount: number) => void;
  setChoice: (key: string, value: string) => void;
  unlockSkill: (skill: string) => void;
  setCompromised: (v: boolean) => void;
  resetGame: () => void;
  completeChapter: (chapter: number) => void;
  unlockChapter: (chapter: number) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(loadSave);

  useEffect(() => {
    persistSave(state);
  }, [state]);

  const nextScene = useCallback(() => setState(s => ({ ...s, currentScene: s.currentScene + 1 })), []);
  const goToScene = useCallback((n: number) => setState(s => ({ ...s, currentScene: n })), []);
  const addXP = useCallback((cat: keyof GameState['xp'], amt: number) =>
    setState(s => ({ ...s, xp: { ...s.xp, [cat]: s.xp[cat] + amt } })), []);
  const setChoice = useCallback((k: string, v: string) =>
    setState(s => ({ ...s, choices: { ...s.choices, [k]: v } })), []);
  const unlockSkill = useCallback((skill: string) =>
    setState(s => ({ ...s, skills: { ...s.skills, [skill]: true } })), []);
  const setCompromised = useCallback((v: boolean) => setState(s => ({ ...s, isCompromised: v })), []);
  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState(defaultState);
  }, []);

  const completeChapter = useCallback((chapter: number) =>
    setState(s => ({
      ...s,
      completedChapters: s.completedChapters.includes(chapter) ? s.completedChapters : [...s.completedChapters, chapter],
      unlockedChapters: s.unlockedChapters.includes(chapter + 1) ? s.unlockedChapters : [...s.unlockedChapters, chapter + 1],
    })), []);

  const unlockChapter = useCallback((chapter: number) =>
    setState(s => ({
      ...s,
      unlockedChapters: s.unlockedChapters.includes(chapter) ? s.unlockedChapters : [...s.unlockedChapters, chapter],
    })), []);

  return (
    <GameContext.Provider value={{ state, nextScene, goToScene, addXP, setChoice, unlockSkill, setCompromised, resetGame, completeChapter, unlockChapter }}>
      {children}
    </GameContext.Provider>
  );
};
