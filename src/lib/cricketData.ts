import { GoogleGenAI } from "@google/genai";
import { unstable_cache } from "next/cache";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

function stripFences(text: string) {
  return text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();
}

// 1. MATCHES SEARCH
export const getLiveMatches = unstable_cache(
  async () => {
    try {
      const prompt = `Search for "IPL 2026 today match schedule venue time IST". 
      Return ONLY valid JSON:
      {
        "matches": [
          { "id": "team1-vs-team2", "homeTeam": "...", "awayTeam": "...", "time": "...", "venue": "...", "isLive": false }
        ],
        "lastUpdated": "${new Date().toISOString()}"
      }`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} } as any],
      });

      const responseText = result.response.text();
      return JSON.parse(stripFences(responseText));
    } catch (error) {
      console.error("Gemini Search Error (Matches):", error);
      throw error;
    }
  },
  ["live-matches"],
  { revalidate: 1800 } // 30 minutes
);

// 2. PREDICTION DATA SEARCH
export const getMatchPredictionData = unstable_cache(
  async (matchId: string) => {
    try {
      const prompt = `Search for "IPL 2026 ${matchId.replace("-vs-", " vs ")} head to head stats, recent form, pitch report, weather".
      Return ONLY valid JSON:
      {
        "headToHead": "...",
        "currentForm": { "homeTeam": "W L W...", "awayTeam": "L W W..." },
        "pitchReport": "...",
        "weather": "...",
        "aiPrediction": { "winner": "...", "confidence": 75, "explanation": "..." }
      }`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} } as any],
      });

      return JSON.parse(stripFences(result.response.text()));
    } catch (error) {
      console.error("Gemini Search Error (Prediction):", error);
      throw error;
    }
  },
  ["match-prediction"],
  { revalidate: 120 } // 2 minutes for "live" feel
);

// 3. NEWS SEARCH
export const getLatestNews = unstable_cache(
  async () => {
    try {
      const prompt = `Search for "IPL 2026 latest news today cricket updates".
      Return ONLY news from the last 24 hours. Return ONLY valid JSON:
      [
        { "title": "...", "aiSummary": "...", "source": "...", "timestamp": "..." }
      ]`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} } as any],
      });

      return JSON.parse(stripFences(result.response.text()));
    } catch (error) {
      console.error("Gemini Search Error (News):", error);
      throw error;
    }
  },
  ["latest-news"],
  { revalidate: 900 } // 15 minutes
);

// 4. IQ TEST GENERATION
export const getDynamicIQTest = unstable_cache(
  async () => {
    try {
      const prompt = `Search for "IPL 2026 latest stats, match results, player records this season".
      Generate 10 multiple-choice questions based on REAL RECENT EVENTS.
      Return ONLY valid JSON:
      [
        { "id": 1, "question": "...", "options": ["...", "..."], "correctAnswerIndex": 0, "explanation": "..." }
      ]`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} } as any],
      });

      return JSON.parse(stripFences(result.response.text()));
    } catch (error) {
      console.error("Gemini Search Error (IQ):", error);
      throw error;
    }
  },
  ["daily-iq"],
  { revalidate: 86400 } // 24 hours
);

// 5. POINTS TABLE SEARCH
export const getPointsTable = unstable_cache(
  async () => {
    try {
      const prompt = `Search for "IPL 2026 points table latest standings".
      Return ONLY valid JSON:
      [
        { "team": "...", "played": 10, "won": 7, "lost": 3, "points": 14, "nrr": "+0.55" }
      ]`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} } as any],
      });

      return JSON.parse(stripFences(result.response.text()));
    } catch (error) {
      console.error("Gemini Search Error (Points):", error);
      throw error;
    }
  },
  ["points-table"],
  { revalidate: 3600 } // 1 hour
);
