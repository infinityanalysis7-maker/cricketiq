"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Trophy, ArrowRight, Flame, AlertCircle, RefreshCw, Calendar, Wifi, WifiOff } from "lucide-react";

function MatchSkeleton() {
  return (
    <div className="bg-card-bg border border-border rounded-2xl p-4 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-3 w-20 bg-white/10 rounded" />
        <div className="h-4 w-16 bg-white/10 rounded-full" />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center flex-1 gap-2">
          <div className="w-16 h-16 bg-white/10 rounded-full" />
          <div className="h-3 w-12 bg-white/10 rounded" />
        </div>
        <div className="px-4"><div className="h-4 w-8 bg-white/10 rounded" /></div>
        <div className="flex flex-col items-center flex-1 gap-2">
          <div className="w-16 h-16 bg-white/10 rounded-full" />
          <div className="h-3 w-12 bg-white/10 rounded" />
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

// Beautiful quota-exceeded state — looks premium, not broken
function QuotaExceededCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-gradient-to-br from-[#111] to-[#1a1a2e] border border-orange-500/30 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
          <WifiOff className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-orange-400">AI Quota Limit Reached</p>
          <p className="text-xs text-gray-500">Resets daily at midnight</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-4 relative z-10">
        The free Gemini API quota has been used up for today. Live data will return automatically at midnight Pacific Time. You can still use all other features of the app.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold px-4 py-2 rounded-full text-xs transition-colors"
      >
        <RefreshCw className="w-3 h-3" /> Try Again
      </button>
    </div>
  );
}

const STATIC_NEWS = [
  { title: "IPL 2026: Points Table standings as of this week", aiSummary: "Check the latest standings to see which teams are leading the race to the playoffs.", time: "IPL 2026" },
  { title: "Player of the Match awards — IPL 2026 Season highlights", aiSummary: "Star performers from across the season have been lighting up stadiums with their incredible displays.", time: "IPL 2026" },
  { title: "IPL 2026 Auction: How the squads are performing mid-season", aiSummary: "Teams that invested heavily at the auction are being tested as the tournament reaches the business end.", time: "IPL 2026" },
  { title: "Top run-scorers and wicket-takers of IPL 2026", aiSummary: "The Orange Cap and Purple Cap races are heating up with several players putting in consistent performances.", time: "IPL 2026" },
  { title: "Playoff qualification scenarios — IPL 2026", aiSummary: "With the tournament in full swing, multiple teams are still in contention for the final four spots.", time: "IPL 2026" },
];

export default function Home() {
  const [matches, setMatches] = useState<any[]>([]);
  const [nextMatchMessage, setNextMatchMessage] = useState<string>("");
  const [matchError, setMatchError] = useState<string | null>(null);
  const [matchLoading, setMatchLoading] = useState(true);
  const [isQuotaError, setIsQuotaError] = useState(false);

  const [news, setNews] = useState<any[]>([]);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [newsLoading, setNewsLoading] = useState(true);
  const [isNewsQuotaError, setIsNewsQuotaError] = useState(false);

  const fetchMatches = useCallback(async () => {
    setMatchLoading(true);
    setMatchError(null);
    setIsQuotaError(false);
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      if (data.error) {
        // Detect quota error
        if (data.error.toLowerCase().includes("quota") || data.error.toLowerCase().includes("429")) {
          setIsQuotaError(true);
        }
        setMatchError(data.error);
      } else {
        setMatches(data.matches || []);
        setNextMatchMessage(data.nextMatchMessage || "");
      }
    } catch {
      setMatchError("Could not fetch live data. Please check your connection.");
    } finally {
      setMatchLoading(false);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError(null);
    setIsNewsQuotaError(false);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.error) {
        if (data.error.toLowerCase().includes("quota") || data.error.toLowerCase().includes("429")) {
          setIsNewsQuotaError(true);
          // Show static news as fallback instead of error
          setNews(STATIC_NEWS);
          setNewsError(null);
        } else {
          setNewsError(data.error);
        }
      } else {
        setNews(Array.isArray(data) ? data : []);
      }
    } catch {
      setNewsError("Could not fetch live news. Please check your connection.");
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
          <span className="text-xs text-primary font-bold px-2 py-1 bg-primary/10 rounded-full flex items-center gap-1">
            {!matchLoading && !matchError && matches.length > 0 && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />}
            LIVE PREDICTIONS
          </span>
        </div>

        {matchLoading ? (
          <div className="space-y-4"><MatchSkeleton /></div>
        ) : isQuotaError ? (
          <QuotaExceededCard onRetry={fetchMatches} />
        ) : matchError ? (
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-5 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-red-400 font-medium text-sm">{matchError}</p>
            <button onClick={fetchMatches} className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-4 py-2 rounded-full text-sm transition-colors">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-card-bg border border-border rounded-2xl p-6 text-center flex flex-col items-center gap-3">
            <Calendar className="w-8 h-8 text-gray-600" />
            <p className="text-gray-300 font-medium">{nextMatchMessage || "No IPL 2026 matches scheduled for today."}</p>
            <Link href="/community">
              <button className="text-xs text-primary font-bold bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                Join Fan Wars →
              </button>
            </Link>
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
                      <div className="w-16 h-16 bg-black rounded-full border-2 border-border flex items-center justify-center font-black text-sm mb-2 text-center">
                        {match.homeTeam?.substring(0, 3)?.toUpperCase()}
                      </div>
                      <span className="text-xs font-bold truncate max-w-[80px] text-center">{match.homeTeam}</span>
                    </div>
                    <div className="flex flex-col items-center px-4">
                      <span className="text-xs text-gray-500 font-bold mb-1">VS</span>
                      <Trophy className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-16 h-16 bg-black rounded-full border-2 border-border flex items-center justify-center font-black text-sm mb-2 text-center">
                        {match.awayTeam?.substring(0, 3)?.toUpperCase()}
                      </div>
                      <span className="text-xs font-bold truncate max-w-[80px] text-center">{match.awayTeam}</span>
                    </div>
                  </div>
                  {match.venue && <p className="text-[10px] text-gray-600 text-center mt-2">{match.venue}</p>}
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

      {/* Daily Challenges */}
      <section>
        <h2 className="text-xl font-bold mb-4">Daily Challenges</h2>
        <Link href="/iq">
          <div className="bg-gradient-to-r from-blue-900 to-black border border-secondary/30 rounded-2xl p-5 relative overflow-hidden hover:border-secondary transition-colors cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
            <h3 className="text-lg font-bold text-white mb-1">Cricket IQ Test</h3>
            <p className="text-sm text-gray-300 mb-4">Are you in the top 1% of fans?</p>
            <button className="bg-secondary text-black font-bold py-2 px-4 rounded-full text-sm hover:bg-secondary/90 transition-colors">Play Now</button>
          </div>
        </Link>
      </section>

      {/* Trending News */}
      <section className="pb-24">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">Trending News</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${isNewsQuotaError ? 'bg-orange-500/20 text-orange-400' : 'bg-secondary/20 text-secondary'}`}>
            {isNewsQuotaError ? '⚡ CACHED' : 'AI SUMMARIZED'}
          </span>
        </div>

        {newsLoading ? (
          <div className="space-y-4"><NewsSkeleton /><NewsSkeleton /><NewsSkeleton /></div>
        ) : newsError ? (
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-5 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-red-400 font-medium text-sm">{newsError}</p>
            <button onClick={fetchNews} className="flex items-center gap-2 bg-red-500/20 text-red-400 font-bold px-4 py-2 rounded-full text-sm transition-colors">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((article: any, i: number) => (
              <div key={i} className="bg-card-bg border border-border rounded-2xl p-4 hover:border-primary/50 transition-colors">
                <h3 className="font-bold text-sm mb-2 leading-snug">{article.title}</h3>
                <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex gap-2">
                  <span className="text-xl shrink-0">🤖</span>
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
