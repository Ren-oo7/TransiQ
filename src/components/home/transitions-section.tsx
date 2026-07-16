import Link from "next/link";
import { normHighlights } from "@/data/site-content";
import styles from "./transitions-section.module.css";

export function TransitionsSection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Contenido para búsqueda orgánica</p>
          <h2>Páginas núcleo + páginas por norma.</h2>
          <p>
            El sitio incluye páginas permanentes para intención de búsqueda: diagnóstico ISO, transición ISO 9001:2026, ISO 14001:2026, ISO 45001, ISO 37001:2025 e ISO/IEC 27001.
          </p>
        </div>

        <div className={styles.grid}>
          {normHighlights.map((card) => (
            <article key={card.title} className={`cardSurface ${styles.card}`}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <Link className={styles.routeLink} href={card.href}>
                Ver página
              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
