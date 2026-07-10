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
  { href: '/diagnostico?canal=navegacion', label: 'Diagnóstico' },
  { href: '/soluciones', label: 'Soluciones' },
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
  { label: 'Brechas críticas', value: '7' },
  { label: 'Acciones abiertas', value: '22' },
  { label: 'Evidencias pendientes', value: '38%' },
  { label: 'Tiempo estimado', value: '120 días' },
];

export const featureStats = [
  'Diagnóstico de madurez por norma, cláusula y eje de gestión.',
  'Matriz de brechas con impacto, evidencia, prioridad y responsable.',
  'Plan automático de transición, implementación o fortalecimiento.',
  'Seguimiento ejecutivo con IA, evidencias, acciones e indicadores.',
];

export const transitionCards: TransitionCard[] = [
  {
    code: 'ISO 9001:2015 -> ISO 9001:2026',
    title: 'Calidad y desempeño organizacional',
    status: 'FDIS / publicación esperada 2026',
    description:
      'Ruta para evaluar enfoque al cliente, procesos, riesgos, liderazgo, desempeño, cultura de calidad, datos y mejora.',
    bullets: ['Brechas por cláusula', 'Plan de transición', 'Indicadores y auditoría interna'],
  },
  {
    code: 'ISO 14001:2015 -> ISO 14001:2026',
    title: 'Gestión ambiental y sostenibilidad',
    status: 'Nueva edición publicada',
    description:
      'Preparación para fortalecer contexto ambiental, ciclo de vida, cumplimiento, riesgos climáticos, desempeño y evidencias.',
    bullets: ['Aspectos e impactos', 'Cumplimiento legal', 'ESG y cambio climatico'],
  },
  {
    code: 'ISO 45001:2018 -> futura edición',
    title: 'Seguridad, salud y cultura preventiva',
    status: 'En revisión internacional',
    description:
      'Fortalecimiento de SST, participación de trabajadores, contratistas, emergencias, incidentes y riesgos psicosociales.',
    bullets: ['Peligros y riesgos', 'Consulta y participación', 'Bienestar laboral'],
  },
  {
    code: 'ISO 37001:2016 -> ISO 37001:2025',
    title: 'Antisoborno, ética y cumplimiento',
    status: 'Actualización normativa',
    description:
      'Ruta para debida diligencia, controles financieros y no financieros, función de cumplimiento, terceros y canal de denuncias.',
    bullets: ['Riesgos de soborno', 'Debida diligencia', 'Gobernanza y evidencia'],
  },
];

export const platformModules = [
  'Diagnóstico de madurez',
  'Selector multinorma',
  'Matriz de brechas',
  'Plan de transición',
  'Gestión documental',
  'Evidencias objetivas',
  'Auditoría interna',
  'Acciones correctivas',
  'Riesgos y oportunidades',
  'Indicadores',
  'Revisión por dirección',
  'Copiloto IA',
  'Dashboard cliente',
  'Dashboard comercial',
  'Dashboard técnico',
  'Reportes PDF y Word',
];

export const workflowSteps = [
  {
    code: '01',
    title: 'Registro de organización',
    description: 'País, sector, norma, alcance, empleados, sitios y urgencia.',
  },
  {
    code: '02',
    title: 'Diagnóstico por norma',
    description: 'Preguntas ponderadas por cláusula, eje y criticidad.',
  },
  {
    code: '03',
    title: 'Resultado de madurez',
    description: 'Semáforo, brechas, riesgos prioritarios y ruta sugerida.',
  },
  {
    code: '04',
    title: 'Plan de acción',
    description: 'Fases, responsables, evidencias, fechas e indicadores.',
  },
  {
    code: '05',
    title: 'Seguimiento',
    description: 'Dashboard, alertas, auditorías, acciones correctivas y reportes.',
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
    title: 'Diagnóstico Inteligente',
    text: 'Evaluación multinorma automática por cláusula y eje de gestión, generando semáforos de madurez en tiempo real.',
  },
  {
    title: 'Planificador de Acción',
    text: 'Algoritmo dinámico que traza una ruta de implementación detallada con plazos, responsables y entregables.',
  },
  {
    title: 'Gestor de Evidencias',
    text: 'Repositorio seguro para recolectar y almacenar evidencias objetivas trazables de cara a auditorías de certificación.',
  },
  {
    title: 'Auditoría y Desempeño',
    text: 'Herramientas para planificar auditorías internas, registrar no conformidades, realizar análisis de causa raíz y KPIs.',
  },
  {
    title: 'Seguridad y Trazabilidad',
    text: 'Control de accesos estructurado, firmas digitales, perfiles por rol y trazabilidad completa de cambios en el SG.',
  },
  {
    title: 'Copiloto de IA',
    text: 'Asistencia inteligente para interpretar requisitos normativos complejos y sugerir acciones correctivas eficaces.',
  },
];

