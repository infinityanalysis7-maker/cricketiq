import { GoogleGenAI } from "@google/genai";
import { unstable_cache } from "next/cache";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function stripFences(text: string) {
  return text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();
}

// Helper for timeout-wrapped fetch
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
    try {
      const prompt = `Search for "IPL 2026 today match schedule". 
      Return JSON: { "matches": [{ "id": "...", "homeTeam": "...", "awayTeam": "...", "time": "...", "venue": "..." }] }`;

      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        8000 // 8s limit
      );

      return JSON.parse(stripFences(result.text || "{}"));
    } catch (error) {
      console.error("Matches Search failed/timed out:", error);
      return { matches: [], isPartial: true };
    }
  },
  ["live-matches-v2"],
  { revalidate: 1800 }
);

// 2. PREDICTION DATA SEARCH
export const getMatchPredictionData = unstable_cache(
  async (matchId: string) => {
    try {
      const prompt = `Quick search: IPL 2026 ${matchId.replace("-vs-", " vs ")} stats and pitch.
      Return JSON: { "headToHead": "...", "aiPrediction": { "winner": "...", "confidence": 70, "explanation": "..." } }`;

      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        8000
      );

      return JSON.parse(stripFences(result.text || "{}"));
    } catch (error) {
      return { headToHead: "Live data unavailable.", aiPrediction: { winner: "Analysis Pending", confidence: 50, explanation: "Searching..." } };
    }
  },
  ["match-prediction-v2"],
  { revalidate: 120 }
);

// 3. NEWS SEARCH
export const getLatestNews = unstable_cache(
  async () => {
    try {
      const prompt = `Search for "IPL 2026 news today". Return JSON array of 5 news items.`;
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        8000
      );
      return JSON.parse(stripFences(result.text || "[]"));
    } catch (error) {
      return [];
    }
  },
  ["latest-news-v2"],
  { revalidate: 900 }
);

// 4. IQ TEST GENERATION
export const getDynamicIQTest = unstable_cache(
  async () => {
    try {
      const prompt = `Generate 10 MCQ for IPL 2026 today. JSON: [{id, question, options, correctAnswerIndex, explanation}]`;
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        8000
      );
      return JSON.parse(stripFences(result.text || "[]"));
    } catch (error) {
      return { error: "Timeout" };
    }
  },
  ["daily-iq-v2"],
  { revalidate: 86400 }
);

// 5. POINTS TABLE SEARCH
export const getPointsTable = unstable_cache(
  async () => {
    try {
      const prompt = `Search for "IPL 2026 points table". Return JSON array of standings.`;
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        8000
      );
      return JSON.parse(stripFences(result.text || "[]"));
    } catch (error) {
      return [];
    }
  },
  ["points-table-v2"],
  { revalidate: 3600 }
);
