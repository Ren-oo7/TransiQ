import Link from "next/link";
import { getTransiqAppLoginUrl } from "@/lib/site-config";
import styles from "./login-page.module.css";

export default function LoginPage() {
  const transiqAppUrl = getTransiqAppLoginUrl();
  const hasExternalAppUrl = transiqAppUrl !== "/login";

  return (
    <main className="section">
      <div className={`shell ${styles.layout}`}>
        <section className={styles.intro}>
          <p className="eyebrow">App TransiQ</p>
          <h1>La operación de TransiQ vive aparte de este sitio comercial.</h1>
          <p>
            Esta página web existe para vender, captar demanda y convertir oportunidades. La app TransiQ para clientes,
            cuentas autorizadas y operación real vive en una entrada separada.
          </p>

          <article className={`cardSurface ${styles.externalCard}`}>
            <p className="eyebrow sectionEyebrow">Acceso a la plataforma</p>
            <h2>Acceso a la plataforma TransiQ</h2>
            <p>
              Esta página comercial no reemplaza la aplicación operativa. El CRM comercial del sitio ya no se encuentra
              aquí; ahora vive bajo una zona separada para el equipo interno.
            </p>
            <div className={styles.actions}>
              <Link className="button buttonPrimary" href={hasExternalAppUrl ? transiqAppUrl : "/demo"}>
                {hasExternalAppUrl ? "Entrar a la app" : "Solicitar acceso o demo"}
              </Link>
              <Link className="button buttonGhost" href="/crm/login">
                Ir al CRM comercial
              </Link>
            </div>
            {!hasExternalAppUrl ? (
              <p>
                Falta configurar `TRANSIQ_APP_LOGIN_URL` para apuntar directamente al login real de la app.
              </p>
            ) : null}
          </article>
        </section>
      </div>
    </main>
  );
}

