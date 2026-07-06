import {
  answerOptions,
  maturityLevels,
  standards,
  type DiagnosticQuestion,
} from "@/data/diagnostic-content";

export type OrgData = {
  company: string;
  country: string;
  sector: string;
  employees: string;
  sites: string;
  standard: string;
  urgency: string;
  interest: string;
  scope: string;
  contact: string;
};

type ScoredQuestion = DiagnosticQuestion & {
  index: number;
  raw?: string;
  score: number | null;
};

export type DiagnosticGap = {
  domain: string;
  gap: string;
  impact: string;
  priority: "Critica" | "Alta" | "Media";
  action: string;
  evidence: string;
};

export type DiagnosticPlanItem = {
  phase: string;
  activity: string;
  owner: string;
  deliverable: string;
  term: string;
};

export type DiagnosticState = {
  org: OrgData;
  standard: (typeof standards)[keyof typeof standards];
  score: number;
  level: (typeof maturityLevels)[number];
  gaps: DiagnosticGap[];
  plan: DiagnosticPlanItem[];
  lead: { score: number; type: string };
  domainScores: { domain: string; score: number }[];
  recommendation: string[];
  duration: string;
  answered: number;
  total: number;
};

const basePlan = [
  {
    phase: "1. Diagnostico inicial",
    activity: "Confirmar alcance, version normativa, partes interesadas, procesos, sedes y nivel de madurez.",
    owner: "Direccion / Responsable SG",
    deliverable: "Ficha de diagnostico y alcance validado",
  },
  {
    phase: "2. Analisis de brechas",
    activity: "Comparar requisitos aplicables, evidencia actual y cambios esperados por norma.",
    owner: "Especialista tecnico",
    deliverable: "Matriz de brechas priorizada",
  },
  {
    phase: "3. Planeacion de transicion",
    activity: "Definir ruta, responsables, recursos, plazos, riesgos y criterios de cierre.",
    owner: "Responsable SG / Alta Direccion",
    deliverable: "Plan de transicion aprobado",
  },
  {
    phase: "4. Actualizacion documental",
    activity: "Actualizar documentos, matrices, procedimientos, formatos, controles y registros criticos.",
    owner: "Duenos de proceso",
    deliverable: "Paquete documental actualizado",
  },
  {
    phase: "5. Capacitacion y comunicacion",
    activity: "Sensibilizar alta direccion, lideres de proceso, auditores internos y personal clave.",
    owner: "RH / Responsable SG",
    deliverable: "Plan y registros de capacitacion",
  },
  {
    phase: "6. Implementacion y evidencias",
    activity: "Ejecutar cambios, recolectar evidencia objetiva y cerrar brechas criticas.",
    owner: "Duenos de proceso",
    deliverable: "Expediente de evidencias",
  },
  {
    phase: "7. Auditoria interna",
    activity: "Auditar implementacion, eficacia, evidencias, cumplimiento y resultados por proceso.",
    owner: "Equipo auditor interno",
    deliverable: "Informe de auditoria interna",
  },
  {
    phase: "8. Revision por la direccion",
    activity: "Evaluar desempeno, recursos, riesgos, oportunidades, cambios y decisiones.",
    owner: "Alta Direccion",
    deliverable: "Acta de revision y plan de mejora",
  },
  {
    phase: "9. Cierre y readiness",
    activity: "Verificar cierre de acciones, eficacia y preparacion para auditoria externa o mantenimiento.",
    owner: "Responsable SG / Direccion",
    deliverable: "Reporte de readiness assessment",
  },
];

const serviceMap = {
  low: ["Diagnostico tecnico completo", "Taller ejecutivo de transicion", "Plan intensivo de 90 a 120 dias", "Auditoria interna previa"],
  medium: ["Matriz de brechas", "Capacitacion por norma", "Acompanamiento mensual", "Auditoria interna integrada"],
  high: ["Readiness assessment", "Validacion documental", "Revision por direccion asistida", "Preparacion de expediente de transicion"],
  ready: ["Validacion final de evidencias", "Auditoria interna de cierre", "Seguimiento preventivo", "Actualizacion anual del sistema"],
};

export function createInitialOrgData(): OrgData {
  return {
    company: "",
    country: "Mexico",
    sector: "",
    employees: "",
    sites: "",
    standard: "qms",
    urgency: "media",
    interest: "Diagnostico",
    scope: "",
    contact: "",
  };
}

export function createInitialAnswers(standardKey = "qms") {
  return Array.from({ length: standards[standardKey].questions.length }, () => "");
}

export function computeDiagnostic(org: OrgData, answers: string[]): DiagnosticState {
  const standard = standards[org.standard] ?? standards.qms;
  const scored = standard.questions.map((question, index) => {
    const raw = answers[index];
    const option = answerOptions.find((item) => item.value === raw);
    return { ...question, index, raw, score: option ? option.score : 0 };
  });
  const applicable = scored.filter((item) => item.score !== null);
  const weightedTotal = applicable.reduce((sum, item) => sum + Number(item.score) * item.weight, 0);
  const weightBase = applicable.reduce((sum, item) => sum + item.weight, 0) || 1;
  const score = Math.round(weightedTotal / weightBase);
  const level = maturityLevels.find((item) => score >= item.min && score <= item.max) ?? maturityLevels[0];
  const gaps = getGaps(scored, score, answers);
  const duration = estimateDuration(score, org.urgency);
  const plan = getPlan(score, gaps, duration);
  const lead = getLeadScore(org, score, gaps);
  const domainScores = getDomainScores(scored);
  const recommendation = getServices(score, org.interest);

  return {
    org,
    standard,
    score,
    level,
    gaps,
    plan,
    lead,
    domainScores,
    recommendation,
    duration,
    answered: answers.filter(Boolean).length,
    total: standard.questions.length,
  };
}

