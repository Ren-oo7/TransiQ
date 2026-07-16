import Link from "next/link";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.grid}`}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <span className={styles.mark}>TQ</span>
            <span>
              <strong>TransiQ</strong>
              <small>by ISOsolutions</small>
            </span>
          </div>
          <p className={styles.tagline}>
            Plataforma inteligente para diagnóstico, transición, implementación, evidencia y seguimiento de sistemas de gestión ISO.
          </p>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} TransiQ. Todos los derechos reservados.
          </span>
        </div>

        <div className={styles.linksCol}>
          <h4>Soluciones ISO</h4>
          <Link href="/soluciones/iso-9001">ISO 9001:2026 (Calidad)</Link>
          <Link href="/soluciones/iso-14001">ISO 14001:2026 (Ambiente)</Link>
          <Link href="/soluciones/iso-45001">ISO 45001 (SST)</Link>
          <Link href="/soluciones/iso-37001">ISO 37001:2025 (Antisoborno)</Link>
          <Link href="/soluciones/iso-27001">ISO/IEC 27001 (Seguridad)</Link>
        </div>

        <div className={styles.linksCol}>
          <h4>Navegación</h4>
          <Link href="/">Inicio</Link>
          <Link href={buildAttributedHref("/diagnostico", { canal: "footer" })}>Diagnóstico</Link>
          <Link href="/soluciones">Soluciones</Link>
          <Link href="/plataforma">Plataforma</Link>
          <Link href="/recursos">Recursos</Link>
          <Link href={buildAttributedHref("/demo", { canal: "footer" })}>Demo</Link>
          <Link href={buildAttributedHref("/contacto", { canal: "footer" })}>Contacto</Link>
        </div>

        <div className={styles.legalCol}>
          <h4>Legal y equipo</h4>
          <Link href="/legal/privacidad">Aviso de privacidad</Link>
          <Link href="/legal/imparcialidad">Declaración de imparcialidad</Link>
          <Link href="/login">Acceso CRM Staff</Link>
          <p className={styles.disclaimer}>
            <b>Nota de Imparcialidad:</b> El diagnóstico emitido por TransiQ / ISOsolutions tiene fines de orientación, preparación y mejora. No sustituye una auditoría de certificación y no garantiza la obtención de certificados.
          </p>
        </div>
      </div>
    </footer>
  );
}
