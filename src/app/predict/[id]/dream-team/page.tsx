import Link from "next/link";
import { ArrowLeft, Sparkles, UserCheck, Activity } from "lucide-react";

export default function DreamTeamAnalyzerPage({ params }: { params: { id: string } }) {
  const [homeTeam, awayTeam] = params.id.toUpperCase().split("-VS-");

  return (
    <div className="min-h-screen pb-24 p-4 animate-slide-up pt-8">
      <Link href={`/predict/${params.id}`} className="text-gray-400 text-sm mb-6 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Match
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          AI DREAM TEAM ANALYZER
        </h1>
        <p className="text-gray-400 text-sm mt-2">Select your XI and let our AI predict your winning probability.</p>
      </div>

      <div className="bg-card-bg border border-border rounded-3xl p-6 mb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-transparent pointer-events-none" />
        <Sparkles className="w-12 h-12 text-secondary mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Build Your XI</h2>
        <p className="text-sm text-gray-400 mb-6">Select 11 players from {homeTeam} and {awayTeam}</p>
        
        {/* Placeholder for selection UI */}
        <div className="bg-black border border-white/10 rounded-2xl p-8 mb-4 border-dashed">
          <p className="text-gray-500 font-bold text-sm">TAP HERE TO SELECT PLAYERS</p>
        </div>

        <button className="w-full bg-secondary text-black font-black py-4 rounded-xl text-lg hover:bg-secondary/90 transition-transform active:scale-95">
          ANALYZE MY TEAM
        </button>
      </div>

      {/* Demo Analysis Section (what it looks like after analysis) */}
      <h3 className="font-bold mb-4 opacity-50">Example AI Output:</h3>
      <div className="space-y-4 opacity-50 pointer-events-none">
        <div className="bg-gradient-to-br from-[#111] to-[#222] border border-secondary/30 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-secondary" /> Win Probability</h4>
            <span className="text-2xl font-black text-secondary">82%</span>
          </div>
          <p className="text-sm text-gray-300">Your team is heavily favored against expert picks. Your middle-order selection is very strong for this pitch.</p>
        </div>

        <div className="bg-card-bg border border-border rounded-2xl p-5">
          <h4 className="font-bold flex items-center gap-2 mb-3"><UserCheck className="w-4 h-4 text-green-400" /> Best Captain Pick</h4>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-xl">🏏</div>
            <div>
              <p className="font-bold">Virat Kohli</p>
              <p className="text-xs text-gray-400">Expected points: 120+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
