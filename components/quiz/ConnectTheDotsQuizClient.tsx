"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { shuffle } from "@/lib/quiz";
import { displayPinyin } from "@/lib/write-it-out";
import type { QuizQuestion, VocabItem } from "@/types/vocabulary";

type QuizStage = "ready" | "playing" | "done";
type RingSegment = {
    id: number;
    path: string;
};

interface MatchFeedback {
    leftId: number;
    rightId: number;
    isCorrect: boolean;
    key: number;
}

interface MatchingResult {
    question: QuizQuestion;
    pairId: number;
    isCorrect: boolean;
    timeSpent: number;
}

interface ConnectTheDotsQuizClientProps {
    initialQuestions: QuizQuestion[];
    mode: "hanzi-to-pinyin" | "hanzi-to-id";
}

function getTimestamp() {
    return Date.now();
}

function buildRoundQuestions(questions: QuizQuestion[]) {
    return shuffle(questions).map((question) => ({
        ...question,
        choices: shuffle(question.choices),
    }));
}

function buildRightItemGroups(questions: QuizQuestion[]) {
    return questions.map((question) => shuffle(question.choices));
}

function polarToCartesian(center: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

    return {
        x: center + radius * Math.cos(angleInRadians),
        y: center + radius * Math.sin(angleInRadians),
    };
}

function describeArc(center: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(center, radius, endAngle);
    const end = polarToCartesian(center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
    ].join(" ");
}

function buildRingSegments(totalSegments: number): RingSegment[] {
    const segmentAngle = 360 / totalSegments;
    const gapAngle = 4.3;

    return Array.from({ length: totalSegments }, (_, index) => {
        const startAngle = index * segmentAngle + gapAngle / 2;
        const endAngle = (index + 1) * segmentAngle - gapAngle / 2;

        return {
            id: index,
            path: describeArc(120, 88, startAngle, endAngle),
        };
    });
}

function RoundAccuracySummary({
    percentage,
    matchedCount,
    missedCount,
}: {
    percentage: number;
    matchedCount: number;
    missedCount: number;
}) {
    const totalSegments = 24;
    const activeSegments = Math.round((percentage / 100) * totalSegments);
    const segments = buildRingSegments(totalSegments);

    return (
        <div className="flex flex-col items-center">
            <div className="mb-8 rounded-full bg-[#E8F4FF] px-5 py-1 text-center text-xl font-semibold uppercase  text-[#1684F7] [animation:connect-result-pill_520ms_cubic-bezier(0.22,1,0.36,1)_both] sm:px-5 sm:text-xl">
                Round complete
            </div>

            <div className="relative size-[180px] sm:size-[260px]">
                <svg
                    aria-hidden="true"
                    className="absolute inset-0 size-full -rotate-90 overflow-visible"
                    viewBox="0 0 240 240"
                >
                    {segments.map((segment, index) => {
                        const isMatchedSegment = index < activeSegments;

                        return (
                            <path
                                key={segment.id}
                                d={segment.path}
                                fill="none"
                                stroke={isMatchedSegment ? "#1684F7" : "#CBD5E1"}
                                strokeWidth="15"
                                strokeLinecap="butt"
                                className="[animation:connect-result-segment_620ms_cubic-bezier(0.34,1.56,0.64,1)_both]"
                                style={{ animationDelay: `${index * 32}ms` }}
                            />
                        );
                    })}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center [animation:connect-result-score_720ms_cubic-bezier(0.34,1.56,0.64,1)_220ms_both]">
                    <div className="leading-none tracking-tight">
                        <span className="text-4xl font-black text-[#1684F7] sm:text-5xl">
                            {percentage}
                        </span>
                        <span className="text-3xl font-black text-slate-950 sm:text-4xl">%</span>
                    </div>
                    <p className="mt-2 text-lg font-bold uppercase tracking-[0.18em] text-slate-500">
                        Accuracy
                    </p>
                </div>
            </div>

            <div className="mt-7 flex items-center justify-center gap-8 text-xl font-semibold text-slate-500 sm:text-2xl">
                <div className="flex items-center gap-3 [animation:connect-result-legend_520ms_cubic-bezier(0.22,1,0.36,1)_520ms_both]">
                    <span className="h-3 w-8 rounded-full bg-[#1684F7]" />
                    <span>
                        <span>{matchedCount}</span> matched
                    </span>
                </div>
                <div className="flex items-center gap-3 [animation:connect-result-legend_520ms_cubic-bezier(0.22,1,0.36,1)_620ms_both]">
                    <span className="h-3 w-8 rounded-full bg-slate-300" />
                    <span>
                        <span>{missedCount}</span> missed
                    </span>
                </div>
            </div>
        </div>
    );
}

