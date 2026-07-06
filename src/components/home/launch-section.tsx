import Link from "next/link";
import { launchCalendar, launchFunnel, launchHooks } from "@/data/site-content";
import styles from "./launch-section.module.css";

export function LaunchSection() {
  return (
    <section className="section sectionAlt">
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Documento de lanzamiento integrado</p>
          <h2>Bloques recomendados para landing, campanas y salida comercial.</h2>
          <p>
            Estos contenidos pueden ubicarse en la landing principal, paginas por
            norma y materiales de pre-lanzamiento.
          </p>
        </div>

        <div className={styles.layout}>
          <article className={`cardSurface ${styles.card} ${styles.primary}`}>
            <p className="miniLabel">Claim principal</p>
            <h3>La nueva generacion ISO ya comenzo.</h3>
            <p>
              Prepara tu transicion ISO 9001:2026, ISO 14001:2026, ISO 45001,
              ISO 37001:2025 y sistemas integrados con diagnostico digital,
              analisis de brechas y plan de accion.
            </p>
            <Link className="button buttonPrimary" href="/diagnostico">
              Realiza tu diagnostico
            </Link>
          </article>

          <article className={`cardSurface ${styles.card}`}>
            <h3>Hooks para campana</h3>
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
