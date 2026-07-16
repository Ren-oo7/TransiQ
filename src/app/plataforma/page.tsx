import Link from "next/link";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./plataforma.module.css";

const stackModules = ["Diagnóstico", "Brechas", "Plan", "Documentos", "Evidencias", "Auditoría", "Acciones", "Dashboards", "Copiloto IA", "Reportes"];

const moduleCards = [
  {
    title: "Motor de diagnóstico",
    description: "Evalúa por norma, cláusula, proceso, evidencia, país, sector y madurez.",
  },
  {
    title: "Matriz de brechas",
    description: "Clasifica criticidad, impacto, evidencia, responsable, riesgo y acción sugerida.",
  },
  {
    title: "Plan de acción",
    description: "Convierte brechas en actividades, fechas, responsables e indicadores.",
  },
  {
    title: "Gestión documental",
    description: "Controla versiones, aprobaciones, vigencia, responsables y documentos afectados.",
  },
  {
    title: "Evidencias objetivas",
    description: "Vincula registros, archivos y pruebas a requisitos, procesos y auditorías.",
  },
  {
    title: "Auditoría y mejora",
    description: "Checklist, hallazgos, causa raíz, acciones correctivas y eficacia.",
  },
];

const dashboardCards = [
  { audience: "Cliente", title: "Operar el sistema", description: "Avance, evidencias, riesgos, acciones, documentos y auditorías." },
  { audience: "Comercial", title: "Priorizar oportunidades", description: "Leads por país, norma, score, urgencia y potencial." },
  { audience: "Técnico", title: "Detectar tendencias", description: "Brechas recurrentes, requisitos débiles y necesidades de capacitación." },
];

const architectureRows = [
  ["Frontend", "Next.js / PWA / componentes reutilizables", "Velocidad, SEO, experiencia móvil"],
  ["Backend", "API, motor de reglas, IA, reportes", "Escalabilidad e integración"],
  ["Datos", "PostgreSQL o MongoDB híbrido", "Diagnósticos, evidencias, leads y planes"],
  ["Integraciones", "CRM, WhatsApp, email, calendario, analytics", "Automatización comercial"],
  ["Seguridad", "MFA, roles, bitácoras, cifrado y respaldos", "Confidencialidad y trazabilidad"],
];

export default function PlataformaPage() {
  return (
    <main>
      <section className={`section ${styles.hero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (4).webp')" }} />
        <div className={`shell ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow sectionEyebrow">Producto SaaS</p>
            <h1>Un sistema vivo de gestión, evidencia y seguimiento ISO.</h1>
            <p>
              TransiQ no es una biblioteca de archivos. Es un ecosistema para
              operar diagnóstico, brechas, evidencias, auditorías internas,
              acciones, indicadores y reportes ejecutivos.
            </p>
            <div className={styles.heroActions}>
              <Link className="button buttonPrimary" href={buildAttributedHref("/demo", { canal: "plataforma-hero" })}>
                Probar plataforma
              </Link>
              <Link className="button buttonSecondary" href={buildAttributedHref("/diagnostico", { canal: "plataforma-hero" })}>
                Diagnóstico
              </Link>
            </div>
          </div>

          <aside className={`cardSurface ${styles.stackCard}`}>
            <h3>Stack funcional</h3>
            <div className={styles.stackTags}>
              {stackModules.map((module) => (
                <span key={module}>{module}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className={`section ${styles.modulesSection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <h2>Módulos que no se repiten: se conectan.</h2>
            <p>
              Cada módulo entrega información al siguiente para evitar capturas
              duplicadas y crear trazabilidad.
            </p>
          </div>

          <div className={styles.moduleGrid}>
            {moduleCards.map((card) => (
              <article key={card.title} className={`cardSurface ${styles.moduleCard}`}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className={`section ${styles.dashboardSection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <h2>Dashboards para tres decisiones distintas.</h2>
          </div>

          <div className={styles.dashboardGrid}>
            {dashboardCards.map((card) => (
              <article key={card.audience} className={`cardSurface ${styles.dashboardCard}`}>
                <span className={styles.audience}>{card.audience}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.architectureSection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <h2>Arquitectura recomendada.</h2>
          </div>

          <div className={`cardSurface ${styles.tableCard}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Capa</th>
                  <th>Recomendación</th>
                  <th>Objetivo</th>
                </tr>
              </thead>
              <tbody>
                {architectureRows.map(([layer, recommendation, goal]) => (
                  <tr key={layer}>
                    <td>{layer}</td>
                    <td>{recommendation}</td>
                    <td>{goal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
