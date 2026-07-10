"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { buildLeadSource } from "@/lib/lead-attribution";
import styles from "./public-diagnostic.module.css";

type AnswerList = string[];

export function PublicDiagnostic() {
  const searchParams = useSearchParams();

  function getInitialStandard() {
    const normaParam = searchParams.get("norma") || searchParams.get("standard");
    return normaParam && standards[normaParam] ? normaParam : "qms";
  }

  function getInitialOrg() {
    return {
      ...createInitialOrgData(),
      standard: getInitialStandard(),
    };
  }

  function getDiagnosticSource(standardKey: string) {
    return buildLeadSource({
      entryPoint: "Diagnóstico público",
      channel: searchParams.get("canal"),
      standardKey,
    });
  }

  const [org, setOrg] = useState(getInitialOrg());
  const [answers, setAnswers] = useState<AnswerList>(() => createInitialAnswers(getInitialStandard()));
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [toast, setToast] = useState("");
  const [autoSavedStatus, setAutoSavedStatus] = useState<"loading" | "success" | "error" | null>(null);

  const state = computeDiagnostic(org, answers);
  const currentStandard: DiagnosticStandard = standards[org.standard] ?? standards.qms;
  
  // Calculate general progress
  const progress = state.total ? Math.round((state.answered / state.total) * 100) : 0;

  // Generic index dividing for steps:
  // Step 1: index 0 to 2 (3 questions)
  // Step 2: index 3 to 5 (3 questions)
  // Step 3: index 6 to 9 (4 questions)
  const totalQ = currentStandard.questions.length;
  const step1Limit = Math.ceil(totalQ / 3); // 4
  const step2Limit = Math.ceil((totalQ * 2) / 3); // 7

  function getStepQuestions() {
    return currentStandard.questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter((_, idx) => {
      if (currentStep === 1) return idx < step1Limit;
      if (currentStep === 2) return idx >= step1Limit && idx < step2Limit;
      if (currentStep === 3) return idx >= step2Limit;
      return false;
    });
  }

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

  function handleStart() {
    if (!org.company.trim() || !org.contact.trim()) {
      setValidationError("Por favor, ingresa el nombre de la empresa y un medio de contacto (correo o teléfono) para iniciar.");
      return;
    }
    setValidationError("");
    setCurrentStep(1);
  }

  async function handleFinish() {
    const minRequired = Math.max(4, Math.ceil(state.total * 0.4));
    if (state.answered < minRequired) {
      flashToast(`Responde al menos ${minRequired} preguntas para poder calcular tu reporte.`);
      return;
    }

    setCurrentStep(4);
    setAutoSavedStatus("loading");

    try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            org,
            answers,
            state,
            source: getDiagnosticSource(org.standard),
          }),
        });
      if (response.ok) {
        setAutoSavedStatus("success");
        flashToast("Diagnóstico completado y enviado al CRM.");
      } else {
        setAutoSavedStatus("error");
      }
    } catch {
      setAutoSavedStatus("error");
    }
  }

  function resetDiagnostic() {
    const initialStandard = getInitialStandard();
    setOrg(getInitialOrg());
    setAnswers(createInitialAnswers(initialStandard));
    setCurrentStep(0);
    setAutoSavedStatus(null);
    setValidationError("");
    flashToast("Diagnóstico reiniciado");
  }

  async function copySummary() {
    const summary = [
      "TRANSIQ - REPORTE EJECUTIVO PRELIMINAR",
      `Empresa: ${org.company || "No capturada"}`,
      `Norma: ${state.standard.label}`,
      `Madurez global: ${state.score}% - ${state.level.title}`,
      `Lead score: ${state.lead.score}/100 - ${state.lead.type}`,
      `Duración estimada: ${state.duration}`,
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
    link.download = `transiq-diagnostico-${org.company.toLowerCase().replace(/\s+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    flashToast("Archivo JSON generado");
  }

  function printReport() {
    window.print();
  }

  function flashToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  return (
    <>
      <section className={`section ${styles.hero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/GAP/GAP (1).webp')" }} />
        <div className="shell">
          <div className={styles.heroCopy}>
            <p className="eyebrow sectionEyebrow">Evaluación Inteligente ISO</p>
            <h1>Diagnóstico Ejecutivo de Madurez</h1>
            <p>
              Completa este sencillo asistente para evaluar el nivel de preparación de tu organización frente a la nueva generación de normas ISO y recibe un reporte preliminar de brechas y plan de acción.
            </p>
          </div>
        </div>
      </section>

      <section className="section sectionCompact">
        <div className="shell">
          {/* Bloque Introductorio arriba del Diagnóstico */}
          {currentStep === 0 && (
            <div className={styles.introBlock}>
              <div className={styles.introText}>
                <p className="eyebrow">Diagnóstico de Madurez</p>
                <h2>Prepara tu transición con precisión</h2>
                <p className="lead">
                  Este diagnóstico evalúa tus procesos de gestión actuales frente a las cláusulas clave de la norma ISO seleccionada.
                  Al completar las preguntas, obtendrás un semáforo de cumplimiento global, matriz de brechas críticas (GAP) y un plan de acción sugerido a 12 meses.
                </p>
                <ul className={styles.introList}>
                  <li>Porcentaje de preparación global de tu organización.</li>
                  <li>Identificación de brechas críticas por cláusula (GAP).</li>
                  <li>Cronograma de trabajo sugerido a 12 meses.</li>
                </ul>
              </div>
              <div className={styles.introMedia}>
                <img 
                  src="/imagenes/GAP/GAP (2).webp" 
                  alt="Auditoría y Análisis de Brechas" 
                  className={styles.introImg} 
                />
              </div>
            </div>
          )}

          {/* Stepper visual */}
          <div className={styles.stepper}>
            {/* Lineas de fondo conectadas */}
            <div className={styles.stepperLine}>
              <div 
                className={styles.stepperProgressLine} 
                style={{ width: `${currentStep * 25}%` }} 
              />
            </div>

            {/* Indicadores de paso */}
            {[
              { num: 1, label: "Registro" },
              { num: 2, label: "Estrategia" },
              { num: 3, label: "Operación" },
              { num: 4, label: "Mejora" },
              { num: 5, label: "Resultados" }
            ].map((step, idx) => {
              const isActive = currentStep === idx;
              const isCompleted = currentStep > idx;
              return (
                <div 
                  key={step.num} 
                  className={`${styles.stepIndicator} ${isActive ? styles.stepActive : ""} ${isCompleted ? styles.stepCompleted : ""}`}
                >
                  <span className={styles.stepNumber}>
                    {isCompleted ? "✓" : step.num}
                  </span>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* PASO 0: Registro de Datos */}
          {currentStep === 0 && (
            <div className={`cardSurface ${styles.card} ${styles.wizardStepCentered}`}>
              <div className={styles.formTitle}>
                <div>
                  <p className="eyebrow sectionEyebrow">Paso 1 de 5</p>
                  <h2>Datos de la organización</h2>
                </div>
                <span className="statusPill statusNeutral">Seguro y Privado</span>
              </div>

              {validationError && <div className={styles.validationError}>{validationError}</div>}

              <form className={styles.formGrid} onSubmit={(e) => e.preventDefault()}>
                <label className={styles.field}>
                  Empresa *
                  <input value={org.company} onChange={(event) => updateOrgField("company", event.target.value)} placeholder="Nombre de la organización" required />
                </label>

                <label className={styles.field}>
                  País
                  <select value={org.country} onChange={(event) => updateOrgField("country", event.target.value)}>
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
                  <input value={org.sector} onChange={(event) => updateOrgField("sector", event.target.value)} placeholder="Manufactura, servicios, TI..." />
                </label>

                <label className={styles.field}>
                  Empleados
                  <input type="number" min="1" value={org.employees} onChange={(event) => updateOrgField("employees", event.target.value)} placeholder="65" />
                </label>

                <label className={styles.field}>
                  Sitios operativos
                  <input type="number" min="1" value={org.sites} onChange={(event) => updateOrgField("sites", event.target.value)} placeholder="1" />
                </label>

                <label className={styles.field}>
                  Norma objetivo *
                  <select value={org.standard} onChange={(event) => updateOrgField("standard", event.target.value)}>
                    {Object.entries(standards).map(([key, standard]) => (
                      <option key={key} value={key}>
                        {standard.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  Urgencia del Proyecto
                  <select value={org.urgency} onChange={(event) => updateOrgField("urgency", event.target.value)}>
                    <option value="baja">Baja: 6 a 12 meses</option>
                    <option value="media">Media: 3 a 6 meses</option>
                    <option value="alta">Alta: 1 a 3 meses</option>
                    <option value="critica">Crítica: menos de 30 días</option>
                  </select>
                </label>

                <label className={styles.field}>
                  Interés Principal
                  <select value={org.interest} onChange={(event) => updateOrgField("interest", event.target.value)}>
                    <option value="Diagnostico">Diagnóstico</option>
                    <option value="Capacitacion">Capacitación</option>
                    <option value="Auditoria interna">Auditoría interna</option>
                    <option value="Preauditoria">Preauditoría</option>
                    <option value="Certificacion">Certificación</option>
                    <option value="Sistema integrado">Sistema integrado</option>
                    <option value="Seguimiento mensual">Seguimiento mensual</option>
                  </select>
                </label>

                <label className={`${styles.field} ${styles.full}`}>
                  Alcance preliminar del sistema de gestión
                  <textarea rows={2} value={org.scope} onChange={(event) => updateOrgField("scope", event.target.value)} placeholder="Actividades o procesos a cubrir" />
                </label>

                <label className={`${styles.field} ${styles.full}`}>
                  Contacto corporativo (correo o teléfono) *
                  <input value={org.contact} onChange={(event) => updateOrgField("contact", event.target.value)} placeholder="ejemplo@empresa.com | +52..." required />
                </label>

                <div className={`${styles.full} ${styles.wizardActions}`}>
                  <button className="button buttonPrimary" type="button" onClick={handleStart} style={{ width: "100%" }}>
                    Iniciar Evaluación ISO &rarr;
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PASOS 1, 2, 3: Preguntas del Diagnóstico */}
          {currentStep >= 1 && currentStep <= 3 && (
            <div className={`cardSurface ${styles.card} ${styles.wizardStep}`}>
              <div className={styles.formTitle}>
                <div>
                  <p className="eyebrow sectionEyebrow">Paso {currentStep + 1} de 5 | Diagnóstico {currentStandard.short}</p>
                  <h2>
                    {currentStep === 1 && "Estrategia, Contexto y Liderazgo"}
                    {currentStep === 2 && "Operación, Soporte y Procesos"}
                    {currentStep === 3 && "Evaluación del Desempeño y Mejora"}
                  </h2>
                </div>
                <span className="statusPill statusNeutral">
                  {state.answered} de {state.total} respondidas
                </span>
              </div>

              <div className={styles.progressBarWrapper}>
                <div className={styles.progressLine}>
                  <span className={styles.progressBar} style={{ width: `${progress}%` }} />
                </div>
                <span className={styles.progressText}>{progress}% Completado</span>
              </div>

              <p className={styles.questionIntro}>{currentStandard.focus}</p>

              <div className={styles.questionList}>
                {getStepQuestions().map((question) => {
                  const idx = question.originalIndex;
                  return (
                    <article key={`${question.domain}-${idx}`} className={styles.questionCard}>
                      <header>
                        <b>{idx + 1}. {question.text}</b>
                        <span className={styles.domainPill}>{question.domain}</span>
                      </header>

                      <div className={styles.answerGrid}>
                        {answerOptions.map((option) => {
                          const isActive = answers[idx] === option.value;
                          return (
                            <label key={option.value} className={`${styles.answerOption} ${isActive ? styles.answerOptionActive : ""}`}>
                              <input type="radio" name={`question-${idx}`} value={option.value} checked={isActive} onChange={(event) => updateAnswer(idx, event.target.value)} />
                              {option.label}
                            </label>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className={styles.wizardActions}>
                <button className="button buttonSecondary" type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                  &larr; Anterior
                </button>

                {currentStep < 3 ? (
                  <button className="button buttonPrimary" type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                    Siguiente &rarr;
                  </button>
                ) : (
                  <button className="button buttonPrimary" type="button" onClick={handleFinish}>
                    Calcular Reporte Ejecutivo &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PASO 4: Resultados y Reporte Final */}
          {currentStep === 4 && (
            <div className={styles.resultsLayout}>
              <aside className={`cardSurface ${styles.card} ${styles.scoreSidebar}`}>
                <p className="eyebrow sectionEyebrow">Maturity Score</p>
                <div className={styles.scoreRing} style={{ ["--score" as string]: state.score }}>
                  <span>{state.score}%</span>
                </div>
                <h2 className={styles.levelTitle}>{state.level.title}</h2>
                <p className={styles.levelMessage}>{state.level.message}</p>

                <div className={styles.summaryGrid}>
                  <span>Prioridad Lead <b>{state.lead.type}</b></span>
                  <span>Horizonte <b>{state.duration}</b></span>
                </div>

                <div className={styles.saveStatusCard}>
                  {autoSavedStatus === "loading" && (
                    <div className={styles.savingLoader}>
                      <span className={styles.loaderIcon}>⏳</span>
                      <p>Registrando tus datos en el CRM...</p>
                    </div>
                  )}
                  {autoSavedStatus === "success" && (
                    <div className={`${styles.savingLoader} ${styles.saveSuccess}`}>
                      <span className={styles.loaderIcon}>✓</span>
                      <p><b>¡Lead guardado en el CRM!</b> Un consultor de ISOsolutions revisará tu perfil en breve.</p>
                    </div>
                  )}
                  {autoSavedStatus === "error" && (
                    <div className={`${styles.savingLoader} ${styles.saveError}`}>
                      <span className={styles.loaderIcon}>⚠</span>
                      <p>No se pudo conectar con el CRM de forma automática, pero puedes descargar tu reporte abajo.</p>
                    </div>
                  )}
                </div>

                <div className={styles.resultActions}>
                  <button className="button buttonPrimary" type="button" onClick={printReport}>
                    Imprimir / Guardar PDF
                  </button>
                  <button className="button buttonSecondary" type="button" onClick={copySummary}>
                    Copiar Resumen
                  </button>
                  <button className="button buttonSecondary" type="button" onClick={downloadJson}>
                    Descargar datos JSON
                  </button>
                  <button className="button buttonGhost" type="button" onClick={resetDiagnostic}>
                    Realizar nuevo diagnóstico
                  </button>
                </div>
              </aside>

              <div className={styles.reportDetails}>
                <article className={`cardSurface ${styles.card}`}>
                  <p className="eyebrow sectionEyebrow">Análisis Operativo</p>
                  <h2>Brechas de madurez identificadas</h2>
                  <p className={styles.introParagraph}>
                    {org.company} muestra una preparación global del <b>{state.score}%</b>. A continuación se presentan las brechas clave detectadas y sus correspondientes acciones recomendadas prioritarias:
                  </p>

                  <ul className={styles.gapDetailedList}>
                    {state.gaps.length ? state.gaps.map((gap, index) => (
                      <li key={`${gap.domain}-${index}`} className={`${styles.gapItem} ${gap.priority === "Critica" ? styles.gapCritical : gap.priority === "Alta" ? styles.gapHigh : styles.gapMedium}`}>
                        <div className={styles.gapHeader}>
                          <span className={styles.gapPriorityBadge}>{gap.priority}</span>
                          <h3>{gap.domain}</h3>
                        </div>
                        <p className={styles.gapImpact}><b>Impacto:</b> {gap.impact}</p>
                        <p className={styles.gapAction}><b>Acción recomendada:</b> {gap.action}</p>
                        <small className={styles.gapEvidence}><b>Evidencia a colectar:</b> {gap.evidence}</small>
                      </li>
                    )) : (
                      <li>No se detectaron brechas críticas. Tu sistema cuenta con una excelente base.</li>
                    )}
                  </ul>
                </article>

                <article className={`cardSurface ${styles.card} ${styles.planCard}`}>
                  <p className="eyebrow sectionEyebrow">Ruta Crítica</p>
                  <h2>Plan sugerido de transición</h2>
                  <p className={styles.introParagraph}>
                    Cronograma estimado sugerido de actividades en base a tu nivel de urgencia y respuestas:
                  </p>

                  <div className={styles.timeline}>
                    {state.plan.map((item, idx) => (
                      <div key={idx} className={styles.timelineItem}>
                        <div className={styles.timelineBadge}>{item.term}</div>
                        <div className={styles.timelineContent}>
                          <h4>{item.phase}</h4>
                          <p>{item.activity}</p>
                          <span><b>Entregable:</b> {item.deliverable}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className={`cardSurface ${styles.card}`}>
                  <p className="eyebrow sectionEyebrow">Servicios Recomendados</p>
                  <h2>Siguientes pasos sugeridos</h2>
                  <p>Para acelerar tu proceso y mitigar brechas críticas antes de tu auditoría formal, te recomendamos:</p>
                  <ul className={styles.recommendationList}>
                    {state.recommendation.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          )}
        </div>
      </section>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </>
  );
}
