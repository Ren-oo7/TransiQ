import { architectureItems } from "@/data/site-content";
import styles from "./architecture-section.module.css";

export function ArchitectureSection() {
  return (
    <section className="section">
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Todo conectado</p>
          <h2>Lo que puedes resolver con TransiQ en un solo lugar.</h2>
          <p>
            Desde el diagnóstico inicial hasta el seguimiento, la idea es que tu
            sistema tenga continuidad, claridad y mejor trazabilidad.
          </p>
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
