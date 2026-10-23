import { NextResponse } from "next/server";
import { returnBorrow } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();
  const { recordId } = body || {};
  if (!recordId) return NextResponse.json({ error: "Record is required." }, { status: 400 });
  const result = await returnBorrow(recordId);
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
  return NextResponse.json({ record: result.record, fine: result.fine });
}
