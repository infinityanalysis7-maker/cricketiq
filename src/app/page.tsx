import Link from "next/link";
import { getTodayMatches, getLatestNews } from "@/actions/cricket";
import { Trophy, ArrowRight, Flame, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 1800; // Cache for 30 minutes

export default async function Home() {
  const [matchData, newsData] = await Promise.all([
    getTodayMatches(),
    getLatestNews(),
  ]);

  const matches = (matchData as any).matches || [];
  const nextMatchMessage = (matchData as any).nextMatchMessage || "No IPL 2026 matches scheduled for today.";
  const matchError = (matchData as any).error;
  const newsError = (newsData as any).error;

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

      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">Today's Matches</h2>
          <span className="text-xs text-primary font-bold px-2 py-1 bg-primary/10 rounded-full">
            LIVE PREDICTIONS
          </span>
        </div>

        {matchError ? (
          <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-6 text-center flex flex-col items-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-red-400 font-bold">{matchError}</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-card-bg border border-border rounded-2xl p-6 text-center">
            <p className="text-gray-300 font-bold text-lg">{nextMatchMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match: any) => (
              <Link key={match.id} href={`/predict/${match.id}`}>
                <div className="bg-card-bg border border-border rounded-2xl p-4 hover:border-primary transition-colors relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-xs text-gray-400 font-medium">{match.time}</span>
                    <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-bold">
                      AI READY
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-16 h-16 bg-black rounded-full border-2 border-border flex items-center justify-center font-black text-xl mb-2 text-center text-[10px] break-words">
                        {match.homeTeam.substring(0,3)}
                      </div>
                      <span className="text-xs font-bold truncate max-w-[80px]">{match.homeTeam}</span>
                    </div>
                    
                    <div className="flex flex-col items-center px-2">
                      <span className="text-xs text-gray-500 font-bold mb-1">VS</span>
                      <Trophy className="w-5 h-5 text-gray-700" />
                    </div>

                    <div className="flex flex-col items-center flex-1">
                      <div className="w-16 h-16 bg-black rounded-full border-2 border-border flex items-center justify-center font-black text-xl mb-2 text-center text-[10px] break-words">
                         {match.awayTeam.substring(0,3)}
                      </div>
                      <span className="text-xs font-bold truncate max-w-[80px]">{match.awayTeam}</span>
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

      <section className="pt-4 pb-4">
        <h2 className="text-xl font-bold mb-4">Daily Challenges</h2>
        <Link href="/iq">
          <div className="bg-gradient-to-r from-blue-900 to-black border border-secondary/30 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
            <h3 className="text-lg font-bold text-white mb-1">Cricket IQ Test</h3>
            <p className="text-sm text-gray-300 mb-4">Are you in the top 1% of fans?</p>
            <button className="bg-secondary text-black font-bold py-2 px-4 rounded-full text-sm">
              Play Now
            </button>
          </div>
        </Link>
      </section>

      {/* Cricket News + AI Summary */}
      <section className="pb-20">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">Trending News</h2>
          <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-bold">
            AI SUMMARIZED
          </span>
        </div>
        <div className="space-y-4">
          {newsError ? (
            <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-6 text-center flex flex-col items-center">
              <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-red-400 font-bold">{newsError}</p>
            </div>
          ) : newsData.length === 0 ? (
            <div className="bg-card-bg border border-border rounded-2xl p-6 text-center">
              <p className="text-gray-400">No recent news found.</p>
            </div>
          ) : (
            newsData.map((news: any, i: number) => (
              <div key={i} className="bg-card-bg border border-border rounded-2xl p-4 hover:border-primary transition-colors">
                <h3 className="font-bold text-sm mb-2">{news.title}</h3>
                <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex gap-2">
                  <span className="text-xl">🤖</span>
                  <p className="text-xs text-gray-300 leading-relaxed italic">"{news.aiSummary}"</p>
                </div>
                <p className="text-[10px] text-gray-500 mt-3 font-bold">{news.time}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
