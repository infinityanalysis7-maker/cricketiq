import { getPointsTable } from "@/lib/cricketData";
import { Table, ArrowLeft, RefreshCw, Info } from "lucide-react";
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
    const data = await getPointsTable();

    return (
      <div className="space-y-6 animate-slide-up">
        <div className="bg-card-bg border border-border rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-secondary" />
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Real-Time Points Table (May 11)</h2>
          </div>
          
          <div className="bg-black/50 border border-white/5 rounded-2xl p-6 md:p-8">
            <p className="text-base text-gray-200 leading-relaxed font-medium whitespace-pre-wrap">
              {data.rawText || "Points table is being updated. Please check back shortly."}
            </p>
          </div>

          <div className="mt-8 p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-center">
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest">
              Live Standings Fetched via Gemini Search
            </p>
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          Last Updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-12 text-center flex flex-col items-center gap-6 animate-pulse">
        <RefreshCw className="w-12 h-12 text-primary animate-spin" />
        <p className="text-primary font-bold uppercase tracking-widest">Syncing with latest results...</p>
      </div>
    );
  }
}
