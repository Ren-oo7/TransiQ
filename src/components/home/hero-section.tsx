import Link from "next/link";
import { heroMetrics, heroStandards } from "@/data/site-content";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={`shell ${styles.grid}`}>
        <div className={styles.content}>
          <p className="eyebrow">Nueva generacion ISO 2026 | Diagnostico | Brechas | Plan de accion</p>
          <h1 className={styles.title}>
            Transiciona, implementa y administra sistemas de gestion ISO con inteligencia aplicada.
          </h1>
          <p className={styles.lead}>
            TransiQ convierte la incertidumbre normativa en una ruta ejecutable:
            evalua madurez, identifica brechas, genera planes de transicion y da
            seguimiento desde una experiencia comercial pensada para captar y
            convertir demanda calificada.
          </p>
          <div className={styles.actions}>
            <Link className="button buttonPrimary" href="/diagnostico">
              Realizar diagnostico gratuito
            </Link>
            <Link className="button buttonSecondary" href="/demo">
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
              <p className={`miniLabel ${styles.dashboardLabel}`}>Preparacion global</p>
              <strong>64%</strong>
            </div>
            <span className="statusPill statusWarning">En transicion</span>
          </div>

          <div className={styles.radarCard}>
            <div className={styles.scoreRing}>
              <span>64%</span>
            </div>
            <div className={styles.radarCopy}>
              <b>Prioridad detectada</b>
              <p>
                Control documental, evidencias objetivas y auditoria interna
                requieren atencion antes de la transicion.
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
              Con base en tu diagnostico, priorizaria liderazgo, riesgos,
              evaluacion del desempeno y evidencia trazable.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
