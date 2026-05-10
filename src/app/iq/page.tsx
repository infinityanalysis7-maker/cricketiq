import Link from "next/link";
import { Brain, Trophy, Star, History, Users } from "lucide-react";

export default function IQLandingPage() {
  return (
    <div className="min-h-screen pb-24 p-4 space-y-6 animate-slide-up">
      <div className="text-center pt-8 pb-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[50px] rounded-full z-0" />
        <Brain className="w-16 h-16 text-primary mx-auto mb-4 relative z-10 animate-pulse-glow rounded-full" />
        <h1 className="text-3xl font-black relative z-10">CRICKET IQ</h1>
        <p className="text-gray-400 text-sm mt-2 relative z-10">Are you in the top 1% of Indian fans?</p>
      </div>

      <div className="bg-card-bg border border-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <h2 className="text-lg font-bold mb-2">Today's Challenge</h2>
        <p className="text-sm text-gray-400 mb-6">10 Questions • 15 Seconds each • New test daily</p>
        
        <Link href="/iq/test" className="block">
          <button className="w-full bg-primary hover:bg-primary/90 text-black font-black py-4 rounded-2xl text-lg transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,130,0,0.3)] flex items-center justify-center gap-2">
            START TEST <Star className="w-5 h-5" fill="currentColor" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card-bg border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
          <h3 className="font-bold text-lg">94</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Your Best IQ</p>
        </div>
        <div className="bg-card-bg border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Users className="w-8 h-8 text-secondary mb-2" />
          <h3 className="font-bold text-lg">Top 12%</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Percentile</p>
        </div>
      </div>

      <div className="bg-card-bg border border-border rounded-2xl p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-primary" /> Recent Badges
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {["Legend", "Expert", "Fan"].map((badge, i) => (
            <div key={i} className="min-w-[100px] bg-black border border-border rounded-xl p-3 flex flex-col items-center justify-center shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 
                i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 
                'bg-gradient-to-br from-orange-400 to-orange-600'
              }`}>
                <Star className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold">{badge}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-secondary/20 to-black border border-secondary/30 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white mb-1">Global Leaderboard</h3>
          <p className="text-xs text-gray-400">See where you stand in India</p>
        </div>
        <button className="text-secondary text-sm font-bold bg-secondary/10 px-4 py-2 rounded-full">View</button>
      </div>
    </div>
  );
}
