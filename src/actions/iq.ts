"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function getDailyIQTest() {
  try {
    const prompt = `
    Generate a Cricket IQ test with 10 multiple-choice questions.
    Mix these categories: Current IPL, Historical cricket trivia, Player stats, and Rules.
    Return ONLY a JSON array of objects. Schema:
    [
      {
        "id": 1,
        "question": "Question text",
        "options": ["A", "B", "C", "D"],
        "correctAnswerIndex": 1,
        "explanation": "Why this is the answer"
      }
    ]
    Make the questions challenging (only true fans would know the hard ones).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating IQ test:", error);
    // Fallback static questions
    return [
      {
        id: 1,
        question: "Who holds the record for the most runs in a single IPL season?",
        options: ["Virat Kohli", "Chris Gayle", "David Warner", "Jos Buttler"],
        correctAnswerIndex: 0,
        explanation: "Virat Kohli scored 973 runs in the 2016 IPL season."
      },
      {
        id: 2,
        question: "Which team has never won an IPL trophy?",
        options: ["Rajasthan Royals", "Deccan Chargers", "Royal Challengers Bangalore", "Sunrisers Hyderabad"],
        correctAnswerIndex: 2,
        explanation: "RCB has reached the finals 3 times but never won the trophy."
      },
      // Adding a third fallback just so it works
      {
        id: 3,
        question: "What is the maximum number of foreign players allowed in an IPL playing XI?",
        options: ["3", "4", "5", "6"],
        correctAnswerIndex: 1,
        explanation: "A team can have a maximum of 4 overseas players in their playing XI."
      }
    ];
  }
}
