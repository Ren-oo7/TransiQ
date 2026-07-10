import { CrmPipeline } from "@/components/crm/crm-pipeline";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getLeads } from "@/lib/lead-store";
import { getCrmUsers } from "@/lib/team-store";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function CrmPipelinePage() {
  const session = await requireCrmSession("/crm/pipeline");
  const [leads, users] = await Promise.all([getLeads(), getCrmUsers()]);
  return (
    <div className={styles.fullBleed}>
      <CrmPipeline leads={leads} session={session} users={users} />
    </div>
  );
}
