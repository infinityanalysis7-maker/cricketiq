"use server";

import { getLiveMatches, getMatchPredictionData, getLatestNews as getLiveNews } from "@/lib/cricketData";

export async function getTodayMatches() {
  try {
    return await getLiveMatches();
  } catch (error) {
    console.error("Error fetching today's matches:", error);
    return { error: "Fetching live data... please wait." };
  }
}

export async function getMatchPrediction(matchId: string) {
  try {
    return await getMatchPredictionData(matchId);
  } catch (error) {
    console.error("Error fetching match prediction:", error);
    // Returning error object for UI to handle with retry
    return { error: "Analyzing live data... please wait." };
  }
}

export async function getLatestNews() {
  try {
    return await getLiveNews();
  } catch (error) {
    console.error("Error fetching news:", error);
    return { error: "Searching for today's headlines... please wait." };
  }
}
