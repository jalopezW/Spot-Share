import { NextResponse } from "next/server";
import { z } from "zod";
import { modelExists } from "@/lib/vehicles";

const Q = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1886),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = Q.safeParse({
    make: searchParams.get("make"),
    model: searchParams.get("model"),
    year: searchParams.get("year"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { make, model, year } = parsed.data;
  const exists = await modelExists(make, model, year);
  return NextResponse.json({ ok: true, make, model, year, exists });
}
