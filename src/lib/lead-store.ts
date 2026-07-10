import { leadPriorities, pipelineStages, type CreateLeadInput, type LeadHistoryEntry, type LeadPriority, type LeadStage, type SavedLead, type UpdateLeadInput } from "@/lib/lead-types";
import { findLeadRow, getLeadHistoryRows, getLeadRows, insertLead, insertLeadHistoryEntry, rowToLead, rowToLeadHistoryEntry, updateLeadRow } from "@/lib/crm-db";

function deriveLeadPriority(input: CreateLeadInput): LeadPriority {
  if (input.org.urgency === "critica" || input.org.urgency === "alta" || input.state.lead.score >= 75) return "Alta";
  if (input.state.lead.score >= 50) return "Media";
  return "Baja";
}

function getInitialFollowUpDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toISOString().slice(0, 10);
}

export async function getLeads() {
  const leadRows = getLeadRows();
  const historyRows = getLeadHistoryRows(leadRows.map((row) => row.id));
  const historyByLead = new Map<string, LeadHistoryEntry[]>();

  historyRows.map(rowToLeadHistoryEntry).forEach((entry) => {
    const current = historyByLead.get(entry.leadId) ?? [];
    current.push(entry);
    historyByLead.set(entry.leadId, current);
  });

  return leadRows.map((row) => rowToLead(row, historyByLead.get(row.id) ?? []));
}

export async function getLeadById(id: string) {
  const row = findLeadRow(id);
  if (!row) return null;
  return rowToLead(row, getLeadHistoryRows([id]).map(rowToLeadHistoryEntry));
}

export async function createLead(input: CreateLeadInput) {
  const lead: SavedLead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "Nuevo",
    priority: deriveLeadPriority(input),
    owner: "Sin asignar",
    notes: input.notes?.trim() ?? "",
    nextFollowUpAt: getInitialFollowUpDate(),
    lossReason: "",
    source: input.source || "Diagnóstico público",
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
    history: [],
  };

  insertLead(lead);
  const createdEntry: LeadHistoryEntry = {
    id: crypto.randomUUID(),
    leadId: lead.id,
    kind: "created",
    createdAt: new Date().toISOString(),
    actorName: "Sistema",
    actorRole: "Captación web",
    message: `Lead captado desde ${lead.source} para ${lead.diagnostic.standardLabel}.`,
  };

  insertLeadHistoryEntry(createdEntry);

  if (lead.notes.trim()) {
    const notesEntry: LeadHistoryEntry = {
      id: crypto.randomUUID(),
      leadId: lead.id,
      kind: "notes_updated",
      createdAt: new Date().toISOString(),
      actorName: "Sistema",
      actorRole: "Captación web",
      message: `Notas iniciales capturadas: ${lead.notes.trim().slice(0, 180)}`,
    };

    insertLeadHistoryEntry(notesEntry);
    return { ...lead, history: [createdEntry, notesEntry] };
  }

  return { ...lead, history: [createdEntry] };
}

export async function updateLead(input: UpdateLeadInput) {
  const row = findLeadRow(input.id);
  if (!row) return null;

  const current = rowToLead(row);
  const historyEntries: LeadHistoryEntry[] = [];
  const next: SavedLead = {
    ...current,
    status: input.status && pipelineStages.includes(input.status as LeadStage) ? input.status : current.status,
    priority: input.priority && leadPriorities.includes(input.priority as LeadPriority) ? input.priority : current.priority,
    owner: typeof input.owner === "string" && input.owner.trim() ? input.owner.trim() : current.owner,
    notes: typeof input.notes === "string" ? input.notes : current.notes,
    nextFollowUpAt: typeof input.nextFollowUpAt === "string" ? input.nextFollowUpAt : current.nextFollowUpAt,
    lossReason: typeof input.lossReason === "string" ? input.lossReason : current.lossReason,
  };

  updateLeadRow(next);

  const actorName = input.actor?.name || "Equipo interno";
  const actorRole = input.actor?.role || "CRM";
  const now = new Date().toISOString();

  if (next.status !== current.status) {
    historyEntries.push({
      id: crypto.randomUUID(),
      leadId: next.id,
      kind: "status_changed",
      createdAt: now,
      actorName,
      actorRole,
      message: `Etapa actualizada de ${current.status} a ${next.status}.`,
    });
  }

  if (next.owner !== current.owner) {
    historyEntries.push({
      id: crypto.randomUUID(),
      leadId: next.id,
      kind: "owner_changed",
      createdAt: now,
      actorName,
      actorRole,
      message: `Responsable reasignado de ${current.owner} a ${next.owner}.`,
    });
  }

  if (next.notes.trim() !== current.notes.trim()) {
    historyEntries.push({
      id: crypto.randomUUID(),
      leadId: next.id,
      kind: "notes_updated",
      createdAt: now,
      actorName,
      actorRole,
      message: next.notes.trim()
        ? `Notas internas actualizadas: ${next.notes.trim().slice(0, 180)}`
        : "Notas internas limpiadas para reiniciar seguimiento.",
    });
  }

  if (next.priority !== current.priority) {
    historyEntries.push({
      id: crypto.randomUUID(),
      leadId: next.id,
      kind: "priority_updated",
      createdAt: now,
      actorName,
      actorRole,
      message: `Prioridad actualizada de ${current.priority} a ${next.priority}.`,
    });
  }

  if (next.nextFollowUpAt !== current.nextFollowUpAt) {
    historyEntries.push({
      id: crypto.randomUUID(),
      leadId: next.id,
      kind: "follow_up_updated",
      createdAt: now,
      actorName,
      actorRole,
      message: next.nextFollowUpAt
        ? `Próximo seguimiento fijado para ${next.nextFollowUpAt}.`
        : "Seguimiento próximo limpiado para redefinir la agenda comercial.",
    });
  }

  if (next.lossReason.trim() !== current.lossReason.trim()) {
    historyEntries.push({
      id: crypto.randomUUID(),
      leadId: next.id,
      kind: "loss_reason_updated",
      createdAt: now,
      actorName,
      actorRole,
      message: next.lossReason.trim()
        ? `Motivo de cierre/pérdida actualizado: ${next.lossReason.trim().slice(0, 180)}`
        : "Motivo de cierre/pérdida limpiado.",
    });
  }

  historyEntries.forEach(insertLeadHistoryEntry);
  return { ...next, history: getLeadHistoryRows([next.id]).map(rowToLeadHistoryEntry) };
}
