import { GameProvider, useGame } from '@/contexts/GameContext';
import { GameHUD } from '@/components/game/GameHUD';
import { GameIntro } from '@/components/game/GameIntro';
import { Scene1_Email } from '@/components/game/Scene1_Email';
import { Scene2_Mentor } from '@/components/game/Scene2_Mentor';
import { Scene3_Terminal } from '@/components/game/Scene3_Terminal';
import { Scene4_Incident } from '@/components/game/Scene4_Incident';
import { Scene5_Conclusion } from '@/components/game/Scene5_Conclusion';
import { Ch2Scene1_SOC } from '@/components/game/chapter2/Ch2Scene1_SOC';
import { Ch2Scene2_DNS } from '@/components/game/chapter2/Ch2Scene2_DNS';
import { Ch2Scene3_Ports } from '@/components/game/chapter2/Ch2Scene3_Ports';
import { Ch2Scene4_Traffic } from '@/components/game/chapter2/Ch2Scene4_Traffic';
import { Ch2Scene5_Wireshark } from '@/components/game/chapter2/Ch2Scene5_Wireshark';
import { Ch2Scene6_Chain } from '@/components/game/chapter2/Ch2Scene6_Chain';
import { Ch2Scene7_Conclusion } from '@/components/game/chapter2/Ch2Scene7_Conclusion';
import { TrainingHub } from '@/components/game/TrainingHub';
import { AnimatePresence, motion } from 'framer-motion';

const GameScreen = () => {
  const { state } = useGame();
  const scene = state.currentScene;

  // Scene 100 = Training Hub
  if (scene === 100) {
    return (
      <div className="min-h-screen bg-background">
        <GameHUD xp={state.xp} chapter={state.currentChapter} scene={0} />
        <TrainingHub />
      </div>
    );
  }

  const scenes: Record<number, JSX.Element> = {
    0: <GameIntro key="intro" />,
    // Chapter 1
    1: <Scene1_Email key="s1" />,
    2: <Scene2_Mentor key="s2" />,
    3: <Scene3_Terminal key="s3" />,
    4: <Scene4_Incident key="s4" />,
    5: <Scene5_Conclusion key="s5" />,
    // Chapter 2
    6: <Ch2Scene1_SOC key="ch2s1" />,
    7: <Ch2Scene2_DNS key="ch2s2" />,
    8: <Ch2Scene3_Ports key="ch2s3" />,
    9: <Ch2Scene4_Traffic key="ch2s4" />,
    10: <Ch2Scene5_Wireshark key="ch2s5" />,
    11: <Ch2Scene6_Chain key="ch2s6" />,
    12: <Ch2Scene7_Conclusion key="ch2s7" />,
  };

  const currentChapter = scene >= 6 ? 2 : 1;
  const sceneInChapter = scene >= 6 ? scene - 5 : scene;

  return (
    <div className="min-h-screen bg-background">
      {scene > 0 && <GameHUD xp={state.xp} chapter={currentChapter} scene={sceneInChapter} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {scenes[scene] || <Scene5_Conclusion />}
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
