"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";

import { GameplayCards } from "@/components/landing/components/gameplay-cards.component";
import { HanziStrokeAnimation } from "@/components/landing/components/HanziStrokeAnimation";

const storySections = [
  {
    heading: "Memorizing Mandarin words is not always enough.",
    body: "To truly remember a word, you need to recognize the Hanzi, connect it with the Pinyin, and understand what it means.",
    type: "character",
  },
  {
    heading: "A better way to practice Mandarin vocabulary.",
    body: "Instead of only memorizing, practice Mandarin through simple interactive challenges that help you recognize Hanzi, understand Pinyin, and remember meanings more naturally.",
    type: "stat",
  },
  {
    heading: "Practice in different ways, all in one place.",
    body: "Some words are easier to remember when you see them. Some feel clearer when you type them. Others make more sense when you match Hanzi with its Pinyin or meaning.",
    type: "features",
  },
] as const;

const targetVocabularyCount = 500;
const countDurationMs = 1200;

const contentMotion = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.4, ease: "easeInOut" },
} as const;

export function WhySection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedVocabularyCount, setDisplayedVocabularyCount] = useState(0);
  const activeSection = storySections[activeIndex];
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const segmentSize = 1 / storySections.length;
    const nextIndex = Math.min(
      Math.floor(latest / segmentSize),
      storySections.length - 1,
    );

    setActiveIndex(nextIndex);
  });

  useEffect(() => {
    if (activeSection.type !== "stat") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayedVocabularyCount(0);
      return;
    }

    if (shouldReduceMotion) {
      const frameId = requestAnimationFrame(() => {
        setDisplayedVocabularyCount(targetVocabularyCount);
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }

    let frameId = 0;
    const startedAt = performance.now();

    const animateCount = (currentTime: number) => {
      const progress = Math.min((currentTime - startedAt) / countDurationMs, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayedVocabularyCount(
        Math.round(targetVocabularyCount * easedProgress),
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount);
      }
    };

    frameId = requestAnimationFrame(animateCount);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [activeSection.type, shouldReduceMotion]);

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-4 py-16 sm:px-6 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)] lg:gap-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`story-copy-${activeIndex}`}
              className="text-center lg:text-left"
              {...contentMotion}
            >
              <h2 className="text-4xl font-semibold leading-tight tracking-normal text-black sm:text-5xl lg:text-[56px]">
                {activeSection.heading}
              </h2>

              <p className="mt-8 max-w-2xl text-base font-normal leading-relaxed text-black sm:text-xl lg:text-[22px]">
                {activeSection.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="relative flex h-[min(82vh,820px)] min-h-[430px] w-full max-w-[540px] items-center justify-center overflow-hidden rounded-[32px] border border-white/80 bg-white/90 px-8 py-8 text-center shadow-[0_30px_90px_rgba(24,24,27,0.10)] backdrop-blur-sm sm:px-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`story-card-content-${activeIndex}`}
                  className="flex h-full w-full items-center justify-center"
                  {...contentMotion}
                >
                  {activeSection.type === "character" ? (
                    <HanziStrokeAnimation withCard={false} />
                  ) : null}

                  {activeSection.type === "stat" ? (
                    <div>
                      <p className="text-7xl font-medium leading-none tracking-normal text-black sm:text-8xl lg:text-[104px]">
                        +
                        <span className="inline-block min-w-[3ch] text-right tabular-nums">
                          {displayedVocabularyCount}
                        </span>
                      </p>
                      <p className="mt-4 text-base font-normal leading-none text-black">
                        Ready words
                      </p>
                      <p className="mt-1 text-3xl font-normal leading-tight tracking-normal text-black sm:text-4xl">
                        Vocabulary
                      </p>
                    </div>
                  ) : null}

                  {activeSection.type === "features" ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <GameplayCards animate="visible" variant="compact" />
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
