import { type DiagnosticState, type OrgData } from "@/lib/diagnostic-engine";

export const pipelineStages = [
  "Nuevo",
  "Contactado",
  "Diagnostico revisado",
  "Demo agendada",
  "Propuesta enviada",
  "Cerrado",
] as const;

export type LeadStage = (typeof pipelineStages)[number];

export const leadPriorities = ["Alta", "Media", "Baja"] as const;

export type LeadPriority = (typeof leadPriorities)[number];

const stageLabels: Record<LeadStage, string> = {
  Nuevo: "Nuevo",
  Contactado: "Contactado",
  "Diagnostico revisado": "Diagnóstico revisado",
  "Demo agendada": "Demo agendada",
  "Propuesta enviada": "Propuesta enviada",
  Cerrado: "Cerrado",
};

export function formatLeadStage(stage: LeadStage) {
  return stageLabels[stage];
}

export function formatLeadPriority(priority: LeadPriority) {
  return priority;
}

export type LeadHistoryKind =
  | "created"
  | "status_changed"
  | "owner_changed"
  | "notes_updated"
  | "priority_updated"
  | "follow_up_updated"
  | "loss_reason_updated";

export type LeadHistoryEntry = {
  id: string;
  leadId: string;
  kind: LeadHistoryKind;
  message: string;
  createdAt: string;
  actorName: string;
  actorRole: string;
};

export type SavedLead = {
  id: string;
  createdAt: string;
  status: LeadStage;
  priority: LeadPriority;
  owner: string;
  notes: string;
  nextFollowUpAt: string;
  lossReason: string;
  source: string;
  org: OrgData;
  answers: string[];
  diagnostic: Pick<DiagnosticState, "score" | "level" | "lead" | "duration" | "answered" | "total" | "recommendation" | "domainScores" | "gaps"> & {
    standardLabel: string;
    standardShort: string;
  };
  history: LeadHistoryEntry[];
};

export type CreateLeadInput = {
  org: OrgData;
  answers: string[];
  state: DiagnosticState;
  source?: string;
  notes?: string;
};

export type UpdateLeadInput = {
  id: string;
  status?: LeadStage;
  priority?: LeadPriority;
  owner?: string;
  notes?: string;
  nextFollowUpAt?: string;
  lossReason?: string;
  actor?: {
    name: string;
    role: string;
  };
};
