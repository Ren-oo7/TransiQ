"use client";

import Link from "next/link";
import { useState } from "react";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "./demo.module.css";

const experiences = [
  { label: "Demo rápida de 3 minutos", title: "Demo de 3 minutos", result: "Simulación rápida de madurez, brechas y dashboard." },
  { label: "Dashboard ejecutivo", title: "Dashboard ejecutivo", result: "Indicadores, brechas, riesgos y acciones para Dirección." },
  { label: "Soy consultor", title: "Demo consultores", result: "Panel multicuentas, reportes y plantillas para clientes." },
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

const urgencies = ["Crítica: 0 a 30 días", "Alta: 1 a 3 meses", "Media: 3 a 6 meses", "Planeada: 6 a 12 meses"];
const statuses = ["Ya estamos certificados", "Estamos en implementación", "Tengo auditoría próxima", "Soy consultor ISO"];

const aiQuestions = [
  { title: "¿Qué brechas tengo?", text: "La IA explica brechas por norma, proceso y evidencia." },
  { title: "¿Qué documentos actualizo?", text: "Identifica información documentada afectada." },
  { title: "¿Qué hago en 90 días?", text: "Genera una ruta preliminar con prioridades." },
];

const comparisonRows = [
  ["Demo autónoma", "Conocer plataforma y simular ruta", "Baja"],
  ["Demo guiada por IA", "Recibir recomendaciones", "Baja"],
  ["Demo ejecutiva", "Presentar a Dirección", "Media"],
  ["Especialista", "Casos multinorma, multisitio o complejos", "Opcional"],
];

type DemoResult = { score: number; norm: string; country: string; route: string };

export default function DemoPage() {
  const [activeExperience, setActiveExperience] = useState(0);
  const [result, setResult] = useState<DemoResult | null>(null);

  function handleDemo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const employees = Number(form.get("employees") || 120);
    const sites = Number(form.get("sites") || 2);
    const urgency = String(form.get("urgency") || urgencies[0]);
    const score = Math.max(38, Math.min(88, 72 - Math.min(sites * 2, 12) - (employees > 500 ? 6 : 0) - (urgency.startsWith("Crítica") ? 8 : 0)));
    setResult({
      score,
      norm: String(form.get("norm") || norms[0]),
      country: String(form.get("country") || countries[0]),
      route: score < 55 ? "Diagnóstico y plan prioritario" : "Validación de brechas y evidencias",
    });
  }

  return (
    <main>
      <section className={`section ${styles.hero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (3).webp')" }} />
        <div className={`shell ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow sectionEyebrow">Experience Lab</p>
            <h1>Experimenta TransiQ antes de hablar con un ejecutivo.</h1>
            <p>Prueba cómo la plataforma analiza tu contexto, identifica brechas, recomienda evidencias y activa una ruta ISO con IA. La sesión humana queda como opción estratégica.</p>
            <div className={styles.heroActions}>
              <a className="button buttonPrimary" href="#demo">Probar demo interactiva</a>
              <Link className="button buttonSecondary" href={buildAttributedHref("/diagnostico", { canal: "demo-hero" })}>Diagnóstico gratuito</Link>
            </div>
          </div>

          <aside className={`cardSurface ${styles.experienceCard}`}>
            <h3>Elige experiencia</h3>
            <div className={styles.experienceOptions}>
              {experiences.map((experience, index) => (
                <button key={experience.label} type="button" className={index === activeExperience ? styles.activeExperience : ""} onClick={() => setActiveExperience(index)}>
                  {experience.label}
                </button>
              ))}
            </div>
            <div className={styles.experienceResult}>
              <strong>{experiences[activeExperience].title}</strong>
              <p>{experiences[activeExperience].result}</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="demo" className={`section ${styles.demoSection}`}>
        <div className={`shell ${styles.formGrid}`}>
          <form className={`cardSurface ${styles.demoForm}`} onSubmit={handleDemo}>
            <p className="eyebrow sectionEyebrow">Personalizar demo</p>
            <h2>Genera una simulación.</h2>
            <div className={styles.formRow}>
              <label>País<select name="country">{countries.map((country) => <option key={country}>{country}</option>)}</select></label>
              <label>Norma<select name="norm">{norms.map((norm) => <option key={norm}>{norm}</option>)}</select></label>
            </div>
            <div className={styles.formRow}>
              <label>Empleados<input name="employees" type="number" defaultValue="120" /></label>
              <label>Sitios<input name="sites" type="number" defaultValue="2" /></label>
            </div>
            <div className={styles.formRow}>
              <label>Urgencia<select name="urgency">{urgencies.map((urgency) => <option key={urgency}>{urgency}</option>)}</select></label>
              <label>Situación<select name="status">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            </div>
            <button className="button buttonPrimary" type="submit">Generar demo automática</button>
          </form>

          <aside className={`cardSurface ${styles.resultPanel}`}>
            <h3>Dashboard simulado</h3>
            {result ? (
              <div className={styles.generatedResult}>
                <div className={styles.score}><strong>{result.score}%</strong></div>
                <p><strong>Norma:</strong> {result.norm}</p>
                <p><strong>País:</strong> {result.country}</p>
                <p><strong>Ruta recomendada:</strong> {result.route}</p>
              </div>
            ) : <p>La demo mostrará score, brechas, evidencias y ruta.</p>}
          </aside>
        </div>
      </section>

      <section className={`section ${styles.aiSection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <h2>Copiloto IA visible.</h2>
            <p>La demo muestra preguntas que el usuario puede hacer al sistema.</p>
          </div>
          <div className={styles.aiGrid}>
            {aiQuestions.map((item) => <article key={item.title} className={`cardSurface ${styles.aiCard}`}><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className={`section ${styles.comparisonSection}`}>
        <div className="shell">
          <div className="sectionHeading"><h2>Demo autónoma vs sesión ejecutiva.</h2></div>
          <div className={`cardSurface ${styles.tableCard}`}>
            <table className={styles.table}>
              <thead><tr><th>Modalidad</th><th>Uso recomendado</th><th>Dependencia humana</th></tr></thead>
              <tbody>{comparisonRows.map(([mode, use, dependency]) => <tr key={mode}><td>{mode}</td><td>{use}</td><td>{dependency}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={`section ${styles.finalCta}`}>
        <div className={styles.finalCtaBg} />
        <div className="shell">
          <h2>Primero prueba. Después decide.</h2>
          <p>TransiQ está diseñado para que el usuario obtenga valor antes de agendar una sesión.</p>
        </div>
      </section>
    </main>
  );
}
