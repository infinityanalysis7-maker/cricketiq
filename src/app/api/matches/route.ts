import { NextResponse } from "next/server";
import { getLiveMatches } from "@/lib/cricketData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getLiveMatches();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route Error (Matches):", error);
    return NextResponse.json(
      { error: "Fetching live data... please wait", retryIn: 10 },
      { status: 503 }
    );
  }
}
