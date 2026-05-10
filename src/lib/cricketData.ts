import { GoogleGenAI } from "@google/genai";
import { unstable_cache } from "next/cache";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("SEARCH_TIMEOUT")), timeoutMs)
    ),
  ]);
}

// 1. MATCHES SEARCH (Keep JSON for home page grid, but add raw fallback)
export const getLiveMatches = unstable_cache(
  async () => {
    try {
      const query = "PBKS vs DC IPL 2026 match today May 11";
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: query }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9000
      );
      const text = result.text || "";
      // Smart Fallback
      return { 
        matches: [{ id: "pbks-vs-dc", homeTeam: "Punjab Kings", awayTeam: "Delhi Capitals", time: "7:30 PM IST", venue: "Dharamshala" }],
        rawText: text 
      };
    } catch {
      return { 
        matches: [{ id: "pbks-vs-dc", homeTeam: "Punjab Kings", awayTeam: "Delhi Capitals", time: "7:30 PM IST", venue: "Dharamshala" }],
        rawText: "Matches for May 11: Punjab Kings vs Delhi Capitals."
      };
    }
  },
  ["live-matches-v5"],
  { revalidate: 300 }
);

// 2. PREDICTION - RAW TEXT ONLY
export const getMatchPredictionData = unstable_cache(
  async (matchId: string) => {
    try {
      const query = `${matchId.replace("-vs-", " vs ")} IPL 2026 who will win today head to head recent form key players`;
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: query }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9500
      );
      return { rawText: result.text || "No analysis available yet." };
    } catch {
      return { rawText: "Fetching live intelligence... please refresh in a moment." };
    }
  },
  ["match-prediction-v5"],
  { revalidate: 120 }
);

// 3. POINTS TABLE - RAW TEXT ONLY
export const getPointsTable = unstable_cache(
  async () => {
    try {
      const query = "IPL 2026 points table today May 11 standings";
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: query }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9500
      );
      return { rawText: result.text || "Standings being updated..." };
    } catch {
      return { rawText: "IPL 2026 Table is currently syncing. Please check back in 1 minute." };
    }
  },
  ["points-table-v5"],
  { revalidate: 3600 }
);

// 4. NEWS
export const getLatestNews = unstable_cache(
  async () => {
    try {
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: "IPL 2026 latest news today May 11. 5 headlines." }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9000
      );
      return { rawText: result.text || "" };
    } catch {
      return { rawText: "" };
    }
  },
  ["latest-news-v5"],
  { revalidate: 900 }
);

// 5. IQ TEST (Keep JSON if possible as it's a quiz, but add fallback)
export const getDynamicIQTest = unstable_cache(
  async () => {
    try {
      const prompt = `Generate 10 MCQ for IPL 2026 today May 11. Return JSON.`;
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9500
      );
      return JSON.parse(result.text?.replace(/```json|```/g, "").trim() || "[]");
    } catch {
      return [];
    }
  },
  ["daily-iq-v5"],
  { revalidate: 86400 }
);
