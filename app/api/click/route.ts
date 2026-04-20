import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { type, name } = await req.json();

    if (type === "hotel") {
      // 既存チェック
      const { data } = await supabase
        .from("hotel_clicks")
        .select("*")
        .eq("name", name)
        .single();

      if (data) {
        // 更新
        await supabase
          .from("hotel_clicks")
          .update({ count: data.count + 1 })
          .eq("name", name);
      } else {
        // 新規
        await supabase
          .from("hotel_clicks")
          .insert([{ name, count: 1 }]);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}