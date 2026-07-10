import Link from "next/link";
import { solutions } from "@/data/site-content";
import styles from "./soluciones.module.css";

export default function SolucionesPage() {
  // Helper to map solution slug to a representative cover image
  function getCardImage(slug: string) {
    if (slug.includes("9001")) return "/imagenes/iso-9001/iso-9001 (2).webp";
    if (slug.includes("14001")) return "/imagenes/iso-14001/iso-14001 (2).webp";
    if (slug.includes("45001")) return "/imagenes/iso-45001/iso-45001 (2).webp";
    if (slug.includes("37001")) return "/imagenes/iso-37001/iso-37001 (2).webp";
    return "/imagenes/Genericas/eqa (5).webp";
  }

  return (
    <main>
      <section className={`section ${styles.hero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (3).webp')" }} />
        <div className={`shell ${styles.heroCopy}`}>
          <p className="eyebrow sectionEyebrow">Ecosistema Normativo ISO</p>
          <h1>Páginas de Solución por Norma y Eje de Gestión</h1>
          <p>
            Cada solución está diseñada para responder a las necesidades específicas de tu sector,
            audiencia y nivel de madurez, proporcionando una ruta interactiva hacia la certificación.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className={styles.grid}>
            {solutions.map((solution) => (
              <article key={solution.slug} className={styles.card}>
                <div 
                  className={styles.cardCover} 
                  style={{ backgroundImage: `url('${getCardImage(solution.slug)}')` }}
                />
                <div className={styles.cardContent}>
                  <span className={styles.cardTag}>{solution.label}</span>
                  <h2>{solution.summary}</h2>
                  <p><b>Público objetivo:</b> {solution.audience}</p>
                  <Link className={styles.cardLink} href={`/soluciones/${solution.slug}`}>
                    Ver detalles de la solución &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
