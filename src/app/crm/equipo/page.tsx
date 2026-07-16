import { CrmTeam } from "@/components/crm/crm-team";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getCrmUsers } from "@/lib/team-store";

export const dynamic = "force-dynamic";

export default async function CrmEquipoPage() {
  const session = await requireCrmSession("/crm/equipo");
  const users = await getCrmUsers();
  return <CrmTeam session={session} users={users} />;
}
