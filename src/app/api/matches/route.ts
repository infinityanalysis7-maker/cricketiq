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
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Search for: "IPL 2026 today match schedule ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}".
      Return a JSON object with this EXACT schema (no extra text, only JSON):
      {
        "matches": [
          { "id": "team1-vs-team2", "homeTeam": "Team Name", "awayTeam": "Team Name", "time": "7:30 PM IST", "venue": "Stadium Name" }
        ],
        "nextMatchMessage": "No match today. Next match: [date] — [Team A] vs [Team B]"
      }
      Rules:
      - If there IS a match today: fill "matches" array, leave "nextMatchMessage" as empty string ""
      - If there is NO match today: leave "matches" as [], fill "nextMatchMessage"
      - NEVER invent matches. Only real IPL 2026 schedule.
      - id must be lowercase hyphenated, e.g. "rcb-vs-csk"`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || '{"matches":[],"nextMatchMessage":"No matches found."}';
    const data = JSON.parse(text);

    cache = { data, timestamp: Date.now() };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (err: any) {
    console.error("Matches API error:", err?.message || err);
    return NextResponse.json(
      { error: "Could not fetch live match data. Please refresh in a moment." },
      { status: 200 } // Return 200 so client handles it gracefully
    );
  }
}
