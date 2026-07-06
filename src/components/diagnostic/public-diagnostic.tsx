"use client";

import { useState } from "react";
import {
  answerOptions,
  standards,
  type DiagnosticStandard,
} from "@/data/diagnostic-content";
import {
  computeDiagnostic,
  createInitialAnswers,
  createInitialOrgData,
} from "@/lib/diagnostic-engine";
import styles from "./public-diagnostic.module.css";

type AnswerList = string[];

export function PublicDiagnostic() {
  const [org, setOrg] = useState(createInitialOrgData);
  const [answers, setAnswers] = useState<AnswerList>(() => createInitialAnswers("qms"));
  const [toast, setToast] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const state = computeDiagnostic(org, answers);
  const currentStandard: DiagnosticStandard = standards[org.standard] ?? standards.qms;
  const progress = state.total ? Math.round((state.answered / state.total) * 100) : 0;

  function updateOrgField(field: keyof typeof org, value: string) {
    const nextOrg = { ...org, [field]: value };
    if (field === "standard") {
      setOrg(nextOrg);
      setAnswers(createInitialAnswers(value));
      return;
    }
    setOrg(nextOrg);
  }

  function updateAnswer(index: number, value: string) {
    const nextAnswers = [...answers];
    nextAnswers[index] = value;
    setAnswers(nextAnswers);
  }

  function resetDiagnostic() {
    setOrg(createInitialOrgData());
    setAnswers(createInitialAnswers("qms"));
    flashToast("Diagnostico reiniciado");
  }

  async function copySummary() {
    const summary = [
      "TRANSIQ - REPORTE EJECUTIVO PRELIMINAR",
      `Empresa: ${org.company || "No capturada"}`,
      `Norma: ${state.standard.label}`,
      `Madurez global: ${state.score}% - ${state.level.title}`,
      `Lead score: ${state.lead.score}/100 - ${state.lead.type}`,
      `Duracion estimada: ${state.duration}`,
      "",
      "Brechas prioritarias:",
      ...state.gaps.map((gap, index) => `${index + 1}. [${gap.priority}] ${gap.domain}: ${gap.action}`),
      "",
      "Servicios recomendados:",
      ...state.recommendation.map((item, index) => `${index + 1}. ${item}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      flashToast("Reporte copiado al portapapeles");
    } catch {
      flashToast("No fue posible copiar el reporte");
    }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transiq-diagnostico.json";
    link.click();
    URL.revokeObjectURL(url);
    flashToast("Archivo JSON generado");
  }

  async function saveLead() {
    if (!org.company.trim() || !org.contact.trim()) {
      flashToast("Captura empresa y contacto antes de guardar el lead");
      return;
    }

    if (state.answered < Math.max(4, Math.ceil(state.total * 0.4))) {
      flashToast("Contesta mas preguntas para generar un lead util para comercial");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org, answers, state }),
      });

      const payload = await response.json();
      if (!response.ok) {
        flashToast(payload.error || "No fue posible guardar el lead");
        return;
      }

      flashToast("Lead enviado al CRM interno");
    } catch {
      flashToast("Fallo la conexion con el CRM local");
    } finally {
      setIsSaving(false);
    }
  }

  function flashToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  return (
    <>
      <section className={`section ${styles.hero}`}>
        <div className="shell">
          <div className={styles.heroCopy}>
            <p className="eyebrow sectionEyebrow">Diagnostico publico</p>
            <h1>Diagnostico ejecutivo y comercial de captacion</h1>
            <p>
              Esta experiencia conserva el valor del demo original, pero lo presenta con enfoque de negocio: madurez,
              brechas, prioridad y ruta sugerida para convertir el interes en una conversacion comercial bien calificada.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`shell ${styles.shell}`}>
          <form className={`cardSurface ${styles.card}`} onSubmit={(event) => event.preventDefault()}>
            <div className={styles.formTitle}>
              <div>
                <p className="eyebrow sectionEyebrow">Datos de la organizacion</p>
                <h2>Registro ejecutivo</h2>
              </div>
              <span className="statusPill statusNeutral">MVP</span>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.field}>
                Empresa
                <input value={org.company} onChange={(event) => updateOrgField("company", event.target.value)} placeholder="Nombre de la organizacion" />
              </label>

              <label className={styles.field}>
                Pais
                <select value={org.country} onChange={(event) => updateOrgField("country", event.target.value)}>
                  <option value="Mexico">Mexico</option>
                  <option value="Republica Dominicana">Republica Dominicana</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Otro">Otro</option>
                </select>
              </label>

              <label className={styles.field}>
                Sector
                <input value={org.sector} onChange={(event) => updateOrgField("sector", event.target.value)} placeholder="Manufactura, servicios, salud, TI..." />
              </label>

              <label className={styles.field}>
                Empleados
                <input type="number" min="1" value={org.employees} onChange={(event) => updateOrgField("employees", event.target.value)} placeholder="65" />
              </label>

              <label className={styles.field}>
                Sitios
                <input type="number" min="1" value={org.sites} onChange={(event) => updateOrgField("sites", event.target.value)} placeholder="1" />
              </label>

              <label className={styles.field}>
                Norma objetivo
                <select value={org.standard} onChange={(event) => updateOrgField("standard", event.target.value)}>
                  {Object.entries(standards).map(([key, standard]) => (
                    <option key={key} value={key}>
                      {standard.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                Urgencia
                <select value={org.urgency} onChange={(event) => updateOrgField("urgency", event.target.value)}>
                  <option value="baja">Baja: 6 a 12 meses</option>
                  <option value="media">Media: 3 a 6 meses</option>
                  <option value="alta">Alta: 1 a 3 meses</option>
                  <option value="critica">Critica: menos de 30 dias</option>
                </select>
              </label>

              <label className={styles.field}>
                Interes principal
                <select value={org.interest} onChange={(event) => updateOrgField("interest", event.target.value)}>
                  <option value="Diagnostico">Diagnostico</option>
                  <option value="Capacitacion">Capacitacion</option>
                  <option value="Auditoria interna">Auditoria interna</option>
                  <option value="Preauditoria">Preauditoria</option>
                  <option value="Certificacion">Certificacion</option>
                  <option value="Sistema integrado">Sistema integrado</option>
                  <option value="Seguimiento mensual">Seguimiento mensual</option>
                </select>
              </label>

              <label className={`${styles.field} ${styles.full}`}>
                Alcance del sistema de gestion
                <textarea rows={3} value={org.scope} onChange={(event) => updateOrgField("scope", event.target.value)} placeholder="Describe el alcance operativo actual o deseado" />
              </label>

              <label className={`${styles.field} ${styles.full}`}>
                Correo / telefono
                <input value={org.contact} onChange={(event) => updateOrgField("contact", event.target.value)} placeholder="correo@empresa.com | +52..." />
              </label>
            </div>
          </form>

          <section className={`cardSurface ${styles.card}`}>
            <div className={styles.formTitle}>
              <div>
                <p className="eyebrow sectionEyebrow">Evaluacion ponderada</p>
                <h2 className={styles.questionTitle}>Diagnostico {currentStandard.short}</h2>
              </div>
              <button className="button buttonSecondary" type="button" onClick={resetDiagnostic}>
                Limpiar
              </button>
            </div>

            <p className={styles.questionIntro}>{currentStandard.focus}</p>
            <div className={styles.progressLine}>
              <span className={styles.progressBar} style={{ ["--width" as string]: `${progress}%`, width: `${progress}%` }} />
            </div>

            <div className={styles.questionList}>
              {currentStandard.questions.map((question, index) => (
                <article key={`${question.domain}-${index}`} className={styles.questionCard}>
                  <header>
                    <b>{index + 1}. {question.text}</b>
                    <span className={styles.domainPill}>{question.domain}</span>
                  </header>

                  <div className={styles.answerGrid}>
                    {answerOptions.map((option) => {
                      const isActive = answers[index] === option.value;
                      return (
                        <label key={option.value} className={`${styles.answerOption} ${isActive ? styles.answerOptionActive : ""}`}>
                          <input type="radio" name={`question-${index}`} value={option.value} checked={isActive} onChange={(event) => updateAnswer(index, event.target.value)} />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className={`${styles.results} cardSurface ${styles.card}`}>
            <p className="eyebrow sectionEyebrow">Resultado preliminar</p>
            <div className={styles.scoreRing} style={{ ["--score" as string]: state.score }}>
              <span>{state.score}%</span>
            </div>
            <h2 className={styles.levelTitle}>{state.level.title}</h2>
            <p className={styles.levelMessage}>{state.level.message}</p>

            <div className={styles.summaryGrid}>
              <span>Lead score <b>{state.lead.score}</b></span>
              <span>Tipo <b>{state.lead.type}</b></span>
            </div>

            <div className={styles.focusBox}>
              <p className="miniLabel">Lectura ejecutiva</p>
              <p>{org.company || "La organizacion evaluada"} muestra una preparacion de <b>{state.score}%</b> para {state.standard.short}.</p>
              <ul className={styles.focusList}>
                {state.domainScores.slice(0, 3).map((item) => (
                  <li key={item.domain}>{item.domain}: <b>{item.score}%</b></li>
                ))}
              </ul>
            </div>

            <div className={styles.recommendations}>
              <p className="miniLabel">Ruta comercial sugerida</p>
              <ul className={styles.recommendationList}>
                {state.recommendation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.resultActions}>
              <button className="button buttonPrimary" type="button" onClick={saveLead} disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar lead en CRM"}
              </button>
              <button className="button buttonSecondary" type="button" onClick={copySummary}>Copiar resumen</button>
              <button className="button buttonSecondary" type="button" onClick={downloadJson}>Descargar JSON</button>
            </div>
          </aside>
        </div>

        <div className={`shell ${styles.reportLayout}`}>
          <section className={`cardSurface ${styles.card}`}>
            <p className="eyebrow sectionEyebrow">Brechas preliminares</p>
            <div className={styles.reportBlock}>
              <h3>Resumen ejecutivo</h3>
              <p>{org.company || "La organizacion evaluada"} se ubica en <b>{state.level.title}</b>, con una madurez global de <b>{state.score}%</b>. Se identificaron <b>{state.gaps.length}</b> brechas prioritarias y una ruta estimada de <b>{state.duration}</b>.</p>
            </div>

            <div className={styles.reportBlock}>
              <h3>Matriz resumida de brechas</h3>
              <ul className={styles.tableList}>
                {state.gaps.length ? state.gaps.map((gap, index) => (
                  <li key={`${gap.domain}-${index}`}>
                    <span className={`${styles.priority} ${gap.priority === "Critica" ? styles.priorityCritical : gap.priority === "Alta" ? styles.priorityHigh : styles.priorityMedium}`}>[{gap.priority}]</span>{" "}
                    <b>{gap.domain}</b>: {gap.action}
                  </li>
                )) : <li>Completa el diagnostico para generar la lectura de brechas.</li>}
              </ul>
            </div>
          </section>

          <section className={styles.reportMeta}>
            <article className={`cardSurface ${styles.card}`}>
              <p className="eyebrow sectionEyebrow">Plan sugerido</p>
              <div className={styles.reportBlock}>
                <h3>{state.duration}</h3>
                <ul className={styles.tableList}>
                  {state.plan.slice(0, 5).map((item) => (
                    <li key={item.phase}><b>{item.phase}</b>: {item.activity}</li>
                  ))}
                </ul>
              </div>
            </article>

            <article className={`cardSurface ${styles.card}`}>
              <p className="eyebrow sectionEyebrow">Siguiente paso</p>
              <div className={styles.reportBlock}>
                <h3>Demo comercial con contexto</h3>
                <p>El objetivo de esta salida publica es generar una conversacion comercial mejor informada. El equipo interno recibira el lead, su score, las respuestas y la urgencia para preparar demo, seguimiento y propuesta.</p>
              </div>
            </article>
          </section>
        </div>
      </section>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </>
  );
}
