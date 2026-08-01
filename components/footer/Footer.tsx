import Image, { type StaticImageData } from "next/image";

import emailIcon from "@/assets/icons/email.svg";
import githubIcon from "@/assets/icons/github.svg";
import instagramIcon from "@/assets/icons/instagram.svg";
import linkedinIcon from "@/assets/icons/linkedin.svg";

type SocialLink = {
  href: string;
  icon: StaticImageData;
  label: string;
};

const emailAddress = "muhamadalifanwar@gmail.com";

const socialLinks: SocialLink[] = [
  {
    href: `mailto:${emailAddress}`,
    icon: emailIcon,
    label: "Email",
  },
  {
    href: "https://www.linkedin.com/in/muhamad-alif-anwar/",
    icon: linkedinIcon,
    label: "LinkedIn",
  },
  {
    href: "https://instagram.com/a.lifanwar",
    icon: instagramIcon,
    label: "Instagram",
  },
  {
    href: "https://github.com/AlifAnwar",
    icon: githubIcon,
    label: "GitHub",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 bg-gradient-to-b from-zinc-50 to-white text-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-16 text-center">
        <p className="text-2xl font-semibold tracking-normal">
          Xue In
        </p>

        <p className="mt-5 max-w-2xl text-base font-normal leading-relaxed text-zinc-700 sm:text-lg">
          Practice Mandarin vocabulary through quick challenges that help you
          connect Hanzi, Pinyin, and meaning one word at a time.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {socialLinks.map((link) => {
            const isExternalLink = link.href.startsWith("https://");

            return (
              <a
                key={link.label}
                href={link.href}
                target={isExternalLink ? "_blank" : undefined}
                rel={isExternalLink ? "noreferrer" : undefined}
                aria-label={link.label}
                className="flex size-11 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                <Image
                  src={link.icon}
                  alt=""
                  aria-hidden="true"
                  className="size-5"
                />
              </a>
            );
          })}
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm font-normal text-zinc-600">
          Xue In &copy; {currentYear}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
