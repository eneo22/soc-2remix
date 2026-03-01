// === TRAINING TERMINAL WRAPPER ===
// Uses the AdvancedTerminal for training modules

import { TerminalContent } from '@/data/training';
import { AdvancedTerminal } from './terminal/AdvancedTerminal';

interface Props {
  content: TerminalContent;
  onComplete: () => void;
}

export const TrainingTerminal = ({ content, onComplete }: Props) => {
  return (
    <AdvancedTerminal
      scenario={content.scenario}
      expectedCommand={content.expectedCommand}
      hint={content.hint}
      successOutput={content.successOutput}
      onComplete={onComplete}
      heightClass="h-[400px]"
    />
  );
};
