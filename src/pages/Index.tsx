import { GameProvider, useGame } from '@/contexts/GameContext';
import { GameHUD } from '@/components/game/GameHUD';
import { HomeScreen } from '@/components/game/HomeScreen';
import { ChapterSelect } from '@/components/game/ChapterSelect';
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
import { Ch3Scene1_OSI } from '@/components/game/chapter3/Ch3Scene1_OSI';
import { Ch3Scene2_Physical } from '@/components/game/chapter3/Ch3Scene2_Physical';
import { Ch3Scene3_ARP } from '@/components/game/chapter3/Ch3Scene3_ARP';
import { Ch3Scene4_DNS } from '@/components/game/chapter3/Ch3Scene4_DNS';
import { Ch3Scene5_Transport } from '@/components/game/chapter3/Ch3Scene5_Transport';
import { Ch3Scene6_TCPIP } from '@/components/game/chapter3/Ch3Scene6_TCPIP';
import { Ch3Scene7_Conclusion } from '@/components/game/chapter3/Ch3Scene7_Conclusion';
import { Ch4Scene1_Incident } from '@/components/game/chapter4/Ch4Scene1_Incident';
import { Ch4Scene2_Netstat } from '@/components/game/chapter4/Ch4Scene2_Netstat';
import { Ch4Scene3_ARPSpoof } from '@/components/game/chapter4/Ch4Scene3_ARPSpoof';
import { Ch4Scene4_DNSPoison } from '@/components/game/chapter4/Ch4Scene4_DNSPoison';
import { Ch4Scene5_Chain } from '@/components/game/chapter4/Ch4Scene5_Chain';
import { Ch4Scene6_Isolate } from '@/components/game/chapter4/Ch4Scene6_Isolate';
import { Ch4Scene7_Conclusion } from '@/components/game/chapter4/Ch4Scene7_Conclusion';
import { TrainingHub } from '@/components/game/TrainingHub';
import { AnimatePresence, motion } from 'framer-motion';

const GameScreen = () => {
  const { state } = useGame();
  const scene = state.currentScene;

  // Home screen
  if (scene === -1) return <HomeScreen />;

  // Chapter select
  if (scene === -2) return <ChapterSelect />;

  // Training Hub
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
    // Chapter 3
    13: <Ch3Scene1_OSI key="ch3s1" />,
    14: <Ch3Scene2_Physical key="ch3s2" />,
    15: <Ch3Scene3_ARP key="ch3s3" />,
    16: <Ch3Scene4_DNS key="ch3s4" />,
    17: <Ch3Scene5_Transport key="ch3s5" />,
    18: <Ch3Scene6_TCPIP key="ch3s6" />,
    19: <Ch3Scene7_Conclusion key="ch3s7" />,
    // Chapter 4
    20: <Ch4Scene1_Incident key="ch4s1" />,
    21: <Ch4Scene2_Netstat key="ch4s2" />,
    22: <Ch4Scene3_ARPSpoof key="ch4s3" />,
    23: <Ch4Scene4_DNSPoison key="ch4s4" />,
    24: <Ch4Scene5_Chain key="ch4s5" />,
    25: <Ch4Scene6_Isolate key="ch4s6" />,
    26: <Ch4Scene7_Conclusion key="ch4s7" />,
  };

  const currentChapter = scene >= 20 ? 4 : scene >= 13 ? 3 : scene >= 6 ? 2 : 1;
  const sceneInChapter = scene >= 20 ? scene - 19 : scene >= 13 ? scene - 12 : scene >= 6 ? scene - 5 : scene;

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
          {scenes[scene] || <HomeScreen />}
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
