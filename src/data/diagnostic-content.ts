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
  { value: "75", label: "Documentado", score: 75 },
  { value: "100", label: "Medido y mejorado", score: 100 },
  { value: "na", label: "N/A", score: null },
];

export const maturityLevels: MaturityLevel[] = [
  { min: 0, max: 20, title: "Nivel inicial", message: "El sistema requiere estructura basica, priorizacion directiva y control documental minimo antes de una transicion.", tone: "critical" },
  { min: 21, max: 40, title: "Alto riesgo de transicion", message: "Existen brechas relevantes. Conviene ejecutar diagnostico profundo, capacitacion y plan intensivo de cierre.", tone: "high" },
  { min: 41, max: 60, title: "En transicion", message: "La organizacion cuenta con bases, pero requiere ordenar evidencias, responsabilidades y controles por requisito.", tone: "medium" },
  { min: 61, max: 80, title: "Parcialmente preparada", message: "El sistema tiene madurez aceptable. Debe enfocarse en brechas especificas, auditoria interna y revision directiva.", tone: "good" },
  { min: 81, max: 90, title: "Avanzada", message: "La organizacion muestra preparacion robusta. Recomendacion: validar evidencias y ejecutar readiness assessment.", tone: "advanced" },
  { min: 91, max: 100, title: "Lista para transicion", message: "El sistema muestra alta madurez. Conviene mantener monitoreo, auditoria final y evidencia trazable.", tone: "ready" },
];

