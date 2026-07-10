import Link from "next/link";
import { transitionCards } from "@/data/site-content";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./transitions-section.module.css";

export function TransitionsSection() {
  return (
    <section className="section">
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Anticipación Normativa</p>
          <h2>La transición ISO no se improvisa. Se diagnostica, se planifica y se ejecuta.</h2>
          <p>
            El camino hacia la conformidad no consiste en acumular carpetas de documentos. Las organizaciones excelentes
            anticipan los cambios normativos, evalúan sus brechas de forma continua y demuestran la eficacia de su sistema
            con evidencias objetivas y digitales.
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
            <strong>Obtén tu Reporte de Brechas preliminar sin costo</strong>
            <p>
              Evalúa hoy el nivel de preparación de tu sistema frente a las normas ISO de nueva generación.
              TransiQ analiza tus debilidades por proceso, te proporciona un plan de acción sugerido a 12 meses
              y te prepara para el éxito de cara a tu próxima auditoría.
            </p>
          </div>
          <Link className="button buttonPrimary" href={buildAttributedHref("/diagnostico", { canal: "bloque-transicion" })}>
            Iniciar diagnóstico gratis
          </Link>
        </div>
      </div>
    </section>
  );
}
