"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function getTodayMatches() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: "What IPL matches are scheduled for today? Return a JSON array. Each object should have: id (string, e.g., 'csk-vs-rcb'), homeTeam (string), awayTeam (string), time (string). If no IPL match today, return an empty array []. Use Google Search to get the real-time schedule.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error fetching today's matches:", error);
    // Fallback data if API fails or is not configured
    return [
      { id: "csk-vs-mi", homeTeam: "CSK", awayTeam: "MI", time: "7:30 PM IST" },
      { id: "rcb-vs-kkr", homeTeam: "RCB", awayTeam: "KKR", time: "3:30 PM IST" }
    ];
  }
}

export async function getMatchPrediction(matchId: string) {
  try {
    const prompt = `
    Analyze the IPL match ${matchId} happening today. Provide a detailed pre-match analysis.
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
        "winner": "Predicted winning team",
        "confidence": 75,
        "explanation": "Why AI thinks this team will win"
      }
    }
    Use Google Search to get the most accurate and real-time data.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error fetching match prediction:", error);
    return {
      matchId,
      headToHead: "CSK has won 20, MI has won 21 matches in their history.",
      currentForm: { homeTeam: "W W L", awayTeam: "W L W" },
      pitchReport: "Batting friendly pitch with some help for spinners in the second innings.",
      weather: "Clear skies, 30°C, 60% humidity.",
      keyMatchups: ["Dhoni vs Bumrah", "Rohit vs Jadeja"],
      aiPrediction: {
        winner: "CSK",
        confidence: 65,
        explanation: "CSK has a strong home advantage and their spinners are in top form."
      }
    };
  }
}
