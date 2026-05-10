import { getDynamicIQTest } from "@/lib/cricketData";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function getDailyIQTest() {
  try {
    return await getDynamicIQTest();
  } catch (error) {
    console.error("Error generating IQ test:", error);
    // Return an error object that the UI can handle with a retry button
    return { error: "Searching for today's trivia... please wait." };
  }
}
