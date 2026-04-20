import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
const { type, name } = await req.json();

// 既存データ取得（共通化）
const { data } = await supabase
  .from("hotel_clicks")
  .select("*")
  .eq("name", name)
  .single();

if (type === "hotel") {
  if (data) {
    // クリック更新
    await supabase
      .from("hotel_clicks")
      .update({ count: (data.count || 0) + 1 })
      .eq("name", name);
  } else {
    // 新規
    await supabase
      .from("hotel_clicks")
      .insert([{ name, count: 1, impressions: 0 }]);
  }
}

if (type === "impression") {
  if (data) {
    // 👇ここ追加（表示回数）
    await supabase
      .from("hotel_clicks")
      .update({ impressions: (data.impressions || 0) + 1 })
      .eq("name", name);
  } else {
    // 新規
    await supabase
      .from("hotel_clicks")
      .insert([{ name, count: 0, impressions: 1 }]);
  }
}

return NextResponse.json({ status: "ok" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}