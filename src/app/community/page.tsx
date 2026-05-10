import Link from "next/link";
import { Flame, Swords, TrendingUp, Trophy, MessageSquare } from "lucide-react";
import { getTodayMatches } from "@/actions/cricket";
import { unstable_cache } from "next/cache";

const getCachedMatches = unstable_cache(
  async () => getTodayMatches(),
  ['today-matches'],
  { revalidate: 1800 }
);

export default async function CommunityPage() {
  const matchData = await getCachedMatches();
  const matches = matchData.matches || [];
  
  const activeDebates = matches.map((match: any) => ({
    id: match.id,
    title: `${match.homeTeam} vs ${match.awayTeam}`,
    fansOnline: Math.floor(Math.random() * 5000) + 1000, // Random fans for now
    hottestTake: "Who will step up today in the big clash?"
  }));

  return (
    <div className="min-h-screen pb-24 p-4 space-y-6 animate-slide-up pt-8">
      <header className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            FAN WARS <Swords className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-sm text-gray-400 font-medium">India's most toxic-free debate rooms</p>
        </div>
      </header>

      {/* Active Debate Rooms */}
      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Live Match Rooms
        </h2>
        
        {activeDebates.length === 0 ? (
          <div className="bg-card-bg border border-border rounded-2xl p-6 text-center">
            <p className="text-gray-400">No live match rooms active right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDebates.map((room: any) => (
              <Link key={room.id} href={`/community/${room.id}`} className="block">
                <div className="bg-card-bg border border-border rounded-2xl p-4 hover:border-primary transition-colors relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-black">{room.title}</h3>
                    <div className="bg-black text-xs font-bold px-2 py-1 rounded border border-border text-gray-300 flex items-center gap-1">
                      <UsersIcon className="w-3 h-3 text-secondary" /> {room.fansOnline.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex gap-2">
                    <Flame className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-gray-500 font-bold block mb-0.5">HOTTEST TAKE</span>
                      <p className="text-sm text-gray-300 italic">"{room.hottestTake}"</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-primary text-sm font-bold">
                    <MessageSquare className="w-4 h-4" /> ENTER DEBATE
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Fan Leaderboard */}
      <section className="pt-4">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> Top Fans of the Week
          </h2>
        </div>

        <div className="bg-card-bg border border-border rounded-2xl p-4 space-y-4 text-center">
          <p className="text-gray-500 text-sm py-4">Leaderboard updates on Sunday based on prediction accuracy.</p>
        </div>
      </section>
    </div>
  );
}

// Inline Icon component to avoid another import
function UsersIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}
