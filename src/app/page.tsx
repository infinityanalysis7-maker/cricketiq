"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Trophy, ArrowRight, Flame, Calendar, RefreshCw, AlertCircle, History } from "lucide-react";

function MatchSkeleton() {
  return (
    <div className="bg-card-bg border border-border rounded-2xl p-4 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="h-4 w-16 bg-white/10 rounded-full" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center flex-1 gap-2">
          <div className="w-16 h-16 bg-white/10 rounded-full" />
          <div className="h-3 w-20 bg-white/10 rounded" />
        </div>
        <div className="h-5 w-8 bg-white/10 rounded mx-4" />
        <div className="flex flex-col items-center flex-1 gap-2">
          <div className="w-16 h-16 bg-white/10 rounded-full" />
          <div className="h-3 w-20 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="bg-card-bg border border-border rounded-2xl p-4 animate-pulse space-y-3">
      <div className="h-4 w-3/4 bg-white/10 rounded" />
      <div className="bg-black/50 p-3 rounded-xl space-y-2">
        <div className="h-3 w-full bg-white/10 rounded" />
        <div className="h-3 w-2/3 bg-white/10 rounded" />
      </div>
    </div>
  );
}

const TEAM_ABBR: Record<string, { abbr: string; color: string }> = {
  "Chennai Super Kings": { abbr: "CSK", color: "#FFFF00" },
  "Mumbai Indians": { abbr: "MI", color: "#004BA0" },
  "Royal Challengers Bengaluru": { abbr: "RCB", color: "#EC1C24" },
  "Kolkata Knight Riders": { abbr: "KKR", color: "#3A225D" },
  "Delhi Capitals": { abbr: "DC", color: "#0078BC" },
  "Rajasthan Royals": { abbr: "RR", color: "#254AA5" },
  "Sunrisers Hyderabad": { abbr: "SRH", color: "#F26522" },
  "Punjab Kings": { abbr: "PBKS", color: "#ED1B24" },
  "Gujarat Titans": { abbr: "GT", color: "#1C1C1C" },
  "Lucknow Super Giants": { abbr: "LSG", color: "#A2AAAD" },
};

function TeamCircle({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const info = TEAM_ABBR[name];
  const dimension = size === "sm" ? "w-10 h-10 text-[10px]" : "w-16 h-16 text-xs";
  return (
    <div
      className={`${dimension} rounded-full border-2 border-border flex items-center justify-center font-black mb-2 text-center shrink-0`}
      style={{ backgroundColor: info ? info.color + "22" : "#111", borderColor: info ? info.color + "55" : undefined }}
    >
      <span style={{ color: info ? info.color : "#fff" }}>{info?.abbr || name.substring(0, 3).toUpperCase()}</span>
    </div>
  );
}

export default function Home() {
  const [matches, setMatches] = useState<any[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [nextMatchMessage, setNextMatchMessage] = useState("");
  const [matchLoading, setMatchLoading] = useState(true);
  const [matchError, setMatchError] = useState<string | null>(null);

  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    setMatchLoading(true);
    setMatchError(null);
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      setMatches(data.matches || []);
      setRecentResults(data.recentResults || []);
      setNextMatchMessage(data.nextMatchMessage || "");
    } catch {
      setMatchError("Could not load match schedule.");
    } finally {
      setMatchLoading(false);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch {
      setNews([]);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    fetchNews();
  }, [fetchMatches, fetchNews]);

  return (
    <div className="p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <header className="flex justify-between items-center pt-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">
            <span className="text-white">CRICKET</span>
            <span className="text-primary">IQ</span>
          </h1>
          <p className="text-sm text-gray-400 font-medium">India's First AI Cricket Community</p>
        </div>
        <div className="bg-card-bg p-2 rounded-full border border-border">
          <Flame className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </header>

      {/* Today's Matches */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">Today's Matches</h2>
          <span className="text-xs text-primary font-bold px-2 py-1 bg-primary/10 rounded-full flex items-center gap-1.5">
            {!matchLoading && matches.length > 0 && (
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
            )}
            LIVE PREDICTIONS
          </span>
        </div>

        {matchLoading ? (
          <MatchSkeleton />
        ) : matches.length === 0 ? (
          <div className="bg-card-bg border border-border rounded-2xl p-6 text-center flex flex-col items-center gap-3">
            <Calendar className="w-10 h-10 text-gray-600" />
            <p className="text-gray-300 font-medium text-sm leading-relaxed">{nextMatchMessage || "No IPL 2026 matches today."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match: any) => (
              <Link key={match.id} href={`/predict/${match.id}`}>
                <div className="bg-card-bg border border-border rounded-2xl p-4 hover:border-primary transition-all duration-200 relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-400 font-medium">{match.time}</span>
                    <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-bold">AI READY</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center flex-1">
                      <TeamCircle name={match.homeTeam} />
                      <span className="text-xs font-bold text-center leading-tight">{match.homeTeam}</span>
                    </div>
                    <div className="flex flex-col items-center px-3">
                      <span className="text-xs text-gray-500 font-bold mb-1">VS</span>
                      <Trophy className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <TeamCircle name={match.awayTeam} />
                      <span className="text-xs font-bold text-center leading-tight">{match.awayTeam}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center relative z-10">
                    <span className="text-sm font-semibold text-gray-300">Predict Now</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Results */}
      {recentResults.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Recent Results</h2>
          </div>
          <div className="space-y-3">
            {recentResults.map((res: any) => (
              <div key={res.id} className="bg-card-bg border border-border rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <TeamCircle name={res.homeTeam} size="sm" />
                    <TeamCircle name={res.awayTeam} size="sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary mb-1">{res.result}</p>
                    <p className="text-[10px] text-gray-400">{res.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daily Challenges */}
      <section>
        <h2 className="text-xl font-bold mb-4">Daily Challenges</h2>
        <Link href="/iq">
          <div className="bg-gradient-to-r from-blue-900 to-black border border-secondary/30 rounded-2xl p-5 relative overflow-hidden hover:border-secondary transition-all cursor-pointer group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
            <h3 className="text-lg font-bold text-white mb-1">Cricket IQ Test</h3>
            <p className="text-sm text-gray-300 mb-4">Are you in the top 1% of fans?</p>
            <button className="bg-secondary text-black font-bold py-2 px-5 rounded-full text-sm hover:bg-secondary/90">Play Now →</button>
          </div>
        </Link>
      </section>

      {/* Trending News */}
      <section className="pb-24">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">Trending News</h2>
          <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-bold">IPL 2026</span>
        </div>
        {newsLoading ? (
          <div className="space-y-4"><NewsSkeleton /><NewsSkeleton /></div>
        ) : (
          <div className="space-y-4">
            {news.map((article: any, i: number) => (
              <div key={i} className="bg-card-bg border border-border rounded-2xl p-4">
                <h3 className="font-bold text-sm mb-3 leading-snug">{article.title}</h3>
                <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex gap-2">
                  <span className="text-lg shrink-0">🤖</span>
                  <p className="text-xs text-gray-300 leading-relaxed italic">"{article.aiSummary}"</p>
                </div>
                <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-wide">{article.time}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
