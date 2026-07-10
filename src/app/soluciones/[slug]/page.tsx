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
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug);

  return {
    title: solution ? `${solution.label} | TransiQ` : "Solución | TransiQ",
    description: solution?.summary,
  };
}

export default async function SolutionDetailPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug);

  if (!solution) {
    notFound();
  }

  // Helper to map solution slug to a representative image
  function getSolutionImage(slug: string) {
    if (slug.includes("9001")) return "/imagenes/iso-9001/iso-9001 (1).webp";
    if (slug.includes("14001")) return "/imagenes/iso-14001/iso-14001 (1).webp";
    if (slug.includes("45001")) return "/imagenes/iso-45001/iso-45001 (1).webp";
    if (slug.includes("37001")) return "/imagenes/iso-37001/iso-37001 (1).webp";
    return "/imagenes/Genericas/eqa (3).webp";
  }
  
  const bgImage = getSolutionImage(slug);

  return (
    <main>
      <section className={`section ${styles.detailHero}`}>
        <div className={styles.heroBg} style={{ backgroundImage: `url('${bgImage}')` }} />
        <div className={`shell ${styles.detailHeader}`}>
          <p className="eyebrow sectionEyebrow">{solution.label}</p>
          <h1>{solution.summary}</h1>
          <p className={styles.challengeText}><b>El reto:</b> {solution.challenge}</p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className={styles.detailGrid}>
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
          </div>

          <div style={{ marginTop: 28 }}>
            <article className={styles.detailPanel}>
              <h2>Valor que comunica esta página</h2>
              <ul className={styles.list}>
                {solution.value.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className={styles.btnRow}>
            <Link
              className="button buttonPrimary"
              href={buildAttributedHref("/diagnostico", { canal: `solucion-${solution.slug}`, norma: solution.slug })}
            >
              Realizar diagnóstico gratuito
            </Link>
            <Link
              className="button buttonSecondary"
              href={buildAttributedHref("/demo", { canal: `solucion-${solution.slug}`, norma: solution.slug })}
            >
              Solicitar demo de plataforma
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
