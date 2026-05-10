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
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Search for: "IPL 2026 cricket news today ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}".
      Find 5 real IPL 2026 news articles from the past 48 hours.
      Return a JSON array ONLY (no extra text):
      [
        { "title": "Exact article headline", "aiSummary": "One sentence summary of the article", "time": "X hours ago or Today" }
      ]
      Rules:
      - Return EXACTLY 5 items
      - Only real news. No invented headlines.
      - Summaries must be in simple English, 1 sentence max.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || "[]";
    const data = JSON.parse(text);
    const articles = Array.isArray(data) ? data : [];

    cache = { data: articles, timestamp: Date.now() };

    return NextResponse.json(articles, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (err: any) {
    console.error("News API error:", err?.message || err);
    return NextResponse.json(
      { error: "Could not fetch live news. Please refresh in a moment." },
      { status: 200 }
    );
  }
}
