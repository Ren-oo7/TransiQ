import Link from "next/link";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { isUsingDemoAuth } from "@/lib/admin-auth";
import styles from "./login-page.module.css";

export default function LoginPage() {
  const demoMode = isUsingDemoAuth();

  return (
    <main className="section">
      <div className={`shell ${styles.layout}`}>
        <section className={styles.intro}>
          <p className="eyebrow">Accesos TransiQ</p>
          <h1>La operacion vive en la app existente; el CRM vive en este sitio.</h1>
          <p>
            Desde aqui conviviran dos entradas distintas: el acceso oficial a la app TransiQ para clientes y usuarios
            autorizados, y el acceso interno del equipo comercial que administra los leads del sitio web.
          </p>

          <article className={`cardSurface ${styles.externalCard}`}>
            <p className="eyebrow sectionEyebrow">App existente</p>
            <h2>Acceso a la plataforma TransiQ</h2>
            <p>
              Esta pagina comercial no reemplaza la aplicacion operativa. Cuando definamos la URL oficial del sistema,
              aqui vivira el enlace directo al login real de clientes o cuentas de prueba.
            </p>
            <div className={styles.actions}>
              <Link className="button buttonPrimary" href="/demo">
                Solicitar acceso o demo
              </Link>
              <Link className="button buttonGhost" href="/">
                Volver al inicio
              </Link>
            </div>
          </article>
        </section>

        <AdminLoginForm demoMode={demoMode} />
      </div>
    </main>
  );
}
