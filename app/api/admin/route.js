import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = readDB();
  const today = new Date().toISOString().slice(0, 10);

  const overdue = db.borrows.filter(
    (r) => r.status === "borrowed" && r.dueDate < today
  );

  const stats = {
    totalBooks: db.books.length,
    totalStudents: db.students.length,
    borrowed: db.borrows.filter((r) => r.status === "borrowed").length,
    overdue: overdue.length,
    totalCopies: db.books.reduce((s, b) => s + b.totalCopies, 0),
    availableCopies: db.books.reduce((s, b) => s + b.availableCopies, 0),
  };

  return NextResponse.json({ stats, settings: db.settings, overdue });
}

export async function PUT(req) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = readDB();
  const body = await req.json();
  db.settings = {
    finePerDay: Math.max(0, Number(body.finePerDay) || 0),
    loanPeriodDays: Math.max(1, Number(body.loanPeriodDays) || 14),
    borrowLimit: Math.max(1, Number(body.borrowLimit) || 3),
  };
  writeDB(db);
  return NextResponse.json({ settings: db.settings });
}