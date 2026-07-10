import { CrmConfiguration } from "@/components/crm/crm-configuration";
import { isUsingDemoAuth } from "@/lib/admin-auth";
import { requireCrmSession } from "@/lib/crm-page-auth";
import { getTransiqAppLoginUrl } from "@/lib/site-config";
import { getCrmUsers } from "@/lib/team-store";

export const dynamic = "force-dynamic";

export default async function CrmConfiguracionPage() {
  const session = await requireCrmSession("/crm/configuracion");
  const users = await getCrmUsers();
  const appLoginUrl = getTransiqAppLoginUrl();

  const config = {
    appLoginUrl,
    hasExternalAppUrl: appLoginUrl !== "/login",
    demoMode: isUsingDemoAuth(),
    hasCustomAuthSecret: Boolean(process.env.TRANSIQ_ADMIN_SECRET?.trim()),
    hasCustomDirectorSeed: Boolean(process.env.TRANSIQ_DIRECTOR_EMAIL?.trim()),
    hasCustomCommercialSeed: Boolean(process.env.TRANSIQ_COMERCIAL_EMAIL?.trim()),
  };

  return <CrmConfiguration session={session} users={users} config={config} />;
}
