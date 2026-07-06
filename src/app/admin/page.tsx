import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { authCookieName, readSessionToken } from "@/lib/admin-auth";
import { getLeads } from "@/lib/lead-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(authCookieName)?.value);

  if (!session) {
    redirect("/login?next=/admin&area=crm");
  }

  const leads = await getLeads();
  return <AdminDashboard leads={leads} session={session} />;
}
