import Link from "next/link";
import { launchCalendar, launchFunnel, launchHooks } from "@/data/site-content";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./launch-section.module.css";

export function LaunchSection() {
  return (
    <section className="section sectionAlt">
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Documento de lanzamiento integrado</p>
          <h2>Bloques recomendados para landing, campañas y salida comercial.</h2>
          <p>
            Estos contenidos pueden ubicarse en la landing principal, páginas por
            norma y materiales de pre-lanzamiento.
          </p>
        </div>

        <div className={styles.layout}>
          <article className={`cardSurface ${styles.card} ${styles.primary}`}>
            <p className="miniLabel">Claim principal</p>
            <h3>La nueva generación ISO ya comenzó.</h3>
            <p>
              Prepara tu transición ISO 9001:2026, ISO 14001:2026, ISO 45001,
              ISO 37001:2025 y sistemas integrados con diagnóstico digital,
              análisis de brechas y plan de acción.
            </p>
            <Link className="button buttonPrimary" href={buildAttributedHref("/diagnostico", { canal: "bloque-lanzamiento" })}>
              Realiza tu diagnóstico
            </Link>
          </article>

          <article className={`cardSurface ${styles.card}`}>
            <h3>Hooks para campaña</h3>
            <ul>
              {launchHooks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={`cardSurface ${styles.card}`}>
            <h3>Embudo recomendado</h3>
            <ol>
              {launchFunnel.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
        </div>

        <div className={styles.calendar}>
          {launchCalendar.map((item) => (
            <article key={item.week} className={`cardSurface ${styles.calendarItem}`}>
              <strong>{item.week}</strong>
              <span>{item.text}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
