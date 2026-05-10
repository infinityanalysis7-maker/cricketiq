import Link from "next/link";
import { ArrowLeft, Flame, TrendingDown, Share2 } from "lucide-react";

export default function RoastPage({ params }: { params: { id: string } }) {
  const teams = params.id.split("-vs-").map(t => t.toUpperCase());
  
  return (
    <div className="min-h-screen pb-24 p-4 animate-slide-up">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href={`/predict/${params.id}`} className="text-gray-400">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2">
          AI Roast & Praise <Flame className="w-5 h-5 text-red-500" />
        </h1>
      </header>

      <div className="space-y-6">
        {/* Roast Section */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h2 className="font-black text-red-500 uppercase tracking-tighter">The Savage Roast</h2>
          </div>
          <p className="text-gray-200 leading-relaxed italic">
            "Imagine supporting {teams[0]} in 2026. Their middle order is currently slower than a 2G internet connection in a tunnel. Even the stadium floodlights have more energy than their strike rate."
          </p>
        </div>

        {/* Praise Section */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-green-500" />
            <h2 className="font-black text-green-500 uppercase tracking-tighter">The Glory Praise</h2>
          </div>
          <p className="text-gray-200 leading-relaxed italic">
            "{teams[1]} are playing like they've come from the future. Their bowling attack is so lethal, batters are looking for the exit before they even guard their stumps. Absolute cinema!"
          </p>
        </div>
      </div>

      <div className="mt-8">
        <button className="w-full bg-red-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
          <Share2 className="w-5 h-5" /> SHARE THIS ROAST
        </button>
      </div>
    </div>
  );
}
