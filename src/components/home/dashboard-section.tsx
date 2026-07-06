import { dashboardPanels } from "@/data/site-content";
import styles from "./dashboard-section.module.css";

export function DashboardSection() {
  return (
    <section className="section">
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Dashboards de operacion</p>
          <h2>Disenado para clientes, equipo comercial y especialistas tecnicos.</h2>
          <p>
            La aplicacion debe generar valor para la organizacion evaluada y, al
            mismo tiempo, alimentar inteligencia comercial para EQA Group.
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
