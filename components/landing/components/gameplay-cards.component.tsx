"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { gameplayCards } from "@/components/landing/data/gameplay-challenges";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const cardsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const comingSoonChallengeSlugs = new Set([
  "pick-your-answer",
  "beat-the-clock",
]);

interface GameplayCardsProps {
  animate?: "hidden" | "visible";
  variant?: "grid" | "compact" | "training";
}

export function GameplayCards({
  animate = "visible",
  variant = "grid",
}: GameplayCardsProps) {
  const isCompact = variant === "compact";
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null);
  const [wipeSize, setWipeSize] = useState({ width: 1200, height: 800 });
  const [comingSoonTitle, setComingSoonTitle] = useState<string | null>(null);

  const handleChallengeClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const isModifiedClick =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;

    if (isModifiedClick || shouldReduceMotion) {
      return;
    }

    event.preventDefault();

    if (transitionTarget) {
      return;
    }

    setWipeSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setTransitionTarget(href);
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

  if (variant === "training") {
    return (
      <>
        <motion.div
          className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2"
          initial="hidden"
          animate={animate}
          variants={cardsContainerVariants}
        >
          {gameplayCards.map((card) => {
            const href = `/training/${card.slug}`;
            const isComingSoon = comingSoonChallengeSlugs.has(card.slug);
            const cardClassName = cn(
              "group relative flex min-h-[250px] h-full w-full flex-col rounded-lg border border-zinc-200 bg-white p-6 text-left shadow-[0_16px_45px_rgba(15,23,42,0.06)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_22px_55px_rgba(15,23,42,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4 sm:p-7",
              isComingSoon && "cursor-not-allowed",
              transitionTarget && "pointer-events-none",
            );
            const cardContent = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={cn(
                      "flex size-[60px] items-center justify-center rounded-md",
                      card.iconBackground,
                    )}
                  >
                    <Image
                      src={card.icon}
                      alt=""
                      aria-hidden="true"
                      className="size-8"
                    />
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className={cn(
                      "size-5 text-zinc-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-900",
                      isComingSoon &&
                        "group-hover:translate-x-0 group-hover:translate-y-0",
                    )}
                  />
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <h2
                    className={cn(
                      "text-2xl font-semibold leading-tight tracking-normal",
                      card.titleColor,
                    )}
                  >
                    {card.title}
                  </h2>
                  {isComingSoon ? (
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-zinc-500">
                      Coming soon
                    </span>
                  ) : null}
                </div>
                <div className={cn("mt-5 border-t", card.dividerColor)} />
                <p className="mt-4 text-base leading-relaxed text-zinc-700">
                  {card.description}
                </p>
              </>
            );

            return (
              <motion.div key={card.slug} variants={cardVariants}>
                {isComingSoon ? (
                  <button
                    type="button"
                    aria-disabled="true"
                    onClick={() => setComingSoonTitle(card.title)}
                    className={cardClassName}
                  >
                    {cardContent}
                  </button>
                ) : (
                  <Link
                    href={href}
                    onClick={(event) => handleChallengeClick(event, href)}
                    aria-disabled={transitionTarget !== null}
                    className={cardClassName}
                  >
                    {cardContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <Dialog
          open={comingSoonTitle !== null}
          onOpenChange={(open) => {
            if (!open) {
              setComingSoonTitle(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Coming soon</DialogTitle>
              <DialogDescription>
                {comingSoonTitle
                  ? `${comingSoonTitle} belum tersedia. Coba Write it out dulu ya.`
                  : "Challenge ini belum tersedia."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button">OK</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {transitionTarget ? (
          <motion.svg
            aria-hidden="true"
            className="fixed inset-0 z-9999 h-screen w-screen"
            viewBox={`0 0 ${wipeSize.width} ${wipeSize.height}`}
            preserveAspectRatio="none"
          >
            <motion.path
              fill="#FAFAFA"
              initial={{ d: clipWipePath(0) }}
              animate={{ d: clipWipePath(1) }}
              transition={{
                duration: 1,
                ease: [0.76, 0, 0.24, 1],
              }}
              onAnimationComplete={() => router.push(transitionTarget)}
            />
          </motion.svg>
        ) : null}
      </>
    );
  }

  if (isCompact) {
    return (
      <div className="relative h-full max-h-[860px] w-full max-w-[340px] overflow-hidden px-8 py-6">
        <motion.div
          className="mx-auto flex w-full max-w-[260px] flex-col"
          animate={{
            y: ["0%", "-50%"],
          }}
          transition={{
            duration: 16,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...gameplayCards, ...gameplayCards].map((card, index) => (
            <motion.article
              key={`${card.title}-${index}`}
              tabIndex={0}
              className="group mb-4 aspect-square cursor-pointer rounded-[18px] border border-zinc-200 bg-white p-5 text-left outline-none ring-black/0"
              whileFocus={{
                y: -5,
                scale: 1.02,
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.14)",
              }}
              whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.14)",
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={{
                type: "spring",
                stiffness: 360,
                damping: 24,
              }}
            >
              <motion.div
                className={cn(
                  "flex size-10 items-center justify-center rounded-md",
                  card.iconBackground,
                )}
                whileHover={{
                  rotate: -4,
                  scale: 1.08,
                }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 22,
                }}
              >
                <Image
                  src={card.icon}
                  alt=""
                  aria-hidden="true"
                  className="size-6"
                />
              </motion.div>

              <h3
                className={cn(
                  "mt-5 text-2xl font-semibold leading-tight tracking-normal",
                  card.titleColor,
                )}
              >
                {card.title}
              </h3>

              <p className="mt-3 text-lg font-normal leading-snug text-black">
                {card.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10"
      initial="hidden"
      animate={animate}
      variants={cardsContainerVariants}
    >
      {gameplayCards.map((card) => (
        <motion.article
          key={card.title}
          tabIndex={0}
          className="group min-h-[245px] cursor-pointer rounded-[22px]  px-6 py-6 text-left shadow-[0_22px_60px_rgba(15,23,42,0.08)] outline-none ring-black/0 transition-shadow sm:px-7"
          variants={cardVariants}
          whileFocus={{
            y: -10,
            scale: 1.035,
            boxShadow: "0 30px 80px rgba(15, 23, 42, 0.14)",
          }}
          whileHover={{
            y: -10,
            scale: 1.035,
            boxShadow: "0 30px 80px rgba(15, 23, 42, 0.14)",
          }}
          whileTap={{
            scale: 0.98,
          }}
          transition={{
            type: "spring",
            stiffness: 360,
            damping: 24,
          }}
        >
          <motion.div
            className={cn(
              "flex size-[60px] items-center justify-center rounded-md",
              card.iconBackground,
            )}
            whileHover={{
              rotate: -4,
              scale: 1.08,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 22,
            }}
          >
            <Image
              src={card.icon}
              alt=""
              aria-hidden="true"
              className="h-8 w-8"
            />
          </motion.div>

          <h3
            className={cn(
              "mt-8 text-[27px] font-semibold leading-tight tracking-normal",
              card.titleColor,
            )}
          >
            {card.title}
          </h3>

          <div className={cn("mt-7 border-t", card.dividerColor)} />

          <p className="mt-3 text-[18px] font-normal leading-snug text-black">
            {card.description}
          </p>
        </motion.article>
      ))}
    </motion.div>
  );
}
