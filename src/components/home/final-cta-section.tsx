import Link from "next/link";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./final-cta-section.module.css";

export function FinalCtaSection() {
  return (
    <section className={`${styles.section} section`}>
      <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (4).webp')" }} />
      <div className={`shell ${styles.content}`}>
        <p className="eyebrow">Transición Inteligente</p>
        <h2>Empieza a digitalizar tu Sistema de Gestión ISO hoy</h2>
        <p className={styles.lead}>
          TransiQ te ayuda a diagnosticar de forma inteligente, mapear brechas críticas
          y automatizar tus evidencias para asegurar el éxito en tu próxima auditoría de certificación.
        </p>
        <div className={styles.actions}>
          <Link className="button buttonLight" href={buildAttributedHref("/demo", { canal: "cta-final" })}>
            Solicitar demo ejecutiva
          </Link>
          <Link className="button buttonSecondary" href={buildAttributedHref("/contacto", { canal: "cta-final" })}>
            Hablar con comercial
          </Link>
        </div>
        <p className={styles.disclaimer}>
          El diagnóstico tiene fines de orientación, preparación y mejora. No
          sustituye auditoría de certificación, no representa decisión de
          certificación y no garantiza obtención, mantenimiento o renovación de
          certificado.
        </p>
      </div>
    </section>
  );
}
