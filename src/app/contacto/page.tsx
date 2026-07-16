"use client";

import Link from "next/link";
import { useState } from "react";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./contacto.module.css";

const flow = [
  { number: "01", title: "Captura IA", text: "Datos clave de país, norma, sector y urgencia." },
  { number: "02", title: "Ruta automática", text: "Diagnóstico, demo, recurso o plan." },
  { number: "03", title: "Escalamiento opcional", text: "Especialista solo cuando corresponde." },
];

const countries = [
  "México", "Estados Unidos", "Canadá", "República Dominicana", "Colombia", "Ecuador", "Chile", "Brasil / Brazil",
  "Paraguay", "Perú", "Argentina", "Uruguay", "Costa Rica", "Panamá", "España", "Francia", "Italia", "Alemania",
  "Portugal", "Reino Unido", "China", "Japón / Japan", "India", "Corea del Sur", "Singapur", "Otro país",
];

const norms = [
  "ISO 9001:2015 → ISO 9001:2026", "ISO 14001:2015 → ISO 14001:2026", "ISO 45001:2018 → fortalecimiento / futura versión",
  "ISO 37001:2016 → ISO 37001:2025", "ISO/IEC 27001:2022", "ISO 22301", "ISO 22000 / HACCP", "ISO 50001",
  "ISO 13485", "ISO/IEC 42001", "Sistema Integrado ISO 9001 + 14001 + 45001", "Multinorma personalizada",
];

const urgencies = ["Crítica: 0 a 30 días", "Alta: 1 a 3 meses", "Media: 3 a 6 meses", "Planeada: 6 a 12 meses", "Exploratoria"];

const channels = [
  { title: "México", text: "Mercado local, corporativo, gobierno y sectores regulados." },
  { title: "LATAM", text: "RD, Colombia, Ecuador, Chile, Brasil, Paraguay y Perú." },
  { title: "Europa", text: "España, Francia, Italia y otros mercados." },
  { title: "Asia", text: "China, Japón, India y mercados estratégicos." },
];

type ContactRoute = { title: string; description: string };

export default function ContactoPage() {
  const [route, setRoute] = useState<ContactRoute | null>(null);

  function handleContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const sites = Number(form.get("sites") || 1);
    const norm = String(form.get("norm") || norms[0]);
    const urgency = String(form.get("urgency") || urgencies[0]);
    const specialist = sites > 2 || norm.includes("Multinorma") || norm.includes("Sistema Integrado");
    setRoute(specialist
      ? { title: "Escalamiento opcional", description: "Tu contexto puede beneficiarse de un especialista por su alcance multinorma, multisitio o complejidad." }
      : urgency.startsWith("Crítica")
        ? { title: "Diagnóstico prioritario", description: "La ruta recomendada inicia con diagnóstico y priorización de brechas." }
        : { title: "Ruta automática", description: "La recomendación inicial es continuar con diagnóstico, recurso o demo autónoma." });
  }

  return (
    <main>
      <section className={`section ${styles.hero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (2).webp')" }} />
        <div className={`shell ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow sectionEyebrow">Contacto inteligente</p>
            <h1>Contacto solo cuando agrega valor. La ruta inicia automáticamente.</h1>
            <p>TransiQ primero interpreta tu contexto, recomienda una acción y permite avanzar. El contacto humano queda para proyectos estratégicos, multinorma, multisitio o complejos.</p>
            <div className={styles.heroActions}>
              <a className="button buttonPrimary" href="#contacto">Enviar contexto</a>
              <Link className="button buttonSecondary" href={buildAttributedHref("/diagnostico", { canal: "contacto-hero" })}>Preferir diagnóstico</Link>
            </div>
          </div>

          <aside className={`cardSurface ${styles.flowPanel}`}>
            <h3>Flujo sin dependencia comercial inicial</h3>
            <div className={styles.flowList}>
              {flow.map((item) => (
                <article key={item.number} className={styles.flowCard}>
                  <span>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="contacto" className={`section ${styles.contactSection}`}>
        <div className={`shell ${styles.formGrid}`}>
          <form className={`cardSurface ${styles.contactForm}`} onSubmit={handleContact}>
            <p className="eyebrow sectionEyebrow">Solicitud ejecutiva</p>
            <h2>Comparte tu contexto.</h2>
            <div className={styles.formRow}>
              <label>Empresa<input name="company" placeholder="Empresa" /></label>
              <label>País<select name="country">{countries.map((country) => <option key={country}>{country}</option>)}</select></label>
            </div>
            <div className={styles.formRow}>
              <label>Norma<select name="norm">{norms.map((norm) => <option key={norm}>{norm}</option>)}</select></label>
              <label>Urgencia<select name="urgency">{urgencies.map((urgency) => <option key={urgency}>{urgency}</option>)}</select></label>
            </div>
            <div className={styles.formRow}>
              <label>Empleados<input name="employees" type="number" defaultValue="80" /></label>
              <label>Sitios<input name="sites" type="number" defaultValue="1" /></label>
            </div>
            <label>Mensaje<textarea name="message" rows={4} placeholder="Describe brevemente tu necesidad" /></label>
            <button className="button buttonPrimary" type="submit">Generar ruta de contacto</button>
          </form>

          <aside className={`cardSurface ${styles.routePanel}`}>
            <h3>Ruta de contacto</h3>
            {route ? <div className={styles.routeResult}><span>✓</span><h4>{route.title}</h4><p>{route.description}</p></div> : <p>Si el caso no requiere especialista, se recomendará diagnóstico, recurso o demo autónoma.</p>}
          </aside>
        </div>
      </section>

      <section className={`section ${styles.channelsSection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <h2>Canales globales.</h2>
            <p>Preparado para México, LATAM, Estados Unidos, Europa, Asia, India y operación internacional.</p>
          </div>
          <div className={styles.channelsGrid}>
            {channels.map((channel) => <article key={channel.title} className={`cardSurface ${styles.channelCard}`}><h3>{channel.title}</h3><p>{channel.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className={`section ${styles.finalCta}`}>
        <div className={styles.finalCtaBg} />
        <div className="shell">
          <h2>Evita la bandeja genérica.</h2>
          <p>Convierte tu solicitud en una ruta automática y accionable.</p>
        </div>
      </section>
    </main>
  );
}
