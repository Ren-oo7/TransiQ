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

export type SavedLead = {
  id: string;
  createdAt: string;
  status: LeadStage;
  owner: string;
  notes: string;
  source: "Diagnostico publico";
  org: OrgData;
  answers: string[];
  diagnostic: Pick<DiagnosticState, "score" | "level" | "lead" | "duration" | "answered" | "total" | "recommendation" | "domainScores" | "gaps"> & {
    standardLabel: string;
    standardShort: string;
  };
};

export type CreateLeadInput = {
  org: OrgData;
  answers: string[];
  state: DiagnosticState;
};

export type UpdateLeadInput = {
  id: string;
  status?: LeadStage;
  owner?: string;
  notes?: string;
};
