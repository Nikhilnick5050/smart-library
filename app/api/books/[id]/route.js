import { NextResponse } from "next/server";
import { getBook, updateBook, deleteBook } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const book = await getBook(params.id);
  if (!book) return NextResponse.json({ error: "Book not found." }, { status: 404 });
  return NextResponse.json({ book });
}

export async function PUT(req, { params }) {
  const body = await req.json();
  const book = await updateBook(params.id, body);
  if (!book) return NextResponse.json({ error: "Book not found." }, { status: 404 });
  return NextResponse.json({ book });
}

export async function DELETE(req, { params }) {
  await deleteBook(params.id);
  return NextResponse.json({ ok: true });
}
