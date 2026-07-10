import { CrmOverview } from "@/components/crm/crm-overview";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getLeads } from "@/lib/lead-store";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const session = await requireCrmSession("/crm");
  const leads = await getLeads();
  return <CrmOverview leads={leads} session={session} />;
}