function getDomainScores(scored: ScoredQuestion[]) {
  const groups: Record<string, { total: number; weight: number }> = {};

  scored.forEach((item) => {
    if (item.score === null) return;
    if (!groups[item.domain]) groups[item.domain] = { total: 0, weight: 0 };
    const currentScore = item.score ?? 0;
    groups[item.domain].total += Number(currentScore) * item.weight;
    groups[item.domain].weight += item.weight;
  });

  return Object.entries(groups)
    .map(([domain, value]) => ({ domain, score: Math.round(value.total / value.weight) }))
    .sort((a, b) => a.score - b.score);
}

function getGaps(scored: ScoredQuestion[], globalScore: number, answers: string[]): DiagnosticGap[] {
  if (!answers.some(Boolean)) return [];

  return scored
    .filter((item) => item.score !== null && item.score < 75)
    .map((item) => {
      const currentScore = item.score ?? 0;
      const priority: DiagnosticGap["priority"] = currentScore <= 25 || (item.weight >= 1.3 && currentScore < 50) ? "Critica" : currentScore < 50 ? "Alta" : "Media";
      const impact = priority === "Critica"
        ? "Riesgo alto de no demostrar cumplimiento, eficacia o evidencia objetiva durante la transicion."
        : priority === "Alta"
          ? "Puede generar hallazgos relevantes si no se cierra antes de auditoria interna o revision."
          : "Debe fortalecerse para mejorar trazabilidad y preparacion ejecutiva.";

      return {
        domain: item.domain,
        gap: `Madurez insuficiente en: ${item.text}`,
        impact,
        priority,
        action: getAction(item.domain, globalScore),
        evidence: item.evidence,
      };
    })
    .sort((a, b) => priorityValue(a.priority) - priorityValue(b.priority))
    .slice(0, 8);
}

function priorityValue(priority: DiagnosticGap["priority"]) {
  return priority === "Critica" ? 1 : priority === "Alta" ? 2 : 3;
}

function getAction(domain: string, score: number) {
  if (score < 41) return `Ejecutar diagnostico profundo de ${domain.toLowerCase()}, definir responsable, evidencia minima y fecha de cierre inmediata.`;
  if (score < 61) return `Actualizar metodologia de ${domain.toLowerCase()}, documentar controles y programar verificacion en auditoria interna.`;
  if (score < 81) return `Validar evidencia de ${domain.toLowerCase()}, medir eficacia y cerrar acciones pendientes.`;
  return `Consolidar evidencia final de ${domain.toLowerCase()} y mantener monitoreo preventivo.`;
}

function getPlan(score: number, gaps: DiagnosticGap[], duration: string): DiagnosticPlanItem[] {
  const days = Number(duration.match(/\d+/)?.[0] || 120);
  const slice = Math.max(8, Math.min(basePlan.length, score < 41 ? 9 : score < 71 ? 8 : 7));

  return basePlan.slice(0, slice).map((item, index) => {
    const start = Math.round((days / slice) * index) + 1;
    const end = Math.round((days / slice) * (index + 1));
    const gap = gaps[index % Math.max(gaps.length, 1)];
    return {
      ...item,
      term: `Dia ${start} a ${end}`,
      activity: gap && index > 0 ? `${item.activity} Prioridad: ${gap.domain}.` : item.activity,
    };
  });
}

function estimateDuration(score: number, urgency: string) {
  let days = score < 41 ? 180 : score < 61 ? 120 : score < 81 ? 90 : 60;
  if (urgency === "critica") days = Math.min(days, 45);
  if (urgency === "alta") days = Math.min(days, 90);
  if (urgency === "baja") days = Math.max(days, 120);
  return `${days} dias estimados`;
}

function getLeadScore(org: OrgData, score: number, gaps: DiagnosticGap[]) {
  const employees = Number(org.employees || 0);
  const sites = Number(org.sites || 1);
  let leadScore = 20;
  leadScore += score < 45 ? 18 : score < 65 ? 12 : 6;
  leadScore += gaps.filter((item) => item.priority === "Critica").length * 4;
  leadScore += employees >= 250 ? 20 : employees >= 65 ? 14 : employees >= 15 ? 8 : 4;
  leadScore += sites >= 3 ? 12 : sites >= 2 ? 6 : 2;
  leadScore += org.urgency === "critica" ? 20 : org.urgency === "alta" ? 14 : org.urgency === "media" ? 8 : 3;
  leadScore += ["Certificacion", "Sistema integrado", "Seguimiento mensual"].includes(org.interest) ? 10 : 5;
  leadScore = Math.min(100, Math.round(leadScore));

  const type = leadScore >= 85 ? "Estrategico" : leadScore >= 70 ? "Urgente" : leadScore >= 55 ? "Calificado" : leadScore >= 40 ? "Interesado" : "Frio";
  return { score: leadScore, type };
}

function getServices(score: number, interest: string) {
  const bucket = score < 41 ? "low" : score < 70 ? "medium" : score < 91 ? "high" : "ready";
  const services = [...serviceMap[bucket]];
  if (interest && !services.includes(interest)) services.unshift(interest);
  return services.slice(0, 5);
}
