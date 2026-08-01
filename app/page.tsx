import { GamePlaySection } from "@/components/landing/sections/GamePlaySection";
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { WhySection } from "@/components/landing/sections/WhySection";

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <WhySection />
      <GamePlaySection />
    </main>
  );
}
