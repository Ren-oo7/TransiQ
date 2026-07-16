"use client";

import Link from "next/link";
import { useState } from "react";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./recursos.module.css";

const quickNeeds = [
  {
    title: "Prepararme para ISO 9001:2026",
    resultTitle: "ISO 9001:2026",
    result: "Checklist de transición + guía ejecutiva + diagnóstico de madurez.",
  },
  {
    title: "Tengo auditoría próxima",
    resultTitle: "Auditoría próxima",
    result: "Checklist de evidencias críticas + readiness digital.",
  },
  {
    title: "Integrar varias normas",
    resultTitle: "Sistema integrado",
    result: "Mapa de requisitos comunes + matriz multinorma.",
  },
];

const countries = [
  "México", "Estados Unidos", "Canadá", "República Dominicana", "Colombia", "Ecuador", "Chile", "Brasil / Brazil",
  "Paraguay", "Perú", "Argentina", "Uruguay", "Costa Rica", "Panamá", "España", "Francia", "Italia", "Alemania",
  "Portugal", "Reino Unido", "China", "Japón / Japan", "India", "Corea del Sur", "Singapur", "Otro país",
];

const norms = [
  "ISO 9001:2015 → ISO 9001:2026",
  "ISO 14001:2015 → ISO 14001:2026",
  "ISO 45001:2018 → fortalecimiento / futura versión",
  "ISO 37001:2016 → ISO 37001:2025",
  "ISO/IEC 27001:2022",
  "ISO 22301",
  "ISO 22000 / HACCP",
  "ISO 50001",
  "ISO 13485",
  "ISO/IEC 42001",
  "Sistema Integrado ISO 9001 + 14001 + 45001",
  "Multinorma personalizada",
];

const profiles = ["Alta Dirección", "Calidad", "Ambiental / HSE", "SST", "TI / Seguridad", "Cumplimiento / Legal", "Consultor ISO", "Auditor interno"];
const urgencies = ["Crítica: 0 a 30 días", "Alta: 1 a 3 meses", "Media: 3 a 6 meses", "Planeada: 6 a 12 meses", "Exploratoria"];

const library = [
  { tag: "Checklist", title: "Checklist de transición ISO 2026", description: "Liderazgo, riesgos, documentos, evidencias, auditoría interna e indicadores.", action: "Usar checklist", href: "/diagnostico" },
  { tag: "Guía", title: "Guía para Alta Dirección", description: "Riesgos ejecutivos, decisiones clave, ruta de 90 días y seguimiento.", action: "Ver guía", href: "/demo" },
  { tag: "Matriz", title: "Matriz de brechas por norma", description: "Impacto, criticidad, evidencias, procesos responsables y acciones.", action: "Explorar matrices", href: "/soluciones" },
  { tag: "Webinar", title: "Preparación por norma", description: "9001, 14001, 45001, 37001, 27001 y Sistemas Integrados.", action: "Solicitar calendario", href: "/contacto" },
  { tag: "Calculadora", title: "Madurez ISO", description: "Evalúa score, urgencia, complejidad y ruta recomendada.", action: "Calcular madurez", href: "/diagnostico" },
  { tag: "Kit consultor", title: "Kit de diagnóstico para clientes", description: "Reportes, plantillas y rutas para administrar múltiples organizaciones.", action: "Ver demo", href: "/demo" },
];

const organicBlocks = [
  { title: "SEO", text: "Páginas por norma, país y necesidad." },
  { title: "Compartir", text: "Texto listo para LinkedIn y WhatsApp." },
  { title: "Invitar", text: "Expansión interna dentro de la empresa." },
  { title: "Nutrir", text: "Correo, webinar, demo y diagnóstico." },
];

