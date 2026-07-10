import Link from "next/link";
import type { AdminSession } from "@/lib/admin-auth-types";
import { formatLeadStage, pipelineStages, type LeadStage, type SavedLead } from "@/lib/lead-types";
import styles from "./crm-overview.module.css";

type CrmOverviewProps = {
  leads: SavedLead[];
  session: AdminSession;
};

function getStageClass(stage: LeadStage) {
  if (stage === "Cerrado") return styles.stageClosed;
  if (stage === "Propuesta enviada" || stage === "Demo agendada") return styles.stageHot;
  if (stage === "Contactado" || stage === "Diagnostico revisado") return styles.stageWarm;
  return styles.stageNew;
}

export function CrmOverview({ leads, session }: CrmOverviewProps) {
  const strategicLeads = leads.filter((lead) => lead.diagnostic.lead.score >= 70).length;
  const urgentLeads = leads.filter((lead) => ["alta", "critica"].includes(lead.org.urgency)).length;
  const averageScore = leads.length
    ? Math.round(leads.reduce((sum, lead) => sum + lead.diagnostic.score, 0) / leads.length)
    : 0;
  const openLeads = leads.filter((lead) => lead.status !== "Cerrado").length;
  const pipelineCounts = pipelineStages.map((stage) => ({
    stage,
    count: leads.filter((lead) => lead.status === stage).length,
  }));
  const latestLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <main className={styles.grid}>
      <section className={styles.hero}>
        <article className={`cardSurface ${styles.heroCard}`}>
          <p className="eyebrow">Dashboard comercial</p>
          <h1>Visualice captación, avance comercial y prioridades del equipo en un solo tablero.</h1>
          <p>
            Desde aquí podemos leer captación, prioridad, avance de pipeline y ritmo de seguimiento sin mezclar esta
            capa comercial con la app operativa de TransiQ.
          </p>
        </article>

        <article className={`cardSurface ${styles.highlightCard}`}>
          <span className="miniLabel">Sesión activa</span>
          <strong>{session.name}</strong>
          <p>{session.role}</p>
          <div className={styles.highlightValue}>{openLeads}</div>
          <p>oportunidades abiertas para seguimiento comercial</p>
        </article>
      </section>

      <section className={styles.metricGrid}>
        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Leads totales</span>
          <div className={styles.metricValue}>{leads.length}</div>
          <p>Registros captados desde el diagnóstico y formularios del sitio.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Leads estratégicos</span>
          <div className={styles.metricValue}>{strategicLeads}</div>
          <p>Casos con score comercial de 70 o superior.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Urgencia alta</span>
          <div className={styles.metricValue}>{urgentLeads}</div>
          <p>Organizaciones que reportan urgencia alta o crítica.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Madurez promedio</span>
          <div className={styles.metricValue}>{averageScore}%</div>
          <p>Promedio de preparación diagnóstica del portafolio actual.</p>
        </article>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <div>
            <p className="eyebrow sectionEyebrow">Pipeline</p>
            <h2>Lectura rápida por etapa</h2>
          </div>
          <Link className="button buttonPrimary" href="/crm/leads">
            Ir a leads y pipeline
          </Link>
        </div>

        <div className={styles.pipelineGrid}>
          {pipelineCounts.map((item) => (
            <article key={item.stage} className={`cardSurface ${styles.pipelineCard}`}>
              <span className={`${styles.stageBadge} ${getStageClass(item.stage)}`}>{formatLeadStage(item.stage)}</span>
              <div className={styles.pipelineValue}>{item.count}</div>
              <p>Oportunidades en esta etapa.</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.actionGrid}>
        <article className={`cardSurface ${styles.actionCard}`}>
          <p className="eyebrow sectionEyebrow">Siguiente acción</p>
          <h3>Trabajar la bandeja comercial</h3>
          <p>
            Entra a la vista completa de leads para filtrar, reasignar responsables, actualizar notas y mover
            oportunidades por etapa.
          </p>
          <Link className="button buttonPrimary" href="/crm/leads">
            Abrir leads / pipeline
          </Link>
        </article>

        <article className={`cardSurface ${styles.actionCard}`}>
          <p className="eyebrow sectionEyebrow">Lectura rápida</p>
          <h3>Qué revisar primero hoy</h3>
          <p>
            Prioriza oportunidades abiertas, leads estratégicos y casos con urgencia alta para mantener el embudo en
            movimiento y evitar seguimientos vencidos.
          </p>
          <Link className="button buttonGhost" href="/crm/reportes">
            Ver reportes comerciales
          </Link>
        </article>
      </section>

      <section className={`cardSurface ${styles.recentCard}`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="eyebrow sectionEyebrow">Captación reciente</p>
            <h2>Últimos leads recibidos</h2>
          </div>
          <Link className="button buttonSecondary" href="/crm/leads">
            Ver todos
          </Link>
        </div>

        {latestLeads.length ? (
          <ul className={styles.recentList}>
            {latestLeads.map((lead) => (
              <li key={lead.id}>
                <div className={styles.recentTop}>
                  <strong>{lead.org.company || "Sin nombre"}</strong>
                  <span className={`${styles.stageBadge} ${getStageClass(lead.status)}`}>{formatLeadStage(lead.status)}</span>
                </div>
                <p>{lead.diagnostic.standardLabel} · {lead.org.contact}</p>
                <div className={styles.recentMeta}>
                  <span>Score {lead.diagnostic.score}%</span>
                  <span>Lead {lead.diagnostic.lead.score}/100</span>
                  <span>{new Date(lead.createdAt).toLocaleDateString("es-MX")}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={`cardSurface ${styles.emptyCard}`}>
            <h2>Aún no hay leads captados.</h2>
            <p>Cuando entre el primero, aquí veremos una lectura rápida para seguimiento comercial.</p>
          </div>
        )}
      </section>
    </main>
  );
}
