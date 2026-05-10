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

function getSimulatedPrediction(matchId: string) {
  const teams = matchId.split("-vs-").map(t => t.toUpperCase());
  const homeTeam = teams[0] || "TEAM A";
  const awayTeam = teams[1] || "TEAM B";
  
  // Deterministic but "random-looking" confidence
  const confidence = 60 + (matchId.length % 25);
  const winner = matchId.length % 2 === 0 ? homeTeam : awayTeam;

  return {
    matchId,
    headToHead: `${homeTeam} and ${awayTeam} have shared a intense rivalry in the IPL. Historically, matches at this venue have been high-scoring thrillers.`,
    currentForm: {
      homeTeam: "W L W W L",
      awayTeam: "L W W L W"
    },
    pitchReport: "The surface appears to be a balanced track with some initial assistance for swing bowlers, settled to become a batter's paradise as the game progresses.",
    weather: "Clear skies with a slight evening breeze. Humidity around 65%.",
    keyMatchups: [
      `Opening Batters vs Powerplay Bowlers`,
      `Middle Order vs Spin Duo`,
      `Death Over Finishers vs Yorkers`
    ],
    aiPrediction: {
      winner,
      confidence,
      explanation: `Analysis of recent IPL 2026 data suggests ${winner} have a slight edge due to their superior death bowling and current batting depth. Expect a closely fought battle.`
    },
    isSimulated: true
  };
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
    console.error("Error fetching match prediction, using simulation:", error);
    return getSimulatedPrediction(matchId);
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
