"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import type { AdminSession } from "@/lib/admin-auth-types";
import { formatLeadPriority, formatLeadStage, leadPriorities, pipelineStages, type LeadPriority, type LeadStage, type SavedLead } from "@/lib/lead-types";
import type { CrmUser } from "@/lib/team-store";
import styles from "./lead-detail.module.css";

type LeadDetailProps = {
  lead: SavedLead;
  session: AdminSession;
  users: CrmUser[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatUrgency(value: string) {
  if (value === "critica") return "Crítica";
  if (value === "alta") return "Alta";
  if (value === "media") return "Media";
  if (value === "baja") return "Baja";
  return value || "Sin definir";
}

function formatInterest(value: string) {
  return value || "Sin definir";
}

function formatLeadSource(source: string) {
  return source.replace(/\s*\|\s*/g, " · ");
}

export function LeadDetail({ lead: initialLead, session, users }: LeadDetailProps) {
  const [lead, setLead] = useState(initialLead);
  const [draftOwner, setDraftOwner] = useState(initialLead.owner ?? "Sin asignar");
  const [draftNotes, setDraftNotes] = useState(initialLead.notes ?? "");
  const [draftPriority, setDraftPriority] = useState<LeadPriority>(initialLead.priority ?? "Media");
  const [draftFollowUpAt, setDraftFollowUpAt] = useState(initialLead.nextFollowUpAt ?? "");
  const [draftLossReason, setDraftLossReason] = useState(initialLead.lossReason ?? "");
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();

  const canManageOwners = session.role === "Director";
  const allowedStages = session.role === "Director"
    ? pipelineStages
    : pipelineStages.filter((stage) => stage !== "Cerrado");
  const weakestDomains = lead.diagnostic.domainScores.slice(0, 3);
  const ownerOptions = ["Sin asignar", ...users.map((user) => user.name)];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  function flashToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  async function saveLeadUpdate(nextStatus?: LeadStage) {
    const payload = {
      id: lead.id,
      status: nextStatus ?? lead.status,
      priority: draftPriority,
      owner: canManageOwners ? draftOwner.trim() || "Sin asignar" : undefined,
      notes: draftNotes,
      nextFollowUpAt: draftFollowUpAt,
      lossReason: draftLossReason,
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          flashToast(data.error || "No fue posible actualizar el lead");
          return;
        }

        setLead(data.lead);
        setDraftOwner(data.lead.owner);
        setDraftNotes(data.lead.notes);
        setDraftPriority(data.lead.priority);
        setDraftFollowUpAt(data.lead.nextFollowUpAt);
        setDraftLossReason(data.lead.lossReason);
        flashToast("Lead actualizado correctamente");
      } catch {
        flashToast("Falló la actualización del lead");
      }
    });
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerCopy}>
          <Link href="/crm/leads" className={styles.backLink}>
            Volver a Leads
          </Link>
          <p className="eyebrow">Detalle comercial</p>
          <h1>{lead.org.company}</h1>
          <p>
            {lead.diagnostic.standardLabel}. {lead.diagnostic.lead.type} con {lead.diagnostic.score}% de madurez y
            horizonte estimado de {lead.diagnostic.duration}.
          </p>
        </div>

        <div className={styles.headerMeta}>
          <span className={styles.stageBadge}>{formatLeadStage(lead.status)}</span>
          <span className={styles.priorityBadge}>{formatLeadPriority(lead.priority)}</span>
          <span className={styles.dateBadge}>Captado {formatDate(lead.createdAt)}</span>
        </div>
      </section>

      <section className={styles.detailGrid}>
        <article className={`cardSurface ${styles.primaryCard}`}>
          <p className="eyebrow sectionEyebrow">Lead seleccionado</p>

          <div className={styles.summaryGrid}>
            <article className={styles.summaryTile}>
              <span className="miniLabel">Origen del lead</span>
              <strong>{formatLeadSource(lead.source)}</strong>
              <p>{formatDate(lead.createdAt)}</p>
            </article>

            <article className={styles.summaryTile}>
              <span className="miniLabel">Contexto declarado</span>
              <strong>{lead.org.country} · {lead.org.sector || "Sector pendiente"}</strong>
              <p>{lead.org.employees || "Sin dato"} colaboradores · {lead.org.sites || "1"} sede(s)</p>
            </article>

            <article className={styles.summaryTile}>
              <span className="miniLabel">Lectura rápida</span>
              <strong>{lead.diagnostic.lead.type}</strong>
              <p>{lead.diagnostic.score}% de madurez · {lead.diagnostic.duration}</p>
            </article>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span>Norma objetivo</span>
              <strong>{lead.diagnostic.standardLabel}</strong>
            </div>
            <div className={styles.infoItem}>
              <span>Interés principal</span>
              <strong>{formatInterest(lead.org.interest)}</strong>
            </div>
            <div className={styles.infoItem}>
              <span>Urgencia declarada</span>
              <strong>{formatUrgency(lead.org.urgency)}</strong>
            </div>
            <div className={styles.infoItem}>
              <span>Preguntas contestadas</span>
              <strong>{lead.diagnostic.answered} de {lead.diagnostic.total}</strong>
            </div>
            <div className={`${styles.infoItem} ${styles.infoWide}`}>
              <span>Alcance declarado</span>
              <strong>{lead.org.scope || "Aún no se capturó alcance en el diagnóstico."}</strong>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              Etapa comercial
              <select
                value={lead.status}
                onChange={(event) => saveLeadUpdate(event.target.value as LeadStage)}
                disabled={isPending}
              >
                {allowedStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {formatLeadStage(stage)}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              Prioridad comercial
              <select
                value={draftPriority}
                onChange={(event) => setDraftPriority(event.target.value as LeadPriority)}
                disabled={isPending}
              >
                {leadPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              Responsable
              <select
                value={draftOwner}
                onChange={(event) => setDraftOwner(event.target.value)}
                disabled={isPending || !canManageOwners}
              >
                {ownerOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              Contacto
              <input value={lead.org.contact} disabled />
            </label>

            <label className={styles.field}>
              Fuente
              <input value={lead.source} disabled />
            </label>

            <label className={styles.field}>
              Próximo seguimiento
              <input
                type="date"
                value={draftFollowUpAt}
                onChange={(event) => setDraftFollowUpAt(event.target.value)}
                disabled={isPending}
              />
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              Notas internas
              <textarea
                rows={5}
                value={draftNotes}
                onChange={(event) => setDraftNotes(event.target.value)}
                placeholder="Siguiente llamada, objeciones, contexto para demo, fecha objetivo..."
                disabled={isPending}
              />
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              Motivo de cierre / pérdida
              <textarea
                rows={3}
                value={draftLossReason}
                onChange={(event) => setDraftLossReason(event.target.value)}
                placeholder="Competidor, presupuesto, timing, no respuesta, decisión interna..."
                disabled={isPending}
              />
            </label>
          </div>

          {!canManageOwners ? <p className={styles.permissionNote}>Solo Dirección puede reasignar responsables o cerrar oportunidades.</p> : null}

          <div className={styles.actionRow}>
            <button className="button buttonPrimary" type="button" onClick={() => saveLeadUpdate()} disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar seguimiento"}
            </button>
          </div>
        </article>

        <div className={styles.secondaryCards}>
          <article className={`cardSurface ${styles.detailCard}`}>
            <p className="eyebrow sectionEyebrow">Lectura comercial</p>
            <h3>Resumen ejecutivo del lead</h3>
            <ul className={styles.list}>
              <li>Prioridad actual: {formatLeadPriority(lead.priority)}.</li>
              <li>Contacto recibido: {lead.org.contact}.</li>
              <li>Interés inicial: {formatInterest(lead.org.interest)} con urgencia {formatUrgency(lead.org.urgency).toLowerCase()}.</li>
              <li>Fuente atribuida: {formatLeadSource(lead.source)}.</li>
              <li>Próximo seguimiento sugerido: {lead.nextFollowUpAt || "Sin fecha definida"}.</li>
              <li>Motivo de cierre/pérdida: {lead.lossReason || "Aún no se ha capturado"}.</li>
            </ul>
          </article>

          <article className={`cardSurface ${styles.detailCard}`}>
            <p className="eyebrow sectionEyebrow">Ruta sugerida</p>
            <h3>Siguiente movimiento comercial</h3>
            <p>
              Entra como <strong>{lead.diagnostic.lead.type}</strong> con un horizonte estimado de{" "}
              <strong>{lead.diagnostic.duration}</strong>. Conviene priorizar una conversación centrada en alcance,
              brechas críticas y siguiente paso de venta.
            </p>
            <ul className={styles.notesList}>
              {lead.diagnostic.recommendation.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={`cardSurface ${styles.detailCard}`}>
            <p className="eyebrow sectionEyebrow">Dominios sensibles</p>
            <h3>Brechas de menor puntaje</h3>
            <ul className={styles.domainList}>
              {lead.diagnostic.domainScores.slice(0, 4).map((item) => (
                <li key={item.domain}>{item.domain}: {item.score}%</li>
              ))}
            </ul>
            {weakestDomains.length ? (
              <p className={styles.domainInsight}>
                Conviene abrir la conversación por {weakestDomains.map((item) => item.domain).join(", ")} porque son
                las áreas más sensibles del diagnóstico inicial.
              </p>
            ) : null}
          </article>

          <article className={`cardSurface ${styles.detailCard}`}>
            <p className="eyebrow sectionEyebrow">Historial</p>
            <h3>Seguimiento reciente</h3>
            {lead.history.length ? (
              <ul className={styles.historyList}>
                {lead.history.slice(0, 8).map((entry) => (
                  <li key={entry.id} className={styles.historyItem}>
                    <strong>{entry.actorName}</strong>
                    <span>{entry.message}</span>
                    <small>{formatDate(entry.createdAt)} · {entry.actorRole}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>El historial se comenzará a llenar con cada actualización del lead.</p>
            )}
          </article>
        </div>
      </section>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </main>
  );
}
