import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Footer } from "@/components/footer/Footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
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
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className={`${poppins.className} min-h-full flex flex-col bg-zinc-50 text-zinc-900`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
