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
  title: "CricketIQ | AI Powered Cricket Community",
  description: "India's first AI powered cricket community. Predict matches, test your IQ, and join fan wars.",
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
        <body className={`${inter.className} bg-background text-foreground min-h-screen pb-16 overflow-x-hidden`}>
          <main className="max-w-md mx-auto min-h-screen relative border-x border-border/30 bg-black shadow-2xl">
            {children}
            <BottomNav />
            <PWAPrompt />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

