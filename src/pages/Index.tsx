import { GameProvider, useGame } from '@/contexts/GameContext';
import { GameHUD } from '@/components/game/GameHUD';
import { GameIntro } from '@/components/game/GameIntro';
import { Scene1_Email } from '@/components/game/Scene1_Email';
import { Scene2_Mentor } from '@/components/game/Scene2_Mentor';
import { Scene3_Terminal } from '@/components/game/Scene3_Terminal';
import { Scene4_Incident } from '@/components/game/Scene4_Incident';
import { Scene5_Conclusion } from '@/components/game/Scene5_Conclusion';
import { AnimatePresence, motion } from 'framer-motion';

const GameScreen = () => {
  const { state } = useGame();
  const scene = state.currentScene;

  const scenes = [
    <GameIntro key="intro" />,
    <Scene1_Email key="s1" />,
    <Scene2_Mentor key="s2" />,
    <Scene3_Terminal key="s3" />,
    <Scene4_Incident key="s4" />,
    <Scene5_Conclusion key="s5" />,
  ];

  return (
    <div className="min-h-screen bg-background">
      {scene > 0 && <GameHUD xp={state.xp} chapter={state.currentChapter} scene={scene - 1} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {scenes[scene] || scenes[scenes.length - 1]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Index = () => (
  <GameProvider>
    <GameScreen />
  </GameProvider>
);

export default Index;
