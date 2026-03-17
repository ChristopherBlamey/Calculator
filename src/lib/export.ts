import { IngredientTotal } from "@/types";
import { SoldItem } from "@/types/erp";

/**
 * Generate a plain-text shopping list.
 */
export function generateShoppingListText(totals: IngredientTotal[]): string {
  const lines = ["🛒 *LISTA DE COMPRAS*", "━━━━━━━━━━━━━━━━", ""];
  for (const t of totals) {
    lines.push(`✅ ${t.displayValue} ${t.displayUnit} — ${t.name}`);
  }
  lines.push("", `📅 Generado: ${new Date().toLocaleDateString("es-CL")}`);
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
  doc.text(`BLAMEY ERP — ${new Date().toLocaleDateString("es-CL")}`, 20, 33);

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

/**
 * Generate and download a PDF budget for client.
 * Professional format - only shows prices to charge, not internal costs
 */
export async function generateBudgetPDF(
  eventName: string, 
  items: SoldItem[]
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  // Header with logo area
  doc.setFillColor(233, 30, 140); // Wanda pink
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("BLAMEY ERP", 20, 15);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("PRESUPUESTO DE SERVICIO", 20, 25);

  // Event info
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Evento: ${eventName || "Sin nombre"}`, 20, 50);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-CL")}`, 20, 58);

  // Table header
  let y = 70;
  doc.setFillColor(240, 240, 240);
  doc.rect(15, y - 5, 180, 10, 'F');
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Producto", 20, y);
  doc.text("Cantidad", 120, y);
  doc.text("Precio Unit.", 150, y);
  doc.text("Subtotal", 185, y);

  // Line
  y += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, 195, y);
  y += 10;

  // Rows
  doc.setFont("helvetica", "normal");
  let total = 0;

  for (const item of items) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    const productName = `${item.product} ${item.variant}`;
    const subtotal = item.quantity * item.unitPrice;
    total += subtotal;
    
    // Alternate row background
    if (y % 16 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, y - 5, 180, 10, 'F');
    }
    
    doc.setTextColor(60, 60, 60);
    doc.text(productName, 20, y);
    doc.text(item.quantity.toString(), 120, y);
    doc.text(`$${item.unitPrice.toLocaleString("es-CL")}`, 150, y);
    doc.text(`$${subtotal.toLocaleString("es-CL")}`, 185, y);
    
    y += 10;
  }

  // Total box
  y += 5;
  doc.setDrawColor(233, 30, 140);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);
  y += 10;
  
  doc.setFillColor(233, 30, 140);
  doc.rect(120, y - 6, 75, 14, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 125, y + 3);
  doc.text(`$${total.toLocaleString("es-CL")}`, 165, y + 3);

  // Footer
  y += 25;
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Este presupuesto tiene validez de 7 días.", 20, y);
  doc.text("BLAMEY ERP - Servicio de Buffet y Eventos", 20, y + 6);

  doc.save(`presupuesto-${eventName.replace(/\s+/g, "-").toLowerCase() || "evento"}.pdf`);
}
