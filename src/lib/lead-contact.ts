import type { OrgData } from "@/lib/diagnostic-engine";

type LeadOrg = Partial<OrgData>;

function legacyContactParts(org: LeadOrg) {
  return (org.contact || "")
    .split("|")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getLeadContactName(org: LeadOrg) {
  return org.contactName?.trim() || "Sin nombre registrado";
}

export function getLeadEmail(org: LeadOrg) {
  return org.email?.trim() || legacyContactParts(org).find((value) => value.includes("@")) || "Sin correo registrado";
}

export function getLeadPhone(org: LeadOrg) {
  return org.phone?.trim() || legacyContactParts(org).find((value) => !value.includes("@")) || "Sin teléfono registrado";
}

export function getLeadContactSearchText(org: LeadOrg) {
  return [getLeadContactName(org), getLeadEmail(org), getLeadPhone(org)].join(" ");
}
