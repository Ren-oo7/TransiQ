import { architectureItems } from "@/data/site-content";
import styles from "./architecture-section.module.css";

export function ArchitectureSection() {
  return (
    <section className="section">
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Arquitectura web propuesta</p>
          <h2>Ruta tecnica para evolucionar esta experiencia comercial.</h2>
        </div>
        <div className={styles.grid}>
          {architectureItems.map((item) => (
            <article key={item.title} className={`cardSurface ${styles.item}`}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
