import { notFound } from "next/navigation";
import { LeadDetail } from "@/components/admin/lead-detail";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getLeadById } from "@/lib/lead-store";
import { getCrmUsers } from "@/lib/team-store";

export const dynamic = "force-dynamic";

export default async function CrmLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireCrmSession("/crm/leads");
  const { id } = await params;
  const [lead, users] = await Promise.all([getLeadById(id), getCrmUsers()]);

  if (!lead) notFound();

  return <LeadDetail lead={lead} session={session} users={users} />;
}
