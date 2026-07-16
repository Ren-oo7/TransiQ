import { CrmReports } from "@/components/crm/crm-reports";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getLeads } from "@/lib/lead-store";

export const dynamic = "force-dynamic";

export default async function CrmReportesPage({
  searchParams,
}: {
  searchParams: Promise<{ comercial?: string | string[] }>;
}) {
  const session = await requireCrmSession("/crm/reportes");
  const leads = await getLeads();
  const requestedOwner = (await searchParams).comercial;
  const ownerParam = Array.isArray(requestedOwner) ? requestedOwner[0] : requestedOwner;
  const selectedOwner = ownerParam && leads.some((lead) => lead.owner === ownerParam) ? ownerParam : "";

  return <CrmReports leads={leads} session={session} selectedOwner={selectedOwner} />;
}
