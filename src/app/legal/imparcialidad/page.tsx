import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Declaración de imparcialidad | TransiQ",
  description: "Principios básicos de independencia, transparencia e imparcialidad de TransiQ by ISOsolutions.",
};

export default function ImparcialidadPage() {
  return (
    <main>
      <section className={`section ${styles.hero}`}>
        <div className="shell">
          <p className="eyebrow sectionEyebrow">Legal</p>
          <h1>Declaración de imparcialidad</h1>
          <p>Principios básicos para mantener una orientación clara, responsable e independiente.</p>
        </div>
      </section>

      <section className={`section ${styles.contentSection}`}>
        <div className={`shell ${styles.layout}`}>
          <aside className={styles.summary}>
            <span>Última actualización</span>
            <strong>14 de julio de 2026</strong>
            <p>TransiQ orienta y organiza información, pero no emite decisiones formales de certificación.</p>
          </aside>

          <article className={`cardSurface ${styles.document}`}>
            <section>
              <h2>1. Compromiso</h2>
              <p>TransiQ by ISOsolutions mantiene el compromiso de presentar diagnósticos, rutas y recomendaciones con objetividad, transparencia y respeto por la información proporcionada por cada organización.</p>
            </section>
            <section>
              <h2>2. Alcance de la plataforma</h2>
              <p>TransiQ es una herramienta de orientación, preparación, diagnóstico y seguimiento para Sistemas de Gestión ISO.</p>
            </section>
            <section>
              <h2>3. Límites del servicio</h2>
              <p>El uso de la plataforma no garantiza la certificación ni sustituye auditorías internas, auditorías de certificación o decisiones formales de conformidad.</p>
            </section>
            <section>
              <h2>4. Independencia</h2>
              <p>Las recomendaciones automáticas se basan en la información suministrada por el usuario y no deben interpretarse como una aprobación, certificación o declaración oficial de cumplimiento.</p>
            </section>
            <section>
              <h2>5. Conflictos de interés</h2>
              <p>Cualquier situación que pueda afectar la objetividad o independencia del servicio deberá identificarse y gestionarse de manera transparente.</p>
            </section>
            <section>
              <h2>6. Consultas</h2>
              <p>Las dudas relacionadas con imparcialidad, alcance o uso responsable de TransiQ pueden enviarse mediante nuestra página de contacto.</p>
              <Link className="button buttonSecondary" href="/contacto">Ir a contacto</Link>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
