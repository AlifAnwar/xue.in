import { Badge } from "@/components/ui/badge";

export function ScoreHeader({ correct, total }: { correct: number; total: number }) {
  return (
    <div className="flex items-center justify-between w-full mb-6">
      <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Kuis Latihan</h2>
      <div className="px-3 py-1 rounded-full border border-zinc-200 bg-white text-sm font-medium text-zinc-900 shadow-sm">
        Benar: {correct} / {total}
      </div>
    </div>
  );
}
