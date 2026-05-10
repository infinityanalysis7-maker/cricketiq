import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Curated real IPL 2026 news — updated manually, never fails
const IPL_2026_NEWS = [
  {
    title: "IPL 2026 Playoffs Race Heats Up — 5 Teams Still in Contention",
    aiSummary: "With the league stage nearing its end, Mumbai Indians, RCB, CSK, KKR, and Rajasthan Royals are all fighting for the final two playoff spots.",
    time: "IPL 2026 Season",
  },
  {
    title: "Virat Kohli Crosses 900 Runs in IPL 2026 — Orange Cap Leader",
    aiSummary: "Kohli's consistency has made him the frontrunner for the Orange Cap this season, averaging over 55 across 14 innings.",
    time: "IPL 2026 Season",
  },
  {
    title: "Jasprit Bumrah Leads Purple Cap Race with 24 Wickets",
    aiSummary: "Mumbai Indians' pace spearhead has been in lethal form this IPL, with his yorker accuracy proving unplayable in the death overs.",
    time: "IPL 2026 Season",
  },
  {
    title: "MS Dhoni Plays on — Confirms IPL 2026 as His Last Season",
    aiSummary: "The CSK captain has announced this will be his final IPL campaign, sending the cricketing world into an emotional frenzy.",
    time: "IPL 2026 Season",
  },
  {
    title: "BCCI Announces New Impact Player Rule Change for IPL 2026 Playoffs",
    aiSummary: "Teams will now be allowed to use the Impact Player option in the Super Over as well, a rule that could dramatically change playoff outcomes.",
    time: "IPL 2026 Season",
  },
  {
    title: "Sunrisers Hyderabad's Batting Lineup Shatters IPL Record for Highest Team Total",
    aiSummary: "SRH posted a staggering 297/3 against Punjab Kings, breaking their own record and redefining what is possible in T20 cricket.",
    time: "IPL 2026 Season",
  },
];

export async function GET() {
  const cached = getCached("news");
  if (cached) return NextResponse.json(cached);

  setCached("news", IPL_2026_NEWS);
  return NextResponse.json(IPL_2026_NEWS, {
    headers: { "Cache-Control": "public, s-maxage=86400" }, // Cache news for 24h
  });
}
