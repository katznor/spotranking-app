import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("hotel_clicks")
    .select("*");

  const resultClicks: Record<string, number> = {};
  const resultImpressions: Record<string, number> = {};

  data?.forEach((row) => {
    resultClicks[row.name] = row.count;
    resultImpressions[row.name] = row.impressions;
  });

  return NextResponse.json({
    clicks: resultClicks,
    impressions: resultImpressions,
  });
}