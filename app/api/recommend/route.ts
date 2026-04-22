import { NextResponse } from "next/server";
import spots from "@/data/spots_real.json";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { budget, vibe, late } = body;

    console.log("API called:", budget, vibe, late);

    let results = spots.filter((s: any) => {
      return (
        (!budget || s.price === budget) &&
        (!vibe || s.vibe.includes(vibe)) &&
        (!late || s.openLate)
      );
    });
    // 👇ここ追加（神ロジック）

if (results.length === 0) {
  console.log("Fallback triggered");
  results = spots.filter((s: any) => {
  return !budget || s.price === budget;
  });
}
// さらにダメなら
if (results.length === 0) {
  results = spots;
}

  // ② ソート（ここ！）

  results = results.sort((a: any, b: any) => {

    return calculateScore(b, vibe, late) - calculateScore(a, vibe, late);

  });

// スコアリング（改善版）

    // reason付与
    results = results.map((r: any, index: number) => ({
      ...r,
      reason: buildReason(r, vibe, index),
    }));



  // ④ slice（ここ！）
    return NextResponse.json(results.slice(0, 3));


   } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// ■ スコア計算（分離して強化しやすく）
function calculateScore(r: any, vibe: string, late: boolean) {
  let score = 0;

  score += r.rating * 1.0;

  if (vibe && r.vibe.includes(vibe)) {
    score += 1.2;
  }

  if (late && r.openLate) {
    score += 0.5;
  }

  if (r.foreignFriendly) {
    score += 0.3;
  }

  if (r.user_ratings_total) {
    score += Math.log(r.user_ratings_total) * 0.1;
  }

  return score;
}


// ■ 理由生成（UXの核）
function buildReason(r: any, vibe: string, index: number) {
  let reasons = [];

  if (index === 0) {
    reasons.push("🔥 Best overall choice");
  }

  if (index === 1) {
    reasons.push("🌙 Great for late night");
  }

  if (index === 2) {
    reasons.push("💰 Best value option");
  }

  if (r.rating > 4.5) {
    reasons.push("⭐ Top rated");
  }

  return reasons.join(" • ");
}
