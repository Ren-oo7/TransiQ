import { dashboardPanels } from "@/data/site-content";
import styles from "./dashboard-section.module.css";

export function DashboardSection() {
  return (
    <section className="section">
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Dashboards para decisiones distintas</p>
          <h2>Cliente, comercial y técnico no leen el mismo tablero.</h2>
          <p>
            La plataforma debe generar valor para la organización evaluada y, al
            mismo tiempo, alimentar inteligencia comercial y técnica sin
            duplicar capturas ni análisis.
          </p>
        </div>

        <div className={styles.grid}>
          {dashboardPanels.map((panel) => (
            <article key={panel.audience} className={`cardSurface ${styles.card}`}>
              <p className="miniLabel">{panel.audience}</p>
              <h3>{panel.title}</h3>
              <ul>
                {panel.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
