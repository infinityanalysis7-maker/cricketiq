import Link from "next/link";
import { ArrowLeft, Sparkles, Share2, Download } from "lucide-react";

export default function DreamTeamPage({ params }: { params: { id: string } }) {
  const teams = params.id.split("-vs-").map(t => t.toUpperCase());
  
  return (
    <div className="min-h-screen pb-24 p-4 animate-slide-up">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href={`/predict/${params.id}`} className="text-gray-400">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2">
          AI Dream Team <Sparkles className="w-5 h-5 text-secondary" />
        </h1>
      </header>

      <div className="bg-gradient-to-br from-blue-900/40 to-black border border-secondary/30 rounded-3xl p-6 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
        <p className="text-sm text-gray-400 mb-2">PROJECTION FOR</p>
        <h2 className="text-2xl font-black mb-6">{teams[0]} vs {teams[1]}</h2>
        
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
            <span className="font-bold text-secondary">Captain</span>
            <span className="text-white">Virat Kohli (RCB)</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
            <span className="font-bold text-primary">Vice Captain</span>
            <span className="text-white">Rishabh Pant (DC)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-400 text-sm px-2">OPTIMIZED LINEUP (11)</h3>
        {[
          "V. Kohli (C)", "R. Pant (VC)", "S. Gill", "T. Head", 
          "H. Pandya", "R. Jadeja", "G. Maxwell", 
          "J. Bumrah", "T. Boult", "M. Shami", "Y. Chahal"
        ].map((player, i) => (
          <div key={i} className="bg-card-bg border border-border rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">#{i+1}</span>
            <span className="font-medium text-sm">{player}</span>
            <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-bold">9.5 CR</span>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-4 right-4 grid grid-cols-2 gap-4">
        <button className="bg-secondary text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
          <Download className="w-5 h-5" /> DOWNLOAD
        </button>
        <button className="bg-primary text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
          <Share2 className="w-5 h-5" /> SHARE
        </button>
      </div>
    </div>
  );
}
