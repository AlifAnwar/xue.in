"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Keyboard, Languages, Play } from "lucide-react";
import { useRouter } from "next/navigation";

import type { GameplayChallenge } from "@/components/landing/data/gameplay-challenges";
import { Button } from "@/components/ui/button";
import type { TrainingMode } from "@/types/vocabulary";

interface ChallengeSetupProps {
  challenge: GameplayChallenge;
}

export function ChallengeSetup({ challenge }: ChallengeSetupProps) {
  const router = useRouter();
  const isWriteItOut = challenge.slug === "write-it-out";
  const [mode, setMode] = useState<TrainingMode>(
    isWriteItOut ? "hanzi-to-pinyin" : "hanzi-to-id",
  );
  const [totalQuestions, setTotalQuestions] = useState(10);

  const handleStart = () => {
    const params = new URLSearchParams({
      challenge: challenge.slug,
      mode,
      amount: totalQuestions.toString(),
      t: Date.now().toString(),
    });

    router.push(`/training/quiz?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <Button variant="ghost" asChild className="-ml-3 mb-8 text-zinc-600 hover:text-zinc-950">
          <Link href="/training">
            <ArrowLeft aria-hidden="true" />
            All challenges
          </Link>
        </Button>

        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase text-zinc-500">Challenge</p>
          <h1 className="text-3xl font-bold text-zinc-950 sm:text-4xl">{challenge.title}</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-600">
            {challenge.description}
          </p>
        </header>

        <section className="space-y-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase text-zinc-900">1. Choose a mode</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {isWriteItOut ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("hanzi-to-pinyin")}
                    aria-pressed={mode === "hanzi-to-pinyin"}
                    className={`rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                      mode === "hanzi-to-pinyin"
                        ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <Languages className="mb-4 size-5 text-[#E46D34]" aria-hidden="true" />
                    <span className="block font-semibold text-zinc-900">Pinyin mode</span>
                    <span className="mt-2 block text-xs leading-relaxed text-zinc-500">
                      See Traditional Hanzi and type the correct Pinyin.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("pinyin-to-hanzi")}
                    aria-pressed={mode === "pinyin-to-hanzi"}
                    className={`rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                      mode === "pinyin-to-hanzi"
                        ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <Keyboard className="mb-4 size-5 text-[#E46D34]" aria-hidden="true" />
                    <span className="block font-semibold text-zinc-900">Hanzi mode</span>
                    <span className="mt-2 block text-xs leading-relaxed text-zinc-500">
                      See Pinyin and type the Traditional Hanzi yourself.
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("hanzi-to-id")}
                    aria-pressed={mode === "hanzi-to-id"}
                    className={`rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                      mode === "hanzi-to-id"
                        ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <span className="block font-semibold text-zinc-900">Hanzi to Indonesian</span>
                    <span className="mt-2 block text-xs leading-relaxed text-zinc-500">
                      Guess the Indonesian meaning of each Hanzi character.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("id-to-hanzi")}
                    aria-pressed={mode === "id-to-hanzi"}
                    className={`rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                      mode === "id-to-hanzi"
                        ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <span className="block font-semibold text-zinc-900">Indonesian to Hanzi</span>
                    <span className="mt-2 block text-xs leading-relaxed text-zinc-500">
                      Choose the correct Hanzi character based on its meaning.
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase text-zinc-900">2. Number of questions</h2>
            <div className="grid grid-cols-4 gap-3">
              {[5, 10, 15, 20].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTotalQuestions(amount)}
                  aria-label={`${amount} questions`}
                  aria-pressed={totalQuestions === amount}
                  className={`flex h-12 items-center justify-center rounded-lg border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                    totalQuestions === amount
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-6">
            <Button
              onClick={handleStart}
              size="lg"
              className="h-14 w-full bg-zinc-900 text-base text-white hover:bg-zinc-700"
            >
              <Play aria-hidden="true" />
              Start challenge
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
