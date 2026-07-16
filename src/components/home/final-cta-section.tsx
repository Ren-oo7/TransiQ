import Link from "next/link";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./final-cta-section.module.css";

export function FinalCtaSection() {
  return (
    <section className={`${styles.section} section`}>
      <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (4).webp')" }} />
      <div className={`shell ${styles.content}`}>
        <h2>Convierte tu necesidad ISO en una ruta clara, medible y trazable.</h2>
        <p className={styles.lead}>
          Empieza por diagnóstico, demo autónoma o recursos personalizados.
        </p>
        <div className={styles.actions}>
          <Link className="button buttonLight" href={buildAttributedHref("/diagnostico", { canal: "cta-final" })}>
            Iniciar diagnóstico
          </Link>
          <Link className="button buttonSecondary" href={buildAttributedHref("/demo", { canal: "cta-final" })}>
            Probar demo
          </Link>
        </div>
      </div>
    </section>
  );
}
