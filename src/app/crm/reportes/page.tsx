import { CrmReports } from "@/components/crm/crm-reports";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getLeads } from "@/lib/lead-store";

export const dynamic = "force-dynamic";

export default async function CrmReportesPage() {
  const session = await requireCrmSession("/crm/reportes");
  const leads = await getLeads();

  return <CrmReports leads={leads} session={session} />;
}
