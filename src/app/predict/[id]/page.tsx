import { getMatchPredictionData } from "@/lib/cricketData";
import { Brain, Cloud, History, TrendingUp, Share2, AlertCircle, Flame, RefreshCw } from "lucide-react";
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
          ← Back to Matches
        </Link>
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">{homeTeam} vs {awayTeam}</h1>
          <button className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
            <Brain className="w-3 h-3" /> REAL-TIME AI ANALYSIS
          </div>
          <div className="text-[10px] text-gray-500 font-bold uppercase">Source: Gemini Live Search</div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-20">
            <RefreshCw className="w-12 h-12 text-primary mb-4 animate-spin" />
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Searching the web for latest stats...</p>
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
        {/* AI Prediction Card */}
        <div className="bg-gradient-to-br from-[#111] to-[#222] border border-primary/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-6">
            <div>
              <h2 className="text-xs text-gray-400 font-black mb-1 uppercase tracking-widest">AI VERDICT</h2>
              <div className="text-5xl font-black text-primary italic tracking-tighter">
                {data.aiPrediction?.winner?.toUpperCase() || "ANALYZING..."}
              </div>
              <p className="text-[10px] text-primary/60 mt-1 font-bold">PROJECTED TO WIN BASED ON CURRENT FORM</p>
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-xs text-gray-400 font-black mb-1 uppercase tracking-widest">CONFIDENCE</h2>
              <div className="text-4xl font-black text-white italic">
                {data.aiPrediction?.confidence}%
              </div>
            </div>
          </div>

          <div className="bg-black/50 rounded-2xl p-6 border border-white/5 relative z-10">
            <div className="flex gap-4 items-start">
              <Brain className="w-6 h-6 text-primary shrink-0 mt-1" />
              <p className="text-sm text-gray-300 leading-relaxed font-medium italic">
                "{data.aiPrediction?.explanation}"
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card-bg border border-border rounded-2xl p-6 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary" />
              <h3 className="font-black text-sm uppercase">HEAD TO HEAD RECORD</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{data.headToHead}</p>
          </div>

          <div className="bg-card-bg border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h3 className="font-black text-sm uppercase">IPL 2026 FORM</h3>
            </div>
            <div className="space-y-4">
              {Object.entries((data.currentForm as Record<string, string>) || {}).map(([team, form]) => (
                <div key={team}>
                  <span className="text-[10px] text-gray-500 font-black uppercase mb-2 block">{team.toUpperCase()}</span>
                  <div className="flex gap-2">
                    {form.split(" ").map((res: string, i: number) => (
                      <span key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black ${res === 'W' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card-bg border border-border rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-5 h-5 text-blue-400" />
                <h3 className="font-black text-sm uppercase">VENUE & WEATHER</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">{data.weather}</p>
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <span className="text-[10px] font-black text-gray-500 uppercase">Pitch Report</span>
                </div>
                <p className="text-xs text-gray-400 italic">"{data.pitchReport}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-12 text-center flex flex-col items-center gap-6 animate-pulse">
        <RefreshCw className="w-12 h-12 text-primary animate-spin" />
        <div>
          <h3 className="text-xl font-black text-primary uppercase mb-2">Fetching Live Intelligence</h3>
          <p className="text-sm text-primary/70">Connecting to Gemini Search to analyze recent matches and team news. This takes about 10-15 seconds.</p>
        </div>
      </div>
    );
  }
}
