import { NextResponse } from "next/server";
import spots from "@/data/spots_new.json";

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

    // スコアリング（改善版）
    results = results.sort((a: any, b: any) => {
      const scoreA = calculateScore(a, vibe, late);
      const scoreB = calculateScore(b, vibe, late);
      return scoreB - scoreA;
    });

    // reason付与
    results = results.map((r: any) => ({
      ...r,
      reason: buildReason(r, vibe),
    }));

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
function buildReason(r: any, vibe: string) {
  let reasons: string[] = [];

  if (vibe && r.vibe.includes(vibe)) {
    reasons.push(`Perfect for ${vibe} vibe`);
  }

  if (r.openLate) {
    reasons.push("Open late");
  }

  if (r.foreignFriendly) {
    reasons.push("Easy for travelers");
  }

  if (r.rating > 4.3) {
    reasons.push("Highly rated");
  }

  return reasons.join(" • ");
}