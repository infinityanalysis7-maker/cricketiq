import { getPointsTable } from "@/lib/cricketData";
import { Table, ArrowLeft, RefreshCw, Trophy } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default function PointsTablePage() {
  return (
    <div className="max-w-[1200px] mx-auto min-h-screen pb-24 p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
            IPL 2026 STANDINGS <Table className="text-primary" />
          </h1>
        </div>
      </header>

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-20">
          <RefreshCw className="w-12 h-12 text-primary mb-4 animate-spin" />
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Searching the web for latest standings...</p>
        </div>
      }>
        <PointsTableContent />
      </Suspense>
    </div>
  );
}

async function PointsTableContent() {
  try {
    const points = await getPointsTable();

    return (
      <div className="bg-card-bg border border-border rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">RANK</th>
                <th className="px-6 py-4">TEAM</th>
                <th className="px-6 py-4 text-center">P</th>
                <th className="px-6 py-4 text-center">W</th>
                <th className="px-6 py-4 text-center">L</th>
                <th className="px-6 py-4 text-center">NRR</th>
                <th className="px-6 py-4 text-center text-primary">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {points.map((p: any, i: number) => (
                <tr key={p.team} className={`hover:bg-white/5 transition-colors ${i < 4 ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-5 font-black text-gray-500">
                    {i < 4 ? <Trophy className="w-4 h-4 text-primary inline mr-2" /> : null}
                    {i + 1}
                  </td>
                  <td className="px-6 py-5 font-bold text-white uppercase">{p.team}</td>
                  <td className="px-6 py-5 text-center font-bold">{p.played}</td>
                  <td className="px-6 py-5 text-center font-bold text-green-500">{p.won}</td>
                  <td className="px-6 py-5 text-center font-bold text-red-500">{p.lost}</td>
                  <td className="px-6 py-5 text-center font-medium text-gray-400">{p.nrr}</td>
                  <td className="px-6 py-5 text-center font-black text-primary text-lg">{p.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white/5 text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">
          TOP 4 TEAMS QUALIFY FOR PLAYOFFS
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-12 text-center flex flex-col items-center gap-6 animate-pulse">
        <RefreshCw className="w-12 h-12 text-primary animate-spin" />
        <p className="text-primary font-bold uppercase">Syncing with latest match results...</p>
      </div>
    );
  }
}
