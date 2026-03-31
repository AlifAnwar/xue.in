"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizQuestion, TrainingMode, QuizResult } from "@/types/vocabulary";
import { checkAnswer } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { ScoreHeader } from "./ScoreHeader";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ChoiceCard } from "./ChoiceCard";
import { FeedbackBlock } from "./FeedbackBlock";
import { Card } from "@/components/ui/card";

export default function QuizClient({ 
  initialQuestions, 
  mode 
}: { 
  initialQuestions: QuizQuestion[],
  mode: TrainingMode 
}) {
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [status, setStatus] = useState<"answering" | "feedback" | "done">("answering");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!initialQuestions || initialQuestions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-zinc-500 mb-4">Gagal memuat pertanyaan.</p>
        <Button onClick={() => router.push("/training")}>Kembali</Button>
      </div>
    );
  }

  const handleSelectChoice = (index: number) => {
    if (status !== "answering") return;
    
    setSelectedIndex(index);
    const question = initialQuestions[currentIndex];
    const isCorrect = checkAnswer(question.choices[index], question.item, mode);
    
    setResults(prev => [...prev, {
      question,
      selectedIndex: index,
      isCorrect
    }]);
    
    setStatus("feedback");
  };

  const handleNextQuestion = () => {
    if (currentIndex < initialQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedIndex(null);
      setStatus("answering");
    } else {
      setStatus("done");
    }
  };

  const correctCount = results.filter(r => r.isCorrect).length;
  const totalQuestions = initialQuestions.length;

  const handleRestart = () => {
    const params = new URLSearchParams({
      mode,
      amount: initialQuestions.length.toString(),
      t: Date.now().toString()
    });
    router.push(`/training/quiz?${params.toString()}`);
  };

  if (status === "done") {
    return (
      <main className="flex-1 bg-zinc-50 flex flex-col items-center p-4 py-12 sm:py-20">
        <div className="w-full max-w-lg space-y-6 animate-in fade-in duration-500">
          <Card className="p-8 sm:p-12 border border-zinc-200 rounded-xl bg-white shadow-sm flex flex-col items-center text-center space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Selesai!</h1>
              <p className="text-zinc-500">Berikut adalah hasil latihan Anda.</p>
            </div>
            
            <div className="space-y-2 py-4">
              <div className="text-7xl font-black text-zinc-900 tracking-tighter">
                {correctCount}
              </div>
              <div className="text-lg text-zinc-500 font-medium">Dari {totalQuestions} benar</div>
            </div>

            <div className="w-full space-y-3 pt-6 border-t border-zinc-100">
              <Button onClick={handleRestart} className="w-full bg-zinc-900 text-white hover:bg-zinc-700 rounded-lg h-14 text-base">
                Ulangi Mode Ini
              </Button>
              <Button variant="outline" onClick={() => router.push("/training")} className="w-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg h-14 text-base">
                Kembali ke Menu Utama
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  const question = initialQuestions[currentIndex];
  const isHanziPrompt = mode === "hanzi-to-id";
  const promptText = isHanziPrompt ? question.item.hanzi : question.item.indonesian;
  const choiceMode = isHanziPrompt ? "id" : "hanzi";
  
  const selectedChoice = selectedIndex !== null ? question.choices[selectedIndex] : null;
  const isCorrect = selectedChoice ? checkAnswer(selectedChoice, question.item, mode) : false;

  return (
    <main aria-live="polite" className="flex-1 bg-zinc-50 flex flex-col items-center p-4 py-8 sm:py-12">
      <div className="w-full max-w-lg">
        <ScoreHeader correct={correctCount} total={totalQuestions} />
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        
        <div className="mt-8 animate-in fade-in slide-in-from-right-4 duration-300" key={currentIndex}>
          <QuestionCard prompt={promptText} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.choices.map((choice, idx) => {
              let btnState: "default" | "selected" | "correct" | "incorrect" | "revealed" | "disabled" = "default";
              
              if (status === "answering") {
                btnState = "default";
              } else {
                if (idx === question.correctIndex) {
                  btnState = selectedIndex === idx ? "correct" : "revealed";
                } else if (idx === selectedIndex) {
                  btnState = "incorrect";
                } else {
                  btnState = "disabled";
                }
              }

              return (
                <ChoiceCard
                  key={idx}
                  choice={choice}
                  displayMode={choiceMode}
                  state={btnState}
                  onClick={() => handleSelectChoice(idx)}
                />
              );
            })}
          </div>

          {status === "feedback" && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <FeedbackBlock isCorrect={isCorrect} item={question.item} />
              
              <div className="mt-8">
                <Button 
                  onClick={handleNextQuestion}
                  size="lg"
                  className="w-full bg-zinc-900 text-white hover:bg-zinc-700 rounded-lg h-14 text-base font-medium shadow-sm transition-all"
                >
                  {currentIndex < totalQuestions - 1 ? "Soal Berikutnya" : "Lihat Hasil Akhir"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