function ReadyCheck({
    onBack,
    onStart,
}: {
    onBack: () => void;
    onStart: () => void;
}) {
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
                    <div className="border-b border-zinc-100 bg-[#E8F4FF] px-6 py-7 sm:px-8">
                        <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#B6E4FF] text-[#0095E7]">
                            <ChevronRight className="size-5" aria-hidden="true" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#0095E7]">
                            How to play
                        </p>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                            Connect the dots
                        </h1>
                    </div>

                    <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-8">
                        <p className="text-sm leading-6 text-zinc-600">
                            Match items from the left column with their corresponding pairs on the right.
                        </p>

                        <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Example
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <p className="font-medium text-zinc-900">Left side</p>
                                    <div className="rounded bg-white p-2 text-center font-semibold text-zinc-900">
                                        學
                                    </div>
                                    <div className="rounded bg-white p-2 text-center font-semibold text-zinc-900">
                                        習
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-medium text-zinc-900">Right side</p>
                                    <div className="rounded bg-white p-2 text-center font-semibold text-zinc-900">
                                        xué
                                    </div>
                                    <div className="rounded bg-white p-2 text-center font-semibold text-zinc-900">
                                        xí
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-500">
                                Click one on the left, then click its match on the right!
                            </p>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
                            Race against the clock and match all pairs as fast as you can!
                        </div>

                        <Button
                            type="button"
                            onClick={onStart}
                            size="lg"
                            className="h-14 w-full bg-[#0095E7] text-base text-white hover:bg-[#0077B6]"
                        >
                            Let&apos;s match! - Start
                        </Button>
                    </div>
                </Card>
            </div>
        </main>
    );
}

