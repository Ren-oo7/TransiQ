import type { AdminRole } from "@/lib/admin-auth-types";
import { getUserRows } from "@/lib/crm-db";

export type CrmUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
};

export async function getCrmUsers(): Promise<CrmUser[]> {
  return getUserRows().map((row) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role as AdminRole,
    createdAt: row.created_at,
  }));
}
