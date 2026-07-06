import Link from "next/link";
import { transitionCards } from "@/data/site-content";
import styles from "./transitions-section.module.css";

export function TransitionsSection() {
  return (
    <section className="section">
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Oportunidad normativa</p>
          <h2>La transicion ISO no se improvisa. Se diagnostica, se planifica y se ejecuta.</h2>
          <p>
            El sitio principal debe abrir con esta narrativa: las organizaciones
            certificadas necesitan anticipar brechas, actualizar sistemas y
            demostrar eficacia con evidencia, no solo cambiar documentos.
          </p>
        </div>

        <div className={styles.grid}>
          {transitionCards.map((card) => (
            <article key={card.code} className={`cardSurface ${styles.card}`}>
              <span className={styles.code}>{card.code}</span>
              <h3>{card.title}</h3>
              <p>
                <b>{card.status}</b>
              </p>
              <p>{card.description}</p>
              <ul>
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className={`cardSurface ${styles.notice}`}>
          <div>
            <strong>Mensaje recomendado para landing principal</strong>
            <p>
              Evalua hoy tu nivel de preparacion para la nueva generacion ISO.
              TransiQ identifica brechas, prioriza acciones y construye una ruta
              clara para actualizar, implementar y administrar tu sistema de
              gestion con asistencia digital.
            </p>
          </div>
          <Link className="button buttonPrimary" href="/diagnostico">
            Evaluar ahora
          </Link>
        </div>
      </div>
    </section>
  );
}
