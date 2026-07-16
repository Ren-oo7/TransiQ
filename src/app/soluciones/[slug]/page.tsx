import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { solutions } from "@/data/site-content";
import { buildAttributedHref } from "@/lib/lead-attribution";
import styles from "../soluciones.module.css";

type SolutionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return solutions
    .filter((solution) => solution.slug !== "sistema-integrado")
    .map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug && item.slug !== "sistema-integrado");

  return {
    title: solution ? `${solution.label} | TransiQ` : "Solución | TransiQ",
    description: solution?.summary,
  };
}

export default async function SolutionDetailPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug && item.slug !== "sistema-integrado");

  if (!solution) {
    notFound();
  }

  // Helper to map solution slug to a representative image
  function getSolutionImage(slug: string) {
    if (slug.includes("9001")) return "/imagenes/iso-9001/iso-9001 (1).webp";
    if (slug.includes("14001")) return "/imagenes/iso-14001/iso-14001 (1).webp";
    if (slug.includes("45001")) return "/imagenes/iso-45001/iso-45001 (1).webp";
    if (slug.includes("37001")) return "/imagenes/iso-37001/iso-37001 (1).webp";
    if (slug.includes("27001")) return "/imagenes/iso-27001/iso-27001 (1).webp";
    return "/imagenes/Genericas/eqa (3).webp";
  }
  
  const bgImage = getSolutionImage(slug);
  const routeSteps = [
    ["Diagnóstico", "Madurez y contexto."],
    ["Brechas", "Prioridad e impacto."],
    ["Evidencias", "Documentos y registros."],
    ["Plan", "90 días y responsables."],
    ["Seguimiento", "Dashboard y mejora."],
  ];

  return (
    <main>
      <section className={`section ${styles.detailHero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: `url('${bgImage}')` }} />
        <div className={`shell ${styles.detailHeroGrid}`}>
          <div className={styles.detailHeader}>
            <p className="eyebrow sectionEyebrow">Ruta por norma</p>
            <h1>{solution.summary}</h1>
            <p className={styles.challengeText}>{solution.intro ?? solution.challenge}</p>
            <div className={styles.detailHeroActions}>
              <Link className="button buttonPrimary" href={buildAttributedHref("/diagnostico", { canal: `solucion-${solution.slug}`, norma: solution.slug })}>
                Diagnosticar {solution.label}
              </Link>
              <Link className="button buttonSecondary" href={buildAttributedHref("/recursos", { canal: `solucion-${solution.slug}`, norma: solution.slug })}>
                Ver recursos
              </Link>
            </div>
          </div>

          <aside className={`cardSurface ${styles.evaluationSummary}`}>
            <h3>{solution.evaluates ? "Qué evalúa TransiQ" : "Oferta de valor comercial"}</h3>
            <ul>
              {(solution.evaluates?.slice(0, 5) ?? solution.offer).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className={`section ${styles.gapsSection}`}>
        <div className="shell">
          {solution.evaluates ? (
            <>
              <div className="sectionHeading">
                <h2>Brechas, evidencias y ruta de acción.</h2>
                <p>Esta página está diseñada para intención orgánica específica y conecta con diagnóstico, recursos y demo.</p>
              </div>
              <div className={styles.detailGrid}>
                {solution.evaluates.map((item) => (
                  <article className={styles.detailPanel} key={item}>
                    <h2>{item}</h2>
                    <p>TransiQ evalúa madurez, evidencia disponible, criticidad y acción recomendada.</p>
                  </article>
                ))}
              </div>
            </>
          ) : <div className={styles.detailGrid}>
            <article className={styles.detailPanel}>
              <h2>Audiencia prioritaria</h2>
              <p>{solution.audience}</p>
            </article>
            
            <article className={styles.detailPanel}>
              <h2>Oferta de valor comercial</h2>
              <ul className={styles.list}>
                {solution.offer.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>}

        </div>
      </section>

      <section className={`section ${styles.recommendedRoute}`}>
        <div className="shell">
          <div className="sectionHeading"><h2>Ruta recomendada.</h2></div>
          <div className={styles.routeGrid}>
            {routeSteps.map(([title, text]) => (
              <article className={styles.routeCard} key={title}>
                <span>{String(routeSteps.findIndex((step) => step[0] === title) + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.detailFinalCta}`}>
        <div className={styles.detailFinalCtaBg} style={{ backgroundImage: `url('${bgImage}')` }} />
        <div className="shell">
          <h2>Evalúa {solution.label} con una ruta automática.</h2>
          <Link className="button buttonPrimary" href={buildAttributedHref("/diagnostico", { canal: `solucion-${solution.slug}`, norma: solution.slug })}>
            Iniciar diagnóstico
          </Link>
        </div>
      </section>
    </main>
  );
}
