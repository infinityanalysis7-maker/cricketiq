"use client";

import { Settings, Shield, Target, Flame, Share2, Award, Zap } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const profile = {
    name: "ThalaFan99",
    team: "Chennai Super Kings",
    iqScore: 94,
    accuracy: 78,
    streak: 12,
    predictionsMade: 45,
    personality: "The Analyst 🤓 - You rely on stats more than emotions.",
    badges: ["Legend", "Early Bird", "Perfect Predictor", "Derby King"]
  };

  return (
    <div className="min-h-screen pb-24 p-4 animate-slide-up pt-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black">FAN PROFILE</h1>
        <button className="text-gray-400">
          <Settings className="w-6 h-6" />
        </button>
      </header>

      {/* Main Profile Card */}
      <div className="bg-gradient-to-br from-primary/20 to-[#111] border border-primary/30 rounded-3xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(255,130,0,0.1)] mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-black border-2 border-primary rounded-full flex items-center justify-center text-4xl">
              🦁
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{profile.name}</h2>
              <p className="text-xs text-primary font-bold tracking-widest">{profile.team} FAN</p>
            </div>
          </div>
          <button className="bg-white/10 p-2 rounded-full">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="mt-6 bg-black/50 p-4 rounded-xl border border-white/5 relative z-10 flex items-start gap-3">
          <Zap className="w-6 h-6 text-yellow-400 shrink-0" />
          <div>
            <span className="text-xs text-gray-400 font-bold">AI FAN PERSONALITY</span>
            <p className="text-sm text-gray-200 mt-1">{profile.personality}</p>
          </div>
        </div>
      </div>

      <h3 className="font-bold mb-4">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* IQ Score */}
        <div className="bg-card-bg border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Shield className="w-6 h-6 text-secondary mb-2" />
          <h3 className="font-black text-2xl text-white">{profile.iqScore}</h3>
          <p className="text-xs text-gray-500 font-bold mt-1">CRICKET IQ</p>
        </div>
        
        {/* Prediction Accuracy */}
        <div className="bg-card-bg border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Target className="w-6 h-6 text-green-400 mb-2" />
          <h3 className="font-black text-2xl text-white">{profile.accuracy}%</h3>
          <p className="text-xs text-gray-500 font-bold mt-1">ACCURACY</p>
        </div>

        {/* Win Streak */}
        <div className="bg-card-bg border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Flame className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-black text-2xl text-white">{profile.streak}</h3>
          <p className="text-xs text-gray-500 font-bold mt-1">DAY STREAK</p>
        </div>
        
        {/* Total Predictions */}
        <div className="bg-card-bg border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Award className="w-6 h-6 text-purple-400 mb-2" />
          <h3 className="font-black text-2xl text-white">{profile.predictionsMade}</h3>
          <p className="text-xs text-gray-500 font-bold mt-1">PREDICTIONS</p>
        </div>
      </div>

      {/* Prediction Tracker */}
      <h3 className="font-bold mb-4">Recent Predictions</h3>
      <div className="bg-card-bg border border-border rounded-2xl p-4 space-y-3 mb-6">
        {[
          { match: "CSK vs MI", pick: "CSK", correct: true },
          { match: "RCB vs KKR", pick: "RCB", correct: false },
          { match: "GT vs RR", pick: "RR", correct: true },
        ].map((pred, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-black rounded-xl border border-white/5">
            <div>
              <p className="text-sm font-bold text-gray-300">{pred.match}</p>
              <p className="text-xs text-gray-500 mt-0.5">Picked: {pred.pick}</p>
            </div>
            {pred.correct ? (
              <span className="bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded">WON</span>
            ) : (
              <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-1 rounded">LOST</span>
            )}
          </div>
        ))}
        <button className="w-full text-center text-sm text-secondary font-bold pt-2 mt-2 border-t border-white/5">
          View All History
        </button>
      </div>

      {/* Pro Banner */}
      <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 border border-yellow-500/30 rounded-2xl p-5 relative overflow-hidden mb-6">
        <h3 className="font-black text-yellow-500 mb-1 flex items-center gap-2">
          CRICKETIQ PRO <StarIcon className="w-4 h-4 fill-yellow-500" />
        </h3>
        <p className="text-sm text-gray-300 mb-4">Unlimited predictions, ad-free, and advanced AI analysis.</p>
        <button className="bg-yellow-500 text-black font-black py-2 px-6 rounded-full text-sm">
          UPGRADE FOR ₹99/mo
        </button>
      </div>

      {/* Referral System */}
      <h3 className="font-bold mb-4">Refer & Earn Pro</h3>
      <div className="bg-gradient-to-br from-[#111] to-card-bg border border-border rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
        <h4 className="font-bold text-white mb-2">Invite Friends, Get Pro Free</h4>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
          Share your unique link. When a friend joins, both of you get <span className="text-yellow-500 font-bold">1 week of Pro for FREE!</span>
        </p>
        
        <div className="bg-black border border-white/10 rounded-xl p-3 flex justify-between items-center mb-4">
          <span className="text-xs font-mono text-gray-400 truncate mr-2">cricketiq.in/join/thala99</span>
          <button className="text-primary text-xs font-bold uppercase shrink-0 hover:text-primary/80">Copy Link</button>
        </div>

        <button 
          onClick={() => {
            const text = "Join India's ultimate AI Cricket Community! Sign up with my link and we both get 1 week of CricketIQ Pro for FREE! 🏏🔥 https://cricketiq.in/join/thala99";
            if (navigator.share) {
              navigator.share({ title: 'CricketIQ Pro Referral', text });
            } else {
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
            }
          }}
          className="w-full bg-[#25D366] text-white font-black py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-[#20b858] transition-colors mb-4"
        >
          <Share2 className="w-4 h-4" /> SHARE ON WHATSAPP
        </button>

        <div className="border-t border-white/5 pt-4 flex items-center justify-between">
          <span className="text-sm text-gray-300">Friends Joined</span>
          <div className="flex items-center gap-2">
            <span className="bg-secondary/20 text-secondary text-lg font-black px-3 py-1 rounded-lg">3</span>
            <span className="text-xs text-gray-500 font-bold uppercase">Success</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  );
}
