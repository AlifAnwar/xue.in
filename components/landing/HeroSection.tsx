import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-2xl mx-auto space-y-8">
      <a 
        href="https://www.instagram.com/a.lifanwar/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-900 rounded-full transition-colors border border-zinc-200 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
        @a.lifanwar
      </a>

      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900">
          Uji Kosakata Mandarin Anda
        </h1>
        <p className="text-lg text-zinc-500">
          Tingkatkan pemahaman Hanzi dan Pinyin Anda dengan kuis.
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
