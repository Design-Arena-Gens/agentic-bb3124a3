import { NextRequest, NextResponse } from "next/server";
import { generateCaptionAndHashtags } from "@/lib/generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, topic, tone } = body ?? {};
    if (!category || !topic) {
      return NextResponse.json({ error: "category and topic are required" }, { status: 400 });
    }
    const generated = generateCaptionAndHashtags({ category, topic, tone });
    return NextResponse.json(generated);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

