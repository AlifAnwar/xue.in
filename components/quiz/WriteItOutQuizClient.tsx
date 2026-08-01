"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CircleHelp,
  Keyboard,
  Languages,
  RotateCcw,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import type { QuizQuestion, WriteItOutMode } from "@/types/vocabulary";
import {
  displayPinyin,
  getAcceptedAnswers,
  getHanziAnswers,
  isSimplifiedEquivalent,
  isWritingAnswerCorrect,
  numberedPinyinToToneMarks,
} from "@/lib/write-it-out";

type QuizStage = "ready" | "answering" | "feedback" | "done";

interface WritingResult {
  question: QuizQuestion;
  answer: string;
  isCorrect: boolean;
  usedSimplified: boolean;
}

interface WriteItOutQuizClientProps {
  initialQuestions: QuizQuestion[];
  mode: WriteItOutMode;
}

function ReadyCheck({
  mode,
  onBack,
  onStart,
}: {
  mode: WriteItOutMode;
  onBack: () => void;
  onStart: () => void;
}) {
  const isPinyinMode = mode === "hanzi-to-pinyin";

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to setup
        </button>

        <Card className="overflow-hidden rounded-2xl border-zinc-200 bg-white p-0 shadow-sm">
          <div className="border-b border-zinc-100 bg-[#FFF8ED] px-6 py-7 sm:px-8">
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#FFE0AE] text-[#B95020]">
              {isPinyinMode ? (
                <Languages className="size-5" aria-hidden="true" />
              ) : (
                <Keyboard className="size-5" aria-hidden="true" />
              )}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B95020]">
              One quick check
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              {isPinyinMode ? "How to type Pinyin tones" : "Traditional keyboard ready?"}
            </h1>
          </div>

          <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-8">
            {isPinyinMode ? (
              <>
                <p className="text-sm leading-6 text-zinc-600">
                  Add a number after each syllable. You can also type tone marks directly.
                </p>
                <div className="grid grid-cols-5 gap-2" aria-label="Pinyin tone number guide">
                  {[
                    ["1", "ā"],
                    ["2", "á"],
                    ["3", "ǎ"],
                    ["4", "à"],
                    ["5", "a"],
                  ].map(([number, tone]) => (
                    <div
                      key={number}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-3 text-center"
                    >
                      <span className="block text-lg font-semibold text-zinc-900">{tone}</span>
                      <span className="mt-1 block text-[11px] text-zinc-500">
                        {number === "5" ? "neutral" : `tone ${number}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Example
                  </p>
                  <p className="mt-2 font-medium text-zinc-900">
                    <span className="font-mono">xue2 xi2</span>
                    <span className="mx-2 text-zinc-400">→</span>
                    <span className="text-lg">xuéxí</span>
                  </p>
                </div>
                <p className="text-xs leading-5 text-zinc-500">
                  Tip: use <span className="font-mono font-semibold text-zinc-700">v</span> for{" "}
                  <span className="font-semibold text-zinc-700">ü</span>, for example{" "}
                  <span className="font-mono font-semibold text-zinc-700">nv3</span>.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm leading-6 text-zinc-600">
                  Switch your device keyboard to{" "}
                  <strong className="font-semibold text-zinc-900">Chinese (Traditional)</strong>{" "}
                  before you begin.
                </p>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  This challenge focuses on Traditional Hanzi. Simplified Chinese answers will
                  not be accepted.
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <span className="text-2xl font-semibold text-zinc-900">學習</span>
                  <span className="text-zinc-300">not</span>
                  <span className="text-2xl text-zinc-400 line-through">学习</span>
                </div>
              </>
            )}

            <Button
              type="button"
              onClick={onStart}
              size="lg"
              className="h-14 w-full bg-zinc-900 text-base text-white hover:bg-zinc-700"
            >
              {isPinyinMode ? "I understand — Start quiz" : "Keyboard ready — Start quiz"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default function WriteItOutQuizClient({
  initialQuestions,
  mode,
}: WriteItOutQuizClientProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<WritingResult[]>([]);
  const [stage, setStage] = useState<QuizStage>("ready");
  const [answer, setAnswer] = useState("");
  const [inputError, setInputError] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (stage !== "answering" && stage !== "feedback") {
      return;
    }

    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [stage]);

  if (!questions.length) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 p-4">
        <p className="mb-4 text-zinc-500">Could not load the questions.</p>
        <Button onClick={() => router.push("/training")}>Back to training</Button>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isPinyinMode = mode === "hanzi-to-pinyin";
  const correctCount = results.filter((result) => result.isCorrect).length;

  const handleExit = () => {
    if (
      (stage === "answering" || stage === "feedback") &&
      !window.confirm("Leave this quiz? Your current progress will be lost.")
    ) {
      return;
    }

    router.push("/training/write-it-out");
  };

  const handleCheckAnswer = () => {
    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer) {
      setInputError(isPinyinMode ? "Type the Pinyin first." : "Type the Traditional Hanzi first.");
      return;
    }

    const isCorrect = isWritingAnswerCorrect(trimmedAnswer, currentQuestion.item, mode);
    const usedSimplified =
      mode === "pinyin-to-hanzi" &&
      !isCorrect &&
      isSimplifiedEquivalent(trimmedAnswer, currentQuestion.item);

    setResults((currentResults) => [
      ...currentResults,
      {
        question: currentQuestion,
        answer: trimmedAnswer,
        isCorrect,
        usedSimplified,
      },
    ]);
    setInputError("");
    setShowHelp(false);
    setStage("feedback");
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      setStage("done");
      return;
    }

    setCurrentIndex((index) => index + 1);
    setAnswer("");
    setInputError("");
    setStage("answering");
  };

  const startNewRound = (nextQuestions: QuizQuestion[]) => {
    setQuestions(nextQuestions);
    setCurrentIndex(0);
    setResults([]);
    setAnswer("");
    setInputError("");
    setShowHelp(false);
    setStage("answering");
  };

  const handleRetryMistakes = () => {
    const missedQuestions = results
      .filter((result) => !result.isCorrect)
      .map((result) => result.question);
    startNewRound(missedQuestions);
  };

  const handlePracticeNewWords = () => {
    const params = new URLSearchParams({
      challenge: "write-it-out",
      mode,
      amount: initialQuestions.length.toString(),
      t: Date.now().toString(),
    });
    router.push(`/training/quiz?${params.toString()}`);
  };

  if (stage === "ready") {
    return (
      <ReadyCheck
        mode={mode}
        onBack={() => router.push("/training/write-it-out")}
        onStart={() => setStage("answering")}
      />
    );
  }

  if (stage === "done") {
    const mistakes = results.filter((result) => !result.isCorrect);
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 sm:py-16">
        <div className="w-full max-w-2xl space-y-6">
          <Card className="items-center rounded-2xl border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#FFF1D9] text-2xl font-bold text-[#B95020]">
              {percentage}%
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-950">Round complete</h1>
            <p className="mt-2 text-zinc-500">
              You got {correctCount} of {questions.length} answers correct.
            </p>

            <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
              {mistakes.length > 0 && (
                <Button
                  onClick={handleRetryMistakes}
                  size="lg"
                  className="h-13 bg-zinc-900 text-white hover:bg-zinc-700"
                >
                  <RotateCcw aria-hidden="true" />
                  Retry {mistakes.length} mistake{mistakes.length === 1 ? "" : "s"}
                </Button>
              )}
              <Button
                variant={mistakes.length > 0 ? "outline" : "default"}
                onClick={handlePracticeNewWords}
                size="lg"
                className={
                  mistakes.length > 0
                    ? "h-13 border-zinc-200"
                    : "h-13 bg-zinc-900 text-white hover:bg-zinc-700"
                }
              >
                Practice new words
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/training")}
              className="mt-3 text-zinc-500"
            >
              Back to all challenges
            </Button>
          </Card>

          {mistakes.length > 0 && (
            <Card className="rounded-2xl border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-zinc-950">Words to review</h2>
              <div className="mt-5 divide-y divide-zinc-100">
                {mistakes.map((result) => {
                  const correctAnswers = getAcceptedAnswers(result.question.item, mode);
                  const displayedCorrectAnswer = isPinyinMode
                    ? displayPinyin(result.question.item.pinyin)
                    : correctAnswers.join(" / ");

                  return (
                    <div
                      key={result.question.item.id}
                      className="grid gap-2 py-4 text-sm sm:grid-cols-[1fr_1fr]"
                    >
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                          Your answer
                        </p>
                        <p className="mt-1 break-words text-red-600">{result.answer}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                          Correct answer
                        </p>
                        <p className="mt-1 break-words font-medium text-zinc-900">
                          {displayedCorrectAnswer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </main>
    );
  }

  const latestResult = results.at(-1);
  const prompt = isPinyinMode
    ? getHanziAnswers(currentQuestion.item).join(" / ")
    : displayPinyin(currentQuestion.item.pinyin);
  const displayedCorrectAnswer = isPinyinMode
    ? displayPinyin(currentQuestion.item.pinyin)
    : getHanziAnswers(currentQuestion.item).join(" / ");
  const answerPreview =
    isPinyinMode && answer.match(/[0-5]/) ? numberedPinyinToToneMarks(answer) : "";

  return (
    <main
      aria-live="polite"
      className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-8 sm:py-12"
    >
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Exit
          </button>
          <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-900 shadow-sm">
            Correct: {correctCount} / {questions.length}
          </div>
        </div>

        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <Card
          key={currentQuestion.item.id}
          className="mb-5 min-h-48 items-center justify-center rounded-2xl border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-12"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {isPinyinMode ? "Write the Pinyin" : "Write the Traditional Hanzi"}
          </p>
          <div
            lang={isPinyinMode ? "zh-Hant" : undefined}
            className="mt-4 text-4xl font-bold leading-tight tracking-wide text-zinc-950 sm:text-5xl"
          >
            {prompt}
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            {currentQuestion.item.indonesian}
          </p>
        </Card>

        <div className="mb-3 flex items-center justify-between px-1">
          <label htmlFor="write-answer" className="text-sm font-semibold text-zinc-800">
            Your answer
          </label>
          <button
            type="button"
            onClick={() => setShowHelp((visible) => !visible)}
            aria-expanded={showHelp}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950"
          >
            <CircleHelp className="size-4" aria-hidden="true" />
            {isPinyinMode ? "How to type tones?" : "Keyboard help"}
          </button>
        </div>

        {showHelp && (
          <div className="mb-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-600 shadow-sm">
            {isPinyinMode ? (
              <p>
                Add numbers after each syllable:{" "}
                <span className="font-medium text-zinc-900">
                  1 = ā, 2 = á, 3 = ǎ, 4 = à, 5 = neutral
                </span>
                . Example: <span className="font-mono text-zinc-900">xue2 xi2</span>.
              </p>
            ) : (
              <p>
                Use your <strong className="font-semibold text-zinc-900">Chinese (Traditional)</strong>{" "}
                keyboard. Simplified Hanzi are not accepted.
              </p>
            )}
          </div>
        )}

        <Input
          id="write-answer"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            if (inputError) setInputError("");
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !isComposing &&
              !event.nativeEvent.isComposing &&
              stage === "answering"
            ) {
              event.preventDefault();
              handleCheckAnswer();
            }
          }}
          autoFocus
          disabled={stage === "feedback"}
          autoComplete="off"
          spellCheck={false}
          lang={isPinyinMode ? undefined : "zh-Hant"}
          placeholder={isPinyinMode ? "Type Pinyin, e.g. xue2 xi2" : "輸入繁體中文"}
          aria-invalid={Boolean(inputError)}
          aria-describedby={inputError ? "answer-error" : undefined}
          className="h-14 rounded-xl border-zinc-300 bg-white px-4 text-lg shadow-sm disabled:opacity-100"
        />

        {inputError ? (
          <p id="answer-error" className="mt-2 px-1 text-sm text-red-600">
            {inputError}
          </p>
        ) : answerPreview && stage === "answering" ? (
          <p className="mt-2 px-1 text-sm text-zinc-500">
            Tone preview: <span className="font-medium text-zinc-900">{answerPreview}</span>
          </p>
        ) : null}

        {stage === "answering" ? (
          <Button
            type="button"
            onClick={handleCheckAnswer}
            size="lg"
            className="mt-5 h-14 w-full bg-zinc-900 text-base text-white hover:bg-zinc-700"
          >
            Check answer
          </Button>
        ) : (
          <div className="mt-5 space-y-4">
            <Card
              className={`rounded-xl p-5 shadow-sm ${
                latestResult?.isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div
                className={`flex items-center gap-2 font-semibold ${
                  latestResult?.isCorrect ? "text-green-800" : "text-red-700"
                }`}
              >
                {latestResult?.isCorrect ? (
                  <Check className="size-5" aria-hidden="true" />
                ) : (
                  <X className="size-5" aria-hidden="true" />
                )}
                {latestResult?.isCorrect
                  ? "Correct!"
                  : latestResult?.usedSimplified
                    ? "Traditional Hanzi required"
                    : "Not quite"}
              </div>
              {!latestResult?.isCorrect && (
                <div className="mt-3 text-sm leading-6 text-zinc-700">
                  {latestResult?.usedSimplified && (
                    <p className="mb-1">You entered the Simplified Chinese form.</p>
                  )}
                  <p>
                    Correct answer:{" "}
                    <strong className="font-semibold text-zinc-950">
                      {displayedCorrectAnswer}
                    </strong>
                  </p>
                </div>
              )}
            </Card>

            <Button
              type="button"
              onClick={handleNext}
              size="lg"
              className="h-14 w-full bg-zinc-900 text-base text-white hover:bg-zinc-700"
            >
              {currentIndex < questions.length - 1 ? "Next question" : "See results"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
