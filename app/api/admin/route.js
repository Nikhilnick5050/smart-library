import { NextResponse } from "next/server";
import { getStats, getOverdue, getSettings, updateSettings } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [stats, settings, overdue] = await Promise.all([getStats(), getSettings(), getOverdue()]);
  return NextResponse.json({ stats, settings, overdue });
}

export async function PUT(req) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const settings = await updateSettings(body);
  return NextResponse.json({ settings });
}
