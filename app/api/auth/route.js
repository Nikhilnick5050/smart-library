import { NextResponse } from "next/server";
import { getAdminByEmail, verifyPassword } from "@/lib/db";
import { setAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  const admin = await getAdminByEmail(email);
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  setAdminSession();
  return NextResponse.json({ ok: true, name: admin.name });
}