export const solutions: Solution[] = [
  {
    slug: 'iso-9001',
    label: 'ISO 9001:2026',
    summary: 'Prepara la transición de calidad con diagnóstico, brechas y ruta ejecutiva antes de llegar a auditoría.',
    audience: 'Dirección general, calidad, operaciones y responsables de mejora.',
    challenge: 'Muchas organizaciones mantienen certificado vigente, pero no saben si su sistema realmente está listo para la nueva generación ISO.',
    value: ['Diagnóstico ejecutivo de madurez', 'Priorización de brechas por impacto', 'Ruta sugerida para demo y acompañamiento comercial'],
    offer: ['Landing orientada a campaña', 'Diagnóstico guiado', 'Seguimiento comercial hacia demo TransiQ'],
  },
  {
    slug: 'iso-14001',
    label: 'ISO 14001:2026',
    summary: 'Convierte los cambios ambientales en una ruta clara de preparación, evidencia y decisión.',
    audience: 'Gerentes ambientales, HSE, cumplimiento y operaciones.',
    challenge: 'El reto no es solo actualizar documentos; es demostrar control ambiental, riesgos y evidencia de desempeño.',
    value: ['Narrativa comercial por norma', 'Diagnóstico de preparación ambiental', 'Embudo de conversión a demo técnica'],
    offer: ['Pagina por norma con SEO', 'Captura de leads por urgencia', 'Pipeline comercial para seguimiento'],
  },
  {
    slug: 'iso-45001',
    label: 'ISO 45001',
    summary: 'Posiciona la preparación SST como proyecto estratégico, no solo documental.',
    audience: 'Responsables de SST, HSE, operaciones y recursos humanos.',
    challenge: 'Las empresas necesitan evaluar participación, riesgos, cumplimiento y cultura preventiva antes de cualquier transición.',
    value: ['Contenido comercial especializado', 'Diagnóstico público de enganche', 'Lead scoring para priorizar oportunidades'],
    offer: ['Mensajes por sector', 'CTA a sesión ejecutiva', 'Entrega de lead calificado a comercial'],
  },
  {
    slug: 'iso-37001',
    label: 'ISO 37001:2025',
    summary: 'Impulsa servicios de antisoborno con una propuesta clara de diagnóstico, control y gobernanza.',
    audience: 'Cumplimiento, legal, auditoría y dirección.',
    challenge: 'Los equipos necesitan identificar brechas de gobernanza y debida diligencia sin mezclar certificación con asesoría impropia.',
    value: ['Mensajes alineados a imparcialidad', 'Ruta de evaluación preliminar', 'Preparación para seguimiento comercial serio'],
    offer: ['Landing especializada', 'Diagnóstico ejecutivo', 'Canal de paso a demo o contacto'],
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
    description: 'Lead magnet para captar organizaciones que ya saben que necesitan prepararse pero aún no inician.',
  },
  {
    title: 'Guía ejecutiva para alta dirección',
    description: 'Material de apoyo para explicar riesgos, impacto y urgencia de la transición normativa.',
  },
  {
    title: 'Webinar de preparación por norma',
    description: 'Pieza de campaña complementaria para impulsar registro, asistencia y seguimiento comercial.',
  },
];

export const metrics = [
  { value: '8% - 15%', label: 'Conversión esperada de landing' },
  { value: '30% - 50%', label: 'Paso estimado de MQL a SQL' },
  { value: '4 rutas', label: 'Prioridades iniciales por norma y solución' },
  { value: '1 CRM', label: 'Canal interno para dirección y comercial' },
];
