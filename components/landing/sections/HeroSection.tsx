import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import heroBackground from '@/assets/image/herosection.svg';

export function HeroSection() {
  return (
    <section className="relative isolate h-[100vh] flex  w-full items-start justify-center overflow-hidden bg-white px-4  text-center ">
      <div className="absolute inset-x-0 bottom-[-50px] -z-10 mx-auto h-[950px] w-full ">
        <Image
          src={heroBackground}
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-contain object-bottom opacity-10"
          sizes="2200px"
        />
      </div>

      <div className=" z-10 flex w-full h-full flex-col items-center justify-center">
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-black sm:text-5xl lg:text-[56px]">
          Turn Mandarin Vocabulary Into
          <span className="block">a Daily Challenge</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg font-normal leading-relaxed text-black sm:text-xl">
          Explore Hanzi, Pinyin, and meanings through quick,
          <span className="block">interactive practice that keeps learning light, focused,</span>
          <span className="block">and enjoyable</span>
        </p>

        <Button
          asChild
          size="lg"
          className="mt-14 h-12 rounded-lg bg-black px-8 text-lg font-medium text-white hover:bg-zinc-800"
        >
          <Link href="/training">
            Let&apos;s Get Start
          </Link>
        </Button>

        <div className="mt-24  p-2 flex w-fit justify-between gap-12 text-black sm:grid-cols-2 sm:gap-16 lg:mt-28">
          <div className="flex items-center justify-center gap-4 sm:justify-start">
            <span className="text-8xl font-medium leading-none tracking-normal ">
              +500
            </span>
            <div className="text-left">
              <p className="text-xl font-normal leading-none">Ready words</p>
              <p className="text-xl font-normal leading-tight sm:text-5xl">Vocabulary</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 sm:justify-end">
            <span className="text-8xl font-medium leading-none tracking-normal ">
              4
            </span>
            <div className="text-left">
              <p className="text-xl font-normal leading-none">Practice with</p>
              <p className="text-xl font-normal leading-tight sm:text-5xl">Challenges</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
