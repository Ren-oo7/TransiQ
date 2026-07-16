export type Solution = {
  slug: string;
  label: string;
  summary: string;
  audience: string;
  challenge: string;
  value: string[];
  offer: string[];
  intro?: string;
  evaluates?: string[];
};

export type TransitionCard = {
  code: string;
  title: string;
  status: string;
  description: string;
  bullets: string[];
};

export type MissionCard = {
  code: string;
  title: string;
  text: string;
  href: string;
  cta: string;
};

export type NormHighlight = {
  title: string;
  text: string;
  href: string;
};

export const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/diagnostico?canal=navegacion', label: 'Diagnóstico' },
  { href: '/soluciones', label: 'Soluciones' },
  { href: '/plataforma', label: 'Plataforma' },
  { href: '/recursos', label: 'Recursos' },
  { href: '/demo?canal=navegacion', label: 'Demo' },
  { href: '/contacto?canal=navegacion', label: 'Contacto' },
];

export const heroStandards = [
  'ISO 9001:2026',
  'ISO 14001:2026',
  'ISO 45001',
  'ISO 37001:2025',
  'ISO/IEC 27001',
];

export const heroMetrics = [
  { label: 'Brechas priorizadas', value: '68%' },
  { label: 'Evidencias trazables', value: '56%' },
  { label: 'Ruta automatizada', value: '82%' },
];

export const featureStats = [
  'Cada página del sitio cumple una misión concreta: orientar, convertir, explicar, atraer o activar seguimiento.',
  'TransiQ entrega valor antes de la llamada comercial: score, brechas, recursos y siguiente acción sugerida.',
  'La ruta ideal escala sola: diagnóstico, plan, evidencia, dashboard y apoyo humano solo cuando agrega valor.',
  'El contenido por norma y por necesidad fortalece SEO, claridad comercial y captación internacional.',
];

export const missionCards: MissionCard[] = [
  {
    code: "01",
    title: "Necesidad del prospecto",
    text: "El usuario entra por problema: transición, implementación, auditoría próxima, evidencias, sistema integrado o consulta técnica.",
    href: "/soluciones",
    cta: "Encontrar ruta",
  },
  {
    code: "02",
    title: "Valor inmediato",
    text: "Antes de hablar con un ejecutivo, TransiQ entrega score, brechas, recursos y siguiente acción automática.",
    href: "/diagnostico?canal=mision-valor",
    cta: "Evaluar ahora",
  },
  {
    code: "03",
    title: "Crecimiento orgánico",
    text: "Recursos, páginas por norma, FAQ, datos estructurados, sitemap y contenido útil para buscadores y usuarios.",
    href: "/recursos",
    cta: "Ver recursos",
  },
];

export const transitionCards: TransitionCard[] = [
  {
    code: 'ISO 9001:2015 -> ISO 9001:2026',
    title: 'Calidad y desempeño organizacional',
    status: 'FDIS / publicación esperada 2026',
    description:
      'Ruta para preparar procesos, enfoque al cliente, riesgos, liderazgo, proveedores, datos y mejora continua.',
    bullets: ['Diagnóstico de madurez', 'Brechas por requisito', 'Plan de transición y seguimiento'],
  },
  {
    code: 'ISO 14001:2015 -> ISO 14001:2026',
    title: 'Gestión ambiental y sostenibilidad',
    status: 'Nueva edición publicada',
    description:
      'Preparación para fortalecer aspectos e impactos, ciclo de vida, cumplimiento legal, emergencias e indicadores.',
    bullets: ['Contexto y desempeño ambiental', 'Cumplimiento legal', 'Riesgos y evidencias objetivas'],
  },
  {
    code: 'ISO 45001:2018 -> futura edición',
    title: 'Seguridad, salud y cultura preventiva',
    status: 'En revisión internacional',
    description:
      'Fortalecimiento de SST, prevención, participación, incidentes, cumplimiento y evidencia operacional.',
    bullets: ['Peligros y riesgos', 'Participación y prevención', 'Seguimiento y mejora'],
  },
  {
    code: 'ISO 37001:2016 -> ISO 37001:2025',
    title: 'Antisoborno, ética y cumplimiento',
    status: 'Actualización normativa',
    description:
      'Ruta para gobernanza, debida diligencia, controles antisoborno, terceros y función de cumplimiento.',
    bullets: ['Riesgos de soborno', 'Debida diligencia', 'Controles y trazabilidad'],
  },
];

