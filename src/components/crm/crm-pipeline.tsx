"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { AdminSession } from "@/lib/admin-auth-types";
import { formatLeadPriority, formatLeadStage, leadPriorities, pipelineStages, type LeadPriority, type LeadStage, type SavedLead } from "@/lib/lead-types";
import type { CrmUser } from "@/lib/team-store";
import styles from "./crm-pipeline.module.css";

type CrmPipelineProps = {
  leads: SavedLead[];
  session: AdminSession;
  users: CrmUser[];
};

type StageGroup = {
  id: string;
  label: string;
  stages: LeadStage[];
};

const stageGroups: StageGroup[] = [
  {
    id: "entrada",
    label: "Entrada",
    stages: ["Nuevo", "Contactado"],
  },
  {
    id: "calificacion",
    label: "Calificación",
    stages: ["Diagnostico revisado"],
  },
  {
    id: "propuesta",
    label: "Propuesta",
    stages: ["Demo agendada", "Propuesta enviada"],
  },
  {
    id: "cierre",
    label: "Cierre",
    stages: ["Cerrado"],
  },
];

function getBlockWidth(columns: number) {
  if (columns <= 1) return 420;
  if (columns === 2) return 760;
  return 980;
}

function getPriorityClass(priority: LeadPriority) {
  if (priority === "Alta") return styles.priorityHigh;
  if (priority === "Media") return styles.priorityMedium;
  return styles.priorityLow;
}

function getCardTone(stage: LeadStage) {
  if (stage === "Nuevo") return styles.cardNew;
  if (stage === "Contactado" || stage === "Diagnostico revisado") return styles.cardWarm;
  if (stage === "Demo agendada" || stage === "Propuesta enviada") return styles.cardProposal;
  return styles.cardClosed;
}

