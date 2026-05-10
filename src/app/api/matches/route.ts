import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getCached, setCached, getCacheAge } from "@/lib/cache";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Serve from cache if fresh — 1 API call serves ALL users for 30 min
  const cached = getCached("matches");
  if (cached) {
    const age = getCacheAge("matches");
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=1800",
        "X-Cache": `HIT, age: ${age}min`,
      },
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured in Vercel environment variables." });
  }

  try {
    const today = new Date().toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Today is ${today}. What IPL 2026 matches are scheduled for today?
      Return ONLY a valid JSON object (no markdown, no explanation):
      {
        "matches": [
          { "id": "team1-vs-team2", "homeTeam": "Full Team Name", "awayTeam": "Full Team Name", "time": "7:30 PM IST", "venue": "Stadium Name" }
        ],
        "nextMatchMessage": "No match today. Next match: [date] — [Team A] vs [Team B]"
      }
      If matches today: fill matches array, set nextMatchMessage to "".
      If no matches: set matches to [], fill nextMatchMessage.
      Use real IPL 2026 schedule. The id must be lowercase-hyphenated e.g. "rcb-vs-csk".`,
    });

    let text = response.text?.trim() || '{"matches":[]}';
    text = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");
    const data = JSON.parse(text);

    setCached("matches", data);

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=1800", "X-Cache": "MISS" },
    });
  } catch (err: any) {
    const msg = err?.message || String(err);
    const isQuota = msg.includes("429") || msg.toLowerCase().includes("quota") || msg.includes("RESOURCE_EXHAUSTED");
    console.error("Matches API error:", msg);
    return NextResponse.json(
      {
        error: isQuota
          ? "quota: Free API quota reached for today. Resets at midnight PST. Get a new key at aistudio.google.com"
          : "Could not fetch live match data. Please refresh in a moment.",
      },
      { status: 200 }
    );
  }
}
