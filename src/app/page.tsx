"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Trophy, ArrowRight, Flame, RefreshCw, AlertCircle, Clock, Table, Info } from "lucide-react";

function MatchSkeleton() {
  return (
    <div className="bg-card-bg border border-border rounded-2xl p-4 animate-pulse">
      <div className="flex justify-between items-center"><div className="h-3 w-24 bg-white/10 rounded" /><div className="h-4 w-12 bg-white/10 rounded-full" /></div>
      <div className="flex justify-between items-center mt-6">
        <div className="flex flex-col items-center flex-1 gap-2"><div className="w-16 h-16 bg-white/10 rounded-full" /><div className="h-3 w-16 bg-white/10 rounded" /></div>
        <div className="h-5 w-8 bg-white/10 rounded mx-4" />
        <div className="flex flex-col items-center flex-1 gap-2"><div className="w-16 h-16 bg-white/10 rounded-full" /><div className="h-3 w-16 bg-white/10 rounded" /></div>
      </div>
    </div>
  );
}

const TEAM_COLORS: Record<string, string> = {
  "CSK": "#FFFF00", "MI": "#004BA0", "RCB": "#EC1C24", "KKR": "#3A225D",
  "DC": "#0078BC", "RR": "#254AA5", "SRH": "#F26522", "PBKS": "#ED1B24",
  "GT": "#1C1C1C", "LSG": "#A2AAAD",
};

function TeamLogo({ name }: { name: string }) {
  const abbr = name.split(" ").map(w => w[0]).join("").substring(0, 3).toUpperCase();
  const color = TEAM_COLORS[abbr] || "#333";
  return (
    <div className="w-14 h-14 rounded-full border-2 border-white/5 flex items-center justify-center font-black text-xs mb-2" style={{ backgroundColor: color + "22", color }}>
      {abbr}
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<any>({ matches: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/matches");
      const result = await res.json();
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError("Syncing with live web... please wait");
      setTimeout(fetchData, 10000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const matches = data.matches || [];
  const rawText = data.rawText || "";

  return (
    <div className="max-w-[1200px] mx-auto p-4 pb-24 space-y-8 animate-slide-up">
      {/* Header */}
      <header className="flex justify-between items-center pt-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">
            <span className="text-white">CRICKET</span><span className="text-primary">IQ</span>
          </h1>
          <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">Live IPL 2026 Engine</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && <div className="text-[10px] text-gray-500 font-bold uppercase hidden md:block">Synced: {lastUpdated}</div>}
          <button onClick={fetchData} className="bg-white/5 p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <RefreshCw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Flame className="text-primary" /> MATCH HUB
            </h2>
            {loading && <span className="text-[10px] text-primary font-bold animate-pulse uppercase">Searching 11 May 2026...</span>}
          </div>

          {loading && matches.length === 0 ? (
            <div className="space-y-4"><MatchSkeleton /><MatchSkeleton /></div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match: any) => (
                <Link key={match.id} href={`/predict/${match.id}`}>
                  <div className="bg-card-bg border border-border rounded-2xl p-5 hover:border-primary transition-all group cursor-pointer h-full relative">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black text-gray-500 uppercase">{match.time}</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black">LIVE SOURCE</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex flex-col items-center flex-1">
                        <TeamLogo name={match.homeTeam} />
                        <span className="text-xs font-black text-center line-clamp-1">{match.homeTeam}</span>
                      </div>
                      <div className="text-xs font-black text-gray-700 italic">VS</div>
                      <div className="flex flex-col items-center flex-1">
                        <TeamLogo name={match.awayTeam} />
                        <span className="text-xs font-black text-center line-clamp-1">{match.awayTeam}</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">View Prediction</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : rawText ? (
            <div className="bg-card-bg border border-border rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <Info className="w-5 h-5" />
                <h3 className="font-black text-sm uppercase">AI Live Brief (May 11)</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed italic whitespace-pre-wrap">
                "{rawText}"
              </p>
              <div className="mt-6 pt-4 border-t border-white/5">
                <button onClick={fetchData} className="text-[10px] font-black text-primary uppercase underline">Try structured search again</button>
              </div>
            </div>
          ) : (
            <div className="bg-card-bg border border-border rounded-2xl p-12 text-center flex flex-col items-center">
              <Clock className="w-12 h-12 text-gray-700 mb-4 animate-pulse" />
              <p className="text-gray-400 font-medium">No matches confirmed yet for May 11, 2026.</p>
              <button onClick={fetchData} className="mt-4 text-xs font-black text-primary uppercase underline">Check Again</button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#111] to-black border border-border rounded-2xl p-6">
            <h3 className="font-black text-sm mb-4 flex items-center gap-2 uppercase">
              <Table className="w-4 h-4 text-secondary" /> IPL 2026 STANDINGS
            </h3>
            <div className="space-y-4">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Latest Standings as of May 2026</p>
              <Link href="/points" className="block w-full bg-secondary text-black font-black text-center py-3 rounded-xl text-xs">VIEW FULL TABLE</Link>
            </div>
          </div>
          
          <Link href="/iq">
            <div className="bg-primary p-6 rounded-2xl group cursor-pointer transition-transform active:scale-95">
              <h3 className="text-black font-black text-xl mb-1 flex items-center gap-2">DAILY IQ TEST <Trophy className="w-5 h-5" /></h3>
              <p className="text-black/70 text-xs font-bold mb-4 italic">Updated with 11 May stats!</p>
              <span className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-lg">PLAY NOW</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
