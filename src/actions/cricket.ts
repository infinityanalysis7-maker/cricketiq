"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function stripFences(text: string) {
  return text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();
}

export async function getTodayMatches() {
  try {
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Today's date is ${today}. What IPL 2026 matches are scheduled for today?
      Return ONLY valid JSON, no markdown:
      {
        "matches": [
          { "id": "team1-vs-team2", "homeTeam": "Full Team Name", "awayTeam": "Full Team Name", "time": "7:30 PM IST", "venue": "Stadium" }
        ],
        "nextMatchMessage": "If no match: No match today. Next: [date] — [Team A] vs [Team B]. If matches today: empty string."
      }`,
    });

    const data = JSON.parse(stripFences(response.text || '{"matches":[]}'));
    return data;
  } catch (error) {
    console.error("Error fetching today's matches:", error);
    return { error: "Could not fetch live data. Please refresh in a moment." };
  }
}

export async function getMatchPrediction(matchId: string) {
  try {
    const teams = matchId.replace(/-vs-/i, " vs ").toUpperCase();
    const prompt = `Analyze this IPL 2026 match: ${teams}.
    Return ONLY valid JSON, no markdown:
    {
      "matchId": "${matchId}",
      "headToHead": "Recent head to head record between these teams",
      "currentForm": {
        "homeTeam": "W W L W L",
        "awayTeam": "L W W L W"
      },
      "pitchReport": "Pitch and venue conditions",
      "weather": "Expected weather at match time",
      "keyMatchups": ["Key player matchup 1", "Key player matchup 2", "Key player matchup 3"],
      "aiPrediction": {
        "winner": "Team predicted to win",
        "confidence": 72,
        "explanation": "Detailed reasoning based on form, head to head, and conditions"
      }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return JSON.parse(stripFences(response.text || "{}"));
  } catch (error) {
    console.error("Error fetching match prediction:", error);
    return { error: "Could not fetch live prediction. Please refresh in a moment." };
  }
}

export async function getLatestNews() {
  try {
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Today is ${today}. List 5 IPL 2026 cricket news headlines.
      Return ONLY a valid JSON array, no markdown:
      [
        { "title": "News headline", "aiSummary": "One sentence summary.", "time": "Today" }
      ]`,
    });

    const data = JSON.parse(stripFences(response.text || "[]"));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return { error: "Could not fetch live news. Please refresh in a moment." };
  }
}
