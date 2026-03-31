import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900">
          Uji Kosakata Mandarin Anda
        </h1>
        <p className="text-lg text-zinc-500">
          Tingkatkan pemahaman Hanzi dan Pinyin Anda dengan kuis berfokus minimalis dan cepat.
        </p>
      </div>
      
      <Button asChild size="lg" className="bg-zinc-900 text-white hover:bg-zinc-700 rounded-lg">
        <Link href="/training">
          Mulai Latihan
        </Link>
      </Button>
    </section>
  );
}
