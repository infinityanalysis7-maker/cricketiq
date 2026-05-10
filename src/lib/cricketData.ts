import { GoogleGenAI } from "@google/genai";
import { unstable_cache } from "next/cache";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function stripFences(text: string) {
  return text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("SEARCH_TIMEOUT")), timeoutMs)
    ),
  ]);
}

// 1. MATCHES SEARCH
export const getLiveMatches = unstable_cache(
  async () => {
    let rawResponse = "";
    try {
      const query = "IPL 2026 match today May 11, 11 May match schedule";
      const prompt = `Search for: "${query}". 
      Return EXACTLY this JSON structure:
      {
        "matches": [
          { "id": "...", "homeTeam": "...", "awayTeam": "...", "time": "...", "venue": "..." }
        ]
      }
      If no IPL match, search for any major cricket match today.
      If you can't find a JSON structure, just explain the match schedule in plain text.`;

      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9000
      );

      rawResponse = result.text || "";
      console.log("RAW GEMINI RESPONSE (MATCHES):", rawResponse);

      try {
        const parsed = JSON.parse(stripFences(rawResponse));
        return { ...parsed, rawText: rawResponse };
      } catch {
        // Parsing failed, return raw text as fallback
        return { matches: [], rawText: rawResponse };
      }
    } catch (error) {
      console.error("Matches Search failed:", error);
      return { matches: [], error: "Search timed out. Please try again." };
    }
  },
  ["live-matches-v3"],
  { revalidate: 300 } // 5 minutes revalidation for more "real-time" feel
);

// 2. PREDICTION DATA SEARCH
export const getMatchPredictionData = unstable_cache(
  async (matchId: string) => {
    try {
      const prompt = `Analyze: IPL 2026 ${matchId.replace("-vs-", " vs ")}. Need Head-to-head, pitch, and winner prediction. Return JSON.`;
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9000
      );
      return JSON.parse(stripFences(result.text || "{}"));
    } catch (error) {
      return { error: "Analysis taking longer than expected. Please retry." };
    }
  },
  ["match-prediction-v3"],
  { revalidate: 120 }
);

// 3. NEWS SEARCH
export const getLatestNews = unstable_cache(
  async () => {
    try {
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: "IPL 2026 latest news 11 May 2026. Return JSON array of 5 news items." }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9000
      );
      return JSON.parse(stripFences(result.text || "[]"));
    } catch (error) {
      return [];
    }
  },
  ["latest-news-v3"],
  { revalidate: 900 }
);

// 4. POINTS TABLE SEARCH
export const getPointsTable = unstable_cache(
  async () => {
    try {
      const prompt = `Search for "IPL 2026 points table standings May 2026". Return JSON array of standings: [{team, played, won, lost, points, nrr}]`;
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9000
      );
      return JSON.parse(stripFences(result.text || "[]"));
    } catch (error) {
      return [];
    }
  },
  ["points-table-v3"],
  { revalidate: 3600 }
);

// 5. IQ TEST GENERATION
export const getDynamicIQTest = unstable_cache(
  async () => {
    try {
      const prompt = `Generate 10 MCQ for IPL 2026 today May 11. JSON: [{id, question, options, correctAnswerIndex, explanation}]`;
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9000
      );
      return JSON.parse(stripFences(result.text || "[]"));
    } catch (error) {
      return [];
    }
  },
  ["daily-iq-v3"],
  { revalidate: 86400 }
);
