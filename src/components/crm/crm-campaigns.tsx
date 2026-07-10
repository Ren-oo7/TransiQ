import Link from "next/link";
import type { AdminSession } from "@/lib/admin-auth-types";
import { formatLeadStage, type SavedLead } from "@/lib/lead-types";
import styles from "./crm-campaigns.module.css";

type CrmCampaignsProps = {
  leads: SavedLead[];
  session: AdminSession;
};

type SourceSummary = {
  source: string;
  count: number;
  strategic: number;
  urgent: number;
  open: number;
  proposals: number;
  avgMaturity: number;
  avgLeadScore: number;
  latestAt: string;
  standards: string[];
};

type FamilySummary = SourceSummary & {
  family: string;
  channels: string[];
  sources: string[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSourceLabel(value: string) {
  return value.trim() || "Sin fuente";
}

function formatUrgency(value: string) {
  if (value === "critica") return "Crítica";
  if (value === "alta") return "Alta";
  if (value === "media") return "Media";
  if (value === "baja") return "Baja";
  return value || "Sin dato";
}

function getConversionLabel(value: number) {
  if (value >= 60) return "Tracción alta";
  if (value >= 30) return "Tracción media";
  return "Tracción inicial";
}

function getSourceParts(value: string) {
  return value
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSourceFamily(source: string) {
  const normalized = source.toLowerCase();

  if (normalized.includes("descarga de recurso")) return "Recursos";
  if (normalized.includes("solicitud de demo")) return "Demo";
  if (normalized.includes("formulario de contacto")) return "Contacto";
  if (normalized.includes("diagnóstico público") || normalized.includes("diagnostico público")) {
    if (normalized.includes("solucion-")) return "Página por norma";
    if (normalized.includes("hero-principal") || normalized.includes("bloque-")) return "Home";
    if (normalized.includes("header") || normalized.includes("footer") || normalized.includes("navegacion")) return "Navegación";
    return "Diagnóstico";
  }
  if (normalized.includes("solucion-")) return "Página por norma";
  if (normalized.includes("hero-principal") || normalized.includes("bloque-") || normalized.includes("cta-final")) return "Home";
  if (normalized.includes("header") || normalized.includes("footer") || normalized.includes("navegacion")) return "Navegación";
  return "Otros canales";
}

function getSourceSummaries(leads: SavedLead[]) {
  const grouped = new Map<string, SavedLead[]>();

  leads.forEach((lead) => {
    const key = formatSourceLabel(lead.source);
    const current = grouped.get(key) ?? [];
    current.push(lead);
    grouped.set(key, current);
  });

  return Array.from(grouped.entries())
    .map(([source, items]): SourceSummary => {
      const totalMaturity = items.reduce((sum, lead) => sum + lead.diagnostic.score, 0);
      const totalLeadScore = items.reduce((sum, lead) => sum + lead.diagnostic.lead.score, 0);
      const latestLead = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      return {
        source,
        count: items.length,
        strategic: items.filter((lead) => lead.diagnostic.lead.score >= 70).length,
        urgent: items.filter((lead) => ["alta", "critica"].includes(lead.org.urgency)).length,
        open: items.filter((lead) => lead.status !== "Cerrado").length,
        proposals: items.filter((lead) => ["Demo agendada", "Propuesta enviada", "Cerrado"].includes(lead.status)).length,
        avgMaturity: Math.round(totalMaturity / items.length),
        avgLeadScore: Math.round(totalLeadScore / items.length),
        latestAt: latestLead.createdAt,
        standards: Array.from(new Set(items.map((lead) => lead.diagnostic.standardShort))).sort(),
      };
    })
    .sort((a, b) => b.count - a.count || b.avgLeadScore - a.avgLeadScore);
}

function getFamilySummaries(leads: SavedLead[]) {
  const grouped = new Map<string, SavedLead[]>();

  leads.forEach((lead) => {
    const family = getSourceFamily(lead.source);
    const current = grouped.get(family) ?? [];
    current.push(lead);
    grouped.set(family, current);
  });

  return Array.from(grouped.entries())
    .map(([family, items]): FamilySummary => {
      const totalMaturity = items.reduce((sum, lead) => sum + lead.diagnostic.score, 0);
      const totalLeadScore = items.reduce((sum, lead) => sum + lead.diagnostic.lead.score, 0);
      const latestLead = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      const channels = Array.from(
        new Set(
          items
            .map((lead) => getSourceParts(formatSourceLabel(lead.source))[1] || "")
            .filter(Boolean),
        ),
      ).sort();
      const sources = Array.from(new Set(items.map((lead) => formatSourceLabel(lead.source)))).sort();

      return {
        family,
        source: family,
        count: items.length,
        strategic: items.filter((lead) => lead.diagnostic.lead.score >= 70).length,
        urgent: items.filter((lead) => ["alta", "critica"].includes(lead.org.urgency)).length,
        open: items.filter((lead) => lead.status !== "Cerrado").length,
        proposals: items.filter((lead) => ["Demo agendada", "Propuesta enviada", "Cerrado"].includes(lead.status)).length,
        avgMaturity: Math.round(totalMaturity / items.length),
        avgLeadScore: Math.round(totalLeadScore / items.length),
        latestAt: latestLead.createdAt,
        standards: Array.from(new Set(items.map((lead) => lead.diagnostic.standardShort))).sort(),
        channels,
        sources,
      };
    })
    .sort((a, b) => b.count - a.count || b.avgLeadScore - a.avgLeadScore);
}

function getSegmentSummary(leads: SavedLead[], field: "standardShort" | "urgency") {
  const grouped = new Map<string, SavedLead[]>();

  leads.forEach((lead) => {
    const key = field === "standardShort" ? lead.diagnostic.standardShort : formatUrgency(lead.org.urgency);
    const current = grouped.get(key) ?? [];
    current.push(lead);
    grouped.set(key, current);
  });

  return Array.from(grouped.entries())
    .map(([label, items]) => ({
      label,
      count: items.length,
      strategic: items.filter((lead) => lead.diagnostic.lead.score >= 70).length,
      open: items.filter((lead) => lead.status !== "Cerrado").length,
    }))
    .sort((a, b) => b.count - a.count || b.strategic - a.strategic)
    .slice(0, 4);
}

export function CrmCampaigns({ leads, session }: CrmCampaignsProps) {
  const familySummaries = getFamilySummaries(leads);
  const sourceSummaries = getSourceSummaries(leads);
  const activeSources = sourceSummaries.length;
  const activeFamilies = familySummaries.length;
  const strategicLeads = leads.filter((lead) => lead.diagnostic.lead.score >= 70).length;
  const engagedLeads = leads.filter((lead) => lead.status !== "Nuevo").length;
  const engagedRate = leads.length ? Math.round((engagedLeads / leads.length) * 100) : 0;
  const proposalRate = leads.length
    ? Math.round((leads.filter((lead) => ["Demo agendada", "Propuesta enviada", "Cerrado"].includes(lead.status)).length / leads.length) * 100)
    : 0;
  const staleLeads = [...leads]
    .filter((lead) => {
      const ageInDays = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return lead.status !== "Cerrado" && ageInDays >= 7;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 5);
  const topStandards = getSegmentSummary(leads, "standardShort");
  const topUrgencies = getSegmentSummary(leads, "urgency");

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <article className={`cardSurface ${styles.heroCard}`}>
          <p className="eyebrow">Campañas comerciales</p>
          <h1>Lea qué canales están trayendo oportunidades y qué segmentos merecen más inversión comercial.</h1>
          <p>
            Esta vista separa captación y pipeline para entender de dónde vienen los leads, qué tan prometedores son y
            dónde conviene activar seguimiento, contenido, pauta o outreach.
          </p>
          <div className={styles.chips}>
            <span className={styles.chip}>Responsable activo: {session.name}</span>
            <span className={styles.chip}>Rol: {session.role}</span>
            <span className={styles.chip}>Canales ejecutivos: {activeFamilies}</span>
          </div>
        </article>

        <article className={`cardSurface ${styles.highlightCard}`}>
          <span className={styles.highlightLabel}>Conversación activada</span>
          <div className={styles.highlightValue}>{engagedRate}%</div>
          <p>{getConversionLabel(engagedRate)} de seguimiento sobre el total captado.</p>
          <span className={styles.highlightMeta}>{engagedLeads} de {leads.length} leads ya salieron de la etapa Nuevo.</span>
        </article>
      </section>

      <section className={styles.metricGrid}>
        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Canales ejecutivos</span>
          <div className={styles.metricValue}>{activeFamilies}</div>
          <p>Familias comerciales consolidadas para lectura rápida de dirección.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Leads estratégicos</span>
          <div className={styles.metricValue}>{strategicLeads}</div>
          <p>Prospectos con score de oportunidad alto para priorizar inversión comercial.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Avance a demo / propuesta</span>
          <div className={styles.metricValue}>{proposalRate}%</div>
          <p>Proporción que ya alcanzó demo agendada, propuesta enviada o cierre.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Leads por reactivar</span>
          <div className={styles.metricValue}>{staleLeads.length}</div>
          <p>Oportunidades abiertas con más de 7 días sin cierre, útiles para una campaña de seguimiento.</p>
        </article>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="eyebrow sectionEyebrow">Vista ejecutiva</p>
            <h2>Canales comerciales consolidados</h2>
          </div>
          <Link className="button buttonSecondary" href="/crm/leads">
            Ir a leads
          </Link>
        </div>

        {familySummaries.length ? (
          <div className={styles.sourceGrid}>
            {familySummaries.map((item) => (
              <article key={item.family} className={`cardSurface ${styles.sourceCard}`}>
                <div className={styles.sourceTop}>
                  <div>
                    <span className={styles.sourceLabel}>{item.family}</span>
                    <h3>{item.count} lead{item.count === 1 ? "" : "s"} captado{item.count === 1 ? "" : "s"}</h3>
                  </div>
                  <span className={styles.scorePill}>Lead score promedio {item.avgLeadScore}</span>
                </div>

                <p className={styles.sourceMeta}>
                  Último ingreso: {formatDate(item.latestAt)} · Normas activas: {item.standards.join(", ") || "Sin norma"}
                </p>

                <div className={styles.kpiRow}>
                  <span className={styles.kpiBadge}>Abiertos {item.open}</span>
                  <span className={styles.kpiBadge}>Estratégicos {item.strategic}</span>
                  <span className={styles.kpiBadge}>Urgencia alta {item.urgent}</span>
                  <span className={styles.kpiBadge}>Avanzados {item.proposals}</span>
                </div>

                <div className={styles.progressBlock}>
                  <div className={styles.progressMeta}>
                    <span>Madurez promedio</span>
                    <strong>{item.avgMaturity}%</strong>
                  </div>
                  <div className={styles.progressBar}>
                    <span style={{ width: `${item.avgMaturity}%` }} />
                  </div>
                </div>

                <div className={styles.detailStack}>
                  <p className={styles.detailLine}>
                    <strong>Canales detectados:</strong> {item.channels.join(", ") || "Sin detalle"}
                  </p>
                  <p className={styles.detailLine}>
                    <strong>Fuentes agrupadas:</strong> {item.sources.length}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className={`cardSurface ${styles.emptyCard}`}>
            <h3>Aún no hay campañas registradas.</h3>
            <p>Cuando entren leads con fuente definida, aquí veremos qué canales convierten mejor.</p>
          </article>
        )}
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="eyebrow sectionEyebrow">Detalle operativo</p>
            <h2>Fuentes específicas registradas</h2>
          </div>
        </div>

        {sourceSummaries.length ? (
          <div className={styles.sourceGrid}>
            {sourceSummaries.slice(0, 6).map((item) => (
              <article key={item.source} className={`cardSurface ${styles.sourceCard}`}>
                <div className={styles.sourceTop}>
                  <div>
                    <span className={styles.sourceLabel}>{getSourceFamily(item.source)}</span>
                    <h3>{item.source}</h3>
                  </div>
                  <span className={styles.scorePill}>{item.count} lead{item.count === 1 ? "" : "s"}</span>
                </div>

                <p className={styles.sourceMeta}>
                  Último ingreso: {formatDate(item.latestAt)} · Normas activas: {item.standards.join(", ") || "Sin norma"}
                </p>

                <div className={styles.kpiRow}>
                  <span className={styles.kpiBadge}>Abiertos {item.open}</span>
                  <span className={styles.kpiBadge}>Estratégicos {item.strategic}</span>
                  <span className={styles.kpiBadge}>Avanzados {item.proposals}</span>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className={styles.dualGrid}>
        <article className={`cardSurface ${styles.segmentCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Segmentos</p>
              <h2>Normas con mayor atracción</h2>
            </div>
          </div>

          {topStandards.length ? (
            <ul className={styles.segmentList}>
              {topStandards.map((item) => (
                <li key={item.label}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.count} registros · {item.strategic} estratégicos</span>
                  </div>
                  <small>{item.open} abiertos</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>Los segmentos aparecerán cuando el CRM reciba leads reales.</p>
          )}
        </article>

        <article className={`cardSurface ${styles.segmentCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Prioridad</p>
              <h2>Urgencias que dominan la demanda</h2>
            </div>
          </div>

          {topUrgencies.length ? (
            <ul className={styles.segmentList}>
              {topUrgencies.map((item) => (
                <li key={item.label}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.count} registros · {item.strategic} estratégicos</span>
                  </div>
                  <small>{item.open} abiertos</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>La lectura de urgencias se alimentará conforme entren oportunidades.</p>
          )}
        </article>
      </section>

      <section className={styles.dualGrid}>
        <article className={`cardSurface ${styles.segmentCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Reactivos</p>
              <h2>Leads que piden una campaña de seguimiento</h2>
            </div>
            <Link className="button buttonGhost" href="/crm/pipeline">
              Ver pipeline
            </Link>
          </div>

          {staleLeads.length ? (
            <ul className={styles.followList}>
              {staleLeads.map((lead) => (
                <li key={lead.id}>
                  <div className={styles.followTop}>
                    <strong>{lead.org.company || "Sin nombre"}</strong>
                    <span>{formatLeadStage(lead.status)}</span>
                  </div>
                  <p>{formatSourceLabel(lead.source)} · {lead.org.contact}</p>
                  <small>{formatDate(lead.createdAt)} · Score {lead.diagnostic.lead.score}/100</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>Por ahora no hay leads envejecidos que justifiquen una campaña de reactivación.</p>
          )}
        </article>

        <article className={`cardSurface ${styles.segmentCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Lectura ejecutiva</p>
              <h2>Qué hacer con esta vista</h2>
            </div>
          </div>

          <ul className={styles.notesList}>
            <li>Leer primero la familia comercial y luego bajar al detalle de fuente cuando haga falta.</li>
            <li>Comparar volumen contra calidad: no solo cuántos leads entran, sino cuántos avanzan.</li>
            <li>Activar nurturing para leads nuevos y reactivación para leads detenidos por canal.</li>
            <li>Con más datos, esta vista puede crecer a costo por lead, CAC comercial y cierre por canal.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
