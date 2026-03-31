import { Card } from "@/components/ui/card";
import { VocabItem } from "@/types/vocabulary";

type State = "default" | "selected" | "correct" | "incorrect" | "revealed" | "disabled";

interface ChoiceCardProps {
  choice: VocabItem;
  displayMode: "hanzi" | "id";
  state: State;
  onClick: () => void;
}

export function ChoiceCard({ choice, displayMode, state, onClick }: ChoiceCardProps) {
  let borderClass = "border-zinc-200";
  let bgClass = "bg-white";
  let textClass = "text-zinc-900";
  let hoverClass = "hover:border-zinc-400 cursor-pointer hover:bg-zinc-50";

  if (state === "selected") {
    borderClass = "border-zinc-900 ring-1 ring-zinc-900";
    bgClass = "bg-zinc-50";
    hoverClass = "cursor-default";
  } else if (state === "correct" || state === "revealed") {
    borderClass = "border-green-600 ring-1 ring-green-600";
    bgClass = "bg-green-50";
    textClass = "text-green-900";
    hoverClass = "cursor-default";
  } else if (state === "incorrect") {
    borderClass = "border-red-500 ring-1 ring-red-500";
    bgClass = "bg-red-50";
    textClass = "text-red-900";
    hoverClass = "cursor-default";
  } else if (state === "disabled") {
    hoverClass = "cursor-not-allowed opacity-60";
  }

  const label = displayMode === "hanzi" ? choice.hanzi : choice.indonesian;
  const isHanzi = displayMode === "hanzi";

  return (
    <button
      type="button"
      onClick={state === "default" || state === "selected" ? onClick : undefined}
      disabled={state === "disabled" || state === "correct" || state === "incorrect" || state === "revealed"}
      className={`w-full text-left transition-all outline-none rounded-xl disabled:cursor-not-allowed`}
    >
      <Card className={`p-5 sm:p-6 min-h-[5rem] rounded-xl flex items-center justify-center shadow-sm border ${borderClass} ${bgClass} ${textClass} ${hoverClass} h-full`}>
        <span className={`${isHanzi ? 'text-3xl sm:text-4xl font-bold' : 'text-base sm:text-lg font-medium'} text-center w-full block`}>
          {label}
        </span>
      </Card>
    </button>
  );
}
