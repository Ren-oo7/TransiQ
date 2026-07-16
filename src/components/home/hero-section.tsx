import Link from "next/link";
import { heroMetrics } from "@/data/site-content";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (1).webp')" }} />
      <div className={`shell ${styles.grid}`}>
        <div className={styles.content}>
          <p className="eyebrow">Plataforma ISO con IA · Diagnóstico · Evidencia · Seguimiento</p>
          <h1 className={styles.title}>
            La forma más inteligente de preparar, operar y demostrar tu Sistema de Gestión ISO.
          </h1>
          <p className={styles.lead}>
            TransiQ convierte una necesidad normativa en una ruta accionable:
            evalúa madurez, identifica brechas, recomienda evidencias, genera
            planes y activa el siguiente paso sin depender primero de una
            llamada comercial.
          </p>
          <div className={styles.actions}>
            <Link className="button buttonPrimary" href={buildAttributedHref("/diagnostico", { canal: "hero-principal" })}>
              Iniciar diagnóstico inteligente
            </Link>
            <Link className="button buttonSecondary" href={buildAttributedHref("/demo", { canal: "hero-principal" })}>
              Probar Experience Lab
            </Link>
            <Link className="button buttonGhost" href="/soluciones">
              Explorar rutas ISO
            </Link>
          </div>
          <div className={styles.trustRow} aria-label="Cobertura geográfica">
            {["México", "LATAM", "Europa", "Asia", "Global"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <aside className={styles.dashboard} aria-label="Vista previa del tablero TransiQ">
          <div className={styles.radarCard}>
            <div className={styles.scoreRing}>
              <span>72%</span>
            </div>
            <div className={styles.radarCopy}>
              <b>Resultado automático en minutos</b>
              <p>
                Madurez, brechas, riesgos, evidencias y ruta recomendada para ISO 9001, ISO 14001, ISO 45001, ISO 37001, ISO/IEC 27001 y Sistemas Integrados.
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

        </aside>
      </div>
    </section>
  );
}
