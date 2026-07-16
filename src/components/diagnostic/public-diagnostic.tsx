"use client";

import { useState, type MouseEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { downloadDiagnosticPdf } from "@/lib/diagnostic-pdf";

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
    if (field === "email" || field === "phone") {
      nextOrg.contact = [nextOrg.email, nextOrg.phone].filter(Boolean).join(" | ");
    }
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
    if (!org.contactName.trim() || !org.company.trim() || !org.email.trim() || !org.phone.trim()) {
      setValidationError("Por favor, completa nombre, empresa, correo y teléfono para iniciar.");
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

  async function savePdf(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await downloadDiagnosticPdf(org, state);
      flashToast("PDF descargado correctamente");
    } catch {
      flashToast("No fue posible generar el PDF");
    }
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
            <p className="eyebrow sectionEyebrow">ISO Maturity Lab</p>
            <h1>Evalúa tu madurez ISO y recibe una ruta de acción automática con IA.</h1>
            <p>
              TransiQ analiza norma, país, sector, empleados, sitios, alcance y urgencia para entregar score, brechas probables, evidencias requeridas y siguiente paso recomendado.
            </p>
            <div className={styles.heroActions}>
              <a className="button buttonPrimary" href="#diagnostico">Iniciar diagnóstico</a>
              <Link className="button buttonSecondary" href="/demo">Ver ejemplo de dashboard</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="diagnostico" className={`section sectionCompact ${styles.diagnosticSection}`}>
        <div className="shell">
          {/* Bloque Introductorio arriba del Diagnóstico */}
          {currentStep === 0 && (
            <div className={styles.introBlock}>
              <div className={styles.introText}>
                <p className="eyebrow sectionEyebrow">Reporte ejecutivo automático</p>
                <h2>Resultado que recibe el usuario</h2>
                <ul className={styles.introList}>
                  <li>Porcentaje de madurez.</li>
                  <li>Semáforo por eje.</li>
                  <li>Brechas preliminares por norma.</li>
                  <li>Recursos sugeridos.</li>
                  <li>Ruta automática de acción.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Stepper visual */}
          {currentStep >= 1 && currentStep <= 3 ? <p className={`eyebrow sectionEyebrow ${styles.quickStepLabel}`}>Paso 2 · Diagnóstico completo</p> : null}
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
                  <p className="eyebrow sectionEyebrow">Paso 1 · Contexto global</p>
                  <h2>Personaliza tu evaluación.</h2>
                </div>
              </div>

              {validationError && <div className={styles.validationError}>{validationError}</div>}

              <form className={styles.formGrid} onSubmit={(e) => e.preventDefault()}>
                <label className={styles.field}>
                  Nombre del contacto
                  <input value={org.contactName} onChange={(event) => updateOrgField("contactName", event.target.value)} placeholder="Nombre completo" required />
                </label>

                <label className={styles.field}>
                  Empresa
                  <input value={org.company} onChange={(event) => updateOrgField("company", event.target.value)} placeholder="Nombre de la empresa" required />
                </label>

                <label className={styles.field}>
                  País
                  <select value={org.country} onChange={(event) => updateOrgField("country", event.target.value)}>
                    <option value="Mexico">México</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Canada">Canadá</option>
                    <option value="Republica Dominicana">República Dominicana</option>
                    <option value="Colombia">Colombia</option><option value="Ecuador">Ecuador</option><option value="Chile">Chile</option>
                    <option value="Brasil">Brasil / Brazil</option><option value="Paraguay">Paraguay</option><option value="Peru">Perú</option>
                    <option value="Argentina">Argentina</option><option value="Uruguay">Uruguay</option><option value="Costa Rica">Costa Rica</option><option value="Panama">Panamá</option>
                    <option value="Espana">España</option><option value="Francia">Francia</option><option value="Italia">Italia</option><option value="Alemania">Alemania</option>
                    <option value="Portugal">Portugal</option><option value="Reino Unido">Reino Unido</option><option value="China">China</option><option value="Japon">Japón / Japan</option>
                    <option value="India">India</option><option value="Corea del Sur">Corea del Sur</option><option value="Singapur">Singapur</option><option value="Otro">Otro país</option>
                  </select>
                </label>

                <label className={styles.field}>
                  Sector
                  <select value={org.sector} onChange={(event) => updateOrgField("sector", event.target.value)}>
                    <option value="Manufactura">Manufactura</option><option value="Construccion">Construcción</option><option value="Logistica y transporte">Logística y transporte</option>
                    <option value="Alimentos">Alimentos</option><option value="Tecnologia">Tecnología</option><option value="Salud">Salud</option><option value="Gobierno">Gobierno</option>
                    <option value="Servicios">Servicios</option><option value="Energia">Energía</option><option value="Otro">Otro</option>
                  </select>
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
                  Norma objetivo *
                  <select value={org.standard} onChange={(event) => updateOrgField("standard", event.target.value)}>
                    <option value="qms">ISO 9001:2015 → ISO 9001:2026</option><option value="ems">ISO 14001:2015 → ISO 14001:2026</option>
                    <option value="ohs">ISO 45001:2018 → fortalecimiento / futura versión</option><option value="abms">ISO 37001:2016 → ISO 37001:2025</option>
                    <option value="isms">ISO/IEC 27001:2022 → fortalecimiento SGSI</option>
                    <option value="integrated">Sistema Integrado ISO 9001 + 14001 + 45001</option>
                  </select>
                </label>

                <label className={styles.field}>
                  Urgencia
                  <select value={org.urgency} onChange={(event) => updateOrgField("urgency", event.target.value)}>
                    <option value="critica">Crítica: 0 a 30 días</option><option value="alta">Alta: 1 a 3 meses</option><option value="media">Media: 3 a 6 meses</option>
                    <option value="baja">Planeada: 6 a 12 meses</option><option value="exploratoria">Exploratoria</option>
                  </select>
                </label>

                <label className={styles.field}>
                  Situación actual
                  <select value={org.interest} onChange={(event) => updateOrgField("interest", event.target.value)}>
                    <option value="Ya estamos certificados">Ya estamos certificados</option><option value="Estamos en implementacion">Estamos en implementación</option>
                    <option value="Certificacion">Queremos certificar por primera vez</option><option value="Tengo auditoria proxima">Tengo auditoría próxima</option>
                    <option value="Necesito transicion normativa">Necesito transición normativa</option><option value="Soy consultor ISO">Soy consultor ISO</option>
                  </select>
                </label>

                <label className={`${styles.field} ${styles.full}`}>
                  Alcance
                  <textarea rows={2} value={org.scope} onChange={(event) => updateOrgField("scope", event.target.value)} placeholder="Actividades o procesos a cubrir" />
                </label>

                <label className={styles.field}>
                  Correo corporativo
                  <input type="email" value={org.email} onChange={(event) => updateOrgField("email", event.target.value)} placeholder="nombre@empresa.com" required />
                </label>

                <label className={styles.field}>
                  Teléfono
                  <input type="tel" value={org.phone} onChange={(event) => updateOrgField("phone", event.target.value)} placeholder="+52 55 0000 0000" required />
                </label>

                <label className={`${styles.consent} ${styles.full}`}>
                  <input type="checkbox" required />
                  <span>Acepto aviso de privacidad y entiendo que el resultado es orientativo.</span>
                </label>

                <div className={`${styles.full} ${styles.wizardActions}`}>
                  <button className="button buttonPrimary" type="button" onClick={handleStart} style={{ width: "100%" }}>
                    Generar diagnóstico inteligente
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
            <div className={`${styles.resultsLayout} diagnostic-print-report`}>
              <header className={styles.printHeader}>
                <div>
                  <strong>TransiQ</strong>
                  <span>by ISOsolutions</span>
                </div>
                <div className={styles.printHeaderMeta}>
                  <p>Reporte ejecutivo preliminar</p>
                  <span>{new Date().toLocaleDateString("es-MX", { dateStyle: "long" })}</span>
                </div>
                <dl>
                  <div><dt>Empresa</dt><dd>{org.company}</dd></div>
                  <div><dt>Contacto</dt><dd>{org.contactName}</dd></div>
                  <div><dt>Correo</dt><dd>{org.email}</dd></div>
                  <div><dt>Teléfono</dt><dd>{org.phone}</dd></div>
                  <div><dt>Norma</dt><dd>{state.standard.label}</dd></div>
                </dl>
              </header>
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
                      <p>Preparando tu resultado...</p>
                    </div>
                  )}
                  {autoSavedStatus === "success" && (
                    <div className={`${styles.savingLoader} ${styles.saveSuccess}`}>
                      <span className={styles.loaderIcon}>✓</span>
                      <p><b>Tu diagnóstico está listo.</b> Puedes imprimir, guardar o compartir tu resultado.</p>
                    </div>
                  )}
                  {autoSavedStatus === "error" && (
                    <div className={`${styles.savingLoader} ${styles.saveError}`}>
                      <span className={styles.loaderIcon}>⚠</span>
                      <p>Tu resultado está disponible. Puedes imprimirlo o copiar el resumen.</p>
                    </div>
                  )}
                </div>

                <div className={styles.resultActions}>
                  <button className="button buttonPrimary" type="button" onClick={savePdf}>
                    Descargar PDF
                  </button>
                  <button className="button buttonSecondary" type="button" onClick={copySummary}>
                    Copiar Resumen
                  </button>
                  <button className="button buttonGhost" type="button" onClick={resetDiagnostic}>
                    Realizar nuevo diagnóstico
                  </button>
                </div>
              </aside>

              <div className={styles.reportDetails}>
                <article className={`cardSurface ${styles.card} ${styles.resultSectionCard}`}>
                  <p className="eyebrow sectionEyebrow">Análisis Operativo</p>
                  <h2>Brechas de madurez identificadas</h2>
                  <p className={styles.introParagraph}>
                    {org.company} muestra una preparación global del <b>{state.score}%</b>. A continuación se presentan las brechas clave detectadas y sus correspondientes acciones recomendadas prioritarias:
                  </p>

                  <ul className={styles.gapDetailedList}>
                    {state.gaps.length ? state.gaps.slice(0, 4).map((gap, index) => (
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
                  {state.gaps.length > 4 && (
                    <details className={styles.moreGaps}>
                      <summary>Ver {state.gaps.length - 4} brechas adicionales</summary>
                      <ul className={styles.gapDetailedList}>
                        {state.gaps.slice(4).map((gap, index) => (
                          <li key={`${gap.domain}-extra-${index}`} className={`${styles.gapItem} ${gap.priority === "Critica" ? styles.gapCritical : gap.priority === "Alta" ? styles.gapHigh : styles.gapMedium}`}>
                            <div className={styles.gapHeader}><span className={styles.gapPriorityBadge}>{gap.priority}</span><h3>{gap.domain}</h3></div>
                            <p className={styles.gapImpact}><b>Impacto:</b> {gap.impact}</p>
                            <p className={styles.gapAction}><b>Acción recomendada:</b> {gap.action}</p>
                            <small className={styles.gapEvidence}><b>Evidencia a colectar:</b> {gap.evidence}</small>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </article>

                <article className={`cardSurface ${styles.card} ${styles.planCard} ${styles.resultSectionCard}`}>
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

                <article className={`cardSurface ${styles.card} ${styles.resultSectionCard} ${styles.servicesCard}`}>
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

      <section className={`section ${styles.shareSection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <h2>Diseñado para ser orgánico y compartible.</h2>
            <p>El resultado preliminar puede imprimirse, copiarse, enviarse al equipo e iniciar una conversación interna antes de una demo o propuesta.</p>
          </div>
          <div className={styles.infoGrid}>
            <article className="cardSurface"><h3>Compartir</h3><p>Texto listo para LinkedIn, WhatsApp o correo.</p></article>
            <article className="cardSurface"><h3>Invitar equipo</h3><p>Permite que otros responsables completen la evaluación.</p></article>
            <article className="cardSurface"><h3>Continuar</h3><p>Conecta con demo, recurso o diagnóstico profundo.</p></article>
            <article className="cardSurface"><h3>CRM</h3><p>Genera datos de país, norma, urgencia y score comercial.</p></article>
          </div>
        </div>
      </section>

      <section className={`section ${styles.faqSection}`}>
        <div className="shell">
          <div className="sectionHeading"><h2>Preguntas frecuentes del diagnóstico.</h2></div>
          <div className={styles.faqList}>
            <details><summary>¿El diagnóstico sustituye una auditoría?</summary><p>No. Es una herramienta orientativa de preparación, no una decisión de certificación.</p></details>
            <details><summary>¿Puedo usarlo para varios países?</summary><p>Sí. El formulario contempla México, LATAM, Europa, Asia, India y otros mercados.</p></details>
            <details><summary>¿Puedo evaluar un sistema integrado?</summary><p>Sí. Puedes seleccionar rutas multinorma y sistemas integrados.</p></details>
          </div>
        </div>
      </section>

      <section className={`section ${styles.finalCta}`}>
        <div className={styles.finalCtaBg} />
        <div className={`shell ${styles.finalMessage}`}>
          <h2>Empieza con un resultado, no con una reunión.</h2>
          <p>Obtén primero tu lectura automática y después decide si quieres demo, recursos o apoyo especializado.</p>
        </div>
      </section>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </>
  );
}
