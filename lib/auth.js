// Lightweight session helper for the librarian (demo mode).
// A real deployment would use signed JWT cookies or a session store.

import { cookies } from "next/headers";

const COOKIE = "sl_admin";

export function setAdminSession() {
  cookies().set(COOKIE, "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminSession() {
  cookies().delete(COOKIE);
}

export function isAdmin() {
  return cookies().get(COOKIE)?.value === "true";
}