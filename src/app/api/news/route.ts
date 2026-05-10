import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NEWS_DATABASE = [
  { title: "RCB Jump to Top Spot: Bengaluru eyes 2026 Title", aiSummary: "Virat Kohli's form has propelled RCB to the top of the table with 14 points.", category: "HOT" },
  { title: "MI and LSG Officially Eliminated from IPL 2026", aiSummary: "Five-time champions Mumbai Indians will miss the playoffs for the second year in a row.", category: "BREAKING" },
  { title: "Harsh Goenka Sparks Rumors of LSG Leadership Overhaul", aiSummary: "Following LSG's exit, major changes are expected before the 2027 mega-auction.", category: "RUMOR" },
  { title: "BCCI Security Alert: Honeytrap threats reported for franchises", aiSummary: "Officials have briefed teams to stay vigilant during the final league stages.", category: "NEWS" },
  { title: "Playoff Venues: Dharamshala and Kolkata to host finals", aiSummary: "The Grand Final of IPL 2026 is confirmed for May 31st at Eden Gardens.", category: "OFFICIAL" },
  { title: "CSK vs SRH: The battle for the 4th playoff spot intensifies", aiSummary: "Ruturaj Gaikwad's men need to win their remaining matches to stay in contention.", category: "ANALYSIS" },
  { title: "Injury Niggle for DC Captain ahead of PBKS Clash", aiSummary: "Rishabh Pant is expected to play through a minor injury in today's must-win game.", category: "INJURY" },
  { title: "Weather Alert: Early monsoons could impact Kolkata Final", aiSummary: "BCCI is considering reserve days for the final matches in late May.", category: "WEATHER" },
];

export async function GET() {
  // Randomize news order slightly every hour to keep it fresh
  const hour = new Date().getHours();
  const articles = [...NEWS_DATABASE]
    .sort((a, b) => (a.title.length + hour) % 5 - (b.title.length + hour) % 5)
    .slice(0, 5)
    .map(a => ({
      ...a,
      time: "Updated Today"
    }));

  return NextResponse.json(articles, {
    headers: { "Cache-Control": "public, s-maxage=3600" }, 
  });
}
