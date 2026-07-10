export type AdminRole = "Director" | "Comercial";

export type AdminSession = {
  email: string;
  name: string;
  role: AdminRole;
};
