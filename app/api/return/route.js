import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const db = readDB();
  const body = await req.json();
  const { recordId } = body || {};

  const record = db.borrows.find((r) => r.id === recordId);
  if (!record) return NextResponse.json({ error: "Record not found." }, { status: 404 });
  if (record.status === "returned") {
    return NextResponse.json({ error: "Book already returned." }, { status: 400 });
  }

  const today = new Date();
  const due = new Date(record.dueDate);
  const daysLate = Math.max(0, Math.floor((today - due) / (1000 * 60 * 60 * 24)));
  const fine = daysLate * db.settings.finePerDay;

  record.status = "returned";
  record.returnDate = today.toISOString().slice(0, 10);
  record.fine = fine;

  const book = db.books.find((b) => b.id === record.bookId);
  if (book) {
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
  }

  writeDB(db);
  return NextResponse.json({ record, fine });
}