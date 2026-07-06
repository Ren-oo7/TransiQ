import Link from "next/link";
import styles from "./final-cta-section.module.css";

export function FinalCtaSection() {
  return (
    <section className={`${styles.section} section`}>
      <div className={`shell ${styles.content}`}>
        <p className="eyebrow">Lanzamiento comercial</p>
        <h2>Activa TransiQ como motor de captacion, diagnostico y conversion de oportunidades ISO.</h2>
        <p className={styles.lead}>
          Recomendacion: publicar primero la landing principal con diagnostico
          gratuito, campana de ISO 14001:2026 e ISO 9001:2026, y despues escalar
          a modulos de seguimiento, formularios persistentes y CRM interno.
        </p>
        <div className={styles.actions}>
          <Link className="button buttonLight" href="/demo">
            Solicitar demo ejecutiva
          </Link>
          <Link className="button buttonSecondary" href="/contacto">
            Hablar con comercial
          </Link>
        </div>
        <p className={styles.disclaimer}>
          El diagnostico tiene fines de orientacion, preparacion y mejora. No
          sustituye auditoria de certificacion, no representa decision de
          certificacion y no garantiza obtencion, mantenimiento o renovacion de
          certificado.
        </p>
      </div>
    </section>
  );
}
