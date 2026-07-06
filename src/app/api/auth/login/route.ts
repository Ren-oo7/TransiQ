import { NextResponse } from "next/server";
import {
  authCookieName,
  createSessionToken,
  getAuthCookieOptions,
  isUsingDemoAuth,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const session = verifyAdminCredentials(email, password);
    if (!session) {
      return NextResponse.json(
        {
          error: isUsingDemoAuth()
            ? "Credenciales invalidas para el CRM interno demo."
            : "Credenciales invalidas para el CRM interno.",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true, session });
    response.cookies.set(authCookieName, createSessionToken(session), getAuthCookieOptions());
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible iniciar sesion.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
