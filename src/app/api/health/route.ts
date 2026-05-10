import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    return NextResponse.json({ 
      status: "ERROR", 
      problem: "GEMINI_API_KEY environment variable is NOT set in Vercel.",
      fix: "Go to Vercel Dashboard → Settings → Environment Variables → Add GEMINI_API_KEY"
    });
  }

  // Test a minimal Gemini call without googleSearch
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Say 'OK' and nothing else.",
    });
    return NextResponse.json({ 
      status: "OK", 
      keyPrefix: key.substring(0, 8) + "...",
      geminiResponse: response.text?.trim(),
      message: "API key is valid and Gemini is working!"
    });
  } catch (err: any) {
    return NextResponse.json({ 
      status: "ERROR",
      problem: err?.message || String(err),
      keyPrefix: key.substring(0, 8) + "...",
      fix: "The API key is set but Gemini returned an error. See 'problem' field above."
    });
  }
}
