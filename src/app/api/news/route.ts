import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  }

  try {
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Today is ${today}. List 5 recent IPL 2026 cricket news headlines and summaries.
      Return ONLY a valid JSON array, no markdown, no extra text:
      [
        { "title": "News headline here", "aiSummary": "One sentence summary.", "time": "Today" }
      ]
      Return exactly 5 items. Use your knowledge of IPL 2026 events, transfers, match results, and team news.`,
    });

    let text = response.text?.trim() || "[]";
    text = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");
    const data = JSON.parse(text);
    const articles = Array.isArray(data) ? data : [];

    cache = { data: articles, timestamp: Date.now() };

    return NextResponse.json(articles, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (err: any) {
    const msg = err?.message || String(err);
    const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED");
    console.error("News API error:", msg);
    return NextResponse.json(
      { error: isQuota ? "quota: API quota exceeded." : "Could not fetch live news. Please refresh in a moment." },
      { status: 200 }
    );
  }
}
