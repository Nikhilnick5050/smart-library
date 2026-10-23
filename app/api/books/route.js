import { NextResponse } from "next/server";
import { getBooks, createBook } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const category = searchParams.get("category") || "";
  const availability = searchParams.get("availability") || "";
  const books = await getBooks({ q, category, availability });
  return NextResponse.json({ books });
}

export async function POST(req) {
  const body = await req.json();
  const { title, author, category } = body || {};
  if (!title || !author || !category) {
    return NextResponse.json({ error: "Title, author and category are required." }, { status: 400 });
  }
  const book = await createBook(body);
  return NextResponse.json({ book }, { status: 201 });
}
