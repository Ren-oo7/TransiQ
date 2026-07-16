import Link from "next/link";
import type { AdminSession } from "@/lib/admin-auth-types";
import type { SavedLead } from "@/lib/lead-types";
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
    if (normalized.includes("header") || normalized.includes("footer") || normalized.includes("navegacion")) return "Accesos generales del sitio";
    return "Diagnóstico";
  }
  if (normalized.includes("solucion-")) return "Página por norma";
  if (normalized.includes("hero-principal") || normalized.includes("bloque-") || normalized.includes("cta-final")) return "Home";
  if (normalized.includes("header") || normalized.includes("footer") || normalized.includes("navegacion")) return "Accesos generales del sitio";
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

function getStandardSummary(leads: SavedLead[]) {
  const grouped = new Map<string, SavedLead[]>();

  leads.forEach((lead) => {
    const key = lead.diagnostic.standardShort;
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
  const activeFamilies = familySummaries.length;
  const activeSources = sourceSummaries.length;
  const topSource = sourceSummaries[0];
  const strategicLeads = leads.filter((lead) => lead.diagnostic.lead.score >= 70).length;
  const proposalRate = leads.length
    ? Math.round((leads.filter((lead) => ["Demo agendada", "Propuesta enviada", "Cerrado"].includes(lead.status)).length / leads.length) * 100)
    : 0;
  const topStandards = getStandardSummary(leads);

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <article className={`cardSurface ${styles.heroCard}`}>
          <p className="eyebrow">Canales de captación</p>
          <h1>Identifique de dónde llegan los leads y qué fuentes generan mejores oportunidades.</h1>
          <p>
            Esta vista compara el volumen y la calidad comercial de cada origen para decidir qué accesos, contenidos y
            formularios conviene fortalecer.
          </p>
          <div className={styles.chips}>
            <span className={styles.chip}>Responsable activo: {session.name}</span>
            <span className={styles.chip}>Rol: {session.role}</span>
            <span className={styles.chip}>Canales agrupados: {activeFamilies}</span>
            <span className={styles.chip}>Fuentes específicas: {activeSources}</span>
          </div>
        </article>

        <article className={`cardSurface ${styles.highlightCard}`}>
          <span className={styles.highlightLabel}>Fuente con mayor captación</span>
          <div className={styles.highlightSource}>{topSource?.source || "Sin datos"}</div>
          <p>{topSource ? `${topSource.count} leads · score promedio ${topSource.avgLeadScore}` : "Aún no hay fuentes registradas."}</p>
          <span className={styles.highlightMeta}>Comparativo basado en los leads guardados actualmente.</span>
        </article>
      </section>

      <section className={styles.metricGrid}>
        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Leads captados</span>
          <div className={styles.metricValue}>{leads.length}</div>
          <p>Registros recibidos desde todos los orígenes del sitio.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Leads prioritarios</span>
          <div className={styles.metricValue}>{strategicLeads}</div>
          <p>Prospectos con score de oportunidad alto para priorizar inversión comercial.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Avance a demo / propuesta</span>
          <div className={styles.metricValue}>{proposalRate}%</div>
          <p>Proporción que ya alcanzó demo agendada, propuesta enviada o cierre.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Fuentes activas</span>
          <div className={styles.metricValue}>{activeSources}</div>
          <p>Orígenes específicos identificados en los registros actuales.</p>
        </article>
      </section>

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div>
            <p className="eyebrow sectionEyebrow">Vista general</p>
            <h2>Canales de captación agrupados</h2>
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
            <h3>Aún no hay fuentes registradas.</h3>
            <p>Cuando entren leads con origen definido, aquí veremos qué canales generan mejores oportunidades.</p>
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

      <section className={styles.sectionBlock}>
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
                    <span>{item.count} registros · {item.strategic} prioritarios</span>
                  </div>
                  <small>{item.open} abiertos</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>Los segmentos aparecerán cuando el CRM reciba leads reales.</p>
          )}
        </article>
      </section>
    </main>
  );
}
