import Link from "next/link";
import type { AdminSession } from "@/lib/admin-auth-types";
import { formatLeadStage, pipelineStages, type SavedLead } from "@/lib/lead-types";
import styles from "./crm-reports.module.css";

type CrmReportsProps = {
  leads: SavedLead[];
  session: AdminSession;
};

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getSourceFamily(source: string) {
  const normalized = source.toLowerCase();

  if (normalized.includes("descarga de recurso")) return "Recursos";
  if (normalized.includes("solicitud de demo")) return "Demo";
  if (normalized.includes("formulario de contacto")) return "Contacto";
  if (normalized.includes("solucion-")) return "Página por norma";
  if (normalized.includes("header") || normalized.includes("footer") || normalized.includes("navegacion")) return "Navegación";
  if (normalized.includes("hero-principal") || normalized.includes("bloque-") || normalized.includes("cta-final")) return "Home";
  if (normalized.includes("diagnóstico público") || normalized.includes("diagnostico público")) return "Diagnóstico";
  return "Otros";
}

function getStageClass(stage: SavedLead["status"]) {
  if (stage === "Cerrado") return styles.stageClosed;
  if (stage === "Propuesta enviada" || stage === "Demo agendada") return styles.stageHot;
  if (stage === "Contactado" || stage === "Diagnostico revisado") return styles.stageWarm;
  return styles.stageNew;
}

