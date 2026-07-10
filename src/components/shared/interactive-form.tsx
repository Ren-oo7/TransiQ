"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { standards } from "@/data/diagnostic-content";
import {
  computeDiagnostic,
  createInitialAnswers,
  createInitialOrgData,
  type OrgData,
} from "@/lib/diagnostic-engine";
import { buildLeadSource } from "@/lib/lead-attribution";
import styles from "./interactive-form.module.css";

type InteractiveFormProps = {
  source: string;
  defaultInterest: string;
};

export function InteractiveForm({ source, defaultInterest }: InteractiveFormProps) {
  const searchParams = useSearchParams();

  function getInitialOrgData() {
    const normaParam = searchParams.get("norma") || searchParams.get("standard");
    const initialStandard = normaParam && standards[normaParam] ? normaParam : "qms";
    return {
      ...createInitialOrgData(),
      standard: initialStandard,
      interest: defaultInterest || "Diagnóstico",
    };
  }

  function getLeadSource(currentStandard: string) {
    return buildLeadSource({
      entryPoint: source,
      channel: searchParams.get("canal"),
      standardKey: currentStandard,
    });
  }

  const [org, setOrg] = useState<OrgData>(() => getInitialOrgData());

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function updateOrgField(field: keyof OrgData, value: string) {
    setOrg((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!org.company.trim() || !org.contact.trim()) {
      setError("Por favor, ingresa el nombre de tu empresa y tus datos de contacto.");
      return;
    }

    setIsSubmitting(true);

    // Compute standard diagnosis with empty answers for the SQLite payload
    const emptyAnswers = createInitialAnswers(org.standard);
    const state = computeDiagnostic(org, emptyAnswers);

    const initialNotes = message.trim()
      ? `Mensaje inicial del cliente:\n"${message.trim()}"`
      : "";

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org,
          answers: emptyAnswers,
          state,
          source: getLeadSource(org.standard),
          notes: initialNotes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Hubo un problema al enviar tu solicitud.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("No fue posible conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <article className={styles.success}>
        <span className={styles.successIcon}>✓</span>
        <h3>¡Solicitud Enviada con Éxito!</h3>
        <p>
          Tus datos han sido registrados en nuestro CRM. Un consultor experto de ISOsolutions se pondrá en contacto contigo a la brevedad para dar seguimiento a tu requerimiento.
        </p>
        <button
          className="button buttonPrimary"
          type="button"
          onClick={() => {
            setSuccess(false);
            setOrg(getInitialOrgData());
            setMessage("");
          }}
        >
          Enviar otro formulario
        </button>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <div className={styles.title}>
        <p className="eyebrow sectionEyebrow">{source}</p>
        <h2>Completa tu registro ejecutivo</h2>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <label className={styles.field}>
          Empresa *
          <input
            value={org.company}
            onChange={(e) => updateOrgField("company", e.target.value)}
            placeholder="Nombre de la empresa"
            required
          />
        </label>

        <label className={styles.field}>
          País
          <select value={org.country} onChange={(e) => updateOrgField("country", e.target.value)}>
            <option value="Mexico">México</option>
            <option value="Republica Dominicana">República Dominicana</option>
            <option value="Colombia">Colombia</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Estados Unidos">Estados Unidos</option>
            <option value="Otro">Otro</option>
          </select>
        </label>

        <label className={styles.field}>
          Sector
          <input
            value={org.sector}
            onChange={(e) => updateOrgField("sector", e.target.value)}
            placeholder="Manufactura, tecnología, etc."
          />
        </label>

        <label className={styles.field}>
          Empleados
          <input
            type="number"
            min="1"
            value={org.employees}
            onChange={(e) => updateOrgField("employees", e.target.value)}
            placeholder="65"
          />
        </label>

        <label className={styles.field}>
          Norma de interés
          <select value={org.standard} onChange={(e) => updateOrgField("standard", e.target.value)}>
            {Object.entries(standards).map(([key, standard]) => (
              <option key={key} value={key}>
                {standard.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          Urgencia del Proyecto
          <select value={org.urgency} onChange={(e) => updateOrgField("urgency", e.target.value)}>
            <option value="baja">Baja: 6 a 12 meses</option>
            <option value="media">Media: 3 a 6 meses</option>
            <option value="alta">Alta: 1 a 3 meses</option>
            <option value="critica">Crítica: menos de 30 días</option>
          </select>
        </label>

        <label className={`${styles.field} ${styles.full}`}>
          Correo o teléfono de contacto *
          <input
            value={org.contact}
            onChange={(e) => updateOrgField("contact", e.target.value)}
            placeholder="correo@empresa.com o número telefónico"
            required
          />
        </label>

        <label className={`${styles.field} ${styles.full}`}>
          Mensaje / Requerimiento específico
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Cuéntanos más sobre tus objetivos o dudas..."
          />
        </label>

        <div className={`${styles.full} ${styles.actions}`}>
          <button
            className={`button buttonPrimary ${styles.submitBtn}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </button>
        </div>
      </form>
    </article>
  );
}
