"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminSession } from "@/lib/admin-auth-types";
import { pipelineStages, type LeadStage, type SavedLead } from "@/lib/lead-types";
import styles from "./admin-dashboard.module.css";

type AdminDashboardProps = {
  leads: SavedLead[];
  session: AdminSession;
};

function getScoreClass(score: number) {
  if (score >= 75) return styles.scoreHigh;
  if (score >= 50) return styles.scoreMedium;
  return styles.scoreLow;
}

function getStageClass(stage: LeadStage) {
  if (stage === "Cerrado") return styles.stageClosed;
  if (stage === "Propuesta enviada" || stage === "Demo agendada") return styles.stageHot;
  if (stage === "Contactado" || stage === "Diagnostico revisado") return styles.stageWarm;
  return styles.stageNew;
}

export function AdminDashboard({ leads: initialLeads, session }: AdminDashboardProps) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [selectedId, setSelectedId] = useState(initialLeads[0]?.id ?? "");
  const [draftOwner, setDraftOwner] = useState(initialLeads[0]?.owner ?? "Sin asignar");
  const [draftNotes, setDraftNotes] = useState(initialLeads[0]?.notes ?? "");
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const canManageOwners = session.role === "Director";
  const allowedStages = session.role === "Director"
    ? pipelineStages
    : pipelineStages.filter((stage) => stage !== "Cerrado");

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedId) ?? leads[0] ?? null,
    [leads, selectedId],
  );

  const strategicLeads = leads.filter((lead) => lead.diagnostic.lead.score >= 70).length;
  const urgentLeads = leads.filter((lead) => ["alta", "critica"].includes(lead.org.urgency)).length;
  const averageScore = leads.length
    ? Math.round(leads.reduce((sum, lead) => sum + lead.diagnostic.score, 0) / leads.length)
    : 0;

  const pipelineCounts = useMemo(
    () => pipelineStages.map((stage) => ({ stage, count: leads.filter((lead) => lead.status === stage).length })),
    [leads],
  );

  function selectLead(id: string) {
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;
    setSelectedId(id);
    setDraftOwner(lead.owner);
    setDraftNotes(lead.notes);
  }

  function flashToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  async function saveLeadUpdate(nextStatus?: LeadStage) {
    if (!selectedLead) return;

    const payload = {
      id: selectedLead.id,
      status: nextStatus ?? selectedLead.status,
      owner: canManageOwners ? draftOwner.trim() || "Sin asignar" : undefined,
      notes: draftNotes,
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          flashToast(data.error || "No fue posible actualizar el lead");
          return;
        }

        setLeads((current) => current.map((lead) => (lead.id === data.lead.id ? data.lead : lead)));
        setSelectedId(data.lead.id);
        setDraftOwner(data.lead.owner);
        setDraftNotes(data.lead.notes);
        flashToast("Lead actualizado en el pipeline");
      } catch {
        flashToast("Fallo la actualizacion del lead");
      }
    });
  }

  function logout() {
    startLogoutTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login?loggedOut=1");
      router.refresh();
    });
  }

  return (
    <main className="section">
      <div className={`shell ${styles.grid}`}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div>
              <p className="eyebrow">CRM interno</p>
              <h1>Pipeline comercial inicial para diagnosticos captados.</h1>
            </div>
            <p>
              Esta fase ya permite recibir leads, moverlos por etapa, asignar responsable y guardar notas internas para que
              direccion y comercial trabajen sobre una misma lectura operativa.
            </p>
          </div>

          <article className={`cardSurface ${styles.heroStats}`}>
            <div className={styles.sessionMeta}>
              <span className={styles.sessionBadge}>{session.role}</span>
              <button className="button buttonLight" type="button" onClick={logout} disabled={isLoggingOut}>
                {isLoggingOut ? "Saliendo..." : "Cerrar sesion"}
              </button>
            </div>
            <span className="miniLabel">Sesion activa</span>
            <b>{session.name}</b>
            <p>{session.email}</p>
          </article>
        </section>

        <section className={styles.metricGrid}>
          <article className={`cardSurface ${styles.metricCard}`}>
            <span className="miniLabel">Leads totales</span>
            <b>{leads.length}</b>
            <span>Registros acumulados desde el diagnostico publico</span>
          </article>

          <article className={`cardSurface ${styles.metricCard}`}>
            <span className="miniLabel">Leads estrategicos</span>
            <b>{strategicLeads}</b>
            <span>Score comercial mayor o igual a 70</span>
          </article>

          <article className={`cardSurface ${styles.metricCard}`}>
            <span className="miniLabel">Urgencia alta</span>
            <b>{urgentLeads}</b>
            <span>Casos marcados como alta o critica</span>
          </article>

          <article className={`cardSurface ${styles.metricCard}`}>
            <span className="miniLabel">Madurez promedio</span>
            <b>{averageScore}%</b>
            <span>Promedio del diagnostico inicial recibido</span>
          </article>
        </section>

        <section className={styles.pipelineGrid}>
          {pipelineCounts.map((item) => (
            <article key={item.stage} className={`cardSurface ${styles.pipelineCard}`}>
              <span className={`${styles.stageBadge} ${getStageClass(item.stage)}`}>{item.stage}</span>
              <b>{item.count}</b>
              <p>Leads en esta etapa</p>
            </article>
          ))}
        </section>

        {leads.length ? (
          <section className={styles.layout}>
            <article className={`cardSurface ${styles.tableCard}`}>
              <div className={styles.tableHeader}>
                <div>
                  <p className="eyebrow sectionEyebrow">Bandeja comercial</p>
                  <h2>Leads captados</h2>
                </div>
                <p>{leads.length} registros listos para seguimiento</p>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Empresa</th>
                      <th>Etapa</th>
                      <th>Madurez</th>
                      <th>Lead</th>
                      <th>Responsable</th>
                      <th>Contacto</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => {
                      const isSelected = selectedLead?.id === lead.id;
                      return (
                        <tr key={lead.id} className={isSelected ? styles.selectedRow : ""} onClick={() => selectLead(lead.id)}>
                          <td>
                            <div className={styles.companyCell}>
                              <strong>{lead.org.company || "Sin nombre"}</strong>
                              <span>{lead.org.country} | {lead.org.sector || "Sector no definido"}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`${styles.stageBadge} ${getStageClass(lead.status)}`}>{lead.status}</span>
                          </td>
                          <td>
                            <span className={`${styles.scoreBadge} ${getScoreClass(lead.diagnostic.score)}`}>
                              {lead.diagnostic.score}%
                            </span>
                          </td>
                          <td>
                            <div className={styles.companyCell}>
                              <strong>{lead.diagnostic.lead.type}</strong>
                              <span>{lead.diagnostic.lead.score}/100</span>
                            </div>
                          </td>
                          <td>{lead.owner}</td>
                          <td>{lead.org.contact}</td>
                          <td>{new Date(lead.createdAt).toLocaleDateString("es-MX")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>

            <aside className={styles.sidebar}>
              <article className={`cardSurface ${styles.detailCard}`}>
                <p className="eyebrow sectionEyebrow">Lead seleccionado</p>
                <h2>{selectedLead?.org.company || "Sin registros"}</h2>
                <p>
                  {selectedLead
                    ? `${selectedLead.diagnostic.standardLabel}. ${selectedLead.diagnostic.lead.type} con ${selectedLead.diagnostic.score}% de madurez y horizonte de ${selectedLead.diagnostic.duration}.`
                    : "Aun no hay lead destacado para revisar."}
                </p>

                {selectedLead ? (
                  <div className={styles.detailGrid}>
                    <label className={styles.field}>
                      Etapa comercial
                      <select
                        value={selectedLead.status}
                        onChange={(event) => saveLeadUpdate(event.target.value as LeadStage)}
                        disabled={isPending}
                      >
                        {allowedStages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={styles.field}>
                      Responsable
                      <input
                        value={draftOwner}
                        onChange={(event) => setDraftOwner(event.target.value)}
                        placeholder="Director o ejecutivo"
                        disabled={isPending || !canManageOwners}
                      />
                    </label>

                    <label className={`${styles.field} ${styles.fieldFull}`}>
                      Notas internas
                      <textarea
                        rows={5}
                        value={draftNotes}
                        onChange={(event) => setDraftNotes(event.target.value)}
                        placeholder="Siguiente llamada, objeciones, contexto para demo, fecha objetivo..."
                        disabled={isPending}
                      />
                    </label>
                  </div>
                ) : null}

                {!canManageOwners ? <p className={styles.permissionNote}>Solo Direccion puede reasignar responsables o cerrar oportunidades.</p> : null}

                <div className={styles.actionRow}>
                  <button className="button buttonPrimary" type="button" onClick={() => saveLeadUpdate()} disabled={!selectedLead || isPending}>
                    {isPending ? "Guardando..." : "Guardar seguimiento"}
                  </button>
                </div>
              </article>

              <article className={`cardSurface ${styles.detailCard}`}>
                <p className="eyebrow sectionEyebrow">Lectura comercial</p>
                {selectedLead ? (
                  <ul className={styles.list}>
                    <li>Fuente: {selectedLead.source}</li>
                    <li>Interes principal: {selectedLead.org.interest}</li>
                    <li>Urgencia: {selectedLead.org.urgency}</li>
                    <li>Alcance declarado: {selectedLead.org.scope || "Sin alcance capturado"}</li>
                    <li>Preguntas contestadas: {selectedLead.diagnostic.answered} de {selectedLead.diagnostic.total}</li>
                  </ul>
                ) : (
                  <p>Las recomendaciones aparecera aqui cuando llegue el primer lead.</p>
                )}
              </article>

              <article className={`cardSurface ${styles.detailCard}`}>
                <p className="eyebrow sectionEyebrow">Ruta sugerida</p>
                <h3>Siguiente contacto sugerido</h3>
                {selectedLead ? (
                  <ul className={styles.notesList}>
                    {selectedLead.diagnostic.recommendation.slice(0, 4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Las recomendaciones aparecera aqui cuando llegue el primer lead.</p>
                )}
              </article>

              <article className={`cardSurface ${styles.detailCard}`}>
                <p className="eyebrow sectionEyebrow">Dominios sensibles</p>
                <h3>Brechas de menor puntaje</h3>
                {selectedLead ? (
                  <ul className={styles.domainList}>
                    {selectedLead.diagnostic.domainScores.slice(0, 4).map((item) => (
                      <li key={item.domain}>{item.domain}: {item.score}%</li>
                    ))}
                  </ul>
                ) : (
                  <p>Los dominios criticos se mostraran cuando el diagnostico genere datos reales.</p>
                )}
              </article>
            </aside>
          </section>
        ) : (
          <article className={`cardSurface ${styles.emptyCard}`}>
            <p className="eyebrow sectionEyebrow">CRM vacio</p>
            <h2>Aun no hay leads guardados.</h2>
            <p>
              Cuando el usuario complete el diagnostico publico y pulse guardar, el registro aparecera aqui con su score,
              urgencia, contacto y recomendacion comercial inicial.
            </p>
          </article>
        )}
      </div>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </main>
  );
}