export function CrmReports({ leads, session }: CrmReportsProps) {
  const totalLeads = leads.length;
  const openLeads = leads.filter((lead) => lead.status !== "Cerrado").length;
  const strategicLeads = leads.filter((lead) => lead.diagnostic.lead.score >= 70).length;
  const proposalLeads = leads.filter((lead) => ["Propuesta enviada", "Cerrado"].includes(lead.status)).length;
  const demoLeads = leads.filter((lead) => ["Demo agendada", "Propuesta enviada", "Cerrado"].includes(lead.status)).length;
  const closedLeads = leads.filter((lead) => lead.status === "Cerrado").length;
  const overdueFollowUps = leads.filter((lead) => {
    if (lead.status === "Cerrado" || !lead.nextFollowUpAt) return false;
    return new Date(`${lead.nextFollowUpAt}T00:00:00`).getTime() < new Date(new Date().toDateString()).getTime();
  }).length;
  const highPriorityOpen = leads.filter((lead) => lead.status !== "Cerrado" && lead.priority === "Alta").length;

  const avgMaturity = totalLeads
    ? Math.round(leads.reduce((sum, lead) => sum + lead.diagnostic.score, 0) / totalLeads)
    : 0;
  const avgLeadScore = totalLeads
    ? Math.round(leads.reduce((sum, lead) => sum + lead.diagnostic.lead.score, 0) / totalLeads)
    : 0;

  const contactRate = totalLeads ? (leads.filter((lead) => lead.status !== "Nuevo").length / totalLeads) * 100 : 0;
  const demoRate = totalLeads ? (demoLeads / totalLeads) * 100 : 0;
  const proposalRate = totalLeads ? (proposalLeads / totalLeads) * 100 : 0;
  const closeRate = totalLeads ? (closedLeads / totalLeads) * 100 : 0;

  const stageSummaries = pipelineStages.map((stage) => {
    const items = leads.filter((lead) => lead.status === stage);
    const share = totalLeads ? (items.length / totalLeads) * 100 : 0;
    return { stage, count: items.length, share };
  });

  const familySummaries = Array.from(
    leads.reduce((map, lead) => {
      const family = getSourceFamily(lead.source);
      const current = map.get(family) ?? [];
      current.push(lead);
      map.set(family, current);
      return map;
    }, new Map<string, SavedLead[]>()),
  )
    .map(([family, items]) => ({
      family,
      count: items.length,
      strategic: items.filter((lead) => lead.diagnostic.lead.score >= 70).length,
      demos: items.filter((lead) => ["Demo agendada", "Propuesta enviada", "Cerrado"].includes(lead.status)).length,
      closed: items.filter((lead) => lead.status === "Cerrado").length,
      conversion: items.length ? Math.round((items.filter((lead) => lead.status !== "Nuevo").length / items.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count || b.conversion - a.conversion)
    .slice(0, 6);

  const ownerSummaries = Array.from(
    leads.reduce((map, lead) => {
      const owner = lead.owner || "Sin asignar";
      const current = map.get(owner) ?? [];
      current.push(lead);
      map.set(owner, current);
      return map;
    }, new Map<string, SavedLead[]>()),
  )
    .map(([owner, items]) => ({
      owner,
      total: items.length,
      open: items.filter((lead) => lead.status !== "Cerrado").length,
      closed: items.filter((lead) => lead.status === "Cerrado").length,
      overdue: items.filter((lead) => {
        if (lead.status === "Cerrado" || !lead.nextFollowUpAt) return false;
        return new Date(`${lead.nextFollowUpAt}T00:00:00`).getTime() < new Date(new Date().toDateString()).getTime();
      }).length,
    }))
    .sort((a, b) => b.total - a.total || a.overdue - b.overdue)
    .slice(0, 6);

  const nextActionLeads = [...leads]
    .filter((lead) => lead.status !== "Cerrado")
    .sort((a, b) => {
      const aDate = a.nextFollowUpAt ? new Date(`${a.nextFollowUpAt}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
      const bDate = b.nextFollowUpAt ? new Date(`${b.nextFollowUpAt}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    })
    .slice(0, 6);

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <article className={`cardSurface ${styles.heroCard}`}>
          <p className="eyebrow">Reportes comerciales</p>
          <h1>Lea conversión, productividad y salud del pipeline con una vista clara para dirección.</h1>
          <p>
            Este panel resume captación, avance por etapa, urgencias de seguimiento y desempeño por canal para tomar
            decisiones comerciales sin entrar a cada lead.
          </p>
          <div className={styles.chips}>
            <span className={styles.chip}>Responsable activo: {session.name}</span>
            <span className={styles.chip}>Rol: {session.role}</span>
            <span className={styles.chip}>Leads analizados: {totalLeads}</span>
          </div>
        </article>

        <article className={`cardSurface ${styles.highlightCard}`}>
          <span className={styles.highlightLabel}>Tasa de contacto</span>
          <div className={styles.highlightValue}>{formatPercent(contactRate)}</div>
          <p>{openLeads} oportunidades siguen abiertas y requieren disciplina comercial.</p>
          <span className={styles.highlightMeta}>{overdueFollowUps} seguimientos ya están vencidos.</span>
        </article>
      </section>

      <section className={styles.metricGrid}>
        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Madurez promedio</span>
          <div className={styles.metricValue}>{avgMaturity}%</div>
          <p>Preparación diagnóstica media del portafolio captado.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Lead score promedio</span>
          <div className={styles.metricValue}>{avgLeadScore}</div>
          <p>Calidad comercial promedio del universo actual de leads.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Prioridad alta</span>
          <div className={styles.metricValue}>{highPriorityOpen}</div>
          <p>Oportunidades abiertas que requieren intervención rápida.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Cierre actual</span>
          <div className={styles.metricValue}>{formatPercent(closeRate)}</div>
          <p>Porcentaje del total que ya alcanzó la etapa de cierre.</p>
        </article>
      </section>

      <section className={styles.funnelGrid}>
        <article className={`cardSurface ${styles.funnelCard}`}>
          <span className="miniLabel">Contacto</span>
          <strong>{formatPercent(contactRate)}</strong>
          <p>Leads que ya salieron de la etapa Nuevo.</p>
        </article>

        <article className={`cardSurface ${styles.funnelCard}`}>
          <span className="miniLabel">Demo</span>
          <strong>{formatPercent(demoRate)}</strong>
          <p>Leads que llegaron a demo agendada o más.</p>
        </article>

        <article className={`cardSurface ${styles.funnelCard}`}>
          <span className="miniLabel">Propuesta</span>
          <strong>{formatPercent(proposalRate)}</strong>
          <p>Leads que ya tienen propuesta o cierre.</p>
        </article>

        <article className={`cardSurface ${styles.funnelCard}`}>
          <span className="miniLabel">Cierre</span>
          <strong>{formatPercent(closeRate)}</strong>
          <p>Conversión total del embudo actual.</p>
        </article>
      </section>

      <section className={styles.dualGrid}>
        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Etapas</p>
              <h2>Distribución del pipeline</h2>
            </div>
            <Link className="button buttonSecondary" href="/crm/pipeline">
              Ver pipeline
            </Link>
          </div>

          <div className={styles.stageList}>
            {stageSummaries.map((item) => (
              <article key={item.stage} className={styles.stageRow}>
                <div className={styles.stageTop}>
                  <span className={`${styles.stageBadge} ${getStageClass(item.stage)}`}>{formatLeadStage(item.stage)}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className={styles.progressMeta}>
                  <span>{formatPercent(item.share)} del total</span>
                </div>
                <div className={styles.progressBar}>
                  <span style={{ width: `${item.share}%` }} />
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Seguimiento</p>
              <h2>Próximas acciones críticas</h2>
            </div>
            <Link className="button buttonGhost" href="/crm/leads">
              Abrir leads
            </Link>
          </div>

          {nextActionLeads.length ? (
            <ul className={styles.followList}>
              {nextActionLeads.map((lead) => (
                <li key={lead.id}>
                  <div className={styles.followTop}>
                    <strong>{lead.org.company || "Sin nombre"}</strong>
                    <span>{lead.nextFollowUpAt ? formatDate(lead.nextFollowUpAt) : "Sin fecha"}</span>
                  </div>
                  <p>{lead.owner} · {lead.priority} · {formatLeadStage(lead.status)}</p>
                  <small>{lead.org.contact}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>Cuando existan leads abiertos, aquí veremos las acciones más próximas.</p>
          )}
        </article>
      </section>

      <section className={styles.dualGrid}>
        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Canales</p>
              <h2>Desempeño por familia comercial</h2>
            </div>
            <Link className="button buttonSecondary" href="/crm/campanas">
              Ver campañas
            </Link>
          </div>

          {familySummaries.length ? (
            <div className={styles.familyGrid}>
              {familySummaries.map((item) => (
                <article key={item.family} className={styles.familyCard}>
                  <div className={styles.familyTop}>
                    <strong>{item.family}</strong>
                    <span>{item.count} leads</span>
                  </div>
                  <p>Conversión inicial {formatPercent(item.conversion)} · Estratégicos {item.strategic}</p>
                  <div className={styles.kpiRow}>
                    <span className={styles.kpiBadge}>Demos {item.demos}</span>
                    <span className={styles.kpiBadge}>Cierres {item.closed}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>Aún no hay datos de canal suficientes para este tablero.</p>
          )}
        </article>

        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Responsables</p>
              <h2>Carga y disciplina comercial</h2>
            </div>
          </div>

          {ownerSummaries.length ? (
            <ul className={styles.ownerList}>
              {ownerSummaries.map((item) => (
                <li key={item.owner}>
                  <div>
                    <strong>{item.owner}</strong>
                    <span>{item.total} leads · {item.open} abiertos</span>
                  </div>
                  <small>{item.closed} cerrados · {item.overdue} vencidos</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>La carga por responsable aparecerá conforme se asignen oportunidades.</p>
          )}
        </article>
      </section>
    </main>
  );
}
