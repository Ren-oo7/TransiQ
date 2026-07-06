import { pipelineStages, type CreateLeadInput, type LeadStage, type SavedLead, type UpdateLeadInput } from "@/lib/lead-types";
import { findLeadRow, getLeadRows, insertLead, rowToLead, updateLeadRow } from "@/lib/crm-db";

export async function getLeads() {
  return getLeadRows().map(rowToLead);
}

export async function createLead(input: CreateLeadInput) {
  const lead: SavedLead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "Nuevo",
    owner: "Sin asignar",
    notes: "",
    source: "Diagnostico publico",
    org: input.org,
    answers: input.answers,
    diagnostic: {
      standardLabel: input.state.standard.label,
      standardShort: input.state.standard.short,
      score: input.state.score,
      level: input.state.level,
      lead: input.state.lead,
      duration: input.state.duration,
      answered: input.state.answered,
      total: input.state.total,
      recommendation: input.state.recommendation,
      domainScores: input.state.domainScores,
      gaps: input.state.gaps,
    },
  };

  insertLead(lead);
  return lead;
}

export async function updateLead(input: UpdateLeadInput) {
  const row = findLeadRow(input.id);
  if (!row) return null;

  const current = rowToLead(row);
  const next: SavedLead = {
    ...current,
    status: input.status && pipelineStages.includes(input.status as LeadStage) ? input.status : current.status,
    owner: typeof input.owner === "string" && input.owner.trim() ? input.owner.trim() : current.owner,
    notes: typeof input.notes === "string" ? input.notes : current.notes,
  };

  updateLeadRow(next);
  return next;
}
