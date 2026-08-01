"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { GameplayCards } from "@/components/landing/components/gameplay-cards.component";
import { UsersComponent } from "@/components/landing/components/users.component";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


interface SplitTextMotionProps {
  animate: "hidden" | "visible";
  className?: string;
  delay?: number;
  text: string;
}

function SplitTextMotion({
  animate,
  className,
  delay = 0,
  text,
}: SplitTextMotionProps) {
  const words = text.split(" ");

  return (
    <motion.span
      aria-label={text}
      className={cn("block", className)}
      initial="hidden"
      animate={animate}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.045,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          key={`${word}-${index}`}
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: {
                opacity: 0,
                y: "100%",
              },
              visible: {
                opacity: 1,
                y: "0%",
                transition: {
                  duration: 0.62,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? "\u00A0" : null}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function GamePlaySection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [showIntroText, setShowIntroText] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [isPageWiping, setIsPageWiping] = useState(false);
  const [wipeSize, setWipeSize] = useState({ width: 1200, height: 800 });
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const usersScale = useTransform(
    scrollYProgress,
    [0, 0.38, 0.7],
    shouldReduceMotion ? [1, 1, 1] : [1, 1, 0.46],
  );
  const usersY = useTransform(
    scrollYProgress,
    [0, 0.38, 0.7],
    shouldReduceMotion ? ["0vh", "0vh", "0vh"] : ["0vh", "0vh", "-36vh"],
  );
  const introOpacity = useTransform(scrollYProgress, [0.52, 0.72, 1], [0, 1, 1]);
  const introY = useTransform(
    scrollYProgress,
    [0.52, 0.72, 1],
    shouldReduceMotion ? [0, 0, 0] : [48, 0, 0],
  );
  const cardsOpacity = useTransform(scrollYProgress, [0.72, 0.9, 1], [0, 1, 1]);
  const cardsY = useTransform(
    scrollYProgress,
    [0.72, 0.9, 1],
    shouldReduceMotion ? [0, 0, 0] : [56, 0, 0],
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.58) {
      setShowIntroText(true);
    }

    if (latest >= 0.76) {
      setShowCards(true);
    }
  });

  const handleTrainingNavigation = () => {
    if (isPageWiping) {
      return;
    }

    if (shouldReduceMotion) {
      router.push("/training");
      return;
    }

    setWipeSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setIsPageWiping(true);
  };

  const clipWipePath = (progress: number) => {
    const { width, height } = wipeSize;
    const bow = width * 0.16;
    const curve = bow * 2;
    const x = -bow + progress * (width + bow);
    const px = Math.round(x * 10) / 10;
    const curveX = Math.round((x + curve) * 10) / 10;

    return `M 0 0 L ${px} 0 Q ${curveX} ${height / 2} ${px} ${height} L 0 ${height} Z`;
  };

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 py-24 sm:px-6">
        <motion.div
          className="absolute left-1/2 top-1/2 z-10 w-full max-w-6xl -translate-x-1/2 -translate-y-1/2"
          style={{
            scale: usersScale,
            y: usersY,
          }}
        >
          <UsersComponent />
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-[22vh] z-20 flex w-full max-w-6xl -translate-x-1/2 flex-col items-center text-center text-black"
          style={{
            opacity: introOpacity,
            y: introY,
          }}
        >
          <h2 className="text-2xl font-normal leading-tight tracking-normal ">
            <SplitTextMotion
              animate={showIntroText || shouldReduceMotion ? "visible" : "hidden"}
              text="Practice through simple challenges"
            />
          </h2>
          <p className="mt-5 max-w-5xl text-base font-normal leading-snug tracking-normal ]">
            <SplitTextMotion
              animate={showIntroText || shouldReduceMotion ? "visible" : "hidden"}
              delay={0.18}
              text="Explore different ways to recognize, recall, and connect Mandarin vocabulary."
            />
          </p>
        </motion.div>

        {/* list cards gameplay section */}
        <motion.div
          className="absolute left-1/2 top-[40vh] z-20 w-full max-w-362.5 -translate-x-1/2 px-4 sm:px-6"
          style={{
            opacity: cardsOpacity,
            y: cardsY,
          }}
        >
          <GameplayCards animate={showCards || shouldReduceMotion ? "visible" : "hidden"} />
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-[86vh] z-30 -translate-x-1/2"
          style={{
            opacity: cardsOpacity,
            y: cardsY,
          }}
        >
          <Button
            size="lg"
            disabled={isPageWiping}
            onClick={handleTrainingNavigation}
            className="h-12 rounded-lg bg-black px-8 text-lg font-medium text-white hover:bg-zinc-800"
          >
            Let&apos;s Get Start
          </Button>
        </motion.div>

        {isPageWiping ? (
          <motion.svg
            aria-hidden="true"
            className="fixed inset-0 z-9999 h-screen w-screen"
            viewBox={`0 0 ${wipeSize.width} ${wipeSize.height}`}
            preserveAspectRatio="none"
          >
            <motion.path
              fill="#FAFAFA"
              initial={{
                d: clipWipePath(0),
              }}
              animate={{
                d: clipWipePath(1),
              }}
              transition={{
                duration: 1,
                ease: [0.76, 0, 0.24, 1],
              }}
              onAnimationComplete={() => {
                router.push("/training");
              }}
            />
          </motion.svg>
        ) : null}
      </div>
    </section>
  );
}
