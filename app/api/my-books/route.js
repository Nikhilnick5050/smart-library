import { NextResponse } from "next/server";
import { getBorrowsForStudent } from "@/lib/db";

export const dynamic = "force-dynamic";

// Demo: returns the sample student's borrow records with book titles joined in.
export async function GET() {
  const records = await getBorrowsForStudent("stu-1");
  return NextResponse.json({ records });
}
