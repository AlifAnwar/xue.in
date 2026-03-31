import { HeroSection } from "@/components/landing/HeroSection";
import { ModeCard } from "@/components/landing/ModeCard";

export default function LandingPage() {
  return (
    <main className="flex-1 bg-zinc-50 flex flex-col justify-center py-12">
      <HeroSection />
      
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-8">
        <ModeCard 
          title="Mode A: Hanzi → Indonesia"
          description="Latih kemampuan mengingat arti bahasa Indonesia dari karakter Hanzi yang ditampilkan."
          example="Contoh: 我 → Saya"
        />
        <ModeCard 
          title="Mode B: Indonesia → Hanzi"
          description="Tantang diri Anda untuk mengingat karakter Hanzi dari kata bahasa Indonesia."
          example="Contoh: Universitas → 大學"
        />
      </div>
    </main>
  );
}
