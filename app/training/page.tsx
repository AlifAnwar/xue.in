import { GameplayCards } from "@/components/landing/components/gameplay-cards.component";
import { BackHomeButton } from "@/components/navigation/BackHomeButton";

export default function TrainingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <BackHomeButton />

        <header className="mb-9 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase text-zinc-500">Training</p>
          <h1 className="text-3xl font-bold text-zinc-950 sm:text-4xl">Choose your challenge</h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            Practice Mandarin vocabulary through the challenge that fits your learning style.
          </p>
        </header>

        <GameplayCards variant="training" />
      </div>
    </main>
  );
}
