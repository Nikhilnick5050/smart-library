import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const db = readDB();
  const body = await req.json();
  const { bookId, studentId } = body || {};

  if (!bookId || !studentId) {
    return NextResponse.json({ error: "Book and student are required." }, { status: 400 });
  }

  const book = db.books.find((b) => b.id === bookId);
  const student = db.students.find((s) => s.id === studentId);
  if (!book) return NextResponse.json({ error: "Book not found." }, { status: 404 });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  if (book.availableCopies <= 0) {
    return NextResponse.json({ error: "No copies available to borrow." }, { status: 400 });
  }

  const active = db.borrows.filter(
    (r) => r.studentId === studentId && r.status === "borrowed"
  );
  if (active.length >= db.settings.borrowLimit) {
    return NextResponse.json(
      { error: `Borrow limit reached (max ${db.settings.borrowLimit} books).` },
      { status: 400 }
    );
  }

  const now = new Date();
  const due = new Date(now);
  due.setDate(due.getDate() + db.settings.loanPeriodDays);

  const record = {
    id: "borrow-" + Date.now(),
    studentId,
    bookId,
    borrowDate: now.toISOString().slice(0, 10),
    dueDate: due.toISOString().slice(0, 10),
    returnDate: null,
    fine: 0,
    status: "borrowed",
  };

  book.availableCopies -= 1;
  book.borrowCount = (book.borrowCount || 0) + 1;
  db.borrows.unshift(record);
  writeDB(db);

  return NextResponse.json({ record, book }, { status: 201 });
}