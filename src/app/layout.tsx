import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { BottomNav } from "@/components/BottomNav";
import { PWAPrompt } from "@/components/PWAPrompt";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "CricketIQ | Real-Time AI Cricket",
  description: "Live IPL 2026 search-driven cricket community. Powered by Gemini Search.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-[#020202] text-foreground min-h-screen overflow-x-hidden`}>
          <div className="flex flex-col min-h-screen">
            <BottomNav />
            <main className="flex-1 w-full max-w-[1200px] mx-auto relative pt-0 md:pt-16 pb-20 md:pb-0">
              {children}
            </main>
            <PWAPrompt />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