export const standards: StandardMap = {
  qms: {
    label: "ISO 9001:2015 -> ISO 9001:2026",
    short: "ISO 9001",
    focus: "calidad, desempeno, cliente, procesos, riesgos y decisiones basadas en datos",
    questions: [
      q("Contexto y partes interesadas", "La organizacion actualiza su contexto, necesidades de clientes y partes interesadas con evidencia reciente?", 1.1, "Revision de contexto, matriz de partes interesadas y analisis de cambios."),
      q("Liderazgo", "La alta direccion demuestra liderazgo visible sobre calidad, cultura, enfoque al cliente y desempeno del sistema?", 1.2, "Minutas, objetivos, comunicacion directiva y evaluacion de resultados."),
      q("Riesgos y oportunidades", "Los riesgos y oportunidades de calidad se gestionan por proceso, con acciones y seguimiento verificable?", 1.3, "Matriz de riesgos, criterios, acciones y evidencia de tratamiento."),
      q("Procesos", "Los procesos tienen entradas, salidas, responsables, indicadores, controles y criterios de desempeno definidos?", 1.1, "Mapa de procesos, fichas, KPIs y registros operativos."),
      q("Gestion del cambio", "Los cambios internos, tecnologicos, de proveedores o clientes se planifican y evaluan antes de implementarse?", 1.1, "Procedimiento o registro de cambios, evaluacion de impacto y aprobaciones."),
      q("Conocimiento organizacional", "Existe gestion del conocimiento critico para asegurar continuidad, competencia y aprendizaje organizacional?", 0.9, "Matriz de conocimiento, lecciones aprendidas, capacitacion y respaldo documental."),
      q("Proveedores", "Los proveedores externos se evaluan con criterios de riesgo, desempeno y criticidad para la calidad?", 1, "Evaluacion de proveedores, criterios de seleccion y seguimiento."),
      q("Indicadores", "Los indicadores se analizan para decisiones, acciones de mejora y revision por la direccion?", 1.2, "Tablero de KPIs, analisis de tendencias y acciones derivadas."),
      q("Auditoria interna", "El programa de auditoria interna cubre procesos criticos, riesgos, desempeno y resultados de auditorias previas?", 1.2, "Programa, planes, listas, hallazgos y cierre de acciones."),
      q("Mejora", "Las no conformidades se analizan con causa raiz, acciones eficaces y verificacion documentada?", 1.3, "Registros de no conformidad, causa raiz, acciones correctivas y eficacia."),
    ],
  },
  ems: {
    label: "ISO 14001:2015 -> ISO 14001:2026",
    short: "ISO 14001",
    focus: "ambiente, cambio climatico, ciclo de vida, cumplimiento legal y desempeno medible",
    questions: [
      q("Contexto ambiental", "El contexto ambiental considera cambio climatico, condiciones externas, partes interesadas y riesgos emergentes?", 1.3, "Analisis de contexto, riesgos climaticos, partes interesadas y criterios ambientales."),
      q("Aspectos e impactos", "Los aspectos e impactos ambientales estan actualizados y consideran ciclo de vida, cambios y controles?", 1.4, "Matriz de aspectos, criterios de significancia, ciclo de vida y controles."),
      q("Cumplimiento legal", "La organizacion identifica, evalua y evidencia cumplimiento de requisitos legales ambientales aplicables?", 1.4, "Matriz legal, evaluaciones de cumplimiento, permisos y evidencias."),
      q("Objetivos ambientales", "Los objetivos ambientales tienen indicadores, responsables, recursos, plazos y seguimiento?", 1.1, "Programa ambiental, KPIs, responsables y avance documentado."),
      q("Control operacional", "Los controles operacionales ambientales estan definidos, comunicados, implementados y verificados?", 1.2, "Procedimientos, instrucciones, bitacoras, inspecciones y evidencia."),
      q("Emergencias", "La organizacion evalua escenarios de emergencia ambiental y realiza pruebas o simulacros?", 1.1, "Planes de emergencia, simulacros, reportes y acciones de mejora."),
      q("Comunicacion", "La comunicacion ambiental interna y externa esta controlada, autorizada y alineada a informacion verificable?", 0.9, "Plan de comunicacion, registros y criterios de comunicacion externa."),
      q("Desempeno ambiental", "Se mide el desempeno ambiental mediante indicadores de consumo, residuos, emisiones, agua, energia u otros?", 1.2, "Dashboard ambiental, reportes y analisis de tendencias."),
      q("Auditoria interna", "La auditoria interna ambiental evalua cumplimiento legal, control operacional y desempeno real?", 1.3, "Programa de auditoria, evidencias, hallazgos y acciones."),
      q("Mejora ambiental", "Las desviaciones ambientales se corrigen con causa raiz, acciones y verificacion de eficacia?", 1.2, "No conformidades, incidentes, acciones correctivas y eficacia."),
    ],
  },
  ohs: {
    label: "ISO 45001:2018 -> futura version ISO 45001",
    short: "ISO 45001",
    focus: "SST, participacion de trabajadores, peligros, riesgos y cultura preventiva",
    questions: [
      q("Participacion", "Existe consulta y participacion efectiva de trabajadores en peligros, controles, incidentes y mejora?", 1.3, "Actas, comisiones, consultas, reportes y participacion documentada."),
      q("Peligros y riesgos", "La identificacion de peligros y evaluacion de riesgos se actualiza por puesto, actividad, cambio y contratista?", 1.4, "IPER, matriz de riesgos, controles y registros por actividad."),
      q("Cumplimiento legal SST", "Se identifican, evaluan y evidencian requisitos legales de SST aplicables?", 1.3, "Matriz legal, evaluaciones, permisos, inspecciones y cumplimiento."),
      q("Controles operacionales", "Los controles operacionales de SST se implementan, verifican y documentan en campo?", 1.2, "Procedimientos, permisos, inspecciones, EPP y controles criticos."),
      q("Contratistas", "Los contratistas se evaluan y controlan con criterios de SST antes, durante y despues de sus actividades?", 1.1, "Evaluacion de contratistas, induccion, permisos y supervision."),
      q("Emergencias", "La organizacion prueba escenarios de emergencia y evalua su eficacia?", 1, "Plan de emergencias, simulacros, brigadas y mejoras."),
      q("Incidentes", "Los incidentes y casi accidentes se investigan con causa raiz y acciones eficaces?", 1.3, "Reportes, investigaciones, analisis causal y acciones correctivas."),
      q("Bienestar", "Se consideran factores psicosociales, bienestar laboral y condiciones de trabajo en la gestion de riesgos?", 0.9, "Evaluacion psicosocial, programas de bienestar y seguimiento."),
      q("Indicadores SST", "Los indicadores de SST se analizan por tendencia, severidad, frecuencia y eficacia de controles?", 1.1, "Tablero SST, reportes, analisis y acciones."),
      q("Auditoria interna", "La auditoria interna SST evalua implementacion real, evidencia en campo y cumplimiento legal?", 1.2, "Programa, hallazgos, evidencias y cierre de acciones."),
    ],
  },
  abms: {
    label: "ISO 37001:2016 -> ISO 37001:2025",
    short: "ISO 37001",
    focus: "antisoborno, debida diligencia, controles y funcion de cumplimiento",
    questions: [
      q("Riesgos de soborno", "La organizacion identifica y actualiza riesgos de soborno por proceso, tercero, pais, operacion y transaccion?", 1.4, "Matriz de riesgos de soborno, criterios, evaluacion y tratamiento."),
      q("Debida diligencia", "La debida diligencia se aplica a socios de negocio, terceros, personal sensible y proyectos de alto riesgo?", 1.3, "Expedientes, evaluaciones, aprobaciones y monitoreo."),
      q("Funcion de cumplimiento", "La funcion de cumplimiento antisoborno tiene independencia, autoridad, competencia y acceso a alta direccion?", 1.2, "Designacion, perfil, reportes, independencia y recursos."),
      q("Controles financieros", "Existen controles financieros para prevenir pagos indebidos, registros falsos o transacciones de riesgo?", 1.2, "Politicas, aprobaciones, conciliaciones y controles contables."),
      q("Controles no financieros", "Compras, comercial, permisos, regalos, donaciones y patrocinios tienen controles antisoborno?", 1.2, "Politicas, registros, autorizaciones y evidencia."),
      q("Canal de denuncias", "El canal de denuncias protege confidencialidad, no represalia, investigacion y seguimiento?", 1.3, "Canal, protocolo, investigaciones, acciones y comunicacion."),
      q("Cultura etica", "Se capacita y comunica el sistema antisoborno de forma diferenciada por riesgos y funciones?", 1, "Plan de capacitacion, evaluacion y registros."),
      q("Conflictos de interes", "Los conflictos de interes se declaran, evaluan, gestionan y documentan?", 1, "Declaraciones, analisis, medidas y seguimiento."),
      q("Investigacion", "Las investigaciones de incumplimiento se ejecutan con independencia, evidencia y cierre formal?", 1.2, "Expedientes, reportes, decisiones y acciones."),
      q("Mejora", "La revision por la direccion considera riesgos, denuncias, debida diligencia, controles y eficacia?", 1.1, "Informe de revision, decisiones y acciones de mejora."),
    ],
  },
  isms: {
    label: "ISO/IEC 27001:2022 -> fortalecimiento SGSI",
    short: "ISO/IEC 27001",
    focus: "seguridad de la informacion, riesgos, controles, continuidad y proteccion de datos",
    questions: [
      q("Alcance SGSI", "El alcance del SGSI esta definido con procesos, activos, ubicaciones, interfaces, terceros y exclusiones justificadas?", 1.2, "Declaracion de alcance, limites, interfaces y justificacion."),
      q("Riesgos de informacion", "La evaluacion de riesgos considera confidencialidad, integridad, disponibilidad, amenazas y vulnerabilidades?", 1.4, "Metodologia, matriz, tratamiento y aprobacion de riesgos."),
      q("Declaracion de aplicabilidad", "La SoA justifica controles aplicables o no aplicables y su estado de implementacion?", 1.3, "SoA actualizada, justificaciones y evidencias de controles."),
      q("Controles tecnologicos", "Los controles tecnicos clave se implementan y evidencian mediante registros verificables?", 1.2, "Logs, configuraciones, politicas, monitoreo y respaldos."),
      q("Incidentes", "Existe proceso de gestion de incidentes con clasificacion, respuesta, comunicacion y lecciones aprendidas?", 1.1, "Procedimiento, tickets, reportes y postmortem."),
      q("Continuidad", "La continuidad de seguridad de informacion y recuperacion se prueba y mejora?", 1.1, "BCP, DRP, pruebas, RTO y RPO con acciones."),
      q("Proveedores TI", "Los proveedores tecnologicos se evaluan con criterios de riesgo, seguridad, privacidad y continuidad?", 1, "Evaluacion, contratos, SLA, clausulas y monitoreo."),
      q("Proteccion de datos", "La organizacion controla datos personales o sensibles conforme a requisitos legales aplicables?", 1.1, "Inventario, avisos, consentimientos, controles y atencion de derechos."),
      q("Auditoria interna", "La auditoria interna evalua controles, riesgos, SoA, evidencia tecnica y eficacia del SGSI?", 1.3, "Programa, checklist, evidencias tecnicas y hallazgos."),
      q("Metricas SGSI", "El SGSI cuenta con metricas de eficacia, incidentes, vulnerabilidades, capacitacion y tratamiento de riesgos?", 1, "Dashboard de seguridad, KPIs y analisis de tendencia."),
    ],
  },
  integrated: {
    label: "Sistema Integrado ISO 9001 + 14001 + 45001",
    short: "SGI",
    focus: "integracion de calidad, ambiente, SST, procesos, riesgos y evidencias",
    questions: [
      q("Contexto integrado", "El contexto integra riesgos de calidad, ambiente, SST, cumplimiento y partes interesadas en una sola vision?", 1.2, "Analisis integrado, mapa de partes interesadas y riesgos estrategicos."),
      q("Procesos integrados", "El mapa de procesos conecta requisitos de calidad, ambiente y SST con responsables y controles?", 1.2, "Mapa integrado, fichas y controles por proceso."),
      q("Matriz legal", "Los requisitos legales ambientales y de SST estan identificados, evaluados y vinculados a controles?", 1.3, "Matriz legal integrada y evaluaciones de cumplimiento."),
      q("Riesgos y oportunidades", "La metodologia de riesgos integra calidad, ambiente, SST, continuidad y cambio climatico?", 1.3, "Matriz de riesgos integrada, criterios y plan de tratamiento."),
      q("Objetivos e indicadores", "Los objetivos de SGI estan alineados a estrategia, procesos, desempeno y mejora?", 1.1, "Objetivos, indicadores, metas y planes integrados."),
      q("Control operacional", "Los controles operacionales cubren calidad, ambiente y SST sin duplicidad documental?", 1.1, "Procedimientos integrados, registros y evidencia."),
      q("Competencia", "La matriz de competencia integra funciones criticas para calidad, ambiente y SST?", 1, "Matriz, plan, evaluacion y registros de capacitacion."),
      q("Auditoria interna integrada", "El programa de auditoria cubre normas, procesos, riesgos, cumplimiento y desempeno?", 1.3, "Programa integrado, plan, checklist, hallazgos y cierre."),
      q("Revision por direccion", "La revision por la direccion integra desempeno, riesgos, recursos, cumplimiento y mejora del SGI?", 1.2, "Informe y acta de revision con decisiones y acciones."),
      q("Mejora continua", "Las no conformidades, incidentes y desviaciones se gestionan con causa raiz y eficacia?", 1.2, "Registro integrado de acciones y verificacion de eficacia."),
    ],
  },
};
