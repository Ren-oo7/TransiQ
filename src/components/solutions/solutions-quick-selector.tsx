"use client";

import { useMemo, useState } from "react";
import styles from "./solutions-quick-selector.module.css";

type SelectorItem = {
  key: string;
  title: string;
  label: string;
  result: string;
};

const items: SelectorItem[] = [
  {
    key: "transicion",
    title: "Transición normativa",
    label: "Estoy certificado y necesito transición",
    result: "Diagnóstico de madurez + matriz de brechas + plan de transición.",
  },
  {
    key: "auditoria",
    title: "Auditoría próxima",
    label: "Tengo auditoría próxima",
    result: "Readiness digital + evidencias críticas + checklist de auditoría.",
  },
  {
    key: "integrado",
    title: "Sistema integrado",
    label: "Necesito integrar varias normas",
    result: "Matriz multinorma + requisitos comunes + dashboard integrado.",
  },
];

export function SolutionsQuickSelector() {
  const [activeKey, setActiveKey] = useState(items[0].key);

  const activeItem = useMemo(
    () => items.find((item) => item.key === activeKey) ?? items[0],
    [activeKey],
  );

  return (
    <div className={`cardSurface ${styles.wrapper}`}>
      <h3>Selector rápido</h3>
      <div className={styles.options}>
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`${styles.option} ${item.key === activeKey ? styles.optionActive : ""}`}
            onClick={() => setActiveKey(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.result}>
        <strong>{activeItem.title}</strong>
        <p>{activeItem.result}</p>
      </div>
    </div>
  );
}
