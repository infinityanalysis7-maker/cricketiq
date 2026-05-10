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
        <body className={`${inter.className} bg-[#050505] text-foreground min-h-screen overflow-x-hidden flex justify-center`}>
          <main className="w-full max-w-6xl mx-auto min-h-screen relative border-x border-border/30 bg-black shadow-2xl flex flex-col md:flex-row">
            {/* Desktop Sidebar / Topbar goes here or handled in BottomNav */}
            <div className="flex-1 w-full max-w-2xl mx-auto relative pb-20 md:pb-0 md:pt-20">
              {children}
            </div>
            <BottomNav />
            <PWAPrompt />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

