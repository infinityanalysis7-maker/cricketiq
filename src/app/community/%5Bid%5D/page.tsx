import Link from "next/link";
import { ArrowLeft, Swords, Users, MessageSquare, Send, Flame } from "lucide-react";

export default function FanWarRoom({ params }: { params: { id: string } }) {
  const teams = params.id.split("-vs-").map(t => t.toUpperCase());
  
  return (
    <div className="min-h-screen pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-card-bg border-b border-border p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/community" className="text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-sm font-black">{teams[0]} vs {teams[1]}</h1>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">2.4K Fans Online</span>
            </div>
          </div>
        </div>
        <div className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/20">
          <Swords className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-black text-primary">FAN WAR</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className="flex justify-center">
          <div className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Today
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">MI</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-400">Akash_Ambani_Fan</span>
              <span className="text-[10px] text-gray-600">7:42 PM</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none text-sm text-gray-300">
              Imagine thinking {teams[1]} can beat us at Wankhede lol. 🏆🏆🏆🏆🏆
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white shrink-0">RR</div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1 justify-end">
              <span className="text-[10px] text-gray-600">7:43 PM</span>
              <span className="text-xs font-bold text-red-400">HallaBol_JPR</span>
            </div>
            <div className="bg-primary/20 border border-primary/30 p-3 rounded-2xl rounded-tr-none text-sm text-gray-300">
              @Akash_Ambani_Fan bro check the points table first. You guys are already packing bags! 😂🔥
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary p-4 rounded-r-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase">Trending Take</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed italic">
            "The battle between {teams[0]}'s powerplay bowling and {teams[1]}'s top order will decide 70% of the match today."
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-border fixed bottom-0 left-0 right-0 z-20">
        <div className="flex gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Join the war..." 
              className="bg-transparent border-none outline-none text-sm w-full text-white"
            />
          </div>
          <button className="bg-primary text-black w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
