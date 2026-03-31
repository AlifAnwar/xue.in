import { getVocabularyItems } from "@/lib/csv";
import { buildQuestions } from "@/lib/quiz";
import { QuizConfig, TrainingMode } from "@/types/vocabulary";
import QuizClient from "@/components/quiz/QuizClient";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const mode = (params?.mode as TrainingMode) || "hanzi-to-id";
  const amount = parseInt((params?.amount as string) || "10", 10);
  const t = (params?.t as string) || Date.now().toString();
  
  // Load data and statically resolve questions for this quiz session
  const items = getVocabularyItems();
  const config: QuizConfig = { mode, totalQuestions: amount };
  const questions = buildQuestions(items, config);

  return <QuizClient key={t} initialQuestions={questions} mode={mode} />;
}
