import type { AdminRole } from "@/lib/admin-auth-types";
import { createUserRow, getUserRows, updateUserRow } from "@/lib/crm-db";

export type CrmUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  active: boolean;
};

function rowToUser(row: ReturnType<typeof getUserRows>[number]): CrmUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role as AdminRole,
    createdAt: row.created_at,
    active: row.active === 1,
  };
}

export async function getCrmUsers(): Promise<CrmUser[]> {
  return getUserRows().map(rowToUser);
}

export async function createCrmUser(input: { name: string; email: string; role: AdminRole; password: string }) {
  return rowToUser(createUserRow(input));
}

export async function updateCrmUser(id: string, input: { active?: boolean; role?: AdminRole; password?: string }) {
  const row = updateUserRow(id, input);
  return row ? rowToUser(row) : null;
}
