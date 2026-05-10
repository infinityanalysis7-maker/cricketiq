import { NextResponse } from "next/server";
import { getLatestNews } from "@/lib/cricketData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const data = await getLatestNews();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
  }
}
