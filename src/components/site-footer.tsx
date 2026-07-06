import Link from "next/link";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="eyebrow sectionEyebrow">TransiQ by ISOsolutions</p>
          <h3>Puerta de entrada comercial hacia la plataforma TransiQ.</h3>
          <p>
            Este sitio capta, califica y entrega leads a direccion y comercial.
            La operacion de la app TransiQ se gestiona por separado.
          </p>
        </div>
        <div className={styles.links}>
          <Link href="/soluciones">Soluciones</Link>
          <Link href="/diagnostico">Diagnostico</Link>
          <Link href="/recursos">Recursos</Link>
          <Link href="/contacto">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}
