import Link from "next/link";
import type { AdminSession } from "@/lib/admin-auth-types";
import type { LeadHistoryEntry, SavedLead } from "@/lib/lead-types";
import styles from "./crm-activity.module.css";

type CrmActivityProps = {
  leads: SavedLead[];
  session: AdminSession;
};

type ActivityItem = LeadHistoryEntry & {
  company: string;
  contact: string;
  status: SavedLead["status"];
  priority: SavedLead["priority"];
  nextFollowUpAt: string;
  source: string;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getHistoryLabel(kind: LeadHistoryEntry["kind"]) {
  if (kind === "created") return "Alta de lead";
  if (kind === "status_changed") return "Cambio de etapa";
  if (kind === "owner_changed") return "Reasignación";
  if (kind === "notes_updated") return "Notas";
  if (kind === "priority_updated") return "Prioridad";
  if (kind === "follow_up_updated") return "Seguimiento";
  return "Cierre / pérdida";
}

function getHistoryClass(kind: LeadHistoryEntry["kind"]) {
  if (kind === "created") return styles.kindCreated;
  if (kind === "status_changed") return styles.kindStage;
  if (kind === "owner_changed") return styles.kindOwner;
  if (kind === "notes_updated") return styles.kindNotes;
  if (kind === "priority_updated") return styles.kindPriority;
  if (kind === "follow_up_updated") return styles.kindFollowUp;
  return styles.kindLoss;
}

export function CrmActivity({ leads, session }: CrmActivityProps) {
  const activity = leads
    .flatMap<ActivityItem>((lead) =>
      lead.history.map((entry) => ({
        ...entry,
        company: lead.org.company || "Sin nombre",
        contact: lead.org.contact,
        status: lead.status,
        priority: lead.priority,
        nextFollowUpAt: lead.nextFollowUpAt,
        source: lead.source,
      })),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const overdueLeads = leads
    .filter((lead) => {
      if (lead.status === "Cerrado" || !lead.nextFollowUpAt) return false;
      return new Date(`${lead.nextFollowUpAt}T00:00:00`).getTime() < new Date(new Date().toDateString()).getTime();
    })
    .sort((a, b) => new Date(`${a.nextFollowUpAt}T00:00:00`).getTime() - new Date(`${b.nextFollowUpAt}T00:00:00`).getTime());

  const followUpsToday = leads.filter((lead) => {
    if (lead.status === "Cerrado" || !lead.nextFollowUpAt) return false;
    return lead.nextFollowUpAt === new Date().toISOString().slice(0, 10);
  }).length;

  const recentTouches = activity.filter((item) => {
    const ageInDays = (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return ageInDays <= 7;
  }).length;

  const noteUpdates = activity.filter((item) => item.kind === "notes_updated").length;
  const reassigned = activity.filter((item) => item.kind === "owner_changed").length;

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <article className={`cardSurface ${styles.heroCard}`}>
          <p className="eyebrow">Actividad comercial</p>
          <h1>Consolide la trazabilidad diaria del CRM y detecte dónde se está moviendo o frenando el seguimiento.</h1>
          <p>
            Esta vista resume la bitácora operativa del equipo: cambios, notas, seguimientos y casos vencidos para que
            comercial mantenga ritmo y dirección vea disciplina real de ejecución.
          </p>
          <div className={styles.chips}>
            <span className={styles.chip}>Sesión activa: {session.name}</span>
            <span className={styles.chip}>Rol: {session.role}</span>
            <span className={styles.chip}>Eventos recientes: {activity.length}</span>
          </div>
        </article>

        <article className={`cardSurface ${styles.highlightCard}`}>
          <span className={styles.highlightLabel}>Seguimientos hoy</span>
          <div className={styles.highlightValue}>{followUpsToday}</div>
          <p>{overdueLeads.length} oportunidades ya vencieron su próxima acción comercial.</p>
          <span className={styles.highlightMeta}>{recentTouches} movimientos fueron registrados en la última semana.</span>
        </article>
      </section>

      <section className={styles.metricGrid}>
        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Eventos registrados</span>
          <div className={styles.metricValue}>{activity.length}</div>
          <p>Movimientos acumulados de leads dentro del CRM.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Notas actualizadas</span>
          <div className={styles.metricValue}>{noteUpdates}</div>
          <p>Registros donde el equipo dejó contexto o siguiente paso.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Reasignaciones</span>
          <div className={styles.metricValue}>{reassigned}</div>
          <p>Cambios de responsable ya reflejados en la operación comercial.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Seguimientos vencidos</span>
          <div className={styles.metricValue}>{overdueLeads.length}</div>
          <p>Leads abiertos que ya requieren reactivación o redefinición.</p>
        </article>
      </section>

      <section className={styles.dualGrid}>
        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Timeline</p>
              <h2>Actividad reciente del equipo</h2>
            </div>
            <Link className="button buttonSecondary" href="/crm/leads">
              Ir a leads
            </Link>
          </div>

          {activity.length ? (
            <ul className={styles.timeline}>
              {activity.map((item) => (
                <li key={item.id} className={styles.timelineItem}>
                  <div className={styles.timelineTop}>
                    <span className={`${styles.kindBadge} ${getHistoryClass(item.kind)}`}>{getHistoryLabel(item.kind)}</span>
                    <small>{formatDateTime(item.createdAt)}</small>
                  </div>
                  <strong>{item.company}</strong>
                  <p>{item.message}</p>
                  <div className={styles.metaRow}>
                    <span>{item.actorName} · {item.actorRole}</span>
                    <span>{item.contact}</span>
                    <span>{item.priority}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>La actividad aparecerá aquí en cuanto el equipo empiece a mover oportunidades.</p>
          )}
        </article>

        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Urgente</p>
              <h2>Seguimientos vencidos</h2>
            </div>
            <Link className="button buttonGhost" href="/crm/pipeline">
              Ver pipeline
            </Link>
          </div>

          {overdueLeads.length ? (
            <ul className={styles.overdueList}>
              {overdueLeads.map((lead) => (
                <li key={lead.id}>
                  <div>
                    <strong>{lead.org.company || "Sin nombre"}</strong>
                    <span>{lead.owner} · {lead.priority}</span>
                  </div>
                  <small>{lead.nextFollowUpAt ? formatDate(lead.nextFollowUpAt) : "Sin fecha"} · {lead.org.contact}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>No hay seguimientos vencidos en este momento.</p>
          )}

          <div className={styles.callout}>
            <strong>Lectura recomendada</strong>
            <p>
              Si la actividad baja y los seguimientos vencidos suben, conviene revisar carga por responsable y priorizar
              primero las oportunidades de alto valor antes de seguir captando nuevas.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
