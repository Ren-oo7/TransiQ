import { featureStats } from "@/data/site-content";
import styles from "./feature-stats-section.module.css";

export function FeatureStatsSection() {
  return (
    <section className="section sectionCompact">
      <div className={`shell ${styles.statsGrid}`}>
        {featureStats.map((item, index) => (
          <article key={item} className={`cardSurface ${styles.statCard}`}>
            <strong>{index + 1}</strong>
            <span>{item}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
