"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

import user1 from "@/assets/image/users/user1.svg";
import user2 from "@/assets/image/users/user2.svg";
import user3 from "@/assets/image/users/user3.svg";
import user4 from "@/assets/image/users/user4.svg";
import { cn } from "@/lib/utils";

const users = [
  { src: user1, alt: "Xue In user 1" },
  { src: user2, alt: "Xue In user 2" },
  { src: user3, alt: "Xue In user 3" },
  { src: user4, alt: "Xue In user 4" },
];

const targetUserCount = 100;
const countDurationMs = 1200;

const userVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 288,
    scale: 0.96,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: index * 0.16,
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function UsersComponent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.65 });
  const shouldReduceMotion = useReducedMotion();
  const [displayedUserCount, setDisplayedUserCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    if (shouldReduceMotion) {
      const frameId = requestAnimationFrame(() => {
        setDisplayedUserCount(targetUserCount);
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

      setDisplayedUserCount(Math.round(targetUserCount * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount);
      }
    };

    frameId = requestAnimationFrame(animateCount);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isInView, shouldReduceMotion]);

  return (
    <motion.div
      ref={sectionRef}
      className="flex w-full flex-col items-center justify-center gap-6 overflow-hidden text-black sm:flex-row sm:gap-8 lg:gap-10"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="relative z-10 flex shrink-0 items-center overflow-visible">
        {users.map((user, index) => (
          <motion.div
            key={user.alt}
            custom={index}
            variants={userVariants}
            className={cn(
              "relative size-16 overflow-hidden rounded-full bg-zinc-100 ring-2 ring-white sm:size-20 lg:size-[105px]",
              index !== 0 && "-ml-5 sm:-ml-7 lg:-ml-9",
            )}
          >
            <Image
              src={user.src}
              alt={user.alt}
              fill
              sizes="(min-width: 1024px) 105px, (min-width: 640px) 80px, 64px"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-20 bg-white text-center sm:text-left">
        <p className="text-3xl font-normal leading-tight tracking-normal sm:text-4xl lg:text-[40px]">
          Already use by
        </p>
        <p className="mt-2 text-6xl font-normal leading-none tracking-normal sm:text-7xl lg:text-[76px]">
          +
          <span className="inline-block min-w-[2ch] text-right tabular-nums">
            {displayedUserCount}
          </span>{" "}
          users
        </p>
      </div>
    </motion.div>
  );
}
