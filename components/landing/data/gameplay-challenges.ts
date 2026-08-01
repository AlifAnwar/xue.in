import classicIcon from "@/assets/icons/classic.svg";
import connectTheDotsIcon from "@/assets/icons/connectthedots.svg";
import timeIcon from "@/assets/icons/time.svg";
import typingIcon from "@/assets/icons/typing.svg";

export const gameplayCards = [
  {
    slug: "write-it-out",
    title: "Write it out",
    description: "Prove you know it by writing it down yourself.",
    icon: typingIcon,
    iconBackground: "bg-[#FFE0AE]",
    titleColor: "text-[#E46D34]",
    dividerColor: "border-[#F0C6AD]",
  },
  {
    slug: "connect-the-dots",
    title: "Connect the dots",
    description: "Match Hanzi with Pinyin or meaning as fast as you can.",
    icon: connectTheDotsIcon,
    iconBackground: "bg-[#B6E4FF]",
    titleColor: "text-[#0095E7]",
    dividerColor: "border-[#F0C6AD]",
  },
  {
    slug: "pick-your-answer",
    title: "Pick your answer",
    description: "Take it easy and learn from every option you see.",
    icon: classicIcon,
    iconBackground: "bg-[#F1D9FF]",
    titleColor: "text-[#B989E7]",
    dividerColor: "border-[#F0C6AD]",
  },
  {
    slug: "beat-the-clock",
    title: "Beat the clock",
    description: "Answer before time runs out and see how fast you are.",
    icon: timeIcon,
    iconBackground: "bg-[#FFE6DC]",
    titleColor: "text-[#D95100]",
    dividerColor: "border-[#F0C6AD]",
  },
] as const;

export type GameplayChallenge = (typeof gameplayCards)[number];
