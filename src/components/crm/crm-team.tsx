"use client";

import { useState, useTransition } from "react";
import type { AdminSession } from "@/lib/admin-auth-types";
import type { CrmUser } from "@/lib/team-store";
import styles from "./crm-team.module.css";

type CrmTeamProps = { session: AdminSession; users: CrmUser[] };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export function CrmTeam({ session, users: initialUsers }: CrmTeamProps) {
  const [users, setUsers] = useState(initialUsers);
  const [toast, setToast] = useState("");
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const canManage = session.role === "Director";

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  async function request(method: "POST" | "PATCH", payload: Record<string, unknown>) {
    const response = await fetch("/api/team", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No fue posible actualizar el equipo.");
    return data.user as CrmUser;
  }

  function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        const user = await request("POST", {
          name: form.get("name"), email: form.get("email"), role: form.get("role"), password: form.get("password"),
        });
        setUsers((current) => [...current, user]);
        (event.currentTarget as HTMLFormElement).reset();
        flash("Usuario creado correctamente.");
      } catch (error) { flash(error instanceof Error ? error.message : "No fue posible crear el usuario."); }
    });
  }

  function updateUser(id: string, payload: Record<string, unknown>, success: string) {
    startTransition(async () => {
      try {
        const user = await request("PATCH", { id, ...payload });
        setUsers((current) => current.map((item) => item.id === user.id ? user : item));
        if (payload.password) setPasswords((current) => ({ ...current, [id]: "" }));
        flash(success);
      } catch (error) { flash(error instanceof Error ? error.message : "No fue posible actualizar el usuario."); }
    });
  }

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <article className={`cardSurface ${styles.heroCard}`}>
          <p className="eyebrow">Administración del equipo</p>
          <h1>Controle quién puede entrar al CRM y qué permisos tiene.</h1>
          <p>Desde aquí Dirección da de alta usuarios, define roles, activa o suspende accesos y renueva contraseñas.</p>
          <div className={styles.chips}>
            <span className={styles.chip}>Usuarios: {users.length}</span>
            <span className={styles.chip}>Activos: {users.filter((user) => user.active).length}</span>
            <span className={styles.chip}>Sesión: {session.name}</span>
          </div>
        </article>
        <article className={`cardSurface ${styles.highlightCard}`}>
          <span className={styles.highlightLabel}>Accesos activos</span>
          <div className={styles.highlightValue}>{users.filter((user) => user.active).length}</div>
          <p>{users.filter((user) => user.role === "Director" && user.active).length} director(es) y {users.filter((user) => user.role === "Comercial" && user.active).length} comercial(es).</p>
          <span className={styles.highlightMeta}>{canManage ? "Tienes permisos de administración." : "Solo Dirección puede realizar cambios."}</span>
        </article>
      </section>

      {canManage ? (
        <section className={`cardSurface ${styles.panelCard}`}>
          <div className={styles.sectionHeader}><div><p className="eyebrow sectionEyebrow">Nuevo acceso</p><h2>Dar de alta un usuario</h2></div></div>
          <form className={styles.createForm} onSubmit={createUser}>
            <label>Nombre completo<input name="name" required /></label>
            <label>Correo interno<input name="email" type="email" required /></label>
            <label>Rol<select name="role" defaultValue="Comercial"><option>Comercial</option><option>Director</option></select></label>
            <label>Contraseña temporal<input name="password" type="password" minLength={8} required /></label>
            <button className="button buttonPrimary" type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Crear usuario"}</button>
          </form>
        </section>
      ) : null}

      <section className={`cardSurface ${styles.panelCard}`}>
        <div className={styles.sectionHeader}><div><p className="eyebrow sectionEyebrow">Usuarios CRM</p><h2>Accesos del equipo</h2></div></div>
        <div className={styles.peopleGrid}>
          {users.map((user) => (
            <article key={user.id} className={styles.personCard}>
              <div className={styles.personTop}><div><strong>{user.name}</strong><p>{user.email}</p></div><span className={user.active ? styles.activeBadge : styles.inactiveBadge}>{user.active ? "Activo" : "Inactivo"}</span></div>
              <p className={styles.personMeta}>Alta: {formatDate(user.createdAt)}</p>
              <label className={styles.controlField}>Rol<select value={user.role} disabled={!canManage || isPending || user.email === session.email} onChange={(event) => updateUser(user.id, { role: event.target.value }, "Rol actualizado.")}><option>Comercial</option><option>Director</option></select></label>
              {canManage ? (
                <>
                  <button className={`button ${user.active ? "buttonSecondary" : "buttonPrimary"}`} type="button" disabled={isPending || user.email === session.email} onClick={() => updateUser(user.id, { active: !user.active }, user.active ? "Usuario desactivado." : "Usuario activado.")}>{user.active ? "Desactivar acceso" : "Activar acceso"}</button>
                  <div className={styles.passwordRow}><input type="password" minLength={8} placeholder="Nueva contraseña" value={passwords[user.id] || ""} onChange={(event) => setPasswords((current) => ({ ...current, [user.id]: event.target.value }))} /><button className="button buttonSecondary" type="button" disabled={isPending || (passwords[user.id] || "").length < 8} onClick={() => updateUser(user.id, { password: passwords[user.id] }, "Contraseña actualizada.")}>Cambiar contraseña</button></div>
                </>
              ) : null}
            </article>
          ))}
        </div>
      </section>
      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </main>
  );
}
