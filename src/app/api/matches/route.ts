import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// IPL 2026 Schedule - hardcoded real schedule so it never fails
// Format: { date: "YYYY-MM-DD", homeTeam, awayTeam, time, venue }
const IPL_2026_SCHEDULE = [
  { date: "2026-05-11", homeTeam: "Rajasthan Royals", awayTeam: "Royal Challengers Bengaluru", time: "7:30 PM IST", venue: "Sawai Mansingh Stadium, Jaipur" },
  { date: "2026-05-12", homeTeam: "Mumbai Indians", awayTeam: "Punjab Kings", time: "7:30 PM IST", venue: "Wankhede Stadium, Mumbai" },
  { date: "2026-05-13", homeTeam: "Chennai Super Kings", awayTeam: "Delhi Capitals", time: "7:30 PM IST", venue: "MA Chidambaram Stadium, Chennai" },
  { date: "2026-05-14", homeTeam: "Kolkata Knight Riders", awayTeam: "Sunrisers Hyderabad", time: "7:30 PM IST", venue: "Eden Gardens, Kolkata" },
  { date: "2026-05-15", homeTeam: "Gujarat Titans", awayTeam: "Lucknow Super Giants", time: "7:30 PM IST", venue: "Narendra Modi Stadium, Ahmedabad" },
  { date: "2026-05-16", homeTeam: "Royal Challengers Bengaluru", awayTeam: "Chennai Super Kings", time: "3:30 PM IST", venue: "M. Chinnaswamy Stadium, Bengaluru" },
  { date: "2026-05-16", homeTeam: "Mumbai Indians", awayTeam: "Rajasthan Royals", time: "7:30 PM IST", venue: "Wankhede Stadium, Mumbai" },
  { date: "2026-05-17", homeTeam: "Punjab Kings", awayTeam: "Kolkata Knight Riders", time: "3:30 PM IST", venue: "PCA Stadium, Mullanpur" },
  { date: "2026-05-17", homeTeam: "Delhi Capitals", awayTeam: "Sunrisers Hyderabad", time: "7:30 PM IST", venue: "Arun Jaitley Stadium, Delhi" },
  { date: "2026-05-18", homeTeam: "Lucknow Super Giants", awayTeam: "Gujarat Titans", time: "7:30 PM IST", venue: "BRSABV Ekana Stadium, Lucknow" },
  { date: "2026-05-20", homeTeam: "Qualifier 1", awayTeam: "Qualifier 2", time: "7:30 PM IST", venue: "Narendra Modi Stadium, Ahmedabad" },
  { date: "2026-05-22", homeTeam: "Eliminator", awayTeam: "vs", time: "7:30 PM IST", venue: "Eden Gardens, Kolkata" },
  { date: "2026-05-25", homeTeam: "Final", awayTeam: "IPL 2026", time: "7:30 PM IST", venue: "Narendra Modi Stadium, Ahmedabad" },
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
  const cached = getCached("matches");
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
    };
  } else {
    const next = getNextMatch(todayStr);
    const nextMsg = next
      ? `No match today. Next match: ${next.date} — ${next.homeTeam} vs ${next.awayTeam} at ${next.time}`
      : "No upcoming IPL 2026 matches scheduled.";
    result = { matches: [], nextMatchMessage: nextMsg };
  }

  setCached("matches", result);
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=3600" },
  });
}
