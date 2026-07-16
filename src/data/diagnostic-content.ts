export type DiagnosticQuestion = {
  domain: string;
  text: string;
  weight: number;
  evidence: string;
};

export type DiagnosticStandard = {
  label: string;
  short: string;
  focus: string;
  questions: DiagnosticQuestion[];
};

export type AnswerOption = {
  value: string;
  label: string;
  score: number | null;
};

export type MaturityLevel = {
  min: number;
  max: number;
  title: string;
  message: string;
  tone: "critical" | "high" | "medium" | "good" | "advanced" | "ready";
};

type StandardMap = Record<string, DiagnosticStandard>;

function q(domain: string, text: string, weight: number, evidence: string): DiagnosticQuestion {
  return { domain, text, weight, evidence };
}

export const answerOptions: AnswerOption[] = [
  { value: "0", label: "No implementado", score: 0 },
  { value: "25", label: "Parcial", score: 25 },
  { value: "50", label: "Implementado", score: 50 },
  { value: "75", label: "Implementado y documentado", score: 75 },
  { value: "100", label: "Medido y mejorado", score: 100 },
  { value: "na", label: "N/A", score: null },
];

export const maturityLevels: MaturityLevel[] = [
  { min: 0, max: 20, title: "Nivel inicial", message: "El sistema requiere estructura básica, priorización directiva y control documental mínimo antes de una transición.", tone: "critical" },
  { min: 21, max: 40, title: "Alto riesgo de transición", message: "Existen brechas relevantes. Conviene ejecutar diagnóstico profundo, capacitación y plan intensivo de cierre.", tone: "high" },
  { min: 41, max: 60, title: "En transición", message: "La organización cuenta con bases, pero requiere ordenar evidencias, responsabilidades y controles por requisito.", tone: "medium" },
  { min: 61, max: 80, title: "Parcialmente preparada", message: "El sistema tiene madurez aceptable. Debe enfocarse en brechas específicas, auditoría interna y revisión directiva.", tone: "good" },
  { min: 81, max: 90, title: "Avanzada", message: "La organización muestra preparación robusta. Recomendación: validar evidencias y ejecutar readiness assessment.", tone: "advanced" },
  { min: 91, max: 100, title: "Lista para transición", message: "El sistema muestra alta madurez. Conviene mantener monitoreo, auditoría final y evidencia trazable.", tone: "ready" },
];

