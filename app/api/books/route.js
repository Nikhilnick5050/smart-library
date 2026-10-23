import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const db = readDB();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const category = searchParams.get("category") || "";
  const availability = searchParams.get("availability") || "";

  let books = db.books;

  if (q) {
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.isbn || "").toLowerCase().includes(q)
    );
  }
  if (category) {
    books = books.filter((b) => b.category === category);
  }
  if (availability === "available") {
    books = books.filter((b) => b.availableCopies > 0);
  } else if (availability === "borrowed") {
    books = books.filter((b) => b.availableCopies < b.totalCopies);
  }

  return NextResponse.json({ books });
}

export async function POST(req) {
  const db = readDB();
  const body = await req.json();
  const { title, author, category, isbn, publisher, edition, shelf, totalCopies, description } =
    body || {};

  if (!title || !author || !category) {
    return NextResponse.json({ error: "Title, author and category are required." }, { status: 400 });
  }

  const total = Math.max(0, parseInt(totalCopies, 10) || 1);
  const book = {
    id: "book-" + Date.now(),
    title,
    author,
    category,
    isbn: isbn || "",
    publisher: publisher || "",
    edition: edition || "",
    shelf: shelf || "",
    totalCopies: total,
    availableCopies: total,
    description: description || "",
    addedAt: new Date().toISOString().slice(0, 10),
    isNew: true,
    borrowCount: 0,
  };
  db.books.unshift(book);
  writeDB(db);
  return NextResponse.json({ book }, { status: 201 });
}