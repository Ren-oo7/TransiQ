"use client";

import { useState } from "react";
import { resources } from "@/data/site-content";
import { standards } from "@/data/diagnostic-content";
import {
  computeDiagnostic,
  createInitialAnswers,
  createInitialOrgData,
  type OrgData,
} from "@/lib/diagnostic-engine";
import styles from "./recursos.module.css";

type ResourceItem = {
  title: string;
  description: string;
};

export default function RecursosPage() {
  const [activeResource, setActiveResource] = useState<ResourceItem | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [standard, setStandard] = useState("qms");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  function getBadge(title: string) {
    if (title.toLowerCase().includes("checklist")) {
      return { label: "Guía", className: `${styles.badge} ${styles.guideBadge}` };
    }
    if (title.toLowerCase().includes("webinar")) {
      return { label: "Webinar", className: `${styles.badge} ${styles.webinarBadge}` };
    }
    return { label: "Ebook", className: `${styles.badge} ${styles.ebookBadge}` };
  }

  async function handleDownloadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !company.trim()) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }

    setIsSubmitting(true);

    // Prepare a mock OrgData object
    const org: OrgData = {
      ...createInitialOrgData(),
      company: company.trim(),
      contact: email.trim(),
      standard: standard,
      interest: "Capacitacion",
    };

    // Calculate a mock state to pass to lead store
    const emptyAnswers = createInitialAnswers(standard);
    const state = computeDiagnostic(org, emptyAnswers);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org,
          answers: emptyAnswers,
          state,
          source: `Descarga de recurso: ${activeResource?.title}`,
          notes: `Nombre del prospecto: ${name.trim()}\nCorreo capturado: ${email.trim()}\nDescargó el recurso comercial: "${activeResource?.title}"`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Hubo un problema al registrar la descarga.");
        return;
      }

      setDownloadSuccess(true);
    } catch {
      setError("No se pudo procesar tu descarga. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeModal() {
    setActiveResource(null);
    setName("");
    setEmail("");
    setCompany("");
    setDownloadSuccess(false);
    setError("");
  }

  return (
    <main>
      <section className={`section ${styles.hero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (2).webp')" }} />
        <div className={`shell ${styles.heroCopy}`}>
          <p className="eyebrow sectionEyebrow">Biblioteca de Valor</p>
          <h1>Recursos para liderar tu transición ISO</h1>
          <p>
            Accede a guías ejecutivas, listas de verificación y herramientas metodológicas preparadas por expertos de ISOsolutions para asegurar el éxito en tu sistema de gestión.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className={styles.grid}>
            {resources.map((resource) => {
              const badgeInfo = getBadge(resource.title);
              return (
                <article key={resource.title} className={styles.card}>
                  <span className={badgeInfo.className}>{badgeInfo.label}</span>
                  <h2>{resource.title}</h2>
                  <p>{resource.description}</p>
                  <button
                    className="button buttonPrimary"
                    type="button"
                    onClick={() => setActiveResource(resource)}
                  >
                    Descargar recurso gratis
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de descarga */}
      {activeResource && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>✕</button>

            {!downloadSuccess ? (
              <>
                <div className={styles.modalHeader}>
                  <p className="eyebrow">Descarga gratuita</p>
                  <h3>{activeResource.title}</h3>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.modalForm} onSubmit={handleDownloadSubmit}>
                  <label className={styles.field}>
                    Nombre completo *
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    Correo electrónico corporativo *
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@empresa.com"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    Empresa *
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Nombre de tu organización"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    Norma ISO de interés
                    <select value={standard} onChange={(e) => setStandard(e.target.value)}>
                      {Object.entries(standards).map(([key, std]) => (
                        <option key={key} value={key}>
                          {std.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className={styles.modalActions}>
                    <button
                      className="button buttonPrimary downloadBtn"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Procesando..." : "Obtener descarga gratis"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className={styles.modalSuccess}>
                <span className={styles.successIcon}>✓</span>
                <h4>¡Registro completado!</h4>
                <p>
                  El recurso <b>&ldquo;{activeResource.title}&rdquo;</b> se ha enviado directamente a tu correo electrónico. Revisa tu bandeja de entrada o spam.
                </p>
                <button
                  className="button buttonSecondary downloadBtn"
                  type="button"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
