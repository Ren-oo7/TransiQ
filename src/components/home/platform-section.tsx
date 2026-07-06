import { platformModules, workflowSteps } from "@/data/site-content";
import styles from "./platform-section.module.css";

export function PlatformSection() {
  return (
    <section className="section sectionAlt">
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Sistema de gestion inteligente</p>
          <h2>Una plataforma para operar el sistema, no solo para diagnosticarlo.</h2>
          <p>
            TransiQ debe posicionarse como un ecosistema: diagnostico, control
            documental, gestion de evidencias, auditorias, acciones, riesgos,
            indicadores y reportes ejecutivos.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={`cardSurface ${styles.copy}`}>
            <h3>Modulos funcionales propuestos</h3>
            <p>
              El MVP debe ser comercialmente util desde el primer dia y escalable
              hacia una plataforma SaaS multinorma y multipais.
            </p>
            <div className={styles.tags}>
              {platformModules.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className={`cardSurface ${styles.workflow}`}>
            <p className="miniLabel">Flujo de valor</p>
            <ol className={styles.timeline}>
              {workflowSteps.map((step) => (
                <li key={step.code}>
                  <span>{step.code}</span>
                  <b>{step.title}</b>
                  <small>{step.description}</small>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
