"use client";

import Link from "next/link";
import { useState } from "react";
import type { MouseEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const DEFAULT_VIEWPORT = {
  width: 1200,
  height: 800,
};

export function BackHomeButton() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [isPageWiping, setIsPageWiping] = useState(false);
  const [wipeSize, setWipeSize] = useState(DEFAULT_VIEWPORT);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
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

    if (isPageWiping) {
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
    const x = width + bow - progress * (width + bow);
    const px = Math.round(x * 10) / 10;
    const curveX = Math.round((x - curve) * 10) / 10;

    return `M ${width} 0 L ${px} 0 Q ${curveX} ${height / 2} ${px} ${height} L ${width} ${height} Z`;
  };

  return (
    <>
      <Button
        variant="ghost"
        asChild
        className="-ml-3 mb-8 text-zinc-600 hover:text-zinc-950"
      >
        <Link
          href="/"
          onClick={handleClick}
          aria-disabled={isPageWiping}
          className={isPageWiping ? "pointer-events-none" : undefined}
        >
          <ArrowLeft aria-hidden="true" />
          Back to home
        </Link>
      </Button>

      {isPageWiping ? (
        <motion.svg
          aria-hidden="true"
          className="fixed inset-0 z-9999 h-screen w-screen"
          viewBox={`0 0 ${wipeSize.width} ${wipeSize.height}`}
          preserveAspectRatio="none"
        >
          <motion.path
            fill="#FFFFFF"
            initial={{ d: clipWipePath(0) }}
            animate={{ d: clipWipePath(1) }}
            transition={{
              duration: 1,
              ease: [0.76, 0, 0.24, 1],
            }}
            onAnimationComplete={() => router.push("/")}
          />
        </motion.svg>
      ) : null}
    </>
  );
}
