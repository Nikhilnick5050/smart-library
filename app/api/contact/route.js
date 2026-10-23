import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Demo mode: messages are validated and stored in memory only.
// No email is actually sent (clearly labelled in the UI).
export async function POST(req) {
  const body = await req.json();
  const { name, email, subject, message } = body || {};

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, demo: true });
}