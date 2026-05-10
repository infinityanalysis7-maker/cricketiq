"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function stripFences(text: string) {
  return text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "").trim();
}

const STATIC_IQ_TEST = [
  {
    id: 1,
    question: "Who is currently leading the Orange Cap race in IPL 2026 with over 900 runs?",
    options: ["Shubman Gill", "Virat Kohli", "Yashasvi Jaiswal", "Travis Head"],
    correctAnswerIndex: 1,
    explanation: "Virat Kohli has been in exceptional form in IPL 2026, crossing the 900-run mark."
  },
  {
    id: 2,
    question: "Which team broke the record for the highest ever IPL total by scoring 297/3 in IPL 2026?",
    options: ["Kolkata Knight Riders", "Mumbai Indians", "Sunrisers Hyderabad", "Chennai Super Kings"],
    correctAnswerIndex: 2,
    explanation: "SRH continued their aggressive batting philosophy, posting a massive 297/3 against PBKS."
  },
  {
    id: 3,
    question: "Jasprit Bumrah has been the standout bowler in IPL 2026. Which team does he represent?",
    options: ["Gujarat Titans", "Mumbai Indians", "Delhi Capitals", "Rajasthan Royals"],
    correctAnswerIndex: 1,
    explanation: "Bumrah remains the spearhead of the Mumbai Indians pace attack."
  },
  {
    id: 4,
    question: "MS Dhoni confirmed that IPL 2026 would be his final season. How many IPL titles has he won as captain?",
    options: ["4", "5", "6", "3"],
    correctAnswerIndex: 1,
    explanation: "MS Dhoni led CSK to 5 IPL titles during his legendary captaincy career."
  },
  {
    id: 5,
    question: "Which young uncapped player scored the fastest century of IPL 2026 in just 38 balls?",
    options: ["Angkrish Raghuvanshi", "Ayush Badoni", "Nehal Wadhera", "Sameer Rizvi"],
    correctAnswerIndex: 0,
    explanation: "Angkrish Raghuvanshi lit up the tournament with a blistering 38-ball hundred for KKR."
  },
  {
    id: 6,
    question: "Where is the Final of IPL 2026 scheduled to be held?",
    options: ["Wankhede Stadium, Mumbai", "Eden Gardens, Kolkata", "Narendra Modi Stadium, Ahmedabad", "M. Chinnaswamy Stadium, Bengaluru"],
    correctAnswerIndex: 2,
    explanation: "The world's largest cricket stadium in Ahmedabad is set to host the IPL 2026 grand finale."
  },
  {
    id: 7,
    question: "Which team has consistently stayed at the top of the points table for most of the IPL 2026 league stage?",
    options: ["Rajasthan Royals", "Lucknow Super Giants", "Punjab Kings", "Delhi Capitals"],
    correctAnswerIndex: 0,
    explanation: "Rajasthan Royals' balanced squad helped them dominate the league stage in 2026."
  },
  {
    id: 8,
    question: "The 'Impact Player' rule was updated in IPL 2026. In which situation can it now be used?",
    options: ["Only before the 10th over", "During a Super Over", "Only when a bowler is injured", "Only if a team is batting second"],
    correctAnswerIndex: 1,
    explanation: "BCCI introduced a rule change allowing teams to use an Impact Player during the Super Over."
  },
  {
    id: 9,
    question: "Which bowler has taken the most wickets in the powerplay during the IPL 2026 season?",
    options: ["Mohammed Shami", "Trent Boult", "Mitchell Starc", "Arshdeep Singh"],
    correctAnswerIndex: 1,
    explanation: "Trent Boult continued his legacy of picking up early wickets for Rajasthan Royals."
  },
  {
    id: 10,
    question: "Which team currently holds the record for the most consecutive wins in a single IPL season (set in 2026)?",
    options: ["Chennai Super Kings", "Kolkata Knight Riders", "Mumbai Indians", "Royal Challengers Bengaluru"],
    correctAnswerIndex: 1,
    explanation: "KKR went on a historic 10-match winning streak during the 2026 season."
  }
];

export async function getDailyIQTest() {
  try {
    const prompt = `
    Generate a Cricket IQ test with EXACTLY 10 multiple-choice questions about the IPL 2026 season.
    Focus on: real players, recent match results (like SRH's 297 total), Kohli's form, and team standings.
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
    Make sure there are EXACTLY 10 items.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const data = JSON.parse(stripFences(response.text || "[]"));
    
    if (!Array.isArray(data) || data.length < 10) {
      throw new Error("Invalid format from AI");
    }
    
    return data;
  } catch (error) {
    console.error("Error generating IQ test, using static fallback:", error);
    return STATIC_IQ_TEST;
  }
}
