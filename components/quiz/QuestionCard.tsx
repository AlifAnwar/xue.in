import { Card } from "@/components/ui/card";

export function QuestionCard({ prompt }: { prompt: string }) {
  return (
    <Card className="p-8 sm:p-12 mb-8 border border-zinc-200 rounded-xl bg-white shadow-sm flex items-center justify-center min-h-[160px]">
      <div className="text-4xl sm:text-5xl font-bold text-zinc-900 text-center tracking-wide leading-tight">
        {prompt}
      </div>
    </Card>
  );
}
