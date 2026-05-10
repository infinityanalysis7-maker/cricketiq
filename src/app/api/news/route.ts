import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getCached, setCached, getCacheAge } from "@/lib/cache";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cached = getCached("news");
  if (cached) {
    const age = getCacheAge("news");
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
      contents: `Today is ${today}. Generate 5 IPL 2026 cricket news items.
      Return ONLY a valid JSON array (no markdown, no explanation):
      [
        { "title": "Specific news headline about IPL 2026", "aiSummary": "One clear sentence summary.", "time": "Today" }
      ]
      Cover: match results, player performances, team updates, stats milestones, playoff race. Make them specific to IPL 2026.`,
    });

    let text = response.text?.trim() || "[]";
    text = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");
    const data = JSON.parse(text);
    const articles = Array.isArray(data) ? data : [];

    setCached("news", articles);

    return NextResponse.json(articles, {
      headers: { "Cache-Control": "public, s-maxage=1800", "X-Cache": "MISS" },
    });
  } catch (err: any) {
    const msg = err?.message || String(err);
    const isQuota = msg.includes("429") || msg.toLowerCase().includes("quota") || msg.includes("RESOURCE_EXHAUSTED");
    console.error("News API error:", msg);
    return NextResponse.json(
      {
        error: isQuota
          ? "quota: Free API quota reached for today."
          : "Could not fetch live news. Please refresh in a moment.",
      },
      { status: 200 }
    );
  }
}
