import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

// Demo: returns the sample student's borrow records with book titles joined in.
export async function GET() {
  const db = readDB();
  const records = db.borrows
    .filter((r) => r.studentId === "stu-1")
    .map((r) => {
      const book = db.books.find((b) => b.id === r.bookId);
      return {
        ...r,
        bookTitle: book ? book.title : "Unknown book",
        bookAuthor: book ? book.author : "",
      };
    });
  return NextResponse.json({ records });
}