export default function RecursosPage() {
  const [activeNeed, setActiveNeed] = useState(0);
  const [recommendation, setRecommendation] = useState<{ norm: string; country: string; urgency: string } | null>(null);

  function handleRecommendation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setRecommendation({
      norm: String(form.get("norm") || norms[0]),
      country: String(form.get("country") || countries[0]),
      urgency: String(form.get("urgency") || urgencies[0]),
    });
  }

  return (
    <main>
      <section className={`section ${styles.hero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (2).webp')" }} />
        <div className={`shell ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow sectionEyebrow">Knowledge Lab</p>
            <h1>Recursos ISO personalizados, no descargas genéricas.</h1>
            <p>TransiQ recomienda checklists, guías, matrices y webinars según norma, país, sector, perfil y urgencia. Cada recurso abre un siguiente paso: diagnóstico, demo, matriz o plan.</p>
            <div className={styles.heroActions}>
              <a className="button buttonPrimary" href="#recurso">Encontrar recurso</a>
              <Link className="button buttonSecondary" href={buildAttributedHref("/diagnostico", { canal: "recursos-hero" })}>Iniciar diagnóstico</Link>
            </div>
          </div>

          <aside className={`cardSurface ${styles.needCard}`}>
            <h3>¿Qué necesitas?</h3>
            <div className={styles.needOptions}>
              {quickNeeds.map((item, index) => (
                <button key={item.title} type="button" className={index === activeNeed ? styles.activeNeed : ""} onClick={() => setActiveNeed(index)}>
                  {item.title}
                </button>
              ))}
            </div>
            <div className={styles.needResult}>
              <strong>{quickNeeds[activeNeed].resultTitle}</strong>
              <p>{quickNeeds[activeNeed].result}</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="recurso" className={`section ${styles.personalizationSection}`}>
        <div className={`shell ${styles.formGrid}`}>
          <form className={`cardSurface ${styles.resourceForm}`} onSubmit={handleRecommendation}>
            <p className="eyebrow sectionEyebrow">Personaliza tu recurso</p>
            <h2>Recibe la herramienta correcta.</h2>
            <div className={styles.formRow}>
              <label>Nombre<input name="name" placeholder="Nombre" /></label>
              <label>Empresa<input name="company" placeholder="Empresa" /></label>
            </div>
            <div className={styles.formRow}>
              <label>País<select name="country">{countries.map((country) => <option key={country}>{country}</option>)}</select></label>
              <label>Norma<select name="norm">{norms.map((norm) => <option key={norm}>{norm}</option>)}</select></label>
            </div>
            <div className={styles.formRow}>
              <label>Perfil<select name="profile">{profiles.map((profile) => <option key={profile}>{profile}</option>)}</select></label>
              <label>Urgencia<select name="urgency">{urgencies.map((urgency) => <option key={urgency}>{urgency}</option>)}</select></label>
            </div>
            <button className="button buttonPrimary" type="submit">Recibir recomendación de recurso</button>
          </form>

          <aside className={`cardSurface ${styles.resultPanel}`}>
            <h3>{recommendation ? "Resultado preliminar automático" : "Recomendación automática"}</h3>
            {recommendation ? (
              <>
                <p><strong>Norma:</strong> {recommendation.norm}</p>
                <p><strong>País:</strong> {recommendation.country}</p>
                <p><strong>Urgencia:</strong> {recommendation.urgency}</p>
              </>
            ) : <p>El sistema sugerirá recurso, ruta y siguiente acción.</p>}
          </aside>
        </div>
      </section>

      <section className={`section ${styles.librarySection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <h2>Biblioteca por intención de búsqueda.</h2>
            <p>Contenido útil, específico y compartible para captar tráfico orgánico.</p>
          </div>
          <div className={styles.grid}>
            {library.map((resource) => (
              <article key={resource.title} className={styles.card}>
                <span className={styles.badge}>{resource.tag}</span>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <Link className={styles.textLink} href={buildAttributedHref(resource.href, { canal: "biblioteca-recursos" })}>{resource.action}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.organicSection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <h2>Motor orgánico.</h2>
            <p>Cada recurso debe tener URL propia, PDF con QR, CTA a diagnóstico, opción de compartir e invitación al equipo.</p>
          </div>
          <div className={styles.organicGrid}>
            {organicBlocks.map((block) => (
              <article key={block.title} className={`cardSurface ${styles.organicCard}`}>
                <h3>{block.title}</h3>
                <p>{block.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.finalCta}`}>
        <div className={styles.finalCtaBg} />
        <div className="shell">
          <h2>El recurso correcto debe llevar al siguiente paso correcto.</h2>
          <p>Empieza con un checklist, continúa con diagnóstico y activa una ruta automática.</p>
        </div>
      </section>
    </main>
  );
}
