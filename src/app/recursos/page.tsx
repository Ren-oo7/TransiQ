import { resources } from "@/data/site-content";

export default function RecursosPage() {
  return (
    <main className="section">
      <div className="shell">
        <div className="section-heading section-heading--left">
          <p className="eyebrow">Activos de mercadotecnia</p>
          <h1>Recursos para atraer, nutrir y convertir demanda.</h1>
        </div>
        <div className="card-grid">
          {resources.map((resource) => (
            <article key={resource.title} className="panel">
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
