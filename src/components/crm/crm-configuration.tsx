import type { AdminSession, AdminRole } from "@/lib/admin-auth-types";
import { leadPriorities, pipelineStages } from "@/lib/lead-types";
import type { CrmUser } from "@/lib/team-store";
import styles from "./crm-configuration.module.css";

type CrmConfigurationProps = {
  session: AdminSession;
  users: CrmUser[];
  config: {
    appLoginUrl: string;
    hasExternalAppUrl: boolean;
    demoMode: boolean;
    hasCustomAuthSecret: boolean;
    hasCustomDirectorSeed: boolean;
    hasCustomCommercialSeed: boolean;
  };
};

function getRolePermissions(role: AdminRole) {
  if (role === "Director") {
    return [
      "Reasignar responsables",
      "Cerrar oportunidades",
      "Editar seguimiento y notas",
      "Supervisar cartera completa",
    ];
  }

  return [
    "Editar pipeline y notas",
    "Actualizar prioridad y seguimiento",
    "Trabajar cartera asignada",
    "Sin permiso de cierre final",
  ];
}

export function CrmConfiguration({ session, users, config }: CrmConfigurationProps) {
  const roleSummary = Array.from(
    users.reduce((map, user) => {
      const current = map.get(user.role) ?? 0;
      map.set(user.role, current + 1);
      return map;
    }, new Map<AdminRole, number>()),
  );

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <article className={`cardSurface ${styles.heroCard}`}>
          <p className="eyebrow">Configuración del CRM</p>
          <h1>Centralice parámetros operativos, accesos y reglas base del CRM comercial.</h1>
          <p>
            Esta vista resume cómo está configurado hoy el entorno interno: entrada a la app, credenciales base,
            permisos por rol y catálogos activos del embudo.
          </p>
          <div className={styles.chips}>
            <span className={styles.chip}>Sesión activa: {session.name}</span>
            <span className={styles.chip}>Rol: {session.role}</span>
            <span className={styles.chip}>Usuarios CRM: {users.length}</span>
          </div>
        </article>

        <article className={`cardSurface ${styles.highlightCard}`}>
          <span className={styles.highlightLabel}>Estado de acceso</span>
          <div className={styles.highlightValue}>{config.demoMode ? "Demo" : "Custom"}</div>
          <p>{config.demoMode ? "El CRM usa credenciales locales de desarrollo." : "El acceso interno usa credenciales configuradas por entorno."}</p>
          <span className={styles.highlightMeta}>
            {config.hasExternalAppUrl ? "La app TransiQ ya apunta a una URL externa." : "La app TransiQ sigue usando el puente local /login."}
          </span>
        </article>
      </section>

      <section className={styles.metricGrid}>
        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">URL de la app</span>
          <div className={styles.metricValue}>{config.hasExternalAppUrl ? "Lista" : "Pendiente"}</div>
          <p>{config.appLoginUrl}</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Secreto de sesión</span>
          <div className={styles.metricValue}>{config.hasCustomAuthSecret ? "Custom" : "Demo"}</div>
          <p>{config.hasCustomAuthSecret ? "La firma de sesión ya usa un secreto definido por entorno." : "En local se usa el secreto demo de desarrollo."}</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Seed Dirección</span>
          <div className={styles.metricValue}>{config.hasCustomDirectorSeed ? "Custom" : "Demo"}</div>
          <p>{config.hasCustomDirectorSeed ? "Dirección ya no usa el correo local por defecto." : "Sigue con `director@transiq.local` en desarrollo."}</p>
        </article>

        <article className={`cardSurface ${styles.metricCard}`}>
          <span className="miniLabel">Seed Comercial</span>
          <div className={styles.metricValue}>{config.hasCustomCommercialSeed ? "Custom" : "Demo"}</div>
          <p>{config.hasCustomCommercialSeed ? "Comercial ya no usa el seed local por defecto." : "Sigue con `comercial@transiq.local` en desarrollo."}</p>
        </article>
      </section>

      <section className={styles.dualGrid}>
        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Parámetros activos</p>
              <h2>Catálogos del embudo</h2>
            </div>
          </div>

          <div className={styles.catalogGrid}>
            <div className={styles.catalogCard}>
              <strong>Etapas comerciales</strong>
              <ul className={styles.tagList}>
                {pipelineStages.map((stage) => (
                  <li key={stage}>{stage}</li>
                ))}
              </ul>
            </div>

            <div className={styles.catalogCard}>
              <strong>Prioridades</strong>
              <ul className={styles.tagList}>
                {leadPriorities.map((priority) => (
                  <li key={priority}>{priority}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Usuarios</p>
              <h2>Estructura de roles actual</h2>
            </div>
          </div>

          <div className={styles.roleGrid}>
            {roleSummary.map(([role, count]) => (
              <article key={role} className={styles.roleCard}>
                <div className={styles.roleTop}>
                  <strong>{role}</strong>
                  <span className={styles.roleBadge}>{count}</span>
                </div>
                <ul className={styles.notesList}>
                  {getRolePermissions(role).map((permission) => (
                    <li key={permission}>{permission}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.dualGrid}>
        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Acceso interno</p>
              <h2>Lectura operativa del entorno</h2>
            </div>
          </div>

          <ul className={styles.detailList}>
            <li>
              <strong>App TransiQ:</strong> {config.hasExternalAppUrl ? "ya separada del sitio comercial" : "pendiente de URL final; hoy usa el puente local"}.
            </li>
            <li>
              <strong>Modo demo:</strong> {config.demoMode ? "activo en este entorno" : "desactivado; se usan credenciales configuradas"}.
            </li>
            <li>
              <strong>Sesiones:</strong> {config.hasCustomAuthSecret ? "protegidas con secreto definido por entorno" : "firmadas con secreto demo de desarrollo"}.
            </li>
            <li>
              <strong>CRM comercial:</strong> separado de la web pública y de la app operativa de TransiQ.
            </li>
          </ul>
        </article>

        <article className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <p className="eyebrow sectionEyebrow">Siguiente fase</p>
              <h2>Qué puede crecer después</h2>
            </div>
          </div>

          <ul className={styles.notesList}>
            <li>Editar etapas y prioridades desde UI, no solo desde código.</li>
            <li>Definir políticas de contraseña, caducidad de sesión y recuperación de acceso.</li>
            <li>Gestionar permisos por rol con mayor granularidad.</li>
            <li>Centralizar variables visibles del negocio como URL de app y mensajes operativos.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
