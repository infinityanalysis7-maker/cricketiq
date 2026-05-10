"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Trophy, ArrowRight, Flame, Calendar, History, Activity } from "lucide-react";

function MatchSkeleton() {
  return (
    <div className="bg-card-bg border border-border rounded-2xl p-4 animate-pulse">
      <div className="flex justify-between mb-4"><div className="h-3 w-24 bg-white/10 rounded" /></div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center flex-1 gap-2"><div className="w-16 h-16 bg-white/10 rounded-full" /></div>
        <div className="h-5 w-8 bg-white/10 rounded mx-4" />
        <div className="flex flex-col items-center flex-1 gap-2"><div className="w-16 h-16 bg-white/10 rounded-full" /></div>
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
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setMatchLoading(true);
    try {
      const [mRes, nRes] = await Promise.all([fetch("/api/matches"), fetch("/api/news")]);
      const mData = await mRes.json();
      const nData = await nRes.json();
      setMatches(mData.matches || []);
      setRecentResults(mData.recentResults || []);
      setNextMatchMessage(mData.nextMatchMessage || "");
      setNews(nData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setMatchLoading(false);
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 60000); // Auto-refresh every minute for live scores
    return () => clearInterval(timer);
  }, [fetchData]);

  return (
    <div className="p-4 space-y-6 animate-slide-up">
      <header className="flex justify-between items-center pt-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">
            <span className="text-white">CRICKET</span><span className="text-primary">IQ</span>
          </h1>
          <p className="text-sm text-gray-400 font-medium">India's First AI Cricket Community</p>
        </div>
        <div className="bg-card-bg p-2 rounded-full border border-border"><Flame className="w-6 h-6 text-primary animate-pulse" /></div>
      </header>

      {/* Live / Today Matches */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">Matches</h2>
          <span className="text-xs text-primary font-bold px-2 py-1 bg-primary/10 rounded-full flex items-center gap-1.5 uppercase">
            <Activity className="w-3 h-3 animate-pulse" /> Live Tracker
          </span>
        </div>

        {matchLoading && matches.length === 0 ? <MatchSkeleton /> : (
          <div className="space-y-4">
            {matches.map((match: any) => (
              <Link key={match.id} href={`/predict/${match.id}`}>
                <div className={`bg-card-bg border rounded-2xl p-4 hover:border-primary transition-all relative overflow-hidden group cursor-pointer ${match.isLive ? 'border-primary shadow-[0_0_20px_rgba(255,130,0,0.1)]' : 'border-border'}`}>
                  {match.isLive && (
                    <div className="absolute top-0 left-0 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-br-xl flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping" /> LIVE
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-4 mt-2">
                    <span className="text-xs text-gray-400 font-medium">{match.venue}</span>
                    <span className="text-xs font-bold text-gray-300">{match.time}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center flex-1">
                      <TeamCircle name={match.homeTeam} />
                      <span className="text-xs font-bold text-center leading-tight">{match.homeTeam}</span>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      {match.isLive ? (
                        <div className="text-center">
                          <div className="text-xl font-black text-white">{match.liveData.runs}/{match.liveData.wickets}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase">{match.liveData.overs} OV</div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500 font-bold mb-1">VS</span>
                          <Trophy className="w-5 h-5 text-gray-700" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center flex-1">
                      <TeamCircle name={match.awayTeam} />
                      <span className="text-xs font-bold text-center leading-tight">{match.awayTeam}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center relative z-10">
                    <span className="text-sm font-semibold text-gray-300">{match.isLive ? 'View Analysis' : 'Predict Now'}</span>
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
              <Link key={res.id} href={`/scorecard/${res.id}`}>
                <div className="bg-card-bg border border-border rounded-2xl p-4 hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <TeamCircle name={res.homeTeam} size="sm" />
                      <TeamCircle name={res.awayTeam} size="sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-primary mb-1 group-hover:translate-x-1 transition-transform">{res.result}</p>
                      <p className="text-[10px] text-gray-400">{res.score}</p>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Daily Challenges */}
      <section>
        <h2 className="text-xl font-bold mb-4">Daily Challenges</h2>
        <Link href="/iq">
          <div className="bg-gradient-to-r from-blue-900 to-black border border-secondary/30 rounded-2xl p-5 relative overflow-hidden hover:border-secondary transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
            <h3 className="text-lg font-bold text-white mb-1">Cricket IQ Test</h3>
            <p className="text-sm text-gray-300 mb-4">Are you in the top 1% of fans?</p>
            <button className="bg-secondary text-black font-bold py-2 px-5 rounded-full text-sm">Play Now →</button>
          </div>
        </Link>
      </section>
    </div>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  );
}
