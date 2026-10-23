import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const db = readDB();
  const book = db.books.find((b) => b.id === params.id);
  if (!book) {
    return NextResponse.json({ error: "Book not found." }, { status: 404 });
  }
  return NextResponse.json({ book });
}

export async function PUT(req, { params }) {
  const db = readDB();
  const body = await req.json();
  const idx = db.books.findIndex((b) => b.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Book not found." }, { status: 404 });
  }
  const current = db.books[idx];
  const total = Math.max(0, parseInt(body.totalCopies, 10) || current.totalCopies);
  const borrowed = current.totalCopies - current.availableCopies;
  const available = Math.max(0, total - borrowed);

  db.books[idx] = {
    ...current,
    title: body.title ?? current.title,
    author: body.author ?? current.author,
    category: body.category ?? current.category,
    isbn: body.isbn ?? current.isbn,
    publisher: body.publisher ?? current.publisher,
    edition: body.edition ?? current.edition,
    shelf: body.shelf ?? current.shelf,
    description: body.description ?? current.description,
    totalCopies: total,
    availableCopies: available,
  };
  writeDB(db);
  return NextResponse.json({ book: db.books[idx] });
}

export async function DELETE(req, { params }) {
  const db = readDB();
  const idx = db.books.findIndex((b) => b.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Book not found." }, { status: 404 });
  }
  db.books.splice(idx, 1);
  writeDB(db);
  return NextResponse.json({ ok: true });
}