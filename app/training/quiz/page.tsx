import { getVocabularyItems } from "@/lib/csv";
import { buildQuestions } from "@/lib/quiz";
import { QuizConfig, TrainingMode } from "@/types/vocabulary";
import QuizClient from "@/components/quiz/QuizClient";
import WriteItOutQuizClient from "@/components/quiz/WriteItOutQuizClient";
import ConnectTheDotsQuizClient from "@/components/quiz/ConnectTheDotsQuizClient";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const mode = (params?.mode as TrainingMode) || "hanzi-to-id";
  const challenge = (params?.challenge as string) || "";
  const amount = parseInt((params?.amount as string) || "10", 10);
  const t = (params?.t as string) || "quiz";
  
  // Load data and statically resolve questions for this quiz session
  const items = getVocabularyItems();
  const config: QuizConfig = { mode, totalQuestions: amount };
  const questions = buildQuestions(items, config);

  if (
    challenge === "write-it-out" &&
    (mode === "hanzi-to-pinyin" || mode === "pinyin-to-hanzi")
  ) {
    return <WriteItOutQuizClient key={t} initialQuestions={questions} mode={mode} />;
  }

  if (
    challenge === "connect-the-dots" &&
    (mode === "hanzi-to-pinyin" || mode === "hanzi-to-id")
  ) {
    return <ConnectTheDotsQuizClient key={t} initialQuestions={questions} mode={mode} />;
  }

  return <QuizClient key={t} initialQuestions={questions} mode={mode} />;
}
