import Link from "next/link";
import { missionCards } from "@/data/site-content";
import styles from "./feature-stats-section.module.css";

export function FeatureStatsSection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Arquitectura sin repetición</p>
          <h2>Un sitio simple: cada página tiene una misión.</h2>
          <p>
            El sitio fue reorganizado para evitar duplicidad: Home orienta, Soluciones dirige, Diagnóstico convierte, Plataforma explica, Recursos atrae orgánicamente, Demo permite probar y Contacto queda como apoyo opcional.
          </p>
        </div>

        <div className={styles.statsGrid}>
          {missionCards.map((item) => (
            <article key={item.code} className={`cardSurface ${styles.statCard}`}>
              <strong>{item.code}</strong>
              <h3>{item.title}</h3>
              <span>{item.text}</span>
              <Link className={styles.link} href={item.href}>
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
