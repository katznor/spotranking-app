import { NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const log = {
      ...body,
      timestamp: new Date().toISOString(),
    };

    const path = "./data/clicks.json";

    let logs = [];

    if (fs.existsSync(path)) {
      logs = JSON.parse(fs.readFileSync(path, "utf-8"));
    }

    logs.push(log);

    fs.writeFileSync(path, JSON.stringify(logs, null, 2));

    return NextResponse.json({ status: "ok" });
  } catch (e) {
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}