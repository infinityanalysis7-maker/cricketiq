import Link from "next/link";
import { ArrowLeft, Share2, Award, Zap, ChevronRight } from "lucide-react";
import Image from "next/image";

export default async function ScorecardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const matchId = resolvedParams.id;
  
  // Simulated Match Data
  const data = {
    title: matchId.toUpperCase().replace("-VS-", " VS ").replace("-RES", ""),
    status: "RESULT: RCB won by 42 runs",
    venue: "Wankhede Stadium, Mumbai",
    batting: [
      { name: "Virat Kohli", runs: 113, balls: 62, sr: 182.2, outs: "not out", avatar: "/cricket_player_avatar_1778452555076.png" },
      { name: "Faf du Plessis", runs: 45, balls: 28, sr: 160.7, outs: "c Rohit b Bumrah", avatar: "" },
      { name: "Glenn Maxwell", runs: 32, balls: 14, sr: 228.5, outs: "b Hardik", avatar: "" },
    ],
    bowling: [
      { name: "Jasprit Bumrah", overs: 4, maidens: 0, runs: 28, wickets: 2, eco: 7.0 },
      { name: "Gerald Coetzee", overs: 4, maidens: 0, runs: 45, wickets: 1, eco: 11.2 },
    ]
  };

  return (
    <div className="min-h-screen pb-24 animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-black p-4 pt-8 border-b border-border">
        <Link href="/" className="text-gray-400 mb-4 inline-block"><ArrowLeft /></Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black italic">{data.title}</h1>
          <Share2 className="text-gray-400" />
        </div>
        <p className="text-primary font-bold mt-2 text-sm uppercase tracking-widest">{data.status}</p>
        <p className="text-xs text-gray-500 mt-1">{data.venue}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-black sticky top-0 z-10">
        {["INFO", "SCORECARD", "SQUAD", "OVERS"].map((tab, i) => (
          <div key={tab} className={`flex-1 text-center py-4 text-xs font-bold tracking-widest ${i === 1 ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>
            {tab}
          </div>
        ))}
      </div>

      <div className="p-4 space-y-6">
        {/* Batting Section */}
        <section>
          <div className="flex justify-between items-center mb-4 bg-white/5 p-3 rounded-xl">
            <h2 className="font-bold text-sm">BATTING (1st Innings)</h2>
            <span className="text-xs font-bold text-gray-400">224/5 (20)</span>
          </div>
          
          <div className="space-y-4">
            {data.batting.map((player, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-full bg-border overflow-hidden shrink-0 border border-white/10">
                  {player.avatar ? (
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-600">IMG</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm">{player.name}</span>
                    <span className="font-black text-white">{player.runs} <span className="text-[10px] font-normal text-gray-500">({player.balls})</span></span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[10px] text-gray-500 italic uppercase">{player.outs}</span>
                    <span className="text-[10px] text-gray-400 font-medium">SR: {player.sr}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bowling Section */}
        <section>
          <div className="flex justify-between items-center mb-4 bg-white/5 p-3 rounded-xl">
            <h2 className="font-bold text-sm">BOWLING</h2>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 font-bold border-b border-border">
                <th className="text-left pb-2">BOWLER</th>
                <th className="text-center pb-2">O</th>
                <th className="text-center pb-2">R</th>
                <th className="text-center pb-2">W</th>
                <th className="text-right pb-2">ECO</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {data.bowling.map((bowler, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-3 font-bold">{bowler.name}</td>
                  <td className="text-center py-3">{bowler.overs}</td>
                  <td className="text-center py-3">{bowler.runs}</td>
                  <td className="text-center py-3 font-black text-white">{bowler.wickets}</td>
                  <td className="text-right py-3 text-gray-500">{bowler.eco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Highlights Tip */}
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-4">
          <Zap className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h3 className="text-sm font-black text-primary">AI HIGHLIGHTS</h3>
            <p className="text-xs text-gray-400 leading-relaxed mt-1">
              Kohli's century was the 2nd fastest of the season, exploiting the short boundaries at Wankhede perfectly.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
        </div>
      </div>
    </div>
  );
}
