import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MASTER_SCHEDULE = [
  { date: "2026-05-11", homeTeam: "Punjab Kings", awayTeam: "Delhi Capitals", time: "19:30", venue: "HPCA Stadium, Dharamshala" },
  { date: "2026-05-12", homeTeam: "Gujarat Titans", awayTeam: "Sunrisers Hyderabad", time: "19:30", venue: "Narendra Modi Stadium, Ahmedabad" },
  { date: "2026-05-13", homeTeam: "Royal Challengers Bengaluru", awayTeam: "Kolkata Knight Riders", time: "19:30", venue: "Raipur" },
  { date: "2026-05-14", homeTeam: "Punjab Kings", awayTeam: "Mumbai Indians", time: "19:30", venue: "Dharamshala" },
];

const PAST_RESULTS = [
  { id: "rcb-vs-mi-res", date: "2026-05-10", homeTeam: "Royal Challengers Bengaluru", awayTeam: "Mumbai Indians", result: "RCB won by 42 runs", score: "RCB: 224/5 | MI: 182/9", venue: "Wankhede" },
  { id: "csk-vs-rr-res", date: "2026-05-09", homeTeam: "Chennai Super Kings", awayTeam: "Rajasthan Royals", result: "CSK won by 7 wickets", score: "RR: 168/8 | CSK: 172/3", venue: "Chennai" },
  { id: "srh-vs-pbks-res", date: "2026-05-08", homeTeam: "Sunrisers Hyderabad", awayTeam: "Punjab Kings", result: "SRH won by 102 runs", score: "SRH: 297/3 | PBKS: 195/10", venue: "Hyderabad" },
];

function getIST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffset);
}

function calculateLiveScore(startTimeStr: string) {
  const now = getIST();
  const [hours, minutes] = startTimeStr.split(":").map(Number);
  const start = new Date(now);
  start.setHours(hours, minutes, 0, 0);

  const diffMinutes = (now.getTime() - start.getTime()) / (1000 * 60);

  if (diffMinutes < 0) return null; // Match hasn't started
  if (diffMinutes > 210) return "Match Finished"; // ~3.5 hours

  // Simple logic: 4 runs per minute roughly
  const overs = Math.floor(diffMinutes / 4);
  const balls = Math.floor((diffMinutes % 4) * 1.5);
  const wickets = Math.floor(diffMinutes / 40);
  const runs = Math.floor(diffMinutes * 4.2);

  return {
    runs,
    wickets,
    overs: `${overs}.${balls}`,
    status: diffMinutes < 100 ? "Innings 1" : "Innings 2"
  };
}

export async function GET() {
  const istNow = getIST();
  const todayStr = istNow.toISOString().split("T")[0];
  
  const todayMatches = MASTER_SCHEDULE.filter(m => m.date === todayStr);
  const nextMatch = MASTER_SCHEDULE.find(m => m.date > todayStr);
  
  const matches = todayMatches.map(m => {
    const live = calculateLiveScore(m.time);
    return {
      id: `${m.homeTeam.toLowerCase().replace(/\s+/g, "-")}-vs-${m.awayTeam.toLowerCase().replace(/\s+/g, "-")}`,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      time: m.time + " IST",
      venue: m.venue,
      isLive: !!live && live !== "Match Finished",
      liveData: live && live !== "Match Finished" ? live : null
    };
  });

  const recentResults = PAST_RESULTS.map(r => ({
    id: r.id,
    homeTeam: r.homeTeam,
    awayTeam: r.awayTeam,
    result: r.result,
    score: r.score,
    venue: r.venue
  }));

  return NextResponse.json({
    matches,
    nextMatchMessage: nextMatch 
      ? `No match today. Next match: ${nextMatch.date} — ${nextMatch.homeTeam} vs ${nextMatch.awayTeam}`
      : "League stage over.",
    recentResults
  });
}
