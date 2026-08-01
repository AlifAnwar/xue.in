import { notFound } from "next/navigation";

import { gameplayCards } from "@/components/landing/data/gameplay-challenges";
import { ChallengeSetup } from "@/components/training/ChallengeSetup";

interface ChallengeDetailPageProps {
  params: Promise<{ detailChallenge: string }>;
}

export function generateStaticParams() {
  return gameplayCards.map((challenge) => ({
    detailChallenge: challenge.slug,
  }));
}

export default async function ChallengeDetailPage({ params }: ChallengeDetailPageProps) {
  const { detailChallenge } = await params;
  const challenge = gameplayCards.find((item) => item.slug === detailChallenge);

  if (!challenge) {
    notFound();
  }

  return <ChallengeSetup challenge={challenge} />;
}
