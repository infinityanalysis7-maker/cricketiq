import { getMatchPrediction } from "@/actions/cricket";
import { Brain, Cloud, History, TrendingUp, Share2, AlertCircle, Flame } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function MatchPredictionPage({ params }: { params: { id: string } }) {
  // Extract teams from id like csk-vs-mi
  const [homeTeam, awayTeam] = params.id.toUpperCase().split("-VS-");

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-b from-primary/20 to-black p-4 pt-8">
        <Link href="/" className="text-gray-400 text-sm mb-4 inline-block">
          ← Back to Matches
        </Link>
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-3xl font-black">{homeTeam} vs {awayTeam}</h1>
          <button className="bg-white/10 p-2 rounded-full backdrop-blur-md">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="mt-2 text-primary font-bold text-sm tracking-widest flex items-center gap-2">
          <Brain className="w-4 h-4" /> AI PREDICTION ENGINE
        </div>
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
          <Brain className="w-12 h-12 text-primary mb-4 animate-pulse-glow rounded-full" />
          <p className="text-gray-400 text-sm">Analyzing 1M+ data points...</p>
        </div>
      }>
        <PredictionContent matchId={params.id} />
      </Suspense>
    </div>
  );
}

async function PredictionContent({ matchId }: { matchId: string }) {
  const data = await getMatchPrediction(matchId);

  return (
    <div className="p-4 space-y-6 animate-slide-up">
      {/* AI Prediction Card */}
      <div className="bg-gradient-to-br from-[#111] to-[#222] border border-secondary/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.1)]">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="text-sm text-gray-400 font-bold mb-1">AI VERDICT</h2>
            <div className="text-4xl font-black text-secondary">
              {data.aiPrediction?.winner || "UNKNOWN"}
            </div>
            <p className="text-xs text-secondary/80 mt-1">TO WIN THE MATCH</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm text-gray-400 font-bold mb-1">CONFIDENCE</h2>
            <div className="text-3xl font-black text-white">
              {data.aiPrediction?.confidence || 0}%
            </div>
          </div>
        </div>

        <div className="bg-black/50 rounded-xl p-4 border border-white/5 relative z-10">
          <div className="flex gap-2 items-start">
            <Brain className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300 leading-relaxed">
              {data.aiPrediction?.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Make Your Prediction Button */}
      <button className="w-full bg-primary hover:bg-primary/90 text-black font-black py-4 rounded-2xl text-lg transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,130,0,0.3)]">
        LOCK IN YOUR PREDICTION
      </button>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Link href={`/predict/${matchId}/dream-team`}>
          <div className="bg-card-bg border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:border-secondary transition-colors">
            <span className="text-2xl mb-2">✨</span>
            <span className="text-xs font-bold text-gray-300">Dream Team</span>
          </div>
        </Link>
        <Link href={`/predict/${matchId}/roast`}>
          <div className="bg-card-bg border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:border-red-500/50 transition-colors">
            <span className="text-2xl mb-2">🔥</span>
            <span className="text-xs font-bold text-gray-300">Roast/Praise</span>
          </div>
        </Link>
        <Link href={`/predict/${matchId}/memes`}>
          <div className="bg-card-bg border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:border-primary transition-colors">
            <span className="text-2xl mb-2">🤣</span>
            <span className="text-xs font-bold text-gray-300">Meme Gen</span>
          </div>
        </Link>
        <Link href={`/community/${matchId}`}>
          <div className="bg-card-bg border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:border-green-500/50 transition-colors">
            <span className="text-2xl mb-2">⚔️</span>
            <span className="text-xs font-bold text-gray-300">Fan War</span>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Head to Head */}
        <div className="bg-card-bg border border-border rounded-2xl p-4 col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm">Head to Head</h3>
          </div>
          <p className="text-sm text-gray-400">{data.headToHead}</p>
        </div>

        {/* Current Form */}
        <div className="bg-card-bg border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <h3 className="font-bold text-sm">Current Form</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-500 block mb-1">HOME</span>
              <div className="flex gap-1">
                {data.currentForm?.homeTeam?.split(" ").map((res: string, i: number) => (
                  <span key={i} className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold ${res === 'W' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {res}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">AWAY</span>
              <div className="flex gap-1">
                {data.currentForm?.awayTeam?.split(" ").map((res: string, i: number) => (
                  <span key={i} className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold ${res === 'W' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {res}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weather & Pitch */}
        <div className="bg-card-bg border border-border rounded-2xl p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cloud className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm">Weather</h3>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">{data.weather}</p>
          </div>
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <h3 className="font-bold text-sm">Pitch</h3>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">{data.pitchReport}</p>
          </div>
        </div>
      </div>

      {/* Key Matchups */}
      <div className="bg-card-bg border border-border rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4 text-primary" /> Key Matchups
        </h3>
        <ul className="space-y-3">
          {data.keyMatchups?.map((matchup: string, i: number) => (
            <li key={i} className="bg-black p-3 rounded-lg border border-border flex items-center gap-3">
              <span className="text-primary font-black opacity-50 text-xl">{i + 1}</span>
              <span className="text-sm font-medium">{matchup}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