function getFollowUpLabel(value: string) {
  if (!value) return "Sin siguiente paso";
  const target = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `Cierre vencido`;
  if (diff === 0) return "Cierra hoy";
  if (diff === 1) return "Cierra mañana";
  return `Cierra en ${diff} días`;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function CrmPipeline({ leads, session, users }: CrmPipelineProps) {
  const [items, setItems] = useState(leads);
  const [searchTerm, setSearchTerm] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("Todos");
  const [standardFilter, setStandardFilter] = useState("Todas");
  const [toast, setToast] = useState("");
  const [pendingLeadId, setPendingLeadId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState("");
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const boardRef = useRef<HTMLElement | null>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const canCloseLeads = session.role === "Director";
  const allowedStages = canCloseLeads
    ? pipelineStages
    : pipelineStages.filter((stage) => stage !== "Cerrado");
  const ownerOptions = useMemo(
    () => ["Sin asignar", ...users.map((user) => user.name)],
    [users],
  );
  const standardOptions = useMemo(
    () => Array.from(new Set(items.map((lead) => lead.diagnostic.standardShort))).sort(),
    [items],
  );

  const filteredItems = useMemo(() => {
    const query = normalizeText(deferredSearchTerm);

    return items.filter((lead) => {
      if (ownerFilter !== "Todos" && lead.owner !== ownerFilter) return false;
      if (standardFilter !== "Todas" && lead.diagnostic.standardShort !== standardFilter) return false;
      if (!query) return true;

      const haystack = [
        lead.org.company,
        lead.org.contact,
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
  }, [deferredSearchTerm, items, ownerFilter, standardFilter]);

  const totalLeads = filteredItems.length;
  const noNextStepCount = filteredItems.filter((lead) => !lead.nextFollowUpAt).length;
  const overdueCount = filteredItems.filter((lead) => {
    if (!lead.nextFollowUpAt || lead.status === "Cerrado") return false;
    return new Date(`${lead.nextFollowUpAt}T00:00:00`).getTime() < new Date(new Date().toDateString()).getTime();
  }).length;
  const unassignedCount = filteredItems.filter((lead) => lead.owner === "Sin asignar").length;

  const boardGroups = useMemo(() => {
    return stageGroups.map((group) => {
      const columns = group.stages.map((stage) => ({
        stage,
        leads: filteredItems.filter((lead) => lead.status === stage),
      }));

      return {
        ...group,
        total: columns.reduce((sum, column) => sum + column.leads.length, 0),
        columns,
      };
    });
  }, [filteredItems]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const updateScrollState = () => {
      setCanScrollLeft(board.scrollLeft > 8);
      setCanScrollRight(board.scrollLeft + board.clientWidth < board.scrollWidth - 8);
    };

    updateScrollState();
    board.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      board.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [boardGroups]);

  function flashToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function updateLeadField(leadId: string, payload: Record<string, string>, message: string) {
    setPendingLeadId(leadId);

    startTransition(async () => {
      try {
        const response = await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: leadId, ...payload }),
        });

        const data = await response.json();
        if (!response.ok) {
          flashToast(data.error || "No fue posible actualizar el lead");
          return;
        }

        setItems((current) => current.map((lead) => (lead.id === data.lead.id ? data.lead : lead)));
        flashToast(message);
      } catch {
        flashToast("Falló la actualización del lead");
      } finally {
        setPendingLeadId("");
      }
    });
  }

  function clearFilters() {
    setSearchTerm("");
    setOwnerFilter("Todos");
    setStandardFilter("Todas");
  }

  function scrollBoard(direction: "left" | "right") {
    const board = boardRef.current;
    if (!board) return;
    const amount = Math.max(320, Math.round(board.clientWidth * 0.5));
    board.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  function handleBoardPointerDown(event: React.PointerEvent<HTMLElement>) {
    const board = boardRef.current;
    if (!board) return;
    if ((event.target as HTMLElement).closest("select, input, button, a, [draggable='true']")) return;

    setIsDraggingBoard(true);
    dragStartX.current = event.clientX;
    dragStartScroll.current = board.scrollLeft;
    board.setPointerCapture(event.pointerId);
  }

  function handleBoardPointerMove(event: React.PointerEvent<HTMLElement>) {
    const board = boardRef.current;
    if (!board || !isDraggingBoard) return;
    const delta = event.clientX - dragStartX.current;
    board.scrollLeft = dragStartScroll.current - delta;
  }

  function handleBoardPointerUp(event: React.PointerEvent<HTMLElement>) {
    const board = boardRef.current;
    if (!board) return;
    setIsDraggingBoard(false);
    if (board.hasPointerCapture(event.pointerId)) {
      board.releasePointerCapture(event.pointerId);
    }
  }

  function handleLeadDragStart(event: React.DragEvent<HTMLElement>, leadId: string) {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", leadId);
    setDraggedLeadId(leadId);
  }

  function handleLeadDragEnd() {
    setDraggedLeadId("");
    setDragOverStage(null);
  }

  function handleStageDragOver(event: React.DragEvent<HTMLElement>, stage: LeadStage) {
    if (!draggedLeadId || !allowedStages.some((allowedStage) => allowedStage === stage)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stage) setDragOverStage(stage);
  }

  function handleStageDrop(event: React.DragEvent<HTMLElement>, stage: LeadStage) {
    event.preventDefault();
    const leadId = event.dataTransfer.getData("text/plain") || draggedLeadId;
    const draggedLead = items.find((lead) => lead.id === leadId);

    setDraggedLeadId("");
    setDragOverStage(null);

    if (!draggedLead || draggedLead.status === stage || !allowedStages.some((allowedStage) => allowedStage === stage)) return;

    updateLeadField(
      leadId,
      { status: stage },
      `Lead movido a ${formatLeadStage(stage)}`,
    );
  }

  return (
    <main className={styles.wrapper}>
      <section className={styles.topBar}>
        <div className={styles.titleBlock}>
          <p className="eyebrow">Pipeline comercial</p>
          <h1>Pipeline por bloques</h1>
        </div>

        <div className={styles.topActions}>
          <label className={styles.topSelectField}>
            Ver por comercial
            <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
              <option value="Todos">Todos</option>
              {ownerOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <Link className="button buttonPrimary" href="/crm/leads">
            Nuevo lead
          </Link>
        </div>
      </section>

      <section className={styles.quickFilters}>
        <button type="button" className={`${styles.quickChip} ${styles.quickChipActive}`} onClick={clearFilters}>
          <span>Todos</span>
          <b>{totalLeads}</b>
        </button>

        <button type="button" className={styles.quickChip} onClick={() => setSearchTerm("")}>
          <span>Sin siguiente paso</span>
          <b>{noNextStepCount}</b>
        </button>

        <button type="button" className={styles.quickChip} onClick={() => setSearchTerm("")}>
          <span>Cierre vencido</span>
          <b>{overdueCount}</b>
        </button>

        <button type="button" className={styles.quickChip} onClick={() => setOwnerFilter("Sin asignar")}>
          <span>Sin asignar</span>
          <b>{unassignedCount}</b>
        </button>
      </section>

      <section className={`cardSurface ${styles.filterCard}`}>
        <div className={styles.filters}>
          <label className={styles.filterField}>
            Buscar
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Empresa, contacto, país, sector..."
            />
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

          <button className="button buttonSecondary" type="button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </div>
      </section>

      <section
        ref={boardRef}
        className={`${styles.board} ${isDraggingBoard ? styles.boardDragging : ""}`}
        aria-label="Pipeline por bloques"
        onPointerDown={handleBoardPointerDown}
        onPointerMove={handleBoardPointerMove}
        onPointerUp={handleBoardPointerUp}
        onPointerCancel={handleBoardPointerUp}
      >
        {boardGroups.map((group) => (
          <article
            key={group.id}
            className={styles.stageBlock}
            style={{ width: `${getBlockWidth(group.columns.length)}px` }}
          >
            <div className={styles.blockHeader}>
              <h2>{group.label}</h2>
              <span className={styles.blockCount}>{group.total}</span>
            </div>

            <div
              className={styles.innerColumns}
              style={{ gridTemplateColumns: `repeat(${group.columns.length}, minmax(0, 1fr))` }}
            >
              {group.columns.map((column) => (
                <section
                  key={column.stage}
                  className={`${styles.innerColumn} ${dragOverStage === column.stage ? styles.dropTarget : ""}`}
                  onDragOver={(event) => handleStageDragOver(event, column.stage)}
                  onDrop={(event) => handleStageDrop(event, column.stage)}
                >
                  <div className={styles.innerColumnHeader}>
                    <h3>{formatLeadStage(column.stage)}</h3>
                    <span className={styles.innerCount}>{column.leads.length}</span>
                  </div>

                  {column.leads.length ? (
                    <div className={styles.leadList}>
                      {column.leads.map((lead) => (
                        <article
                          key={lead.id}
                          className={`${styles.leadCard} ${getCardTone(lead.status)} ${draggedLeadId === lead.id ? styles.leadCardDragging : ""}`}
                          draggable={!isPending}
                          onDragStart={(event) => handleLeadDragStart(event, lead.id)}
                          onDragEnd={handleLeadDragEnd}
                          aria-label={`${lead.org.company || "Lead sin nombre"}. Arrastra para cambiar de etapa.`}
                        >
                          <div className={styles.cardTop}>
                            <div>
                              <Link className={styles.titleLink} href={`/crm/leads/${lead.id}`}>
                                {lead.org.company || "Sin nombre"}
                              </Link>
                              <span>{lead.org.contact}</span>
                            </div>
                          </div>

                          <strong className={styles.standardText}>{lead.diagnostic.standardLabel}</strong>

                          <div className={styles.tagRow}>
                            <span className={styles.softTag}>{lead.org.country || "Sin país"}</span>
                            <span className={styles.softTag}>{lead.owner}</span>
                          </div>

                          <div className={styles.scoreRow}>
                            <span className={`${styles.priorityPill} ${getPriorityClass(lead.priority)}`}>{formatLeadPriority(lead.priority)}</span>
                            <strong>{lead.diagnostic.lead.score} pts</strong>
                          </div>

                          <p className={styles.cardNote}>
                            {lead.notes?.trim() || lead.diagnostic.recommendation[0] || "Sin observaciones comerciales todavía."}
                          </p>

                          <p className={styles.deadline}>
                            {lead.nextFollowUpAt ? `${getFollowUpLabel(lead.nextFollowUpAt)}: ${lead.nextFollowUpAt}` : "Sin siguiente paso definido"}
                          </p>

                          <div className={styles.compactActions}>
                            <select
                              value={lead.priority}
                              onChange={(event) =>
                                updateLeadField(lead.id, { priority: event.target.value }, `Prioridad ajustada a ${event.target.value}`)
                              }
                              disabled={isPending && pendingLeadId === lead.id}
                            >
                              {leadPriorities.map((priority) => (
                                <option key={priority} value={priority}>
                                  {priority}
                                </option>
                              ))}
                            </select>

                            <select
                              value={lead.status}
                              onChange={(event) =>
                                updateLeadField(lead.id, { status: event.target.value }, `Lead movido a ${formatLeadStage(event.target.value as LeadStage)}`)
                              }
                              disabled={isPending && pendingLeadId === lead.id}
                            >
                              {allowedStages.map((stage) => (
                                <option key={stage} value={stage}>
                                  {formatLeadStage(stage)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyColumn}>
                      <p>Sin leads en esta subetapa.</p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </article>
        ))}
      </section>

      <div className={styles.boardNav}>
        <button
          className={styles.boardArrow}
          type="button"
          onClick={() => scrollBoard("left")}
          disabled={!canScrollLeft}
          aria-label="Desplazar pipeline a la izquierda"
        >
          ←
        </button>
        <button
          className={styles.boardArrow}
          type="button"
          onClick={() => scrollBoard("right")}
          disabled={!canScrollRight}
          aria-label="Desplazar pipeline a la derecha"
        >
          →
        </button>
      </div>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </main>
  );
}
