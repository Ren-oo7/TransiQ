import { Suspense } from "react";
import { InteractiveForm } from "@/components/shared/interactive-form";
import styles from "@/styles/form-page.module.css";

export default function DemoPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className="eyebrow" style={{ color: "var(--color-accent-soft)" }}>Demostración en Vivo</p>
          <h1>Agenda una sesión ejecutiva de TransiQ</h1>
          <p>
            Descubre en vivo cómo TransiQ automatiza tu transición ISO, mapea brechas, gestiona evidencias y te prepara para la auditoría mediante inteligencia artificial.
          </p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="shell">
          <div className={styles.formContainer}>
            <Suspense fallback={
              <div className="cardSurface" style={{ padding: 40, display: "grid", placeItems: "center" }}>
                <p className="eyebrow">Cargando formulario...</p>
              </div>
            }>
              <InteractiveForm source="Solicitud de demo" defaultInterest="Diagnóstico" />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