export const platformModules = [
  'Diagnóstico IA',
  'Matriz de brechas',
  'Plan de acción',
  'Selector multinorma',
  'Gestión documental',
  'Evidencias trazables',
  'Auditoría interna',
  'Acciones correctivas',
  'Riesgos y oportunidades',
  'Dashboards',
  'Copiloto IA',
  'Reportes',
];

export const workflowSteps = [
  {
    code: '01',
    title: 'Elige necesidad',
    description: 'Norma, país, sector, urgencia y contexto del sistema.',
  },
  {
    code: '02',
    title: 'IA interpreta',
    description: 'Madurez, brechas, prioridad y contexto operativo.',
  },
  {
    code: '03',
    title: 'Ruta automática',
    description: 'Diagnóstico, recurso, demo o plan sugerido.',
  },
  {
    code: '04',
    title: 'Acción inmediata',
    description: 'Reporte, checklist, dashboard o simulación útil.',
  },
  {
    code: '05',
    title: 'Escala si conviene',
    description: 'Especialista humano solo cuando aporta valor real.',
  },
];

export const homeFlowSteps = [
  {
    code: "01",
    title: "Elige necesidad",
    description: "Norma, país, sector y urgencia.",
  },
  {
    code: "02",
    title: "IA interpreta",
    description: "Madurez, contexto y prioridad.",
  },
  {
    code: "03",
    title: "Ruta automática",
    description: "Diagnóstico, recurso, demo o plan.",
  },
  {
    code: "04",
    title: "Acción inmediata",
    description: "Reporte, checklist, dashboard o simulación.",
  },
  {
    code: "05",
    title: "Escala si conviene",
    description: "Especialista solo cuando agrega valor.",
  },
];

export const normHighlights: NormHighlight[] = [
  {
    title: "ISO 9001:2026",
    text: "Calidad, procesos, riesgos, datos y mejora continua.",
    href: "/soluciones/iso-9001",
  },
  {
    title: "ISO 14001:2026",
    text: "Desempeño ambiental, cumplimiento, ciclo de vida y sostenibilidad.",
    href: "/soluciones/iso-14001",
  },
  {
    title: "ISO 45001",
    text: "SST, prevención, participación y evidencia operacional.",
    href: "/soluciones/iso-45001",
  },
  {
    title: "ISO/IEC 27001",
    text: "SGSI, riesgos, controles, evidencia técnica y ciberseguridad.",
    href: "/soluciones/iso-27001",
  },
];

export const dashboardPanels = [
  {
    audience: 'Cliente',
    title: 'Tablero del sistema de gestión',
    points: [
      'Avance por norma y cláusula.',
      'Acciones vencidas y evidencias pendientes.',
      'Riesgos críticos y próximos pasos.',
      'Descarga de informes ejecutivos.',
    ],
  },
  {
    audience: 'Comercial',
    title: 'Inteligencia de leads',
    points: [
      'Leads por país, norma, sector y urgencia.',
      'MQL, SQL, valor potencial y probabilidad.',
      'Servicios recomendados y ejecutivo asignado.',
      'Exportación a CRM y seguimiento automático.',
    ],
  },
  {
    audience: 'Técnico',
    title: 'Brechas recurrentes',
    points: [
      'Requisitos con menor madurez.',
      'Sectores con mayor riesgo.',
      'Necesidades de capacitación y auditoría.',
      'Biblioteca de evidencias y plantillas.',
    ],
  },
];

export const launchHooks = [
  'Tu certificado está vigente, pero tu sistema está preparado?',
  'No esperes a la auditoría para descubrir brechas.',
  'La transición no es documental: es estratégica.',
  'Diagnostica antes de invertir tiempo y presupuesto.',
];

export const launchFunnel = [
  'Contenido educativo y anuncios por norma.',
  'Diagnóstico gratuito con lead capture.',
  'Reporte ejecutivo y score comercial.',
  'Webinar o sesión ejecutiva.',
  'Demo, propuesta o plan premium.',
];

