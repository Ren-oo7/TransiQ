import { NextResponse, type NextRequest } from "next/server";
import { authCookieName, readSessionToken } from "@/lib/admin-auth";
import type { AdminRole } from "@/lib/admin-auth-types";
import { createCrmUser, getCrmUsers, updateCrmUser } from "@/lib/team-store";

function getDirector(request: NextRequest) {
  const session = readSessionToken(request.cookies.get(authCookieName)?.value);
  return session?.role === "Director" ? session : null;
}

export async function POST(request: NextRequest) {
  if (!getDirector(request)) return NextResponse.json({ error: "Solo Dirección puede administrar usuarios." }, { status: 403 });
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role: AdminRole = body.role === "Director" ? "Director" : "Comercial";
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Captura nombre y correo válidos." }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    if ((await getCrmUsers()).some((user) => user.email === email)) return NextResponse.json({ error: "Ese correo ya está registrado." }, { status: 409 });
    return NextResponse.json({ user: await createCrmUser({ name, email, role, password }) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No fue posible crear el usuario." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = getDirector(request);
  if (!session) return NextResponse.json({ error: "Solo Dirección puede administrar usuarios." }, { status: 403 });
  try {
    const body = await request.json();
    const users = await getCrmUsers();
    const current = users.find((user) => user.id === body.id);
    if (!current) return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    if (current.email === session.email && (body.active === false || body.role === "Comercial")) {
      return NextResponse.json({ error: "No puedes desactivar tu propia sesión ni quitarte el rol Director." }, { status: 400 });
    }
    if (body.active === false || body.role === "Comercial") {
      const otherDirectors = users.filter((user) => user.id !== current.id && user.active && user.role === "Director");
      if (current.role === "Director" && !otherDirectors.length) return NextResponse.json({ error: "Debe permanecer al menos un Director activo." }, { status: 400 });
    }
    const password = typeof body.password === "string" && body.password ? body.password : undefined;
    if (password && password.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    const role = body.role === "Director" || body.role === "Comercial" ? body.role : undefined;
    const active = typeof body.active === "boolean" ? body.active : undefined;
    return NextResponse.json({ user: await updateCrmUser(current.id, { password, role, active }) });
  } catch {
    return NextResponse.json({ error: "No fue posible actualizar el usuario." }, { status: 500 });
  }
}
