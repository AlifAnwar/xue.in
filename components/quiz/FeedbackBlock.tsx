import { Card } from "@/components/ui/card";
import { VocabItem } from "@/types/vocabulary";

export function FeedbackBlock({ isCorrect, item }: { isCorrect: boolean, item: VocabItem }) {
  return (
    <Card className="mt-8 p-5 sm:p-6 border border-zinc-200 rounded-xl bg-zinc-50 shadow-sm flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className={`font-semibold text-base flex items-center gap-2 ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
        {isCorrect ? (
          <>
            <span className="text-xl">✓</span> Benar!
          </>
        ) : (
          <>
            <span className="text-xl">✗</span> Kurang Tepat
          </>
        )}
      </div>
      <div className="space-y-1.5 w-full max-w-sm">
        <div className="text-3xl font-bold text-zinc-900 mb-2">{item.hanzi}</div>
        <div className="text-sm text-zinc-500 tracking-wide font-medium">{item.pinyin} <span className="text-zinc-300 mx-1">|</span> {item.partOfSpeech}</div>
        <div className="text-lg font-medium text-zinc-800 pt-1">{item.indonesian}</div>
      </div>
    </Card>
  );
}
