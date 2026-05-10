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
      const query = "PBKS vs DC IPL 2026 today match May 11, IPL match today May 11 2026 Punjab Kings Delhi Capitals";
      const prompt = `Search for: "${query}". 
      Return JSON: { "matches": [{ "id": "pbks-vs-dc", "homeTeam": "Punjab Kings", "awayTeam": "Delhi Capitals", "time": "7:30 PM IST", "venue": "Dharamshala" }] }
      If you can't find details, just use the PBKS vs DC match for May 11 2026.`;

      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9000
      );

      rawResponse = result.text || "";
      console.log("RAW GEMINI RESPONSE:", rawResponse);

      try {
        const parsed = JSON.parse(stripFences(rawResponse));
        if (parsed.matches && parsed.matches.length > 0) return { ...parsed, rawText: rawResponse };
        throw new Error("No matches in JSON");
      } catch {
        // HARD FALLBACK FOR MAY 11
        return { 
          matches: [{ id: "pbks-vs-dc", homeTeam: "Punjab Kings", awayTeam: "Delhi Capitals", time: "7:30 PM IST", venue: "HPCA Stadium, Dharamshala" }], 
          rawText: rawResponse || "Today's Match: PBKS vs DC at 7:30 PM IST"
        };
      }
    } catch (error) {
      // LAST RESORT FALLBACK
      return { 
        matches: [{ id: "pbks-vs-dc", homeTeam: "Punjab Kings", awayTeam: "Delhi Capitals", time: "7:30 PM IST", venue: "HPCA Stadium, Dharamshala" }],
        rawText: "Search timed out. Showing scheduled match for May 11: PBKS vs DC."
      };
    }
  },
  ["live-matches-v4"],
  { revalidate: 300 }
);

// 2. PREDICTION DATA SEARCH
export const getMatchPredictionData = unstable_cache(
  async (matchId: string) => {
    try {
      const prompt = `Search for: "IPL 2026 ${matchId.replace("-vs-", " vs ")} head to head and pitch report May 11". Return JSON.`;
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
      return { error: "Analyzing... please refresh in 10s." };
    }
  },
  ["match-prediction-v4"],
  { revalidate: 120 }
);

// 3. NEWS SEARCH
export const getLatestNews = unstable_cache(
  async () => {
    try {
      const result = await withTimeout(
        genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: "IPL 2026 latest news today May 11. Return JSON array." }] }],
          config: { tools: [{ googleSearch: {} } as any] }
        }),
        9000
      );
      return JSON.parse(stripFences(result.text || "[]"));
    } catch (error) {
      return [];
    }
  },
  ["latest-news-v4"],
  { revalidate: 900 }
);

// 4. POINTS TABLE SEARCH
export const getPointsTable = unstable_cache(
  async () => {
    try {
      const prompt = `Search for "IPL 2026 points table standings May 11". Return JSON array.`;
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
  ["points-table-v4"],
  { revalidate: 3600 }
);

// 5. IQ TEST GENERATION
export const getDynamicIQTest = unstable_cache(
  async () => {
    try {
      const prompt = `Generate 10 MCQ for IPL 2026 today May 11. JSON format.`;
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
  ["daily-iq-v4"],
  { revalidate: 86400 }
);
