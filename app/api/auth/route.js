import { NextResponse } from "next/server";
import { readDB, verifyPassword } from "@/lib/db";
import { setAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const db = readDB();
  const body = await req.json();
  const { email, password } = body || {};

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const admin = db.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  setAdminSession();
  return NextResponse.json({ ok: true, name: admin.name });
}