export interface GameState {
  currentScene: number;
  currentChapter: number;
  xp: { technical: number; analytical: number; reflexion: number; detection: number };
  choices: Record<string, string>;
  skills: Record<string, boolean>;
  isCompromised: boolean;
  playerName: string;
  unlockedChapters: number[];
  completedChapters: number[];
}

export interface QuizQuestion {
  question: string;
  options: { text: string; correct: boolean; feedback: string }[];
  explanation: string;
  timer?: number;
}

export type SceneChoice = {
  id: string;
  label: string;
  description: string;
  consequence: 'success' | 'partial' | 'failure';
};
