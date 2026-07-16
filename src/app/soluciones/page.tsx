import Link from "next/link";
import { SolutionsQuickSelector } from "@/components/solutions/solutions-quick-selector";
import styles from "./soluciones.module.css";

export default function SolucionesPage() {
  const solutionNeeds = [
    {
      title: "Transición ISO 2026",
      description: "Para empresas certificadas que deben entender cambios, priorizar brechas y preparar evidencia.",
      href: "/diagnostico?canal=soluciones-necesidad-transicion",
      cta: "Diagnosticar transición",
    },
    {
      title: "Implementación desde cero",
      description: "Para organizaciones que necesitan estructurar contexto, procesos, riesgos, documentos y evidencias.",
      href: "/plataforma",
      cta: "Ver módulos",
    },
    {
      title: "Auditoría próxima",
      description: "Para equipos que necesitan saber qué evidencia falta antes de auditoría interna, externa o de seguimiento.",
      href: "/recursos",
      cta: "Obtener checklist",
    },
    {
      title: "Sistema integrado",
      description: "Para ISO 9001, 14001 y 45001 en una sola ruta de requisitos comunes, evidencias y responsables.",
      href: "/diagnostico?canal=soluciones-necesidad-sgi",
      cta: "Evaluar SGI",
    },
    {
      title: "Gestión documental",
      description: "Para ordenar documentos, versiones, aprobaciones, responsables, vigencia y registros críticos.",
      href: "/plataforma",
      cta: "Ver gestión documental",
    },
    {
      title: "Consultores ISO",
      description: "Para gestionar múltiples clientes con diagnósticos, reportes, plantillas y seguimiento estandarizado.",
      href: "/demo?canal=soluciones-necesidad-consultores",
      cta: "Ver demo consultores",
    },
  ];

  const sectors = [
    "Manufactura",
    "Construcción",
    "Logística",
    "Alimentos",
    "Tecnología",
    "Salud",
    "Gobierno",
    "Energía",
    "Minería",
    "Servicios",
  ];

  const normRoutes = [
    { slug: "iso-9001", tag: "Calidad", title: "ISO 9001:2026", description: "Procesos, cliente, riesgos, proveedores, indicadores, gestión del cambio y mejora.", cta: "Ver ruta 9001" },
    { slug: "iso-14001", tag: "Ambiente", title: "ISO 14001:2026", description: "Aspectos, cumplimiento, ciclo de vida, desempeño, comunicación y emergencias.", cta: "Ver ruta 14001" },
    { slug: "iso-45001", tag: "SST", title: "ISO 45001", description: "Peligros, riesgos SST, participación, contratistas, incidentes y controles.", cta: "Ver ruta 45001" },
    { slug: "iso-37001", tag: "Cumplimiento", title: "ISO 37001:2025", description: "Riesgos de soborno, debida diligencia, controles, terceros y denuncias.", cta: "Ver ruta 37001" },
    { slug: "iso-27001", tag: "Seguridad", title: "ISO/IEC 27001", description: "SGSI, riesgos, controles, SoA, incidentes, nube y proveedores.", cta: "Ver ruta 27001" },
  ];

  // Helper to map solution slug to a representative cover image
  function getCardImage(slug: string) {
    if (slug.includes("9001")) return "/imagenes/iso-9001/iso-9001 (2).webp";
    if (slug.includes("14001")) return "/imagenes/iso-14001/iso-14001 (2).webp";
    if (slug.includes("45001")) return "/imagenes/iso-45001/iso-45001 (2).webp";
    if (slug.includes("37001")) return "/imagenes/iso-37001/iso-37001 (2).webp";
    if (slug.includes("27001")) return "/imagenes/iso-27001/iso-27001 (2).webp";
    return "/imagenes/Genericas/eqa (5).webp";
  }

  return (
    <main>
      <section className={`section ${styles.hero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: "url('/imagenes/Genericas/eqa (3).webp')" }} />
        <div className={`shell ${styles.heroCopy}`}>
          <p className="eyebrow sectionEyebrow">Solutions Hub</p>
          <h1>Cada organización tiene una brecha distinta. TransiQ encuentra la ruta correcta.</h1>
          <p>
            Entra por norma, problema, sector o etapa de madurez. La plataforma
            dirige al diagnóstico, recurso, demo o plan más adecuado.
          </p>
          <div className={styles.heroActions}>
            <Link className="button buttonPrimary" href="/diagnostico?canal=soluciones-hero">
              Encontrar mi ruta ISO
            </Link>
            <Link className="button buttonSecondary" href="#necesidades">
              Elegir problema
            </Link>
          </div>
        </div>
      </section>

      <section className={`section sectionCompact ${styles.selectorSection}`}>
        <div className="shell">
          <SolutionsQuickSelector />
        </div>
      </section>

      <section id="necesidades" className={`section ${styles.needSection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <p className="eyebrow sectionEyebrow">Soluciones por necesidad</p>
            <h2>El usuario no siempre busca una norma; busca resolver un problema.</h2>
          </div>

          <div className={styles.needGrid}>
            {solutionNeeds.map((need) => (
              <article key={need.title} className={`cardSurface ${styles.needCard}`}>
                <h3>{need.title}</h3>
                <p>{need.description}</p>
                <Link className={styles.textLink} href={need.href}>
                  {need.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.routesSection}`}>
        <div className="shell">
          <div className="sectionHeading">
            <p className="eyebrow sectionEyebrow">Normas principales</p>
            <h2>Rutas de solución por norma.</h2>
          </div>

          <div className={styles.grid}>
            {normRoutes.map((route) => (
              <article key={route.slug} className={styles.card}>
                <div 
                  className={styles.cardCover} 
                  style={{ backgroundImage: `url('${getCardImage(route.slug)}')` }}
                />
                <div className={styles.cardContent}>
                  <span className={styles.cardTag}>{route.tag}</span>
                  <h2>{route.title}</h2>
                  <p>{route.description}</p>
                  <Link className={styles.cardLink} href={`/soluciones/${route.slug}`}>
                    {route.cta} &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.sectorBand}`}>
        <div className="shell">
          <div className="sectionHeading">
            <h2>Sectores prioritarios.</h2>
            <p>Contenido preparado para búsquedas por industria y campañas orgánicas.</p>
          </div>

          <div className={styles.sectorRow}>
            {sectors.map((sector) => (
              <span key={sector}>{sector}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.finalCta}`}>
        <div className={styles.finalCtaBg} />
        <div className="shell">
          <div className="sectionHeading">
            <h2>No busques una página más. Encuentra tu ruta ISO.</h2>
            <p>TransiQ te dirige al diagnóstico, recurso o demo que corresponde a tu necesidad.</p>
            <Link className="button buttonPrimary" href="/diagnostico?canal=soluciones-final">Encontrar mi ruta</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
