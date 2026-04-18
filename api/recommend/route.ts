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

  results = results.sort((a: any, b: any) => b.rating - a.rating);

  return NextResponse.json(results.slice(0, 3));
}