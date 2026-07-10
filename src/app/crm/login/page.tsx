import { Suspense } from "react";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { isUsingDemoAuth } from "@/lib/admin-auth";
import styles from "../../login/login-page.module.css";

export default function CrmLoginPage() {
  const demoMode = isUsingDemoAuth();

  return (
    <main className="section">
      <div className={styles.layout}>
        <section className={styles.intro}>
          <p className="eyebrow">CRM de leads</p>
          <h1>Este acceso es exclusivo para el equipo comercial del sitio web.</h1>
          <p>
            Aquí vive el seguimiento de oportunidades, pipeline y notas internas del negocio que comercializa TransiQ.
            No forma parte de la app operativa usada por clientes.
          </p>
        </section>

        <Suspense fallback={
          <div className="cardSurface" style={{ padding: 32, display: "grid", placeItems: "center" }}>
            <p className="eyebrow">Cargando...</p>
          </div>
        }>
          <AdminLoginForm demoMode={demoMode} />
        </Suspense>
      </div>
    </main>
  );
}
