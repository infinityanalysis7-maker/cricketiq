"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function getDailyIQTest() {
  try {
    const prompt = `
    Search for "IPL 2026 latest stats, match results, news, points table".
    Generate a Cricket IQ test with EXACTLY 10 multiple-choice questions.
    Questions MUST be exclusively about the current IPL 2026 season based on the real search results.
    Do not use generic historical trivia. Ask about recent IPL 2026 matches, specific player performances this season, and recent news.
    Return ONLY a JSON array of exactly 10 objects. Schema:
    [
      {
        "id": 1,
        "question": "Question text",
        "options": ["A", "B", "C", "D"],
        "correctAnswerIndex": 1,
        "explanation": "Why this is the answer"
      }
    ]
    Make sure there are EXACTLY 10 items in the array. Never invent fake data.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "[]");
    
    // Fallback if AI didn't return an array or it's empty
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid format from AI");
    }
    
    return data;
  } catch (error) {
    console.error("Error generating IQ test:", error);
    return { error: "Could not generate today's test. Please refresh." };
  }
}
