import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getLeads } from "@/lib/lead-store";
import { getCrmUsers } from "@/lib/team-store";

export const dynamic = "force-dynamic";

export default async function CrmLeadsPage() {
  const session = await requireCrmSession("/crm/leads");
  const [leads, users] = await Promise.all([getLeads(), getCrmUsers()]);
  return <AdminDashboard leads={leads} session={session} users={users} />;
}
