import bgHelpdesk from '@/assets/bg-helpdesk.jpg';
import bgSOC from '@/assets/bg-soc.jpg';

interface Props {
  chapter: number;
}

const BG_MAP: Record<number, string> = {
  1: bgHelpdesk,
  2: bgSOC,
  3: bgSOC,
  4: bgSOC,
};

export const ChapterBackground = ({ chapter }: Props) => {
  const bg = BG_MAP[chapter] || bgHelpdesk;

  return (
    <div className="fixed inset-0 -z-10">
      <img src={bg} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
    </div>
  );
};
