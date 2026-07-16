import { homeFlowSteps } from "@/data/site-content";
import styles from "./launch-section.module.css";

export function LaunchSection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Flujo del usuario</p>
          <h2>Una experiencia de 5 pasos sin fricción.</h2>
        </div>

        <div className={styles.flowGrid}>
          {homeFlowSteps.map((item) => (
            <article key={item.code} className={`cardSurface ${styles.flowCard}`}>
              <strong>{item.code}</strong>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
