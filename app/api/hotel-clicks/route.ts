import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("hotel_clicks")
    .select("*");

  const result: Record<string, number> = {};

  data?.forEach((row) => {
    result[row.name] = row.count;
  });

  return NextResponse.json(result);
}