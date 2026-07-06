import Link from "next/link";
import { solutions } from "@/data/site-content";

export default function SolucionesPage() {
  return (
    <main className="section">
      <div className="shell">
        <div className="section-heading section-heading--left">
          <p className="eyebrow">Arquitectura comercial</p>
          <h1>Paginas por norma y solucion para captar mejor.</h1>
          <p className="lead-copy">
            En lugar de una sola landing, el sitio crece como ecosistema
            comercial: cada solucion responde a una audiencia, una necesidad y
            una ruta distinta de conversion.
          </p>
        </div>
        <div className="card-grid">
          {solutions.map((solution) => (
            <article key={solution.slug} className="panel solution-card solution-card--full">
              <p className="solution-card__tag">{solution.label}</p>
              <h2>{solution.summary}</h2>
              <p>{solution.audience}</p>
              <Link href={`/soluciones/${solution.slug}`}>Abrir pagina</Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
