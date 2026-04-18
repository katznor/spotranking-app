import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, name } = body;

    // ===== 通常ログ =====
    const logPath = path.join(process.cwd(), "data", "clicks.json");

    let logs: any[] = [];

    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, "utf-8"));
    }

    logs.push({
      ...body,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

    // ===== ホテルクリック（ここ重要）=====
    if (type === "hotel") {
      const hotelPath = path.join(
        process.cwd(),
        "data",
        "hotel_clicks.json"
      );

      let hotelData: Record<string, number> = {};

      if (fs.existsSync(hotelPath)) {
        hotelData = JSON.parse(fs.readFileSync(hotelPath, "utf-8"));
      }

      hotelData[name] = (hotelData[name] || 0) + 1;

      fs.writeFileSync(hotelPath, JSON.stringify(hotelData, null, 2));
    }

    return NextResponse.json({ status: "ok" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}