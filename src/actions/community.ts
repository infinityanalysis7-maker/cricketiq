"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function checkToxicity(content: string) {
  try {
    const prompt = `
    Analyze this cricket fan's comment for extreme toxicity or abusive language:
    "${content}"
    
    Return a JSON object:
    {
      "isToxic": boolean,
      "warningMessage": "string or null"
    }
    
    Note: Standard banter (like "RCB always chokes", "CSK are dad's army") is NOT toxic. 
    Only flag actual hate speech, profanity, or extreme personal abuse.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || '{"isToxic": false}');
  } catch (error) {
    console.error("Error checking toxicity:", error);
    return { isToxic: false, warningMessage: null };
  }
}

// Simulated Database fetch for posts
export async function getDebatePosts(matchId: string) {
  return [
    {
      id: "1",
      user: { name: "ThalaFan99", team: "CSK", avatar: "🦁" },
      content: "MI doesn't stand a chance against Pathirana today. It's game over before the toss.",
      upvotes: 245,
      downvotes: 12,
      time: "2m ago",
      isHottest: true
    },
    {
      id: "2",
      user: { name: "HitmanRo", team: "MI", avatar: "🌪️" },
      content: "Bumrah is going to dismantle the CSK top order. Remember 2019?",
      upvotes: 189,
      downvotes: 45,
      time: "5m ago",
      isHottest: false
    },
    {
      id: "3",
      user: { name: "CricketNerd", team: "NEUTRAL", avatar: "🤓" },
      content: "Pitch report suggests spin will play a massive role in the 2nd innings. Chasing will be tough.",
      upvotes: 88,
      downvotes: 2,
      time: "12m ago",
      isHottest: false
    }
  ];
}
