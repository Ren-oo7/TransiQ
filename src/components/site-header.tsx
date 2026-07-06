import Link from "next/link";
import { navItems } from "@/data/site-content";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <Link className={styles.brand} href="/">
          <span className={styles.mark}>TQ</span>
          <span>
            <strong>TransiQ</strong>
            <small>by ISOsolutions | EQA Digital</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Navegacion principal">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link className="button buttonGhost" href="/login">
            Acceso TransiQ
          </Link>
          <Link className="button buttonPrimary" href="/diagnostico">
            Iniciar diagnostico
          </Link>
        </div>

        <button className={styles.mobileButton} type="button" aria-label="Abrir menu">
          =
        </button>
      </div>
    </header>
  );
}
