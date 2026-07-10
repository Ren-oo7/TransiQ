import { CrmActivity } from "@/components/crm/crm-activity";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getLeads } from "@/lib/lead-store";

export const dynamic = "force-dynamic";

export default async function CrmActividadPage() {
  const session = await requireCrmSession("/crm/actividad");
  const leads = await getLeads();

  return <CrmActivity leads={leads} session={session} />;
}
