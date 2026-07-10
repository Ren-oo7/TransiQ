import { NextResponse } from "next/server";
import { authCookieName, getLogoutCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(authCookieName, "", getLogoutCookieOptions());
  return response;
}