export default function ConnectTheDotsQuizClient({
    initialQuestions,
    mode,
}: ConnectTheDotsQuizClientProps) {
    const router = useRouter();
    const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
    const [rightItemGroups, setRightItemGroups] = useState<VocabItem[][]>(() =>
        initialQuestions.map((question) => question.choices),
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<MatchingResult[]>([]);
    const [stage, setStage] = useState<QuizStage>("ready");
    const [selectedLeftId, setSelectedLeftId] = useState<number | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
    const [matchFeedback, setMatchFeedback] = useState<MatchFeedback | null>(null);
    const [sessionStartTime, setSessionStartTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const nextStepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Timer effect
    useEffect(() => {
        if (stage !== "playing") return;

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
        }, 100);

        return () => clearInterval(interval);
    }, [stage, sessionStartTime]);

    // Warn before leaving
    useEffect(() => {
        if (stage !== "playing") {
            return;
        }

        const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", warnBeforeLeaving);
        return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
    }, [stage]);

    useEffect(() => {
        return () => {
            if (feedbackTimeoutRef.current) {
                clearTimeout(feedbackTimeoutRef.current);
            }
            if (nextStepTimeoutRef.current) {
                clearTimeout(nextStepTimeoutRef.current);
            }
        };
    }, []);

    if (!questions.length) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 p-4">
                <p className="mb-4 text-zinc-500">Could not load the questions.</p>
                <Button onClick={() => router.push("/training")}>Back to training</Button>
            </main>
        );
    }

    const currentQuestion = questions[currentIndex];
    const isHanziMode = mode === "hanzi-to-pinyin";
    const leftItems = currentQuestion.choices;
    const rightItems = rightItemGroups[currentIndex] ?? currentQuestion.choices;

    const getRightLabel = (item: VocabItem) => {
        return isHanziMode ? displayPinyin(item.pinyin) : item.indonesian;
    };

    const handleSelectLeft = (item: VocabItem) => {
        if (matchedPairs.has(item.id) || matchFeedback) return;
        setSelectedLeftId((previousId) => (previousId === item.id ? null : item.id));
    };

    const handleSelectRight = (item: VocabItem) => {
        if (selectedLeftId === null || matchedPairs.has(item.id) || matchFeedback) return;

        const isCorrect = selectedLeftId === item.id;
        const timeSpent = Math.floor((getTimestamp() - sessionStartTime) / 1000);
        const nextResult: MatchingResult = {
            question: currentQuestion,
            pairId: item.id,
            isCorrect,
            timeSpent,
        };

        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
        }
        if (nextStepTimeoutRef.current) {
            clearTimeout(nextStepTimeoutRef.current);
        }

        setMatchFeedback({
            leftId: selectedLeftId,
            rightId: item.id,
            isCorrect,
            key: getTimestamp(),
        });

        if (isCorrect) {
            const nextMatchedPairs = new Set([...matchedPairs, item.id]);
            setResults((prev) => [...prev, nextResult]);

            feedbackTimeoutRef.current = setTimeout(() => {
                setMatchedPairs(nextMatchedPairs);
                setSelectedLeftId(null);
                setMatchFeedback(null);

                if (nextMatchedPairs.size >= leftItems.length) {
                    nextStepTimeoutRef.current = setTimeout(() => {
                        if (currentIndex >= questions.length - 1) {
                            setElapsedTime(Math.floor((getTimestamp() - sessionStartTime) / 1000));
                            setStage("done");
                        } else {
                            setCurrentIndex((prev) => prev + 1);
                            setMatchedPairs(new Set());
                        }
                    }, 360);
                }
            }, 420);
        } else {
            setResults((prev) => [...prev, nextResult]);
            feedbackTimeoutRef.current = setTimeout(() => {
                setMatchFeedback(null);
            }, 420);
        }
    };

    const handleExit = () => {
        if (stage === "playing" && !window.confirm("Leave this quiz? Your progress will be lost.")) {
            return;
        }
        router.push("/training/connect-the-dots");
    };

    const startRound = () => {
        const nextQuestions = buildRoundQuestions(initialQuestions);
        const startedAt = getTimestamp();

        setCurrentIndex(0);
        setQuestions(nextQuestions);
        setResults([]);
        setMatchedPairs(new Set());
        setSelectedLeftId(null);
        setMatchFeedback(null);
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
        }
        if (nextStepTimeoutRef.current) {
            clearTimeout(nextStepTimeoutRef.current);
        }
        setRightItemGroups(buildRightItemGroups(nextQuestions));
        setElapsedTime(0);
        setSessionStartTime(startedAt);
        setStage("playing");
    };

    const handleRetry = () => {
        startRound();
    };

    const handlePracticeNew = () => {
        const params = new URLSearchParams({
            challenge: "connect-the-dots",
            mode,
            amount: initialQuestions.length.toString(),
            t: getTimestamp().toString(),
        });
        router.push(`/training/quiz?${params.toString()}`);
    };

    if (stage === "ready") {
        return (
            <ReadyCheck
                onBack={() => router.push("/training/connect-the-dots")}
                onStart={startRound}
            />
        );
    }

    if (stage === "done") {
        const correctCount = results.filter((r) => r.isCorrect).length;
        const totalPairs = questions.reduce((sum, question) => sum + question.choices.length, 0);
        const attempts = results.length;
        const missedCount = attempts - correctCount;
        const percentage = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;

        return (
            <main className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 sm:py-16">
                <div className="w-full max-w-2xl space-y-6">
                    <RoundAccuracySummary
                        percentage={percentage}
                        matchedCount={correctCount}
                        missedCount={missedCount}
                    />

                    <p className="text-center text-sm text-zinc-500">
                        You matched {correctCount} out of {totalPairs} pairs in {elapsedTime} seconds.
                    </p>

                    <div className="flex items-center justify-center gap-10 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm [animation:connect-result-card_560ms_cubic-bezier(0.22,1,0.36,1)_760ms_both] sm:gap-24 sm:p-8">

                        <div className="flex flex-col-reverse items-center">
                            <p className="text-sm text-zinc-500">Correct</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900">
                                {correctCount}/{totalPairs}
                            </p>
                        </div>

                        <div className="flex flex-col-reverse items-center">
                            <p className="text-sm text-zinc-500">Tap</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900">
                                {attempts}
                            </p>
                        </div>

                        <div className="flex flex-col-reverse items-center">
                            <p className="text-sm text-zinc-500">Time</p>
                            <p className="mt-2 text-2xl font-bold text-zinc-900">{elapsedTime}s</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                            <Button
                                onClick={handleRetry}
                                variant="outline"
                                size="lg"
                                className="h-14 flex-1 text-base text-gray-700 hover:bg-[#E8F4FF] hover:text-[#0095E7]"
                            >
                                <RotateCcw className="size-4" aria-hidden="true" />
                                Try again
                            </Button>
                            <Button
                                onClick={handlePracticeNew}
                                size="lg"
                                className="h-14 flex-1 bg-[#0095E7] hover:bg-[#0077B6]"
                            >
                                New round
                            </Button>
                        </div>

                        <Button
                            onClick={handleExit}
                            variant="ghost"
                            size="lg"
                            className="h-14 w-full text-zinc-500 hover:text-zinc-950"
                        >
                            Back to training
                        </Button>
                    </div>

                </div>
            </main>
        );
    }

    const getFeedbackClassName = (item: VocabItem, side: "left" | "right") => {
        if (!matchFeedback) return "";

        const isFeedbackTarget =
            side === "left"
                ? matchFeedback.leftId === item.id
                : matchFeedback.rightId === item.id;

        if (!isFeedbackTarget) return "";

        return matchFeedback.isCorrect
            ? "border-[#0095E7] bg-blue-50 text-[#0095E7] [animation:connect-match-correct_420ms_cubic-bezier(0.34,1.56,0.64,1)]"
            : "border-red-500 bg-red-50 text-red-600 [animation:connect-match-wrong_420ms_cubic-bezier(0.36,0,0.66,-0.56)]";
    };

    return (
        <main className="flex min-h-screen flex-col bg-zinc-50">
            <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-4 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={handleExit}
                            className="text-zinc-500 hover:text-zinc-950"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Exit
                        </Button>
                        <div className="text-right">
                            <p className="text-xs uppercase text-zinc-500">Time elapsed</p>
                            <p className="text-lg font-mono font-bold text-zinc-900">{elapsedTime}s</p>
                        </div>
                    </div>
                    <ProgressBar current={currentIndex + 1} total={questions.length} />
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-4xl">
                    <h2 className="mb-8 text-center text-lg font-semibold text-zinc-900">
                        {isHanziMode ? "Match Hanzi with Pinyin" : "Match Hanzi with Indonesian"}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 sm:gap-8">
                        {/* Left column */}
                        <div className="space-y-3">
                            {leftItems.map((item) => (
                                <button
                                    key={`${item.id}-${matchFeedback?.key ?? "idle"}`}
                                    type="button"
                                    onClick={() => handleSelectLeft(item)}
                                    className={`w-full rounded-lg border-2 p-4 text-center text-xl font-semibold transition-all ${matchedPairs.has(item.id)
                                        ? "border-zinc-300 bg-zinc-100 text-zinc-400 opacity-50"
                                        : getFeedbackClassName(item, "left")
                                            ? getFeedbackClassName(item, "left")
                                            : selectedLeftId === item.id
                                                ? "border-[#0095E7] bg-blue-50 text-[#0095E7]"
                                                : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
                                        }`}
                                    disabled={matchedPairs.has(item.id)}
                                >
                                    {item.hanzi}
                                </button>
                            ))}
                        </div>

                        {/* Right column */}
                        <div className="space-y-3">
                            {rightItems.map((item) => (
                                <button
                                    key={`${item.id}-${matchFeedback?.key ?? "idle"}`}
                                    type="button"
                                    onClick={() => handleSelectRight(item)}
                                    className={`w-full rounded-lg border-2 p-4 text-center text-lg font-semibold transition-all ${matchedPairs.has(item.id)
                                        ? "border-zinc-300 bg-zinc-100 text-zinc-400 opacity-50"
                                        : getFeedbackClassName(item, "right")
                                            ? getFeedbackClassName(item, "right")
                                            : selectedLeftId !== null
                                                ? "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-blue-50"
                                                : "border-zinc-200 bg-white text-zinc-900"
                                        }`}
                                    disabled={matchedPairs.has(item.id) || matchFeedback !== null}
                                >
                                    {getRightLabel(item)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
