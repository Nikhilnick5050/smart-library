import { NextResponse } from "next/server";
import { createBorrow } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();
  const { bookId, studentId } = body || {};
  if (!bookId || !studentId) {
    return NextResponse.json({ error: "Book and student are required." }, { status: 400 });
  }
  const result = await createBorrow(bookId, studentId);
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
  return NextResponse.json({ record: result.record, book: result.book }, { status: 201 });
}
