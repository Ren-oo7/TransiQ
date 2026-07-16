"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getTransiqAppLoginUrl } from "@/lib/site-config";
import styles from "./crm-shell.module.css";

type CrmShellProps = {
  children: ReactNode;
};

const crmNavGroups = [
  {
    label: "Embudo comercial",
    items: [
      { href: "/crm", label: "Dashboard" },
      { href: "/crm/leads", label: "Leads" },
      { href: "/crm/pipeline", label: "Pipeline" },
      { href: "/crm/actividad", label: "Actividad" },
    ],
  },
  {
    label: "Captación",
    items: [
      { href: "/crm/campanas", label: "Canales de captación" },
      { href: "/crm/reportes", label: "Reportes" },
    ],
  },
  {
    label: "Gestión interna",
    items: [
      { href: "/crm/equipo", label: "Equipo" },
    ],
  },
];

export function CrmShell({ children }: CrmShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const transiqAppUrl = getTransiqAppLoginUrl();
  const isLoginPage = pathname === "/crm/login";
  const isPipelinePage = pathname?.startsWith("/crm/pipeline");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/crm/login?loggedOut=1");
    router.refresh();
  }

  if (isLoginPage) {
    return (
      <div className={`${styles.shell} ${styles.loginShell}`}>
        <main className={styles.loginMain}>
          <div className={styles.loginInner}>{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.brand}>
              <div className={styles.brandMark}>CRM</div>
              <div>
                <strong>CRM comercial TransiQ</strong>
                <span>Captación, seguimiento y conversión de leads del sitio web</span>
              </div>
            </div>

            <div className={styles.navPanel}>
              <div className={styles.navHeader}>
                <span className={styles.sectionLabel}>Navegación</span>
              </div>
              <div className={styles.navGroups}>
                {crmNavGroups.map((group) => (
                  <div key={group.label} className={styles.navWrap}>
                    <span className={styles.groupLabel}>{group.label}</span>
                    <nav className={styles.nav} aria-label={`Navegacion CRM ${group.label}`}>
                      {group.items.map((item) => {
                        const isActive =
                          item.href === "/crm" ? pathname === item.href : pathname.startsWith(item.href);

                        return (
                          <Link key={item.href} href={item.href} data-active={isActive}>
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                ))}
                <div className={styles.navWrap}>
                  <span className={styles.groupLabel}>Accesos</span>
                  <nav className={`${styles.nav} ${styles.accessNav}`} aria-label="Accesos del CRM">
                    <Link href="/">
                      <span>Ir al sitio</span>
                    </Link>
                    <Link href={transiqAppUrl}>
                      <span>Acceso TransiQ</span>
                    </Link>
                    <button type="button" onClick={logout}>
                      <span>Salir</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={`${styles.mainInner} ${isPipelinePage ? styles.mainInnerWide : ""}`}>{children}</div>
        </main>
      </div>
    </div>
  );
}
