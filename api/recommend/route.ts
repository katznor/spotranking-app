import { NextResponse } from "next/server";
import spots from "@/data/spots.json";

export async function POST(req: Request) {
  const { budget, vibe, late } = await req.json();

  let results = spots.filter((s: any) => {
    return (
      (!budget || s.price === budget) &&
      (!vibe || s.vibe.includes(vibe)) &&
      (!late || s.openLate)
    );
  });

  // スコアリング（重要）
  results = results.sort((a: any, b: any) => {
    const scoreA =
      a.rating +
      (a.vibe.includes(vibe) ? 1 : 0) +
      (a.openLate ? 0.3 : 0);

    const scoreB =
      b.rating +
      (b.vibe.includes(vibe) ? 1 : 0) +
      (b.openLate ? 0.3 : 0);

    return scoreB - scoreA;
  });

  // 理由を強化
  results = results.map((r: any) => ({
    ...r,
    reason: buildReason(r, vibe),
  }));

  return NextResponse.json(results.slice(0, 3));
}


// 理由生成関数（ここが地味に重要）
function buildReason(r: any, vibe: string) {
  let reasons = [];

  if (r.vibe.includes(vibe)) {
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