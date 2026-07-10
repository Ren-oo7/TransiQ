import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authCookieName, readSessionToken, type AdminSession } from "@/lib/admin-auth";

export async function requireCrmSession(nextPath: string): Promise<AdminSession> {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(authCookieName)?.value);

  if (!session) {
    redirect(`/crm/login?next=${encodeURIComponent(nextPath)}&area=crm`);
  }

  return session;
}
