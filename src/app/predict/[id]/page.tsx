import { getMatchPredictionData } from "@/lib/cricketData";
import { Brain, Share2, Info, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function MatchPredictionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const matchId = resolvedParams.id;
  const idParts = matchId.toUpperCase().split("-VS-");
  const homeTeam = idParts[0] || "TEAM A";
  const awayTeam = idParts[1] || "TEAM B";

  return (
    <div className="max-w-[1200px] mx-auto min-h-screen pb-24">
      <div className="bg-gradient-to-b from-primary/20 to-black p-4 pt-8 md:p-8">
        <Link href="/" className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 inline-block hover:text-white transition-colors">
          ← Back to Hub
        </Link>
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">{homeTeam} vs {awayTeam}</h1>
          <button className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
            <Brain className="w-3 h-3" /> REAL-TIME AI INTELLIGENCE
          </div>
          <div className="text-[10px] text-gray-500 font-bold uppercase">Source: Gemini Live Search (May 11)</div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-20">
            <RefreshCw className="w-12 h-12 text-primary mb-4 animate-spin" />
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Searching the web for live intel...</p>
          </div>
        }>
          <PredictionContent matchId={matchId} />
        </Suspense>
      </div>
    </div>
  );
}

async function PredictionContent({ matchId }: { matchId: string }) {
  try {
    const data = await getMatchPredictionData(matchId);

    return (
      <div className="space-y-8 animate-slide-up">
        {/* AI Raw Brief Card */}
        <div className="bg-gradient-to-br from-[#111] to-[#222] border border-primary/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-black text-primary uppercase tracking-widest">LIVE MATCH ANALYSIS</h2>
          </div>

          <div className="bg-black/50 rounded-2xl p-6 border border-white/5 relative z-10">
            <p className="text-base text-gray-200 leading-relaxed font-medium whitespace-pre-wrap">
              {data.rawText || "AI analysis is currently processing. Please refresh."}
            </p>
          </div>
          
          <div className="mt-8 relative z-10">
            <button className="w-full bg-primary text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
              PREDICT WINNER NOW
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            This analysis is generated using real-time search data from May 11, 2026.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-12 text-center flex flex-col items-center gap-6 animate-pulse">
        <RefreshCw className="w-12 h-12 text-primary animate-spin" />
        <h3 className="text-xl font-black text-primary uppercase">Search in progress...</h3>
        <p className="text-sm text-primary/70">Connecting to Google Search to fetch PBKS vs DC latest news.</p>
      </div>
    );
  }
}
