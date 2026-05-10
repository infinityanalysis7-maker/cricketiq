"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function getTodayMatches() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Search exactly for: "IPL 2026 today match schedule". 
      Return a JSON object with this exact schema:
      {
        "matches": [
          { "id": "home-vs-away", "homeTeam": "HOME", "awayTeam": "AWAY", "time": "Time IST" }
        ],
        "nextMatchMessage": "If no match today, write: No match today, next match is [date] between [teams]. Otherwise leave empty."
      }
      If there is a match today, populate the "matches" array. If no match today, leave "matches" array empty and populate "nextMatchMessage".
      Do not hallucinate fake matches.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || '{"matches":[]}');
    return data;
  } catch (error) {
    console.error("Error fetching today's matches:", error);
    return { error: "Could not fetch live data. Please refresh in a moment." };
  }
}

export async function getMatchPrediction(matchId: string) {
  try {
    const prompt = `
    Search for "IPL 2026 ${matchId.replace("-VS-", " vs ")} match stats, pitch report, and prediction".
    Analyze the real IPL 2026 match ${matchId}.
    Return the response as a JSON object with the following schema:
    {
      "matchId": "${matchId}",
      "headToHead": "Real data on their past encounters",
      "currentForm": {
        "homeTeam": "Recent 3 matches form, e.g., W L W",
        "awayTeam": "Recent 3 matches form, e.g., L W W"
      },
      "pitchReport": "Detailed pitch report for the venue",
      "weather": "Weather conditions for the match time",
      "keyMatchups": ["Matchup 1", "Matchup 2"],
      "aiPrediction": {
        "winner": "Predicted winning team based on real search data",
        "confidence": 75,
        "explanation": "Why AI thinks this team will win based on search results"
      }
    }
    Use Google Search to get the most accurate and real-time data. Never invent fake stats.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error fetching match prediction:", error);
    return { error: "Could not fetch live prediction. Please refresh in a moment." };
  }
}

export async function getLatestNews() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Search exactly for: "IPL 2026 latest news today".
      Find at least 5 real, actual news articles published in the last 24 hours about IPL 2026.
      Return a JSON array of objects with schema:
      [
        { "title": "Real News Title", "aiSummary": "1 sentence summary", "time": "e.g., 2h ago" }
      ]
      DO NOT invent fake news. Only return real news found via search.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching news:", error);
    return { error: "Could not fetch live news. Please refresh in a moment." };
  }
}