export const launchCalendar = [
  { week: 'Semana 1', text: 'Landing principal, claim, diagnóstico mínimo viable y piezas teaser.' },
  { week: 'Semana 2', text: 'Publicación, CRM, formularios, email de seguimiento y campaña orgánica.' },
  { week: 'Semana 3', text: 'Google Ads, LinkedIn Ads, webinar y remarketing por norma y país.' },
  { week: 'Semana 4', text: 'Optimización de leads, demos, propuestas y tablero comercial.' },
];

export const architectureItems = [
  {
    title: 'Diagnóstico inteligente',
    text: 'Evalúa madurez, contexto, urgencia y prioridades antes de iniciar una ruta más profunda.',
  },
  {
    title: 'Brechas y plan de acción',
    text: 'Convierte hallazgos en prioridades, responsables, evidencias y siguientes pasos concretos.',
  },
  {
    title: 'Gestión de evidencias',
    text: 'Ordena registros, pruebas y documentos para demostrar mejor el sistema frente a auditorías.',
  },
  {
    title: 'Auditoría y seguimiento',
    text: 'Da continuidad a acciones, hallazgos, indicadores y mejoras sin perder trazabilidad.',
  },
  {
    title: 'Dashboards claros',
    text: 'Entrega lectura distinta para cliente, comercial y equipo técnico según la decisión que deben tomar.',
  },
  {
    title: 'Copiloto IA',
    text: 'Sugiere rutas, ordena información y ayuda a traducir requisitos complejos en acciones entendibles.',
  },
];

