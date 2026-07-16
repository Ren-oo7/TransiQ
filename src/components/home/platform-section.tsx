import Link from "next/link";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./platform-section.module.css";

const homeModules = ["Diagnóstico IA", "Brechas", "Evidencias", "Plan de acción", "Dashboard", "Recursos", "Demo autónoma", "Escalamiento opcional"];

export function PlatformSection() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="shell">
        <div className="sectionHeading">
          <p className="eyebrow sectionEyebrow">Ruta principal</p>
          <h2>Primero plataforma + IA. Después automatización. Al final intervención humana opcional.</h2>
          <p>
            La interacción está diseñada para escalar globalmente: el usuario se autosegmenta, recibe valor automático y solo escala a especialista cuando el proyecto es estratégico, multinorma, multisitio o complejo.
          </p>
          <Link className="button buttonPrimary" href={buildAttributedHref("/diagnostico", { canal: "home-ruta-principal" })}>Iniciar ruta automática</Link>
        </div>

        <div className={styles.layout}>
          <div className={`cardSurface ${styles.copy}`}>
            <div className={styles.tags}>
              {homeModules.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
