const endpoint = "http://127.0.0.1:3000/api/leads";

const demoLeads = [
  {
    org: {
      company: "Logística Andina",
      country: "Colombia",
      sector: "Transporte y distribución",
      employees: "180",
      sites: "4",
      standard: "qms",
      urgency: "alta",
      interest: "Demo comercial",
      scope: "Centralizar hallazgos, acciones correctivas y seguimiento multisede para ISO 9001.",
      contact: "ana.mejia@logisticaandina.com",
    },
    answers: ["a", "b", "b", "c", "b", "b", "c", "b", "c", "b"],
    state: {
      standard: { label: "ISO 9001: Sistema de Gestión de la Calidad", short: "ISO 9001" },
      score: 58,
      level: { title: "En transición", tone: "warning" },
      lead: { score: 78, type: "Oportunidad prioritaria" },
      duration: "90 días estimados",
      answered: 10,
      total: 10,
      recommendation: [
        "Agendar demo orientada a gestión multisede y tableros de seguimiento.",
        "Mostrar trazabilidad de hallazgos, acciones y responsables.",
        "Validar urgencia de transición y fecha objetivo de auditoría.",
        "Preparar propuesta con acompañamiento de arranque y entrenamiento.",
      ],
      domainScores: [
        { domain: "Contexto y liderazgo", score: 46 },
        { domain: "Operación", score: 55 },
        { domain: "Seguimiento y medición", score: 60 },
        { domain: "Mejora", score: 68 },
      ],
      gaps: [
        {
          domain: "Contexto y liderazgo",
          gap: "Falta claridad en responsabilidades, indicadores y seguimiento directivo.",
          impact: "Puede retrasar la adopción del sistema y la toma de decisiones.",
          priority: "Alta",
          action: "Alinear responsables, indicadores y revisión ejecutiva mensual.",
          evidence: "Matriz de roles, objetivos y minutas de seguimiento.",
        },
        {
          domain: "Operación",
          gap: "La gestión de procesos y hallazgos aún depende de hojas sueltas.",
          impact: "Aumenta dispersión y pérdida de trazabilidad.",
          priority: "Media",
          action: "Digitalizar seguimiento de procesos, acciones y evidencias.",
          evidence: "Procedimientos, registros operativos y plan de acciones.",
        },
      ],
    },
    source: "Diagnóstico público | Campaña LinkedIn | ISO 9001",
    notes: "Pidieron una demo breve para dirección y calidad durante la próxima semana.",
  },
  {
    org: {
      company: "Nova Foods México",
      country: "México",
      sector: "Alimentos",
      employees: "95",
      sites: "2",
      standard: "fsms",
      urgency: "critica",
      interest: "Propuesta económica",
      scope: "Ordenar plan de transición, evidencias y seguimiento de acciones para inocuidad.",
      contact: "marco.ruiz@novafoods.mx",
    },
    answers: ["c", "c", "b", "c", "c", "b", "c", "c", "b", "c"],
    state: {
      standard: { label: "ISO 22000: Sistema de Gestión de Inocuidad Alimentaria", short: "ISO 22000" },
      score: 41,
      level: { title: "Riesgo alto", tone: "danger" },
      lead: { score: 88, type: "Cuenta caliente" },
      duration: "45 días estimados",
      answered: 10,
      total: 10,
      recommendation: [
        "Llevar una llamada de diagnóstico ejecutivo en menos de 48 horas.",
        "Presentar ruta intensiva para control de acciones y evidencias.",
        "Enseñar tablero de cumplimiento, responsables y alertas.",
        "Emitir propuesta con acompañamiento cercano y plan de arranque.",
      ],
      domainScores: [
        { domain: "Riesgos e inocuidad", score: 32 },
        { domain: "Documentación", score: 38 },
        { domain: "Seguimiento", score: 44 },
        { domain: "Competencia y capacitación", score: 50 },
      ],
      gaps: [
        {
          domain: "Riesgos e inocuidad",
          gap: "No existe un control consistente de riesgos críticos y acciones.",
          impact: "Riesgo alto frente a auditoría y operación diaria.",
          priority: "Critica",
          action: "Montar seguimiento centralizado de riesgos, acciones y vencimientos.",
          evidence: "Matriz HACCP, controles y acciones correctivas.",
        },
        {
          domain: "Documentación",
          gap: "La evidencia se encuentra dispersa entre áreas y sedes.",
          impact: "Hace lenta la preparación para auditoría.",
          priority: "Alta",
          action: "Concentrar evidencias y responsables en una sola operación digital.",
          evidence: "Procedimientos, registros y expedientes por proceso.",
        },
      ],
    },
    source: "Diagnóstico público | Referido consultor | ISO 22000",
    notes: "Buscan propuesta esta semana; presión por visita próxima del organismo certificador.",
  },
  {
    org: {
      company: "Enertek Services",
      country: "Perú",
      sector: "Servicios industriales",
      employees: "260",
      sites: "6",
      standard: "ohsms",
      urgency: "media",
      interest: "Diagnóstico",
      scope: "Mejorar visibilidad ejecutiva del sistema SST y control de acciones entre sedes.",
      contact: "paola.silva@enertek.pe",
    },
    answers: ["b", "b", "a", "b", "b", "a", "b", "a", "b", "a"],
    state: {
      standard: { label: "ISO 45001: Seguridad y Salud en el Trabajo", short: "ISO 45001" },
      score: 73,
      level: { title: "Base sólida", tone: "success" },
      lead: { score: 69, type: "Oportunidad en desarrollo" },
      duration: "90 días estimados",
      answered: 10,
      total: 10,
      recommendation: [
        "Realizar demo enfocada en visibilidad directiva y seguimiento multisede.",
        "Explorar tableros de incidentes, hallazgos y acciones correctivas.",
        "Confirmar si quieren piloto con una sede antes del despliegue completo.",
        "Armar propuesta modular para expansión progresiva.",
      ],
      domainScores: [
        { domain: "Participación y liderazgo", score: 61 },
        { domain: "Controles operacionales", score: 70 },
        { domain: "Seguimiento", score: 74 },
        { domain: "Mejora continua", score: 79 },
      ],
      gaps: [
        {
          domain: "Participación y liderazgo",
          gap: "La visión directiva y el seguimiento entre sedes no es homogéneo.",
          impact: "Se diluye la priorización de acciones estratégicas.",
          priority: "Media",
          action: "Instalar tablero ejecutivo compartido con indicadores y responsables.",
          evidence: "KPIs, revisiones gerenciales y planes de acción.",
        },
      ],
    },
    source: "Diagnóstico público | Navegación orgánica | ISO 45001",
    notes: "Posible oportunidad para piloto; les interesa ver tableros y seguimiento de acciones.",
  },
];

for (const item of demoLeads) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error(`Error sembrando ${item.org.company}:`, data);
    process.exitCode = 1;
    continue;
  }

  console.log(`Lead creado: ${data.lead.org.company} (${data.lead.id})`);
}
