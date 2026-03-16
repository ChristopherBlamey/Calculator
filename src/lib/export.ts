import { IngredientTotal } from "@/types";

/**
 * Generate a plain-text shopping list.
 */
export function generateShoppingListText(totals: IngredientTotal[]): string {
  const lines = ["🛒 LISTA DE COMPRAS", "==================", ""];
  for (const t of totals) {
    lines.push(`• ${t.displayValue} ${t.displayUnit} — ${t.name}`);
  }
  lines.push("", `Generado: ${new Date().toLocaleDateString("es-CL")}`);
  return lines.join("\n");
}

/**
 * Generate CSV data from totals.
 */
export function generateCSV(totals: IngredientTotal[]): string {
  const rows = [["Ingrediente", "Cantidad", "Unidad"]];
  for (const t of totals) {
    rows.push([t.name, t.displayValue, t.displayUnit]);
  }
  return rows.map((r) => r.join(",")).join("\n");
}

/**
 * Download a file from text content.
 */
export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate and download a PDF shopping list.
 */
export async function downloadPDF(totals: IngredientTotal[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Lista de Compras", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Carrito Chileno — ${new Date().toLocaleDateString("es-CL")}`, 20, 33);

  // Table header
  let y = 48;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Ingrediente", 20, y);
  doc.text("Cantidad", 120, y);
  doc.text("Unidad", 160, y);

  // Line
  y += 3;
  doc.setDrawColor(200);
  doc.line(20, y, 190, y);
  y += 8;

  // Rows
  doc.setFont("helvetica", "normal");
  for (const t of totals) {
    if (y > 270) {
      doc.addPage();
      y = 25;
    }
    doc.text(t.name, 20, y);
    doc.text(t.displayValue, 120, y);
    doc.text(t.displayUnit, 160, y);
    y += 8;
  }

  doc.save("lista-de-compras.pdf");
}
