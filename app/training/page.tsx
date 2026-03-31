"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrainingMode } from "@/types/vocabulary";

export default function TrainingSetupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<TrainingMode>("hanzi-to-id");
  const [totalQuestions, setTotalQuestions] = useState<number>(10);

  const handleStart = () => {
    const params = new URLSearchParams({
      mode,
      amount: totalQuestions.toString(),
      t: Date.now().toString()
    });
    router.push(`/training/quiz?${params.toString()}`);
  };

  return (
    <main className="flex-1 bg-zinc-50 flex flex-col items-center justify-center p-4 min-h-screen py-12">
      <div className="w-full max-w-lg space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Pengaturan Latihan</h1>
          <p className="text-zinc-500">Pilih mode tebakan dan jumlah soal untuk memulai sesi pemanasan.</p>
        </div>

        <div className="space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-sm">
          {/* Mode Selection */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">1. Pilih Mode</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode("hanzi-to-id")}
                className={`text-left p-4 rounded-xl border transition-all ${
                  mode === "hanzi-to-id"
                    ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
              >
                <div className="font-semibold text-zinc-900 text-base">Hanzi → Indonesia</div>
                <div className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Tebak arti bahasa Indonesia dari karakter Hanzi
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("id-to-hanzi")}
                className={`text-left p-4 rounded-xl border transition-all ${
                  mode === "id-to-hanzi"
                    ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
              >
                <div className="font-semibold text-zinc-900 text-base">Indonesia → Hanzi</div>
                <div className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Pilih karakter Hanzi yang tepat berdasarkan arti
                </div>
              </button>
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">2. Jumlah Soal</h2>
            <div className="flex flex-wrap gap-3">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTotalQuestions(num)}
                  className={`flex-1 py-3 px-2 rounded-xl border font-medium transition-all min-w-[3.5rem] sm:min-w-[4rem] flex items-center justify-center ${
                    totalQuestions === num
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300"
                  }`}
                >
                  <span className="text-lg">{num}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-zinc-100 space-y-3">
            <Button 
              onClick={handleStart} 
              size="lg"
              className="w-full bg-zinc-900 text-white hover:bg-zinc-700 rounded-lg h-14 text-base font-medium transition-colors"
            >
              Mulai
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push("/")} 
              size="lg"
              className="w-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg h-14 text-base font-medium transition-colors"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
