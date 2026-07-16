import { jsPDF } from "jspdf";
import type { DiagnosticState, OrgData } from "@/lib/diagnostic-engine";

const navy: [number, number, number] = [8, 33, 62];
const blue: [number, number, number] = [12, 134, 199];
const teal: [number, number, number] = [15, 159, 144];
const muted: [number, number, number] = [91, 112, 137];
const pale: [number, number, number] = [241, 247, 251];

export async function downloadDiagnosticPdf(org: OrgData, state: DiagnosticState) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function addPage() {
    pdf.addPage();
    y = margin;
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    drawBrandHeader();
  }

  function ensureSpace(height: number) {
    if (y + height > pageHeight - 17) addPage();
  }

  function drawBrandHeader() {
    pdf.setTextColor(...navy);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);
    pdf.text("TransiQ", margin, y);
    pdf.setTextColor(...muted);
    pdf.setFontSize(8);
    pdf.text("by ISOsolutions", margin + 25, y);
    pdf.setTextColor(...blue);
    pdf.setFont("helvetica", "bold");
    pdf.text("REPORTE EJECUTIVO PRELIMINAR", pageWidth - margin, y, { align: "right" });
    y += 4;
    pdf.setDrawColor(...blue);
    pdf.setLineWidth(0.7);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 7;
  }

  function sectionTitle(kicker: string, title: string, intro?: string) {
    ensureSpace(intro ? 25 : 17);
    pdf.setTextColor(...teal);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text(kicker.toUpperCase(), margin, y);
    y += 6;
    pdf.setTextColor(...navy);
    pdf.setFontSize(15);
    pdf.text(title, margin, y);
    y += 6;
    if (intro) {
      pdf.setTextColor(...muted);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const lines = pdf.splitTextToSize(intro, contentWidth) as string[];
      pdf.text(lines, margin, y);
      y += lines.length * 4.2 + 3;
    }
  }

  function infoTile(label: string, value: string, x: number, width: number) {
    pdf.setFillColor(...pale);
    pdf.roundedRect(x, y, width, 15, 2, 2, "F");
    pdf.setTextColor(...muted);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6.5);
    pdf.text(label.toUpperCase(), x + 3, y + 4.5);
    pdf.setTextColor(...navy);
    pdf.setFontSize(8.5);
    const valueLines = pdf.splitTextToSize(value || "No registrado", width - 6) as string[];
    pdf.text(valueLines.slice(0, 2), x + 3, y + 9);
  }

  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  drawBrandHeader();
  const tileGap = 2;
  const tileWidth = (contentWidth - tileGap * 2) / 3;
  infoTile("Empresa", org.company, margin, tileWidth);
  infoTile("Contacto", org.contactName, margin + tileWidth + tileGap, tileWidth);
  infoTile("Norma", state.standard.label, margin + (tileWidth + tileGap) * 2, tileWidth);
  y += 18;
  infoTile("Correo", org.email, margin, tileWidth);
  infoTile("Teléfono", org.phone, margin + tileWidth + tileGap, tileWidth);
  infoTile("Fecha", new Date().toLocaleDateString("es-MX", { dateStyle: "long" }), margin + (tileWidth + tileGap) * 2, tileWidth);
  y += 23;

  pdf.setFillColor(7, 61, 102);
  pdf.roundedRect(margin, y, contentWidth, 35, 3, 3, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(25);
  pdf.text(`${state.score}%`, margin + 8, y + 15);
  pdf.setFontSize(8);
  pdf.text("MADUREZ GLOBAL", margin + 8, y + 23);
  pdf.setFontSize(15);
  pdf.text(state.level.title, margin + 43, y + 12);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  const levelLines = pdf.splitTextToSize(state.level.message, contentWidth - 89) as string[];
  pdf.text(levelLines, margin + 43, y + 19);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Prioridad: ${state.lead.type}`, pageWidth - margin - 7, y + 12, { align: "right" });
  pdf.text(`Horizonte: ${state.duration}`, pageWidth - margin - 7, y + 20, { align: "right" });
  y += 44;

  sectionTitle(
    "Análisis operativo",
    "Brechas de madurez identificadas",
    `${org.company} muestra una preparación global del ${state.score}%. Estas son las brechas detectadas y sus acciones prioritarias.`,
  );

  state.gaps.forEach((gap) => {
    const body = [
      `Impacto: ${gap.impact}`,
      `Acción recomendada: ${gap.action}`,
      `Evidencia a colectar: ${gap.evidence}`,
    ];
    pdf.setFontSize(8.5);
    const lineGroups = body.map((text) => pdf.splitTextToSize(text, contentWidth - 10) as string[]);
    const height = 20 + lineGroups.reduce((sum, lines) => sum + lines.length * 3.8, 0);
    ensureSpace(height + 4);
    const priorityColor: [number, number, number] = gap.priority === "Critica" ? [190, 44, 32] : gap.priority === "Alta" ? [196, 119, 25] : blue;
    pdf.setFillColor(250, 252, 253);
    pdf.setDrawColor(...priorityColor);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(margin, y, contentWidth, height, 2, 2, "FD");
    pdf.setFillColor(...priorityColor);
    pdf.roundedRect(margin + 4, y + 4, 19, 6, 1.5, 1.5, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.text(gap.priority.toUpperCase(), margin + 13.5, y + 8.1, { align: "center" });
    pdf.setTextColor(...navy);
    pdf.setFontSize(10);
    pdf.text(gap.domain, margin + 27, y + 8.5);
    let bodyY = y + 15;
    lineGroups.forEach((lines, index) => {
      pdf.setTextColor(...(index === 2 ? muted : navy));
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.text(lines, margin + 5, bodyY);
      bodyY += lines.length * 3.8 + 1.5;
    });
    y += height + 4;
  });

  addPage();
  sectionTitle("Ruta crítica", "Plan sugerido de transición", "Cronograma estimado según el nivel de urgencia y las respuestas del diagnóstico.");
  state.plan.forEach((item) => {
    pdf.setFontSize(8.5);
    const activityLines = pdf.splitTextToSize(item.activity, contentWidth - 48) as string[];
    const deliverableLines = pdf.splitTextToSize(`Entregable: ${item.deliverable}`, contentWidth - 48) as string[];
    const height = Math.max(20, 11 + (activityLines.length + deliverableLines.length) * 3.7);
    ensureSpace(height + 3);
    pdf.setFillColor(...pale);
    pdf.roundedRect(margin, y, 39, height, 2, 2, "F");
    pdf.setTextColor(...blue);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text(item.term.toUpperCase(), margin + 19.5, y + 8, { align: "center" });
    pdf.setTextColor(...navy);
    pdf.setFontSize(9.5);
    pdf.text(item.phase, margin + 44, y + 6);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.text(activityLines, margin + 44, y + 11);
    const deliverableY = y + 12 + activityLines.length * 3.7;
    pdf.setTextColor(...teal);
    pdf.setFont("helvetica", "bold");
    pdf.text(deliverableLines, margin + 44, deliverableY);
    y += height + 3;
  });

  ensureSpace(42);
  sectionTitle("Servicios recomendados", "Siguientes pasos sugeridos");
  state.recommendation.forEach((item) => {
    ensureSpace(9);
    pdf.setFillColor(...teal);
    pdf.circle(margin + 2, y - 1, 1.3, "F");
    pdf.setTextColor(...navy);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const lines = pdf.splitTextToSize(item, contentWidth - 8) as string[];
    pdf.text(lines, margin + 6, y);
    y += lines.length * 4 + 2;
  });

  const totalPages = pdf.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    pdf.setDrawColor(210, 222, 232);
    pdf.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
    pdf.setTextColor(...muted);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.text("Resultado preliminar de orientación. No sustituye una auditoría o decisión de certificación.", margin, pageHeight - 6);
    pdf.text(`${page} / ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: "right" });
  }

  const safeCompany = (org.company || "diagnostico").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
  const fileName = `transiq-diagnostico-${safeCompany || "resultado"}.pdf`;
  const blobUrl = URL.createObjectURL(pdf.output("blob"));
  const downloadLink = document.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = fileName;
  downloadLink.hidden = true;
  downloadLink.addEventListener("click", (event) => event.stopPropagation());
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
}
