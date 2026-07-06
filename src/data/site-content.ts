export type Solution = {
  slug: string;
  label: string;
  summary: string;
  audience: string;
  challenge: string;
  value: string[];
  offer: string[];
};

export type TransitionCard = {
  code: string;
  title: string;
  status: string;
  description: string;
  bullets: string[];
};

export const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/diagnostico', label: 'Diagnostico' },
  { href: '/soluciones', label: 'Soluciones' },
  { href: '/recursos', label: 'Recursos' },
  { href: '/demo', label: 'Demo' },
  { href: '/contacto', label: 'Contacto' },
];

export const heroStandards = [
  'ISO 9001:2026',
  'ISO 14001:2026',
  'ISO 45001',
  'ISO 37001:2025',
  'ISO/IEC 27001',
];

export const heroMetrics = [
  { label: 'Brechas criticas', value: '7' },
  { label: 'Acciones abiertas', value: '22' },
  { label: 'Evidencias pendientes', value: '38%' },
  { label: 'Tiempo estimado', value: '120 dias' },
];

export const featureStats = [
  'Diagnostico de madurez por norma, clausula y eje de gestion.',
  'Matriz de brechas con impacto, evidencia, prioridad y responsable.',
  'Plan automatico de transicion, implementacion o fortalecimiento.',
  'Seguimiento ejecutivo con IA, evidencias, acciones e indicadores.',
];

export const transitionCards: TransitionCard[] = [
  {
    code: 'ISO 9001:2015 -> ISO 9001:2026',
    title: 'Calidad y desempeno organizacional',
    status: 'FDIS / publicacion esperada 2026',
    description:
      'Ruta para evaluar enfoque al cliente, procesos, riesgos, liderazgo, desempeno, cultura de calidad, datos y mejora.',
    bullets: ['Brechas por clausula', 'Plan de transicion', 'Indicadores y auditoria interna'],
  },
  {
    code: 'ISO 14001:2015 -> ISO 14001:2026',
    title: 'Gestion ambiental y sostenibilidad',
    status: 'Nueva edicion publicada',
    description:
      'Preparacion para fortalecer contexto ambiental, ciclo de vida, cumplimiento, riesgos climaticos, desempeno y evidencias.',
    bullets: ['Aspectos e impactos', 'Cumplimiento legal', 'ESG y cambio climatico'],
  },
  {
    code: 'ISO 45001:2018 -> futura edicion',
    title: 'Seguridad, salud y cultura preventiva',
    status: 'En revision internacional',
    description:
      'Fortalecimiento de SST, participacion de trabajadores, contratistas, emergencias, incidentes y riesgos psicosociales.',
    bullets: ['Peligros y riesgos', 'Consulta y participacion', 'Bienestar laboral'],
  },
  {
    code: 'ISO 37001:2016 -> ISO 37001:2025',
    title: 'Antisoborno, etica y cumplimiento',
    status: 'Actualizacion normativa',
    description:
      'Ruta para debida diligencia, controles financieros y no financieros, funcion de cumplimiento, terceros y canal de denuncias.',
    bullets: ['Riesgos de soborno', 'Debida diligencia', 'Gobernanza y evidencia'],
  },
];

export const platformModules = [
  'Diagnostico de madurez',
  'Selector multinorma',
  'Matriz de brechas',
  'Plan de transicion',
  'Gestion documental',
  'Evidencias objetivas',
  'Auditoria interna',
  'Acciones correctivas',
  'Riesgos y oportunidades',
  'Indicadores',
  'Revision por direccion',
  'Copiloto IA',
  'Dashboard cliente',
  'Dashboard comercial',
  'Dashboard tecnico',
  'Reportes PDF y Word',
];

