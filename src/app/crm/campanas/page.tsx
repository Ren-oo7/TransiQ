import { CrmCampaigns } from "@/components/crm/crm-campaigns";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getLeads } from "@/lib/lead-store";

export const dynamic = "force-dynamic";

export default async function CrmCampanasPage() {
  const session = await requireCrmSession("/crm/campanas");
  const leads = await getLeads();

  return <CrmCampaigns leads={leads} session={session} />;
}
