import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Xue In - Chinese Vocabulary Training",
  description: "A minimal app for learning Chinese vocabulary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${notoSans.variable} h-full antialiased`}
    >
      <body className={`${notoSans.className} min-h-full flex flex-col bg-zinc-50 text-zinc-900`}>{children}</body>
    </html>
  );
}
