import "server-only";

import crypto from "node:crypto";
import type { AdminRole, AdminSession } from "@/lib/admin-auth-types";
import { isUsingDemoSeed, verifyUserCredentials } from "@/lib/crm-db";

export const authCookieName = "transiq_admin_session";

export type { AdminRole, AdminSession };

type SessionPayload = AdminSession & {
  iat: number;
};

function isDevelopmentMode() {
  return process.env.NODE_ENV !== "production";
}

export function isUsingDemoAuth() {
  return isUsingDemoSeed();
}

function getAuthSecret() {
  const configuredSecret = process.env.TRANSIQ_ADMIN_SECRET;
  if (configuredSecret) return configuredSecret;
  if (isDevelopmentMode()) return "transiq-demo-secret-2026";
  throw new Error("Falta TRANSIQ_ADMIN_SECRET para el acceso interno en produccion.");
}

function createSignature(payload: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(payload).digest("hex");
}

export function verifyAdminCredentials(email: string, password: string): AdminSession | null {
  return verifyUserCredentials(email, password);
}

export function canManageOwners(role: AdminRole) {
  return role === "Director";
}

export function canCloseLeads(role: AdminRole) {
  return role === "Director";
}

export function canEditLead(role: AdminRole) {
  return role === "Director" || role === "Comercial";
}

export function createSessionToken(session: AdminSession) {
  const payload: SessionPayload = {
    ...session,
    iat: Date.now(),
  };
  const serializedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createSignature(serializedPayload);
  return `${serializedPayload}.${signature}`;
}

export function readSessionToken(token?: string | null): AdminSession | null {
  if (!token) return null;

  const [serializedPayload, signature] = token.split(".");
  if (!serializedPayload || !signature) return null;
  if (createSignature(serializedPayload) !== signature) return null;

  try {
    const payload = JSON.parse(Buffer.from(serializedPayload, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.email || !payload.name || !payload.role) return null;

    return {
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 10,
  };
}

export function getLogoutCookieOptions() {
  return {
    ...getAuthCookieOptions(),
    maxAge: 0,
  };
}
