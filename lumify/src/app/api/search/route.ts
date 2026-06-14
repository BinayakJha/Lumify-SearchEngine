import { NextRequest, NextResponse } from "next/server";
import { runSearch } from "@/lib/providers";

// Bonus public JSON endpoint: GET /api/search?q=... returns the raw, normalized
// results (no lens applied). Lenses are applied client-side so they stay
// shareable and instant. Useful for scripting or building your own front-end.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ error: "missing 'q' parameter" }, { status: 400 });
  }
  const outcome = await runSearch(q);
  return NextResponse.json(outcome);
}