export const workflowSteps = [
  {
    code: '01',
    title: 'Registro de organizacion',
    description: 'Pais, sector, norma, alcance, empleados, sitios y urgencia.',
  },
  {
    code: '02',
    title: 'Diagnostico por norma',
    description: 'Preguntas ponderadas por clausula, eje y criticidad.',
  },
  {
    code: '03',
    title: 'Resultado de madurez',
    description: 'Semaforo, brechas, riesgos prioritarios y ruta sugerida.',
  },
  {
    code: '04',
    title: 'Plan de accion',
    description: 'Fases, responsables, evidencias, fechas e indicadores.',
  },
  {
    code: '05',
    title: 'Seguimiento',
    description: 'Dashboard, alertas, auditorias, acciones correctivas y reportes.',
  },
];

export const dashboardPanels = [
  {
    audience: 'Cliente',
    title: 'Tablero del sistema de gestion',
    points: [
      'Avance por norma y clausula.',
      'Acciones vencidas y evidencias pendientes.',
      'Riesgos criticos y proximos pasos.',
      'Descarga de informes ejecutivos.',
    ],
  },
  {
    audience: 'Comercial',
    title: 'Inteligencia de leads',
    points: [
      'Leads por pais, norma, sector y urgencia.',
      'MQL, SQL, valor potencial y probabilidad.',
      'Servicios recomendados y ejecutivo asignado.',
      'Exportacion a CRM y seguimiento automatico.',
    ],
  },
  {
    audience: 'Tecnico',
    title: 'Brechas recurrentes',
    points: [
      'Requisitos con menor madurez.',
      'Sectores con mayor riesgo.',
      'Necesidades de capacitacion y auditoria.',
      'Biblioteca de evidencias y plantillas.',
    ],
  },
];

export const launchHooks = [
  'Tu certificado esta vigente, pero tu sistema esta preparado?',
  'No esperes a la auditoria para descubrir brechas.',
  'La transicion no es documental: es estrategica.',
  'Diagnostica antes de invertir tiempo y presupuesto.',
];

export const launchFunnel = [
  'Contenido educativo y anuncios por norma.',
  'Diagnostico gratuito con lead capture.',
  'Reporte ejecutivo y score comercial.',
  'Webinar o sesion ejecutiva.',
  'Demo, propuesta o plan premium.',
];

export const launchCalendar = [
  { week: 'Semana 1', text: 'Landing principal, claim, diagnostico minimo viable y piezas teaser.' },
  { week: 'Semana 2', text: 'Publicacion, CRM, formularios, email de seguimiento y campana organica.' },
  { week: 'Semana 3', text: 'Google Ads, LinkedIn Ads, webinar y remarketing por norma y pais.' },
  { week: 'Semana 4', text: 'Optimizacion de leads, demos, propuestas y tablero comercial.' },
];

export const architectureItems = [
  {
    title: 'Frontend',
    text: 'Sitio comercial en Next.js con paginas por norma, diagnostico, formularios y arquitectura modular para crecimiento.',
  },
  {
    title: 'Backend',
    text: 'APIs para captacion, diagnostico, CRM interno, pipeline comercial y metricas operativas para direccion y ventas.',
  },
  {
    title: 'Base de datos',
    text: 'Persistencia de leads, respuestas, clasificacion comercial, notas, etapas y origen de campana.',
  },
  {
    title: 'Integraciones',
    text: 'Email interno, analytics, remarketing, agenda de demo y posible integracion futura con herramientas comerciales.',
  },
  {
    title: 'Seguridad',
    text: 'Roles para direccion y comercial, control de acceso a admin, trazabilidad y proteccion de datos captados.',
  },
  {
    title: 'IA y evolucion',
    text: 'La experiencia comercial puede crecer hacia recomendaciones, seguimiento y automatizaciones sin reescribir el sitio.',
  },
];

