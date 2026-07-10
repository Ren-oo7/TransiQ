import Link from "next/link";
import { heroMetrics, heroStandards } from "@/data/site-content";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (1).webp')" }} />
      <div className={`shell ${styles.grid}`}>
        <div className={styles.content}>
          <p className="eyebrow">Nueva generación ISO 2026 | Diagnóstico | Brechas | Plan de acción</p>
          <h1 className={styles.title}>
            Transiciona, implementa y administra sistemas de gestión ISO con inteligencia aplicada.
          </h1>
          <p className={styles.lead}>
            TransiQ convierte la incertidumbre normativa en una ruta ejecutable:
            evalúa madurez, identifica brechas, genera planes de transición y da
            seguimiento desde una experiencia comercial pensada para captar y
            convertir demanda calificada.
          </p>
          <div className={styles.actions}>
            <Link className="button buttonPrimary" href={buildAttributedHref("/diagnostico", { canal: "hero-principal" })}>
              Realizar diagnóstico gratuito
            </Link>
            <Link className="button buttonSecondary" href={buildAttributedHref("/demo", { canal: "hero-principal" })}>
              Solicitar demo ejecutiva
            </Link>
          </div>
          <div className={styles.trustRow} aria-label="Normas disponibles">
            {heroStandards.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <aside className={styles.dashboard} aria-label="Vista previa del tablero TransiQ">
          <div className={styles.dashboardHeader}>
            <div>
              <p className={`miniLabel ${styles.dashboardLabel}`}>Preparación global</p>
              <strong>64%</strong>
            </div>
            <span className="statusPill statusWarning">En transición</span>
          </div>

          <div className={styles.radarCard}>
            <div className={styles.scoreRing}>
              <span>64%</span>
            </div>
            <div className={styles.radarCopy}>
              <b>Prioridad detectada</b>
              <p>
                Control documental, evidencias objetivas y auditoría interna
                requieren atención antes de la transición.
              </p>
            </div>
          </div>

          <div className={styles.metricList}>
            {heroMetrics.map((metric) => (
              <div key={metric.label} className={styles.metricRow}>
                <span>{metric.label}</span>
                <b>{metric.value}</b>
              </div>
            ))}
          </div>

          <div className={styles.aiCard}>
            <span>Copiloto IA</span>
            <p>
              Con base en tu diagnóstico, priorizaría liderazgo, riesgos,
              evaluación del desempeño y evidencia trazable.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