export const solutions: Solution[] = [
  {
    slug: 'iso-9001',
    label: 'ISO 9001:2026',
    summary: 'Prepara ISO 9001:2026 con enfoque en procesos, datos y mejora continua.',
    intro: 'Evalúa liderazgo, enfoque al cliente, riesgos, proveedores, indicadores, gestión del cambio, conocimiento organizacional y evidencia de desempeño.',
    evaluates: ['Liderazgo y contexto', 'Procesos y enfoque al cliente', 'Riesgos y oportunidades', 'Control de proveedores', 'Indicadores y análisis de datos', 'Auditoría interna y mejora'],
    audience: 'Dirección general, calidad, operaciones y responsables de mejora.',
    challenge: 'Muchas organizaciones mantienen certificado vigente, pero no saben si su sistema realmente está listo para la nueva generación ISO.',
    value: ['Diagnóstico ejecutivo de madurez', 'Priorización de brechas por impacto', 'Ruta sugerida para demo y acompañamiento comercial'],
    offer: ['Landing orientada a campaña', 'Diagnóstico guiado', 'Seguimiento comercial hacia demo TransiQ'],
  },
  {
    slug: 'iso-14001',
    label: 'ISO 14001:2026',
    summary: 'Transición ISO 14001:2026 con desempeño ambiental y evidencia objetiva.',
    intro: 'Evalúa aspectos e impactos, ciclo de vida, cumplimiento legal, riesgos ambientales, comunicación, emergencias e indicadores ambientales.',
    evaluates: ['Aspectos e impactos', 'Cumplimiento legal ambiental', 'Ciclo de vida', 'Riesgos ambientales', 'Emergencias', 'Indicadores ambientales'],
    audience: 'Gerentes ambientales, HSE, cumplimiento y operaciones.',
    challenge: 'El reto no es solo actualizar documentos; es demostrar control ambiental, riesgos y evidencia de desempeño.',
    value: ['Narrativa comercial por norma', 'Diagnóstico de preparación ambiental', 'Embudo de conversión a demo técnica'],
    offer: ['Pagina por norma con SEO', 'Captura de leads por urgencia', 'Pipeline comercial para seguimiento'],
  },
  {
    slug: 'iso-45001',
    label: 'ISO 45001',
    summary: 'Fortalece ISO 45001 con cultura preventiva, riesgos SST y control operacional.',
    intro: 'Evalúa peligros, riesgos, consulta y participación, contratistas, emergencias, incidentes, controles e indicadores de SST.',
    evaluates: ['Peligros y riesgos SST', 'Consulta y participación', 'Contratistas', 'Emergencias', 'Incidentes', 'Indicadores SST'],
    audience: 'Responsables de SST, HSE, operaciones y recursos humanos.',
    challenge: 'Las empresas necesitan evaluar participación, riesgos, cumplimiento y cultura preventiva antes de cualquier transición.',
    value: ['Contenido comercial especializado', 'Diagnóstico público de enganche', 'Lead scoring para priorizar oportunidades'],
    offer: ['Mensajes por sector', 'CTA a sesión ejecutiva', 'Entrega de lead calificado a comercial'],
  },
  {
    slug: 'iso-37001',
    label: 'ISO 37001:2025',
    summary: 'Actualiza ISO 37001:2025 con gobernanza, debida diligencia y controles antisoborno.',
    intro: 'Evalúa riesgos de soborno, función de cumplimiento, controles financieros y no financieros, terceros, canal de denuncias e investigaciones.',
    evaluates: ['Riesgos de soborno', 'Debida diligencia', 'Función de cumplimiento', 'Controles financieros', 'Terceros', 'Canal de denuncias'],
    audience: 'Cumplimiento, legal, auditoría y dirección.',
    challenge: 'Los equipos necesitan identificar brechas de gobernanza y debida diligencia sin mezclar certificación con asesoría impropia.',
    value: ['Mensajes alineados a imparcialidad', 'Ruta de evaluación preliminar', 'Preparación para seguimiento comercial serio'],
    offer: ['Landing especializada', 'Diagnóstico ejecutivo', 'Canal de paso a demo o contacto'],
  },
  {
    slug: 'iso-27001',
    label: 'ISO/IEC 27001',
    summary: 'Fortalece ISO/IEC 27001 con riesgos, controles y evidencia técnica.',
    intro: 'Evalúa alcance del SGSI, riesgos de seguridad, Declaración de Aplicabilidad, controles ISO/IEC 27002, incidentes, continuidad, nube y proveedores.',
    evaluates: ['Alcance del SGSI', 'Riesgos de seguridad', 'Declaración de Aplicabilidad', 'Controles', 'Incidentes', 'Continuidad'],
    audience: 'Responsables de seguridad de la información, tecnología, riesgos, cumplimiento y dirección.',
    challenge: 'El SGSI requiere conectar riesgos, controles y evidencia técnica en una ruta trazable y útil para la operación.',
    value: ['Diagnóstico de madurez del SGSI', 'Brechas y evidencia por control', 'Ruta automática hacia plan y seguimiento'],
    offer: ['Página especializada por norma', 'Diagnóstico guiado', 'Demo de riesgos, controles y evidencia'],
  },
  {
    slug: 'sistema-integrado',
    label: 'Sistema Integrado',
    summary: 'Explica y vende la integración de calidad, ambiente y SST con una experiencia comercial unificada.',
    audience: 'Empresas multisede, multinorma y equipos de dirección.',
    challenge: 'El valor real está en ordenar prioridades, no en presentar normas aisladas.',
    value: ['Diagnóstico de enfoque integrado', 'Mensajes para alta dirección', 'Seguimiento comercial con mayor contexto'],
    offer: ['Página de integración', 'Captura de leads premium', 'Ruta de conversación hacia demo TransiQ'],
  },
];

export const resources = [
  {
    title: 'Checklist de transición ISO 2026',
    description: 'Liderazgo, riesgos, documentos, evidencias, auditoría interna e indicadores.',
  },
  {
    title: 'Guía para Alta Dirección',
    description: 'Riesgos ejecutivos, decisiones clave, ruta de 90 días y seguimiento.',
  },
  {
    title: 'Preparación por norma',
    description: '9001, 14001, 45001, 37001, 27001 y Sistemas Integrados.',
  },
  {
    title: 'Matriz de brechas por norma',
    description: 'Impacto, criticidad, evidencias, procesos responsables y acciones.',
  },
  {
    title: 'Madurez ISO',
    description: 'Evalúa score, urgencia, complejidad y ruta recomendada.',
  },
  {
    title: 'Kit de diagnóstico para clientes',
    description: 'Reportes, plantillas y rutas para administrar múltiples organizaciones.',
  },
];

export const metrics = [
  { value: '8% - 15%', label: 'Conversión esperada de landing' },
  { value: '30% - 50%', label: 'Paso estimado de MQL a SQL' },
  { value: '4 rutas', label: 'Prioridades iniciales por norma y solución' },
  { value: '1 CRM', label: 'Canal interno para dirección y comercial' },
];
