import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { solutions } from "@/data/site-content";

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const solution = solutions.find((item) => item.slug === params.slug);

  return {
    title: solution ? `${solution.label} | TransiQ` : "Solucion | TransiQ",
    description: solution?.summary,
  };
}

export default function SolutionDetailPage({ params }: { params: { slug: string } }) {
  const solution = solutions.find((item) => item.slug === params.slug);

  if (!solution) {
    notFound();
  }

  return (
    <main className="section">
      <div className="shell narrow-layout">
        <p className="eyebrow">{solution.label}</p>
        <h1>{solution.summary}</h1>
        <p className="lead-copy">{solution.challenge}</p>

        <div className="detail-grid">
          <article className="panel">
            <h2>Audiencia prioritaria</h2>
            <p>{solution.audience}</p>
          </article>
          <article className="panel">
            <h2>Oferta desde el sitio</h2>
            <ul className="stack-list">
              {solution.offer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <article className="panel">
          <h2>Valor que debe comunicar esta pagina</h2>
          <ul className="stack-list">
            {solution.value.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <div className="button-row">
          <Link className="button button--primary" href="/diagnostico">
            Ir al diagnostico
          </Link>
          <Link className="button button--ghost" href="/demo">
            Hablar con comercial
          </Link>
        </div>
      </div>
    </main>
  );
}
