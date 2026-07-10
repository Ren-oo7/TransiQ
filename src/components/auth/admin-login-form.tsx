"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./admin-login-form.module.css";

type AdminLoginFormProps = {
  demoMode: boolean;
};

export function AdminLoginForm({ demoMode }: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(demoMode ? "director@transiq.local" : "");
  const [password, setPassword] = useState(demoMode ? "TransiQ2026!" : "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = searchParams.get("next") || "/crm";
  const loggedOut = searchParams.get("loggedOut") === "1";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No fue posible iniciar sesión.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Falló la conexión con el login interno.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className={`cardSurface ${styles.card}`}>
      <div className={styles.header}>
        <p className="eyebrow sectionEyebrow">CRM interno</p>
        <h2>Ingreso para dirección y comercial</h2>
        <p>
          Este acceso protege la bandeja comercial y el seguimiento de leads del sitio.
        </p>
      </div>

      {loggedOut ? <div className={styles.info}>La sesión se cerró correctamente.</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          Correo interno
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="director@empresa.com" />
        </label>

        <label className={styles.field}>
          Contraseña
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Tu contraseña" />
        </label>

        <button className="button buttonPrimary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : "Entrar al CRM"}
        </button>
      </form>

      <div className={styles.helper}>
        <p className="miniLabel">Configuración de acceso</p>
        {demoMode ? (
          <>
            <ul className={styles.list}>
              <li>Director: `director@transiq.local` / `TransiQ2026!`</li>
              <li>Comercial: `comercial@transiq.local` / `TransiQ2026!`</li>
            </ul>
            <p>
              Este modo demo solo debe usarse en desarrollo local. Para hosting real configura las variables de entorno del CRM.
            </p>
          </>
        ) : (
          <p>
            Este entorno usa credenciales definidas por variables de entorno. El acceso demo ya no está habilitado aquí.
          </p>
        )}
      </div>
    </article>
  );
}
