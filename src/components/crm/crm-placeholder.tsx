import type { AdminSession } from "@/lib/admin-auth-types";
import styles from "./crm-placeholder.module.css";

type CrmPlaceholderProps = {
  title: string;
  eyebrow: string;
  description: string;
  session: AdminSession;
  highlights: string[];
  cards: Array<{
    eyebrow: string;
    title: string;
    description: string;
  }>;
};

export function CrmPlaceholder({ title, eyebrow, description, session, highlights, cards }: CrmPlaceholderProps) {
  return (
    <main className={styles.wrapper}>
      <section className={`cardSurface ${styles.hero}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className={styles.chips}>
          <span className={styles.chip}>Responsable activo: {session.name}</span>
          <span className={styles.chip}>Rol: {session.role}</span>
          <span className={styles.chip}>Estado: Proximamente</span>
        </div>
        <div className={styles.chips}>
          {highlights.map((item) => (
            <span key={item} className={styles.chip}>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.grid}>
        {cards.map((card) => (
          <article key={card.title} className={`cardSurface ${styles.card}`}>
            <p className="eyebrow sectionEyebrow">{card.eyebrow}</p>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
