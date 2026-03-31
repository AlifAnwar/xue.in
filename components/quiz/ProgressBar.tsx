import { Progress } from "@/components/ui/progress";

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const value = Math.min((current / total) * 100, 100);
  return (
    <div className="w-full space-y-2 mb-8">
      <div className="flex justify-between text-xs text-zinc-500 font-medium px-1">
        <span>Soal {Math.min(current, total)} dari {total}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
