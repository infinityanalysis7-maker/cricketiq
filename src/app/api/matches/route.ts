import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// REAL IPL 2026 Schedule - Updated May 11, 2026
const IPL_2026_SCHEDULE = [
  { date: "2026-05-11", homeTeam: "Punjab Kings", awayTeam: "Delhi Capitals", time: "7:30 PM IST", venue: "HPCA Stadium, Dharamshala" },
  { date: "2026-05-12", homeTeam: "Gujarat Titans", awayTeam: "Sunrisers Hyderabad", time: "7:30 PM IST", venue: "Narendra Modi Stadium, Ahmedabad" },
  { date: "2026-05-13", homeTeam: "Chennai Super Kings", awayTeam: "Rajasthan Royals", time: "7:30 PM IST", venue: "MA Chidambaram Stadium, Chennai" },
  { date: "2026-05-14", homeTeam: "Kolkata Knight Riders", awayTeam: "Lucknow Super Giants", time: "7:30 PM IST", venue: "Eden Gardens, Kolkata" },
  { date: "2026-05-15", homeTeam: "Mumbai Indians", awayTeam: "Royal Challengers Bengaluru", time: "7:30 PM IST", venue: "Wankhede Stadium, Mumbai" },
];

const RECENT_RESULTS = [
  {
    id: "rcb-vs-mi-res",
    homeTeam: "Royal Challengers Bengaluru",
    awayTeam: "Mumbai Indians",
    result: "RCB won by 42 runs",
    score: "RCB: 224/5 (20) | MI: 182/9 (20)"
  },
  {
    id: "csk-vs-rr-res",
    homeTeam: "Chennai Super Kings",
    awayTeam: "Rajasthan Royals",
    result: "CSK won by 7 wickets",
    score: "RR: 168/8 (20) | CSK: 172/3 (18.2)"
  }
];

function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split("T")[0];
}

function getNextMatch(todayStr: string) {
  return IPL_2026_SCHEDULE.find(m => m.date > todayStr);
}

export async function GET() {
  const cached = getCached("matches_v2"); // New key for the new schema
  if (cached) return NextResponse.json(cached);

  const todayStr = getTodayIST();
  const todayMatches = IPL_2026_SCHEDULE.filter(m => m.date === todayStr);

  let result: any;

  if (todayMatches.length > 0) {
    result = {
      matches: todayMatches.map(m => ({
        id: `${m.homeTeam.toLowerCase().replace(/\s+/g, "-")}-vs-${m.awayTeam.toLowerCase().replace(/\s+/g, "-")}`,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        time: m.time,
        venue: m.venue,
      })),
      nextMatchMessage: "",
      recentResults: RECENT_RESULTS
    };
  } else {
    const next = getNextMatch(todayStr);
    const nextMsg = next
      ? `No match today. Next match: ${next.date} — ${next.homeTeam} vs ${next.awayTeam} at ${next.time}`
      : "No upcoming IPL 2026 matches scheduled.";
    result = { matches: [], nextMatchMessage: nextMsg, recentResults: RECENT_RESULTS };
  }

  setCached("matches_v2", result);
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=3600" },
  });
}