export const standards: StandardMap = {
  qms: {
    label: "ISO 9001:2015 -> ISO 9001:2026",
    short: "ISO 9001",
    focus: "calidad, desempeño, cliente, procesos, riesgos y decisiones basadas en datos",
    questions: [
      q("Contexto y partes interesadas", "La organización actualiza su contexto, necesidades de clientes y partes interesadas con evidencia reciente?", 1.1, "Revisión de contexto, matriz de partes interesadas y análisis de cambios."),
      q("Liderazgo", "La alta dirección demuestra liderazgo visible sobre calidad, cultura, enfoque al cliente y desempeño del sistema?", 1.2, "Minutas, objetivos, comunicación directiva y evaluación de resultados."),
      q("Riesgos y oportunidades", "Los riesgos y oportunidades de calidad se gestionan por proceso, con acciones y seguimiento verificable?", 1.3, "Matriz de riesgos, criterios, acciones y evidencia de tratamiento."),
      q("Procesos", "Los procesos tienen entradas, salidas, responsables, indicadores, controles y criterios de desempeño definidos?", 1.1, "Mapa de procesos, fichas, KPIs y registros operativos."),
      q("Gestión del cambio", "Los cambios internos, tecnológicos, de proveedores o clientes se planifican y evalúan antes de implementarse?", 1.1, "Procedimiento o registro de cambios, evaluación de impacto y aprobaciones."),
      q("Conocimiento organizacional", "Existe gestión del conocimiento crítico para asegurar continuidad, competencia y aprendizaje organizacional?", 0.9, "Matriz de conocimiento, lecciones aprendidas, capacitación y respaldo documental."),
      q("Proveedores", "Los proveedores externos se evalúan con criterios de riesgo, desempeño y criticidad para la calidad?", 1, "Evaluación de proveedores, criterios de selección y seguimiento."),
      q("Indicadores", "Los indicadores se analizan para decisiones, acciones de mejora y revisión por la dirección?", 1.2, "Tablero de KPIs, análisis de tendencias y acciones derivadas."),
      q("Auditoría interna", "El programa de auditoría interna cubre procesos críticos, riesgos, desempeño y resultados de auditorías previas?", 1.2, "Programa, planes, listas, hallazgos y cierre de acciones."),
      q("Mejora", "Las no conformidades se analizan con causa raíz, acciones eficaces y verificación documentada?", 1.3, "Registros de no conformidad, causa raíz, acciones correctivas y eficacia."),
    ],
  },
  ems: {
    label: "ISO 14001:2015 -> ISO 14001:2026",
    short: "ISO 14001",
    focus: "ambiente, cambio climático, ciclo de vida, cumplimiento legal y desempeño medible",
    questions: [
      q("Contexto ambiental", "El contexto ambiental considera cambio climático, condiciones externas, partes interesadas y riesgos emergentes?", 1.3, "Análisis de contexto, riesgos climáticos, partes interesadas y criterios ambientales."),
      q("Aspectos e impactos", "Los aspectos e impactos ambientales están actualizados y consideran ciclo de vida, cambios y controles?", 1.4, "Matriz de aspectos, criterios de significancia, ciclo de vida y controles."),
      q("Cumplimiento legal", "La organización identifica, evalúa y evidencia cumplimiento de requisitos legales ambientales aplicables?", 1.4, "Matriz legal, evaluaciones de cumplimiento, permisos y evidencias."),
      q("Objetivos ambientales", "Los objetivos ambientales tienen indicadores, responsables, recursos, plazos y seguimiento?", 1.1, "Programa ambiental, KPIs, responsables y avance documentado."),
      q("Control operacional", "Los controles operacionales ambientales están definidos, comunicados, implementados y verificados?", 1.2, "Procedimientos, instrucciones, bitácoras, inspecciones y evidencia."),
      q("Emergencias", "La organización evalúa escenarios de emergencia ambiental y realiza pruebas o simulacros?", 1.1, "Planes de emergencia, simulacros, reportes y acciones de mejora."),
      q("Comunicación", "La comunicación ambiental interna y externa está controlada, autorizada y alineada a información verificable?", 0.9, "Plan de comunicación, registros y criterios de comunicación externa."),
      q("Desempeño ambiental", "Se mide el desempeño ambiental mediante indicadores de consumo, residuos, emisiones, agua, energía u otros?", 1.2, "Dashboard ambiental, reportes y análisis de tendencias."),
      q("Auditoría interna", "La auditoría interna ambiental evalúa cumplimiento legal, control operacional y desempeño real?", 1.3, "Programa de auditoría, evidencias, hallazgos y acciones."),
      q("Mejora ambiental", "Las desviaciones ambientales se corrigen con causa raíz, acciones y verificación de eficacia?", 1.2, "No conformidades, incidentes, acciones correctivas y eficacia."),
    ],
  },
  ohs: {
    label: "ISO 45001:2018 -> futura version ISO 45001",
    short: "ISO 45001",
    focus: "SST, participación de trabajadores, peligros, riesgos y cultura preventiva",
    questions: [
      q("Participación", "Existe consulta y participación efectiva de trabajadores en peligros, controles, incidentes y mejora?", 1.3, "Actas, comisiones, consultas, reportes y participación documentada."),
      q("Peligros y riesgos", "La identificación de peligros y evaluación de riesgos se actualiza por puesto, actividad, cambio y contratista?", 1.4, "IPER, matriz de riesgos, controles y registros por actividad."),
      q("Cumplimiento legal SST", "Se identifican, evalúan y evidencian requisitos legales de SST aplicables?", 1.3, "Matriz legal, evaluaciones, permisos, inspecciones y cumplimiento."),
      q("Controles operacionales", "Los controles operacionales de SST se implementan, verifican y documentan en campo?", 1.2, "Procedimientos, permisos, inspecciones, EPP y controles críticos."),
      q("Contratistas", "Los contratistas se evalúan y controlan con criterios de SST antes, durante y después de sus actividades?", 1.1, "Evaluación de contratistas, inducción, permisos y supervisión."),
      q("Emergencias", "La organización prueba escenarios de emergencia y evalúa su eficacia?", 1, "Plan de emergencias, simulacros, brigadas y mejoras."),
      q("Incidentes", "Los incidentes y casi accidentes se investigan con causa raíz y acciones eficaces?", 1.3, "Reportes, investigaciones, análisis causal y acciones correctivas."),
      q("Bienestar", "Se consideran factores psicosociales, bienestar laboral y condiciones de trabajo en la gestión de riesgos?", 0.9, "Evaluación psicosocial, programas de bienestar y seguimiento."),
      q("Indicadores SST", "Los indicadores de SST se analizan por tendencia, severidad, frecuencia y eficacia de controles?", 1.1, "Tablero SST, reportes, análisis y acciones."),
      q("Auditoría interna", "La auditoría interna SST evalúa implementación real, evidencia en campo y cumplimiento legal?", 1.2, "Programa, hallazgos, evidencias y cierre de acciones."),
    ],
  },
  abms: {
    label: "ISO 37001:2016 -> ISO 37001:2025",
    short: "ISO 37001",
    focus: "antisoborno, debida diligencia, controles y función de cumplimiento",
    questions: [
      q("Riesgos de soborno", "La organización identifica y actualiza riesgos de soborno por proceso, tercero, país, operación y transacción?", 1.4, "Matriz de riesgos de soborno, criterios, evaluación y tratamiento."),
      q("Debida diligencia", "La debida diligencia se aplica a socios de negocio, terceros, personal sensible y proyectos de alto riesgo?", 1.3, "Expedientes, evaluaciones, aprobaciones y monitoreo."),
      q("Función de cumplimiento", "La función de cumplimiento antisoborno tiene independencia, autoridad, competencia y acceso a alta dirección?", 1.2, "Designación, perfil, reportes, independencia y recursos."),
      q("Controles financieros", "Existen controles financieros para prevenir pagos indebidos, registros falsos o transacciones de riesgo?", 1.2, "Políticas, aprobaciones, conciliaciones y controles contables."),
      q("Controles no financieros", "Compras, comercial, permisos, regalos, donaciones y patrocinios tienen controles antisoborno?", 1.2, "Políticas, registros, autorizaciones y evidencia."),
      q("Canal de denuncias", "El canal de denuncias protege confidencialidad, no represalia, investigación y seguimiento?", 1.3, "Canal, protocolo, investigaciones, acciones y comunicación."),
      q("Cultura ética", "Se capacita y comunica el sistema antisoborno de forma diferenciada por riesgos y funciones?", 1, "Plan de capacitación, evaluación y registros."),
      q("Conflictos de interés", "Los conflictos de interés se declaran, evalúan, gestionan y documentan?", 1, "Declaraciones, análisis, medidas y seguimiento."),
      q("Investigación", "Las investigaciones de incumplimiento se ejecutan con independencia, evidencia y cierre formal?", 1.2, "Expedientes, reportes, decisiones y acciones."),
      q("Mejora", "La revisión por la dirección considera riesgos, denuncias, debida diligencia, controles y eficacia?", 1.1, "Informe de revisión, decisiones y acciones de mejora."),
    ],
  },
  isms: {
    label: "ISO/IEC 27001:2022 -> fortalecimiento SGSI",
    short: "ISO/IEC 27001",
    focus: "seguridad de la información, riesgos, controles, continuidad y protección de datos",
    questions: [
      q("Alcance SGSI", "El alcance del SGSI está definido con procesos, activos, ubicaciones, interfaces, terceros y exclusiones justificadas?", 1.2, "Declaración de alcance, límites, interfaces y justificación."),
      q("Riesgos de información", "La evaluación de riesgos considera confidencialidad, integridad, disponibilidad, amenazas y vulnerabilidades?", 1.4, "Metodología, matriz, tratamiento y aprobación de riesgos."),
      q("Declaración de aplicabilidad", "La SoA justifica controles aplicables o no aplicables y su estado de implementación?", 1.3, "SoA actualizada, justificaciones y evidencias de controles."),
      q("Controles tecnológicos", "Los controles técnicos clave se implementan y evidencian mediante registros verificables?", 1.2, "Logs, configuraciones, políticas, monitoreo y respaldos."),
      q("Incidentes", "Existe proceso de gestión de incidentes con clasificación, respuesta, comunicación y lecciones aprendidas?", 1.1, "Procedimiento, tickets, reportes y postmortem."),
      q("Continuidad", "La continuidad de seguridad de información y recuperación se prueba y mejora?", 1.1, "BCP, DRP, pruebas, RTO y RPO con acciones."),
      q("Proveedores TI", "Los proveedores tecnológicos se evalúan con criterios de riesgo, seguridad, privacidad y continuidad?", 1, "Evaluación, contratos, SLA, cláusulas y monitoreo."),
      q("Protección de datos", "La organización controla datos personales o sensibles conforme a requisitos legales aplicables?", 1.1, "Inventario, avisos, consentimientos, controles y atención de derechos."),
      q("Auditoría interna", "La auditoría interna evalúa controles, riesgos, SoA, evidencia técnica y eficacia del SGSI?", 1.3, "Programa, checklist, evidencias técnicas y hallazgos."),
      q("Métricas SGSI", "El SGSI cuenta con métricas de eficacia, incidentes, vulnerabilidades, capacitación y tratamiento de riesgos?", 1, "Dashboard de seguridad, KPIs y análisis de tendencia."),
    ],
  },
  integrated: {
    label: "Sistema Integrado ISO 9001 + 14001 + 45001",
    short: "SGI",
    focus: "integración de calidad, ambiente, SST, procesos, riesgos y evidencias",
    questions: [
      q("Contexto integrado", "El contexto integra riesgos de calidad, ambiente, SST, cumplimiento y partes interesadas en una sola visión?", 1.2, "Análisis integrado, mapa de partes interesadas y riesgos estratégicos."),
      q("Procesos integrados", "El mapa de procesos conecta requisitos de calidad, ambiente y SST con responsables y controles?", 1.2, "Mapa integrado, fichas y controles por proceso."),
      q("Matriz legal", "Los requisitos legales ambientales y de SST están identificados, evaluados y vinculados a controles?", 1.3, "Matriz legal integrada y evaluaciones de cumplimiento."),
      q("Riesgos y oportunidades", "La metodología de riesgos integra calidad, ambiente, SST, continuidad y cambio climático?", 1.3, "Matriz de riesgos integrada, criterios y plan de tratamiento."),
      q("Objetivos e indicadores", "Los objetivos de SGI están alineados a estrategia, procesos, desempeño y mejora?", 1.1, "Objetivos, indicadores, metas y planes integrados."),
      q("Control operacional", "Los controles operacionales cubren calidad, ambiente y SST sin duplicidad documental?", 1.1, "Procedimientos integrados, registros y evidencia."),
      q("Competencia", "La matriz de competencia integra funciones críticas para calidad, ambiente y SST?", 1, "Matriz, plan, evaluación y registros de capacitación."),
      q("Auditoría interna integrada", "El programa de auditoría cubre normas, procesos, riesgos, cumplimiento y desempeño?", 1.3, "Programa integrado, plan, checklist, hallazgos y cierre."),
      q("Revisión por dirección", "La revisión por la dirección integra desempeño, riesgos, recursos, cumplimiento y mejora del SGI?", 1.2, "Informe y acta de revisión con decisiones y acciones."),
      q("Mejora continua", "Las no conformidades, incidentes y desviaciones se gestionan con causa raíz y eficacia?", 1.2, "Registro integrado de acciones y verificación de eficacia."),
    ],
  },
};
