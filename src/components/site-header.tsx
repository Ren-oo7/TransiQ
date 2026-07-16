"use client";

import { useState } from "react";
import Link from "next/link";
import { navItems } from "@/data/site-content";
import { buildAttributedHref } from "@/lib/lead-attribution";
import { getTransiqAppLoginUrl } from "@/lib/site-config";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const transiqAppUrl = getTransiqAppLoginUrl();

  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <Link className={styles.brand} href="/" onClick={() => setIsMobileMenuOpen(false)}>
          <span className={styles.mark}>TQ</span>
          <span>
            <strong>TransiQ</strong>
            <small>by ISOsolutions</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Navegación principal">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link className={`button buttonGhost ${styles.headerButton} ${styles.accessButton}`} href={transiqAppUrl}>
            Acceso
          </Link>
          <Link className={`button buttonPrimary ${styles.headerButton}`} href={buildAttributedHref("/diagnostico", { canal: "header" })}>
            Iniciar diagnóstico
          </Link>
        </div>

        <button
          className={`${styles.mobileButton} ${isMobileMenuOpen ? styles.mobileButtonActive : ""}`}
          type="button"
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobilePanel} aria-label="Menú móvil">
          <nav className={styles.mobileNav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={styles.mobileNavLink}
              >
                {item.label}
              </Link>
            ))}
            <hr className={styles.mobileDivider} />
            <div className={styles.mobileActions}>
              <Link
                className={`button buttonGhost ${styles.headerButton}`}
                href={transiqAppUrl}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Acceso
              </Link>
              <Link
                className={`button buttonPrimary ${styles.headerButton}`}
                href={buildAttributedHref("/diagnostico", { canal: "header-movil" })}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Iniciar diagnóstico
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
