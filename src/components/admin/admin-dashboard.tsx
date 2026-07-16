"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { AdminSession } from "@/lib/admin-auth-types";
import { formatLeadPriority, formatLeadStage, pipelineStages, type LeadStage, type SavedLead } from "@/lib/lead-types";
import type { CrmUser } from "@/lib/team-store";
import { getLeadContactName, getLeadContactSearchText, getLeadEmail, getLeadPhone } from "@/lib/lead-contact";
import styles from "./admin-dashboard.module.css";

type AdminDashboardProps = {
  leads: SavedLead[];
  session: AdminSession;
  users: CrmUser[];
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

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function AdminDashboard({ leads, session, users }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("Todos");
  const [urgencyFilter, setUrgencyFilter] = useState("Todas");
  const [standardFilter, setStandardFilter] = useState("Todas");
  const [ownerFilter, setOwnerFilter] = useState("Todos");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const ownerOptions = useMemo(
    () => ["Sin asignar", ...users.map((user) => user.name)],
    [users],
  );

  const standardOptions = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.diagnostic.standardShort))).sort(),
    [leads],
  );

  const filteredLeads = useMemo(() => {
    const query = normalizeText(deferredSearchTerm);

    return leads.filter((lead) => {
      if (stageFilter !== "Todos" && lead.status !== stageFilter) return false;
      if (urgencyFilter !== "Todas" && lead.org.urgency !== urgencyFilter) return false;
      if (standardFilter !== "Todas" && lead.diagnostic.standardShort !== standardFilter) return false;
      if (ownerFilter !== "Todos" && lead.owner !== ownerFilter) return false;
      if (!query) return true;

      const haystack = [
        lead.org.company,
        getLeadContactSearchText(lead.org),
        lead.org.country,
        lead.org.sector,
        lead.owner,
        lead.source,
        lead.diagnostic.standardLabel,
        lead.diagnostic.standardShort,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [deferredSearchTerm, leads, ownerFilter, stageFilter, standardFilter, urgencyFilter]);

  const strategicLeads = leads.filter((lead) => lead.diagnostic.lead.score >= 70).length;
  const urgentLeads = leads.filter((lead) => ["alta", "critica"].includes(lead.org.urgency)).length;
  const averageScore = leads.length
    ? Math.round(leads.reduce((sum, lead) => sum + lead.diagnostic.score, 0) / leads.length)
    : 0;

  const pageSizeNumber = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSizeNumber));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSizeNumber;
    return filteredLeads.slice(start, start + pageSizeNumber);
  }, [currentPage, filteredLeads, pageSizeNumber]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, stageFilter, urgencyFilter, standardFilter, ownerFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  function clearFilters() {
    setSearchTerm("");
    setStageFilter("Todos");
    setUrgencyFilter("Todas");
    setStandardFilter("Todas");
    setOwnerFilter("Todos");
  }

  return (
    <main className={styles.grid}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div>
            <p className="eyebrow">CRM interno</p>
            <h1>Bandeja comercial para leads captados desde el diagnóstico.</h1>
          </div>
          <p>
            Aquí concentramos filtros, lectura rápida y priorización inicial. El seguimiento completo de cada oportunidad
            ahora vive en una pantalla de detalle para no saturar la bandeja cuando el volumen crezca.
          </p>
        </div>

        <article className={`cardSurface ${styles.heroStats}`}>
          <div className={styles.sessionMeta}>
            <span className={styles.sessionBadge}>{session.role}</span>
          </div>
          <span className="miniLabel">Sesión activa</span>
          <b>{session.name}</b>
          <p>{session.email}</p>
        </article>
      </section>

      <section className={styles.metricGrid}>
        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Leads totales</span>
          <b>{leads.length}</b>
          <span>Registros acumulados desde el diagnóstico público</span>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Leads prioritarios</span>
          <b>{strategicLeads}</b>
          <span>Score comercial mayor o igual a 70</span>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Urgencia alta</span>
          <b>{urgentLeads}</b>
          <span>Casos marcados como alta o crítica</span>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Madurez promedio</span>
          <b>{averageScore}%</b>
          <span>Promedio del diagnóstico inicial recibido</span>
        </article>
      </section>

      {leads.length ? (
        <article className={`cardSurface ${styles.tableCard}`}>
          <div className={styles.tableHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Bandeja comercial</p>
              <h2>Leads captados</h2>
            </div>
            <p>{filteredLeads.length} resultados visibles de {leads.length} registros</p>
          </div>

          <div className={styles.filters}>
            <label className={styles.filterField}>
              Buscar
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Empresa, contacto, norma, país, responsable..."
              />
            </label>

            <label className={styles.filterField}>
              Etapa
              <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
                <option value="Todos">Todas</option>
                {pipelineStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {formatLeadStage(stage)}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.filterField}>
              Urgencia
              <select value={urgencyFilter} onChange={(event) => setUrgencyFilter(event.target.value)}>
                <option value="Todas">Todas</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </label>

            <label className={styles.filterField}>
              Norma
              <select value={standardFilter} onChange={(event) => setStandardFilter(event.target.value)}>
                <option value="Todas">Todas</option>
                {standardOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.filterField}>
              Responsable
              <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                <option value="Todos">Todos</option>
                {ownerOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button className="button buttonSecondary" type="button" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>

          <div className={styles.paginationHeader}>
            <p>
              Mostrando {filteredLeads.length ? (currentPage - 1) * pageSizeNumber + 1 : 0} a{" "}
              {Math.min(currentPage * pageSizeNumber, filteredLeads.length)} de {filteredLeads.length} resultados
            </p>

            <label className={styles.pageSizeField}>
              Ver
              <select value={pageSize} onChange={(event) => setPageSize(event.target.value)}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>por página</span>
            </label>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Etapa</th>
                  <th>Madurez</th>
                  <th>Oportunidad</th>
                  <th>Responsable</th>
                  <th>Prioridad</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Fecha</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className={styles.companyCell}>
                        <strong>{lead.org.company || "Sin nombre"}</strong>
                        <span>{lead.org.country} | {lead.org.sector || "Sector no definido"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.stageBadge} ${getStageClass(lead.status)}`}>{formatLeadStage(lead.status)}</span>
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
                    <td>{formatLeadPriority(lead.priority)}</td>
                    <td>{getLeadContactName(lead.org)}</td>
                    <td>{getLeadEmail(lead.org)}</td>
                    <td>{getLeadPhone(lead.org)}</td>
                    <td>{new Date(lead.createdAt).toLocaleDateString("es-MX")}</td>
                    <td>
                      <Link className={styles.detailLink} href={`/crm/leads/${lead.id}`}>
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filteredLeads.length ? (
            <div className={styles.noResults}>
              <h3>Sin resultados para estos filtros.</h3>
              <p>Ajusta la búsqueda o limpia los filtros para volver a ver toda la bandeja.</p>
            </div>
          ) : null}

          {filteredLeads.length ? (
            <div className={styles.paginationFooter}>
              <p>
                Página {currentPage} de {totalPages}
              </p>

              <div className={styles.paginationActions}>
                <button
                  className="button buttonSecondary"
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>

                <button
                  className="button buttonSecondary"
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : null}
        </article>
      ) : (
        <article className={`cardSurface ${styles.emptyCard}`}>
          <p className="eyebrow sectionEyebrow">CRM vacío</p>
          <h2>Aún no hay leads guardados.</h2>
          <p>
            Cuando el usuario complete el diagnóstico público y pulse guardar, el registro aparecerá aquí con su score,
            urgencia, contacto y recomendación comercial inicial.
          </p>
        </article>
      )}
    </main>
  );
}
