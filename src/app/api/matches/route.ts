import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// In-memory cache: survives across requests on the same serverless instance
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Return cached data if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  }

  try {
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Today's date is ${today}. 
      What IPL 2026 matches are scheduled for today? 
      Return ONLY a valid JSON object, no markdown, no extra text:
      {
        "matches": [
          { "id": "team1-vs-team2", "homeTeam": "Full Team Name", "awayTeam": "Full Team Name", "time": "7:30 PM IST", "venue": "Stadium Name" }
        ],
        "nextMatchMessage": "If no match today: No match today. Next match: [date] — [Team A] vs [Team B]. If matches today: leave empty string."
      }
      Use your knowledge of the IPL 2026 schedule. If you don't know the exact schedule, return an empty matches array with a helpful nextMatchMessage.`,
    });

    // Strip markdown code fences if present
    let text = response.text?.trim() || '{"matches":[]}';
    text = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");
    const data = JSON.parse(text);

    cache = { data, timestamp: Date.now() };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (err: any) {
    const msg = err?.message || String(err);
    const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED");
    console.error("Matches API error:", msg);
    return NextResponse.json(
      { error: isQuota ? "quota: API quota exceeded. Live data will return at midnight." : "Could not fetch live match data. Please refresh in a moment." },
      { status: 200 }
    );
  }
}
