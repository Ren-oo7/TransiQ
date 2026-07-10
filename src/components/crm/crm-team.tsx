import Link from "next/link";
import type { AdminSession } from "@/lib/admin-auth-types";
import type { SavedLead } from "@/lib/lead-types";
import type { CrmUser } from "@/lib/team-store";
import styles from "./crm-team.module.css";

type CrmTeamProps = {
  leads: SavedLead[];
  session: AdminSession;
  users: CrmUser[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CrmTeam({ leads, session, users }: CrmTeamProps) {
  const teamCards = users.map((user) => {
    const owned = leads.filter((lead) => lead.owner === user.name);
    const open = owned.filter((lead) => lead.status !== "Cerrado").length;
    const strategic = owned.filter((lead) => lead.diagnostic.lead.score >= 70).length;
    const overdue = owned.filter((lead) => {
      if (lead.status === "Cerrado" || !lead.nextFollowUpAt) return false;
      return new Date(`${lead.nextFollowUpAt}T00:00:00`).getTime() < new Date(new Date().toDateString()).getTime();
    }).length;
    const closed = owned.filter((lead) => lead.status === "Cerrado").length;
    const highPriority = owned.filter((lead) => lead.status !== "Cerrado" && lead.priority === "Alta").length;

    return {
      ...user,
      total: owned.length,
      open,
      strategic,
      overdue,
      closed,
      highPriority,
    };
  });

  const unassigned = leads.filter((lead) => !users.some((user) => user.name === lead.owner) || lead.owner === "Sin asignar");
  const openLeads = leads.filter((lead) => lead.status !== "Cerrado").length;
  const assignedLeads = leads.filter((lead) => users.some((user) => user.name === lead.owner)).length;
  const assignmentRate = leads.length ? Math.round((assignedLeads / leads.length) * 100) : 0;
  const directors = users.filter((user) => user.role === "Director").length;
  const commercials = users.filter((user) => user.role === "Comercial").length;

  const busiest = [...teamCards]
    .sort((a, b) => b.open - a.open || b.highPriority - a.highPriority)
    .slice(0, 4);

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <article className={`cardSurface ${styles.heroCard}`}>
          <p className="eyebrow">Equipo comercial</p>
          <h1>Visualice responsables, carga operativa y cobertura real de la cartera comercial.</h1>
          <p>
            Esta vista ayuda a dirección a entender quién atiende cada oportunidad, dónde hay saturación y qué parte
            del pipeline sigue sin dueño claro.
          </p>
          <div className={styles.chips}>
            <span className={styles.chip}>Sesión activa: {session.name}</span>
            <span className={styles.chip}>Rol: {session.role}</span>
            <span className={styles.chip}>Usuarios CRM: {users.length}</span>
          </div>
        </article>

        <article className={`cardSurface ${styles.highlightCard}`}>
          <span className={styles.highlightLabel}>Cobertura de cartera</span>
          <div className={styles.highlightValue}>{assignmentRate}%</div>
          <p>{assignedLeads} de {leads.length} leads ya están asignados a una persona del CRM.</p>
          <span className={styles.highlightMeta}>{unassigned.length} siguen sin dueño operativo claro.</span>
        </article>
      </section>

      <section className={styles.metricGrid}>
        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Directores</span>
          <div className={styles.metricValue}>{directors}</div>
          <p>Usuarios con control de reasignación y cierre comercial.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Comerciales</span>
          <div className={styles.metricValue}>{commercials}</div>
          <p>Usuarios enfocados en seguimiento y movimiento del pipeline.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Leads abiertos</span>
          <div className={styles.metricValue}>{openLeads}</div>
          <p>Oportunidades activas que hoy requieren cobertura del equipo.</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Sin asignar</span>
          <div className={styles.metricValue}>{unassigned.length}</div>
          <p>Leads que aún no tienen responsable reconocido dentro del CRM.</p>
        </article>
      </section>

      <section className={styles.dualGrid}>
        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Responsables</p>
              <h2>Resumen por persona</h2>
            </div>
            <Link className="button buttonSecondary" href="/crm/leads">
              Ir a leads
            </Link>
          </div>

          <div className={styles.peopleGrid}>
            {teamCards.map((user) => (
              <article key={user.id} className={styles.personCard}>
                <div className={styles.personTop}>
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.role}</p>
                  </div>
                  <span className={styles.roleBadge}>{user.role}</span>
                </div>

                <p className={styles.personMeta}>{user.email}</p>
                <p className={styles.personMeta}>Alta en CRM: {formatDate(user.createdAt)}</p>

                <div className={styles.kpiRow}>
                  <span className={styles.kpiBadge}>Total {user.total}</span>
                  <span className={styles.kpiBadge}>Abiertos {user.open}</span>
                  <span className={styles.kpiBadge}>Cierres {user.closed}</span>
                </div>

                <div className={styles.kpiRow}>
                  <span className={styles.kpiBadge}>Estratégicos {user.strategic}</span>
                  <span className={styles.kpiBadge}>Alta prioridad {user.highPriority}</span>
                  <span className={styles.kpiBadge}>Vencidos {user.overdue}</span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Carga crítica</p>
              <h2>Quién necesita atención primero</h2>
            </div>
            <Link className="button buttonGhost" href="/crm/reportes">
              Ver reportes
            </Link>
          </div>

          {busiest.length ? (
            <ul className={styles.priorityList}>
              {busiest.map((user) => (
                <li key={user.id}>
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.open} abiertos · {user.highPriority} alta prioridad</span>
                  </div>
                  <small>{user.overdue} seguimientos vencidos</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>Cuando haya cartera asignada, aquí veremos a quién apoyar primero.</p>
          )}

          <div className={styles.callout}>
            <strong>Lectura recomendada</strong>
            <p>
              Si la cartera abierta está concentrada en una sola persona o hay muchos leads sin asignar, conviene
              reasignar desde la bandeja de leads antes de seguir captando más demanda.
            </p>
          </div>
        </article>
      </section>

      <section className={styles.dualGrid}>
        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Sin asignar</p>
              <h2>Oportunidades sin dueño</h2>
            </div>
          </div>

          {unassigned.length ? (
            <ul className={styles.priorityList}>
              {unassigned.slice(0, 6).map((lead) => (
                <li key={lead.id}>
                  <div>
                    <strong>{lead.org.company || "Sin nombre"}</strong>
                    <span>{lead.priority} · {formatDate(lead.createdAt)}</span>
                  </div>
                  <small>{lead.org.contact} · {lead.status}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyText}>Todas las oportunidades ya están asociadas a una persona del equipo.</p>
          )}
        </article>

        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Uso del módulo</p>
              <h2>Qué resolver desde aquí</h2>
            </div>
          </div>

          <ul className={styles.notesList}>
            <li>Ver si la cartera está equilibrada entre responsables y roles.</li>
            <li>Detectar leads sin asignar antes de que queden olvidados.</li>
            <li>Identificar quién concentra seguimientos vencidos o alta prioridad.</li>
            <li>Usar `Leads` para reasignar y este panel para revisar si la distribución mejora.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
