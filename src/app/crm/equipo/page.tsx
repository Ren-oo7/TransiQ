import { CrmTeam } from "@/components/crm/crm-team";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getLeads } from "@/lib/lead-store";
import { getCrmUsers } from "@/lib/team-store";

export const dynamic = "force-dynamic";

export default async function CrmEquipoPage() {
  const session = await requireCrmSession("/crm/equipo");
  const [leads, users] = await Promise.all([getLeads(), getCrmUsers()]);

  return <CrmTeam leads={leads} session={session} users={users} />;
}
