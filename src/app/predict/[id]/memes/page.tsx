import Link from "next/link";
import { ArrowLeft, Laugh, Download, Share2 } from "lucide-react";

export default function MemesPage({ params }: { params: { id: string } }) {
  const teams = params.id.split("-vs-").map(t => t.toUpperCase());
  
  return (
    <div className="min-h-screen pb-24 p-4 animate-slide-up">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href={`/predict/${params.id}`} className="text-gray-400">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2">
          AI Meme Gen <Laugh className="w-5 h-5 text-primary" />
        </h1>
      </header>

      <div className="space-y-6">
        <div className="bg-card-bg border border-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="aspect-square bg-[#111] flex items-center justify-center p-8 text-center relative">
            <div className="absolute top-4 left-0 right-0 px-4">
              <p className="text-2xl font-black text-white uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                ME WATCHING {teams[0]} BATTING
              </p>
            </div>
            <div className="text-8xl">😴</div>
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <p className="text-2xl font-black text-white uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                "WAKE ME UP WHEN THE OVER IS DONE"
              </p>
            </div>
          </div>
          <div className="p-4 border-t border-border flex justify-between gap-4">
            <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Save
            </button>
            <button className="flex-1 bg-primary text-black font-bold p-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        <div className="bg-card-bg border border-border rounded-3xl p-6">
          <p className="text-sm text-gray-400 mb-4 font-bold uppercase">MORE TRENDING MEMES</p>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-black border border-border rounded-xl flex items-center justify-center text-3xl grayscale hover:grayscale-0 transition-all cursor-pointer">
                🖼️
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