export const solutions: Solution[] = [
  {
    slug: 'iso-9001',
    label: 'ISO 9001:2026',
    summary: 'Prepara la transicion de calidad con diagnostico, brechas y ruta ejecutiva antes de llegar a auditoria.',
    audience: 'Direccion general, calidad, operaciones y responsables de mejora.',
    challenge: 'Muchas organizaciones mantienen certificado vigente, pero no saben si su sistema realmente esta listo para la nueva generacion ISO.',
    value: ['Diagnostico ejecutivo de madurez', 'Priorizacion de brechas por impacto', 'Ruta sugerida para demo y acompanamiento comercial'],
    offer: ['Landing orientada a campana', 'Diagnostico guiado', 'Seguimiento comercial hacia demo TransiQ'],
  },
  {
    slug: 'iso-14001',
    label: 'ISO 14001:2026',
    summary: 'Convierte los cambios ambientales en una ruta clara de preparacion, evidencia y decision.',
    audience: 'Gerentes ambientales, HSE, cumplimiento y operaciones.',
    challenge: 'El reto no es solo actualizar documentos; es demostrar control ambiental, riesgos y evidencia de desempeno.',
    value: ['Narrativa comercial por norma', 'Diagnostico de preparacion ambiental', 'Embudo de conversion a demo tecnica'],
    offer: ['Pagina por norma con SEO', 'Captura de leads por urgencia', 'Pipeline comercial para seguimiento'],
  },
  {
    slug: 'iso-45001',
    label: 'ISO 45001',
    summary: 'Posiciona la preparacion SST como proyecto estrategico, no solo documental.',
    audience: 'Responsables de SST, HSE, operaciones y recursos humanos.',
    challenge: 'Las empresas necesitan evaluar participacion, riesgos, cumplimiento y cultura preventiva antes de cualquier transicion.',
    value: ['Contenido comercial especializado', 'Diagnostico publico de enganche', 'Lead scoring para priorizar oportunidades'],
    offer: ['Mensajes por sector', 'CTA a sesion ejecutiva', 'Entrega de lead calificado a comercial'],
  },
  {
    slug: 'iso-37001',
    label: 'ISO 37001:2025',
    summary: 'Impulsa servicios de antisoborno con una propuesta clara de diagnostico, control y gobernanza.',
    audience: 'Cumplimiento, legal, auditoria y direccion.',
    challenge: 'Los equipos necesitan identificar brechas de gobernanza y debida diligencia sin mezclar certificacion con asesoria impropia.',
    value: ['Mensajes alineados a imparcialidad', 'Ruta de evaluacion preliminar', 'Preparacion para seguimiento comercial serio'],
    offer: ['Landing especializada', 'Diagnostico ejecutivo', 'Canal de paso a demo o contacto'],
  },
  {
    slug: 'sistema-integrado',
    label: 'Sistema Integrado',
    summary: 'Explica y vende la integracion de calidad, ambiente y SST con una experiencia comercial unificada.',
    audience: 'Empresas multisede, multinorma y equipos de direccion.',
    challenge: 'El valor real esta en ordenar prioridades, no en presentar normas aisladas.',
    value: ['Diagnostico de enfoque integrado', 'Mensajes para alta direccion', 'Seguimiento comercial con mayor contexto'],
    offer: ['Pagina de integracion', 'Captura de leads premium', 'Ruta de conversacion hacia demo TransiQ'],
  },
];

export const resources = [
  {
    title: 'Checklist de transicion ISO 2026',
    description: 'Lead magnet para captar organizaciones que ya saben que necesitan prepararse pero aun no inician.',
  },
  {
    title: 'Guia ejecutiva para alta direccion',
    description: 'Material de apoyo para explicar riesgos, impacto y urgencia de la transicion normativa.',
  },
  {
    title: 'Webinar de preparacion por norma',
    description: 'Pieza de campana complementaria para impulsar registro, asistencia y seguimiento comercial.',
  },
];

export const metrics = [
  { value: '8% - 15%', label: 'Conversion esperada de landing' },
  { value: '30% - 50%', label: 'Paso estimado de MQL a SQL' },
  { value: '4 rutas', label: 'Prioridades iniciales por norma y solucion' },
  { value: '1 CRM', label: 'Canal interno para direccion y comercial' },
];
