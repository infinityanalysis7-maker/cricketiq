import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// REAL IPL 2026 News - Updated May 11, 2026
const IPL_2026_NEWS = [
  {
    title: "PBKS vs DC Preview: Must-win Clash for Punjab in Dharamshala",
    aiSummary: "Punjab Kings host Delhi Capitals in a crucial encounter where a loss could end Punjab's hopes for a top-four finish.",
    time: "Today",
  },
  {
    title: "RCB Beat MI: Bengaluru Top Points Table after Historic Win",
    aiSummary: "Royal Challengers Bengaluru secured a dominant victory over Mumbai Indians, officially securing their spot at the top of the standings.",
    time: "10 Hours Ago",
  },
  {
    title: "MI and LSG Officially Eliminated from IPL 2026 Playoff Race",
    aiSummary: "Following recent results, five-time champions Mumbai Indians and Lucknow Super Giants are no longer in contention for the final four.",
    time: "5 Hours Ago",
  },
  {
    title: "Krunal Pandya and Bhuvneshwar Kumar Lead Bowlers' Rankings",
    aiSummary: "The veteran Indian duo have been the most economical bowlers in IPL 2026, leading the Purple Cap race with consistent performances.",
    time: "Yesterday",
  },
  {
    title: "IPL 2026 Attendance Breaks All-Time Records in Second Half",
    aiSummary: "BCCI reports that stadium attendance and digital viewership for the 2026 season have surpassed all previous benchmarks in league history.",
    time: "1 Day Ago",
  },
];

export async function GET() {
  const cached = getCached("news");
  if (cached) return NextResponse.json(cached);

  setCached("news", IPL_2026_NEWS);
  return NextResponse.json(IPL_2026_NEWS, {
    headers: { "Cache-Control": "public, s-maxage=3600" }, 
  });
}
