import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Aviso de privacidad | TransiQ",
  description: "Información básica sobre el tratamiento de datos personales en TransiQ by ISOsolutions.",
};

export default function PrivacidadPage() {
  return (
    <main>
      <section className={`section ${styles.hero}`}>
        <div className="shell">
          <p className="eyebrow sectionEyebrow">Legal</p>
          <h1>Aviso de privacidad</h1>
          <p>Información básica sobre el uso y protección de los datos proporcionados a través de TransiQ.</p>
        </div>
      </section>

      <section className={`section ${styles.contentSection}`}>
        <div className={`shell ${styles.layout}`}>
          <aside className={styles.summary}>
            <span>Última actualización</span>
            <strong>14 de julio de 2026</strong>
            <p>Esta versión es informativa y deberá validarse legalmente antes de la publicación definitiva.</p>
          </aside>

          <article className={`cardSurface ${styles.document}`}>
            <section>
              <h2>1. Responsable</h2>
              <p>TransiQ by ISOsolutions es responsable del tratamiento de los datos personales recopilados mediante este sitio y sus formularios.</p>
            </section>
            <section>
              <h2>2. Datos que podemos recopilar</h2>
              <p>Podemos solicitar datos de identificación y contacto, empresa, país, norma ISO de interés, características generales de la organización y la información que el usuario decida compartir.</p>
            </section>
            <section>
              <h2>3. Finalidades</h2>
              <p>Los datos se utilizarán para personalizar diagnósticos, recursos y demos; generar rutas recomendadas; atender solicitudes; y dar seguimiento a los servicios expresamente solicitados.</p>
            </section>
            <section>
              <h2>4. Protección y conservación</h2>
              <p>Se aplicarán medidas razonables de seguridad para proteger la información. Los datos se conservarán únicamente durante el tiempo necesario para las finalidades indicadas y las obligaciones aplicables.</p>
            </section>
            <section>
              <h2>5. Derechos y contacto</h2>
              <p>El titular podrá solicitar acceso, rectificación, actualización o eliminación de sus datos, así como expresar dudas sobre su tratamiento, mediante nuestra página de contacto.</p>
              <Link className="button buttonSecondary" href="/contacto">Ir a contacto</Link>
            </section>
            <section>
              <h2>6. Cambios al aviso</h2>
              <p>Cualquier actualización relevante se publicará en esta misma página indicando la fecha de modificación.</p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
