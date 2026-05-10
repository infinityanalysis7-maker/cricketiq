import { NextResponse } from "next/server";
import { getLatestNews } from "@/lib/cricketData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getLatestNews();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route Error (News):", error);
    return NextResponse.json(
      { error: "Fetching live news... please wait", retryIn: 10 },
      { status: 503 }
    );
  }
}
